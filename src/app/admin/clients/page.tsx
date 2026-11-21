import Link from "next/link";
import { loadClients, serviceLabel, summarize } from "@/lib/clients";
import { GROWTH_KEYS, money } from "@/lib/formation";

export const dynamic = "force-dynamic";

// The admin layout already blocks anyone who isn't an admin.
export default async function AdminClients({ searchParams }: { searchParams: Promise<{ service?: string; q?: string }> }) {
  const { service, q } = await searchParams;
  const all = await loadClients();
  const s = summarize(all);
  const needle = (q ?? "").trim().toLowerCase();
  const rows = all.filter(
    (r) =>
      (!service || r.services.includes(service)) &&
      (!needle || [r.name, r.email, r.phone, r.business].some((v) => v.toLowerCase().includes(needle)))
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold">Clients</h1>
        <a href={`/admin/export${service ? `?service=${service}` : ""}`} className="btn-gold">Download spreadsheet (CSV)</a>
      </div>

      <section aria-label="Totals" className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Clients" value={String(s.clients)} />
        <Stat label="Paid orders" value={String(s.paidOrders)} />
        <Stat label="Collected" value={s.revenueCents ? money(s.revenueCents) : "$0"} />
        <Stat label="Sign-ups, last 30 days" value={String(s.last30)} />
      </section>

      <section aria-label="Sign-ups by service" className="flex flex-col gap-2">
        <h2 className="eyebrow">Sign-ups by service</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/clients" className={`rounded-full px-3.5 py-2 text-sm font-semibold ${!service ? "bg-navy text-cream" : "border border-cream-border bg-white"}`}>
            All · {s.orders}
          </Link>
          {GROWTH_KEYS.map((k) => (
            <Link key={k} href={`/admin/clients?service=${k}`}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold ${service === k ? "bg-navy text-cream" : "border border-cream-border bg-white"}`}>
              {serviceLabel(k)} · {s.byService[k]}
            </Link>
          ))}
        </div>
        {s.awaitingPayment > 0 && (
          <p className="text-sm text-muted">{s.awaitingPayment} started checkout but haven&apos;t paid yet. These are good follow-up calls.</p>
        )}
      </section>

      <form className="flex gap-2" action="/admin/clients">
        {service && <input type="hidden" name="service" value={service} />}
        <label htmlFor="q" className="sr-only">Search clients</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search name, email, phone or business" className="input max-w-md" />
        <button className="btn-navy">Search</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-cream-line text-xs uppercase tracking-wider text-muted">
            <tr>
              <th className="p-3">Client</th><th className="p-3">Contact</th><th className="p-3">Business</th>
              <th className="p-3">Signed up for</th><th className="p-3">Status</th><th className="p-3">Paid</th><th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-line">
            {rows.map((r) => (
              <tr key={r.orderId} className="align-top hover:bg-cream/60">
                <td className="p-3 font-semibold"><Link href={`/admin/orders/${r.orderId}`} className="underline-offset-2 hover:underline">{r.name || "—"}</Link></td>
                <td className="p-3"><div>{r.email}</div><div className="text-muted">{r.phone}</div></td>
                <td className="p-3"><div>{r.business}</div><div className="text-muted">{r.type} · {r.state}</div></td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {r.services.length ? r.services.map((k) => (
                      <span key={k} className="rounded-full bg-cream px-2 py-0.5 text-xs font-semibold">{serviceLabel(k)}</span>
                    )) : <span className="text-muted">Formation only</span>}
                  </div>
                </td>
                <td className="p-3">{r.status}</td>
                <td className="p-3">{r.totalCents ? money(r.totalCents) : "—"}</td>
                <td className="p-3 text-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="p-6 text-center text-muted">No clients match.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</div>
      <div className="mt-1 font-display text-3xl font-semibold">{value}</div>
    </div>
  );
}
