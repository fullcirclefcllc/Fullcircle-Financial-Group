import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { computeTotals, emptyFlow, isFreeRequest, OFFERS, validateStep, type AddonPrice, type FlowData, type Offer, type Path, type StateFee } from "@/lib/formation";

const PATHS: Path[] = ["new_llc", "holding", "existing"];

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 });

  let raw: { flow?: Partial<FlowData>; offer?: string | null };
  try { raw = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }
  const path = raw.flow?.path as Path;
  if (!PATHS.includes(path)) return NextResponse.json({ error: "Unknown order type." }, { status: 400 });

  // Rebuild the order from trusted defaults + the client's answers. Prices always come from the database.
  const base = emptyFlow(path);
  const f = raw.flow!;
  const flow: FlowData = {
    ...base,
    businessName: String(f.businessName ?? "").slice(0, 120),
    businessPurpose: String(f.businessPurpose ?? "").slice(0, 600),
    state: String(f.state ?? base.state).toUpperCase().slice(0, 2),
    members: Array.isArray(f.members)
      ? f.members.slice(0, 20).map((m) => ({ name: String(m?.name ?? "").slice(0, 120), percent: Number(m?.percent) || 0 }))
      : base.members,
    management: f.management === "manager" ? "manager" : "member",
    holdingState: f.holdingState === "DE" ? "DE" : "WY",
    addons: Array.isArray(f.addons) ? f.addons.map(String).slice(0, 20) : [],
    contactName: String(f.contactName ?? "").slice(0, 120),
    contactPhone: String(f.contactPhone ?? "").slice(0, 40),
  };
  for (let s = 0; s <= 4; s++) {
    const err = validateStep(s, flow);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
  }

  const [{ data: prices }, { data: fees }] = await Promise.all([
    supabase.from("addon_prices").select("*"),
    supabase.from("state_fees").select("*"),
  ]);
  const feeList = (fees ?? []) as StateFee[];
  if (!feeList.some((x) => x.code === flow.state)) return NextResponse.json({ error: "Choose a valid state." }, { status: 400 });
  if (path === "holding" && !feeList.find((x) => x.code === flow.state)?.holding_allowed) {
    return NextResponse.json({ error: "Holding companies are offered in Wyoming or Delaware." }, { status: 400 });
  }

  const totals = computeTotals(flow, (prices ?? []) as AddonPrice[], feeList);
  const free = isFreeRequest(totals);
  if (totals.totalCents <= 0 && !free) return NextResponse.json({ error: "Choose at least one item to continue." }, { status: 400 });
  const source = OFFERS.includes(raw.offer as Offer) ? `welcome:${raw.offer}` : `start:${path}`;

  const admin = createAdminClient();
  const { data: order, error } = await admin
    .from("orders")
    .insert({
      user_id: user.id,
      path,
      business_name: flow.businessName,
      business_purpose: flow.businessPurpose,
      state: flow.state,
      members: flow.members,
      management: flow.management,
      holding_state: flow.addons.includes("holding_addon") ? flow.holdingState : path === "holding" ? flow.state : null,
      addons: flow.addons,
      totals,
      total_cents: totals.totalCents,
      contact_name: flow.contactName,
      contact_phone: flow.contactPhone,
      status: free ? "requested" : "awaiting_payment",
      source,
    })
    .select("id")
    .single();
  if (error || !order) {
    console.error(error);
    return NextResponse.json({ error: "We couldn't save your order. Please try again." }, { status: 500 });
  }
  await admin.from("order_status_history").insert({ order_id: order.id, status: free ? "requested" : "awaiting_payment" });
  await admin.from("profiles").update({ full_name: flow.contactName, phone: flow.contactPhone }).eq("id", user.id);

  const site = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  // Free reviews only: no payment, go straight to the portal.
  if (free) return NextResponse.json({ url: `${site}/portal?requested=${order.id}` });
  const chargeable = [...totals.lines, ...(totals.stateFee?.cents ? [totals.stateFee] : [])].filter((l) => (l.cents ?? 0) > 0);

  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      client_reference_id: order.id,
      metadata: { order_id: order.id },
      line_items: chargeable.map((l) => ({
        quantity: 1,
        price_data: { currency: "usd", unit_amount: l.cents!, product_data: { name: l.label } },
      })),
      success_url: `${site}/portal?paid=${order.id}`,
      cancel_url: `${site}/start/${path}`,
    });
    await admin.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Checkout couldn't start." }, { status: 500 });
  }
}
