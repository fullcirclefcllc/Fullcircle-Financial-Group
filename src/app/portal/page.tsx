import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/supabase/server";
import { Icon, Orbit } from "@/components/brand";
import { ClearDraft } from "@/components/ClearDraft";
import { GROWTH_LABEL, money, TRACKER, type OrderStatus } from "@/lib/formation";

export const dynamic = "force-dynamic";

type Order = { id: string; business_name: string; path: string; state: string; status: OrderStatus; created_at: string; addons: string[] };

export default async function PortalHome({ searchParams }: { searchParams: Promise<{ paid?: string; requested?: string; order?: string }> }) {
  const { paid, requested, order: orderParam } = await searchParams;
  const { supabase, user, profile } = await getUserAndProfile();
  if (!user) redirect("/login?next=/portal");

  const { data } = await supabase.from("orders").select("id, business_name, path, state, status, created_at, addons")
    .neq("status", "cancelled").order("created_at", { ascending: false });
  const orders = (data ?? []) as Order[];
  const current = orders.find((o) => o.id === (orderParam ?? paid ?? requested)) ?? orders.find((o) => o.status !== "awaiting_payment") ?? orders[0];
  const booking = process.env.NEXT_PUBLIC_BOOKING_URL ?? "#";
  const { data: bc } = await supabase.from("addon_prices").select("price_cents").eq("key", "business_credit").maybeSingle();
  const creditStart = money((bc?.price_cents as number | null) ?? 50000);
  const firstName = profile?.full_name?.split(" ")[0];
  const services = (current?.addons ?? []).filter((k) => GROWTH_LABEL[k]);
  const enrolled = new Set(orders.filter((o) => !["awaiting_payment", "cancelled"].includes(o.status)).flatMap((o) => o.addons ?? []));

  const reached = (key: OrderStatus) => {
    if (!current) return "todo";
    const order = TRACKER.map((t) => t.key);
    // A status means that step is done; the following step is in progress.
    const cur = current.status === "complete" ? order.length : order.indexOf(current.status);
    const idx = order.indexOf(key);
    if (cur === -1) return "todo"; // awaiting payment
    if (idx <= cur) return "done";
    if (idx === cur + 1) return "now";
    return "todo";
  };

  return (
    <div>
      {(paid || requested) && <ClearDraft />}
      <section className="relative flex flex-col gap-4 overflow-hidden rounded-b-[26px] bg-navy px-5 pb-6 pt-12 text-cream">
        <Orbit className="pointer-events-none absolute -right-[90px] -top-[60px] h-[260px] w-[260px] opacity-30" />
        <div className="text-[13px] text-mist">Welcome back{firstName ? `, ${firstName}` : ""}</div>
        {current ? (
          <>
            <h1 className="font-display text-[30px] font-semibold leading-tight">{current.business_name}</h1>
            {paid && <p role="status" className="rounded-xl bg-navy-light px-3 py-2 text-sm">Payment received. We&apos;ll get started right away.</p>}
            {requested && <p role="status" className="rounded-xl bg-navy-light px-3 py-2 text-sm">Request received. We&apos;ll reach out within one business day.</p>}
            {services.length > 0 && (
              <ul aria-label="Your services" className="flex flex-wrap gap-1.5">
                {services.map((k) => (
                  <li key={k} className="rounded-full border border-gold/60 px-2.5 py-1 text-xs text-gold">{GROWTH_LABEL[k] ?? k}</li>
                ))}
              </ul>
            )}
            {current.status === "requested" ? (
              <p className="text-sm text-mist">Your request is in. A Full Circle specialist will contact you to schedule.</p>
            ) : current.status === "awaiting_payment" ? (
              <div className="flex flex-col gap-2 text-sm text-mist">
                <p>This order is waiting for payment.</p>
                <Link href={`/start/${current.path}`} className="btn-gold self-start">Finish checkout</Link>
              </div>
            ) : (
              <ol className="flex flex-col">
                {TRACKER.map((t) => {
                  const s = reached(t.key);
                  return (
                    <li key={t.key} className={`flex min-h-[34px] items-center gap-3 text-sm ${s === "todo" ? "text-[#A9B3C7]" : ""}`}>
                      {s === "done" ? (
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#C9A646" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#0A1F44" strokeWidth="2.2" strokeLinecap="round" /></svg>
                      ) : s === "now" ? (
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#C9A646" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="#C9A646" /></svg>
                      ) : (
                        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#4A6290" strokeWidth="2" /></svg>
                      )}
                      <span className={s === "now" ? "font-semibold" : ""}>{t.label}</span>
                      {s === "now" && <span className="ml-auto text-xs text-gold">In progress</span>}
                      <span className="sr-only">{s === "done" ? "(done)" : s === "now" ? "(in progress)" : "(not started)"}</span>
                    </li>
                  );
                })}
              </ol>
            )}
          </>
        ) : (
          <>
            <h1 className="font-display text-[30px] font-semibold leading-tight">Let&apos;s build your structure</h1>
            <Link href="/" className="btn-gold self-start">Start a formation</Link>
          </>
        )}
      </section>

      {orders.length > 1 && (
        <div className="flex gap-2 overflow-x-auto px-5 pt-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/portal?order=${o.id}`}
              className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-semibold ${o.id === current?.id ? "bg-navy text-cream" : "border border-cream-border bg-white"}`}>
              {o.business_name}
            </Link>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-3 p-5">
        <h2 className="font-brand text-[13px] font-bold tracking-[0.14em]">YOUR NEXT MOVES</h2>
        <NextMove href={enrolled.has("business_credit") ? booking : "/start/existing?offer=business_credit"} external={enrolled.has("business_credit")} highlight I={Icon.Chart}
          title="Build business credit" sub={enrolled.has("business_credit") ? "You're enrolled. Book your strategy call" : `Get started for ${creditStart}`} />
        <NextMove href={booking} external I={Icon.Shield} title="Protect what you're building" sub={enrolled.has("protection_quote") ? "Quote requested. We'll be in touch" : "Free protection plan quote"} />
        <NextMove href={booking} external I={Icon.Clock} title="Strengthen personal credit" sub={enrolled.has("credit_review") ? "Review requested. We'll be in touch" : "Free personal credit review"} />
      </section>
    </div>
  );
}

function NextMove({ href, title, sub, I, highlight, external }: { href: string; title: string; sub: string; I: (p: { size?: number; className?: string }) => React.ReactElement; highlight?: boolean; external?: boolean }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`flex items-center gap-3.5 rounded-2xl bg-white p-4 ${highlight ? "border-2 border-gold" : ""}`}>
      <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy text-gold"><I size={22} /></span>
      <span className="flex-1">
        <span className="block text-[15px] font-semibold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted">{sub}</span>
      </span>
      <Icon.Chevron size={18} />
    </a>
  );
}
