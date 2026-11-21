import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { GROWTH_KEYS, GROWTH_LABEL, ORDER_STATUSES } from "@/lib/formation";

export type ClientRow = {
  orderId: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  business: string;
  type: string;
  state: string;
  services: string[];
  status: string;
  totalCents: number;
  source: string;
};

const PATH_LABEL: Record<string, string> = { new_llc: "New LLC", holding: "Holding company", existing: "Existing LLC" };
const PAID = new Set(["paid", "filed", "approved", "scorp_filed", "complete"]);

/** Every sign-up joined with the client's profile. Call only after checking the viewer is an admin. */
export async function loadClients(): Promise<ClientRow[]> {
  const admin = createAdminClient();
  const { data: orders } = await admin
    .from("orders")
    .select("id, user_id, created_at, business_name, path, state, addons, status, total_cents, contact_name, contact_phone, source")
    .order("created_at", { ascending: false })
    .limit(5000);
  const ids = [...new Set((orders ?? []).map((o) => o.user_id))];
  const { data: profiles } = ids.length
    ? await admin.from("profiles").select("id, email, full_name, phone").in("id", ids)
    : { data: [] };
  const byId = new Map((profiles ?? []).map((p) => [p.id, p]));
  return (orders ?? []).map((o) => {
    const p = byId.get(o.user_id);
    return {
      orderId: o.id,
      createdAt: o.created_at,
      name: o.contact_name || p?.full_name || "",
      email: p?.email || "",
      phone: o.contact_phone || p?.phone || "",
      business: o.business_name,
      type: PATH_LABEL[o.path] ?? o.path,
      state: o.state,
      services: (o.addons as string[]) ?? [],
      status: ORDER_STATUSES.find((s) => s.key === o.status)?.label ?? o.status,
      totalCents: o.status && PAID.has(o.status) ? o.total_cents : 0,
      source: o.source ?? "",
    };
  });
}

export function summarize(rows: ClientRow[]) {
  const people = new Set(rows.map((r) => r.email || r.orderId));
  const paid = rows.filter((r) => r.totalCents > 0);
  const byService = Object.fromEntries(
    GROWTH_KEYS.map((k) => [k, rows.filter((r) => r.services.includes(k) && r.status !== "Cancelled").length])
  ) as Record<(typeof GROWTH_KEYS)[number], number>;
  const since = Date.now() - 30 * 24 * 3600 * 1000;
  return {
    clients: people.size,
    orders: rows.length,
    paidOrders: paid.length,
    revenueCents: paid.reduce((s, r) => s + r.totalCents, 0),
    last30: rows.filter((r) => new Date(r.createdAt).getTime() >= since).length,
    awaitingPayment: rows.filter((r) => r.status === "Awaiting payment").length,
    byService,
  };
}

export const serviceLabel = (k: string) => GROWTH_LABEL[k] ?? k;

export function toCsv(rows: ClientRow[]) {
  const head = ["Date", "Name", "Email", "Phone", "Business", "Type", "State", "Services", "Status", "Paid ($)", "Source", "Order ID"];
  const cell = (v: string | number) => {
    let s = String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = "'" + s; // keep spreadsheet apps from running formulas
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = rows.map((r) =>
    [
      new Date(r.createdAt).toISOString().slice(0, 10), r.name, r.email, r.phone, r.business, r.type, r.state,
      r.services.map(serviceLabel).join("; "), r.status, (r.totalCents / 100).toFixed(2), r.source, r.orderId,
    ].map(cell).join(",")
  );
  return [head.join(","), ...lines].join("\n");
}
