// Shared types and pricing logic for the formation flow. Used on both client (preview) and server (the real charge).

export type Path = "new_llc" | "holding" | "existing";

export type Member = { name: string; percent: number };

export type FlowData = {
  path: Path;
  businessName: string;
  businessPurpose: string;
  state: string; // two-letter code
  members: Member[];
  management: "member" | "manager";
  holdingState: "WY" | "DE";
  addons: string[]; // addon keys
  contactName: string;
  contactPhone: string;
};

export type AddonPrice = {
  key: string;
  label: string;
  description: string | null;
  price_cents: number | null; // null = quoted later, not charged at checkout
  kind: "package" | "addon";
  grp?: "launch" | "growth"; // growth = business credit and free reviews
  sort: number;
  active: boolean;
};

/** Offers a welcome-screen card can pre-select (e.g. /start/existing?offer=business_credit). */
export const OFFERS = ["business_credit"] as const;
export type Offer = (typeof OFFERS)[number];

export type StateFee = { code: string; name: string; llc_fee_cents: number | null; holding_allowed: boolean };

export const PACKAGE_FOR_PATH: Record<Path, string | null> = {
  new_llc: "llc_package",
  holding: "holding_package",
  existing: null,
};

export const ORDER_STATUSES = [
  { key: "requested", label: "Request received" },
  { key: "awaiting_payment", label: "Awaiting payment" },
  { key: "paid", label: "Order received" },
  { key: "filed", label: "Filed with the state" },
  { key: "approved", label: "Approved + EIN" },
  { key: "scorp_filed", label: "S-corp election filed" },
  { key: "complete", label: "Complete" },
  { key: "cancelled", label: "Cancelled" },
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number]["key"];

/** The steps a client sees in the portal tracker, in order. */
export const TRACKER: { key: OrderStatus; label: string }[] = [
  { key: "paid", label: "Order received" },
  { key: "filed", label: "Filed with the state" },
  { key: "approved", label: "Approved + EIN" },
  { key: "scorp_filed", label: "S-corp election filed" },
];

export function emptyFlow(path: Path, offer?: Offer | null): FlowData {
  const addons = offer ? [offer] : path === "existing" ? ["holding_addon"] : [];
  return {
    path,
    businessName: "",
    businessPurpose: "",
    state: path === "holding" ? "WY" : "AZ",
    members: [{ name: "", percent: 100 }],
    management: "member",
    holdingState: "WY",
    addons,
    contactName: "",
    contactPhone: "",
  };
}

export type LineItem = { key: string; label: string; cents: number | null };

export type Totals = {
  lines: LineItem[]; // charged lines (cents not null)
  quoted: LineItem[]; // selected but priced later
  stateFee: LineItem | null; // null cents = to be confirmed
  totalCents: number;
};

/** Addons a path may choose. The holding_addon is pointless when the order IS a holding company. */
export function addonsForPath(path: Path, prices: AddonPrice[]) {
  return prices
    .filter((p) => p.kind === "addon" && p.active)
    .filter((p) => !(path === "holding" && p.key === "holding_addon"))
    .sort((a, b) => a.sort - b.sort);
}

export function computeTotals(flow: FlowData, prices: AddonPrice[], fees: StateFee[]): Totals {
  const byKey = new Map(prices.map((p) => [p.key, p]));
  const lines: LineItem[] = [];
  const quoted: LineItem[] = [];

  const pkgKey = PACKAGE_FOR_PATH[flow.path];
  if (pkgKey) {
    const pkg = byKey.get(pkgKey);
    if (pkg) lines.push({ key: pkg.key, label: packageLabel(flow, fees), cents: pkg.price_cents ?? 0 });
  }

  const allowed = new Set(addonsForPath(flow.path, prices).map((a) => a.key));
  for (const key of flow.addons) {
    const a = byKey.get(key);
    if (!a || !allowed.has(key)) continue;
    const item = { key, label: a.label, cents: a.price_cents };
    (a.price_cents == null ? quoted : lines).push(item);
  }

  // A state filing fee applies when we file a new entity in that state.
  let stateFee: LineItem | null = null;
  if (flow.path !== "existing") {
    const st = fees.find((f) => f.code === flow.state);
    if (st) stateFee = { key: "state_fee", label: `${st.name} state filing fee`, cents: st.llc_fee_cents };
  }
  // A holding company add-on also files in its own state.
  if (flow.addons.includes("holding_addon") && allowed.has("holding_addon")) {
    const hs = fees.find((f) => f.code === flow.holdingState);
    if (hs) {
      const extra = { key: "holding_state_fee", label: `${hs.name} filing fee (holding company)`, cents: hs.llc_fee_cents };
      (extra.cents == null ? quoted : lines).push(extra);
    }
  }

  const totalCents =
    lines.reduce((s, l) => s + (l.cents ?? 0), 0) + (stateFee?.cents ?? 0);
  return { lines, quoted, stateFee, totalCents };
}

export function packageLabel(flow: FlowData, fees: StateFee[]) {
  const st = fees.find((f) => f.code === flow.state)?.name ?? flow.state;
  return flow.path === "holding" ? `${st} holding company` : `${st} LLC`;
}

export const money = (cents: number | null | undefined) =>
  cents == null ? "Quoted" : cents === 0 ? "Free" : `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0 })}`;

/** Validation per step. Returns an error message or null. */
export function validateStep(step: number, f: FlowData): string | null {
  if (step === 0) {
    if (f.businessName.trim().length < 2) return "Enter your business name.";
    if (f.path !== "existing" && f.businessPurpose.trim().length < 3) return "Tell us briefly what the business does.";
  }
  if (step === 2) {
    if (f.members.length === 0) return "Add at least one owner.";
    if (f.members.some((m) => m.name.trim().length < 2)) return "Enter each owner's full name.";
    const total = f.members.reduce((s, m) => s + (Number(m.percent) || 0), 0);
    if (Math.round(total) !== 100) return `Ownership must add up to 100% (now ${total}%).`;
  }
  if (step === 4) {
    if (f.contactName.trim().length < 2) return "Enter your name.";
    if (f.contactPhone.replace(/\D/g, "").length < 10) return "Enter a phone number we can reach you at.";
  }
  return null;
}

export const STEP_TITLES = ["Business basics", "Your state", "Owners", "Add-ons & growth", "Review"];

/** Labels for the growth sign-ups, used in the portal and admin. */
export const GROWTH_KEYS = ["business_credit", "funding_review", "credit_review", "protection_quote"] as const;
export const GROWTH_LABEL: Record<string, string> = {
  business_credit: "Business credit",
  funding_review: "Funding review",
  credit_review: "Credit review",
  protection_quote: "Protection quote",
  holding_addon: "Holding company",
  expedite: "Expedite",
  identity_kit: "Identity kit",
  virtual_office: "Virtual office",
};

/** True when the order has something to do but nothing to charge (only free reviews or quoted items). */
export function isFreeRequest(t: Totals) {
  return t.totalCents === 0 && (t.lines.length > 0 || t.quoted.length > 0);
}

export const DRAFT_KEY = "fcf-draft-v1";
