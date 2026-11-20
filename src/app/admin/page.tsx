import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { money, ORDER_STATUSES } from "@/lib/formation";

export const dynamic = "force-dynamic";

const PATH_LABEL: Record<string, string> = { new_llc: "New LLC", holding: "Holding co.", existing: "Existing LLC" };
const statusLabel = (k: string) => ORDER_STATUSES.find((s) => s.key === k)?.label ?? k;

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const supabase = await createClient();
  let q = supabase.from("orders").select("id, business_name, path, state, status, total_cents, contact_name, created_at").order("created_at", { ascending: false }).limit(200);
  if (status) q = q.eq("status", status);
  const { data: orders } = await q;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="font-display text-4xl font-semibold">Orders</h1>
        <nav aria-label="Filter by status" className="flex flex-wrap gap-1.5 text-xs">
          <Link href="/admin" className={`rounded-full px-3 py-2 font-semibold ${!status ? "bg-navy text-cream" : "border border-cream-border bg-white"}`}>All</Link>
          {ORDER_STATUSES.map((s) => (
            <Link key={s.key} href={`/admin?status=${s.key}`}
              className={`rounded-full px-3 py-2 font-semibold ${status === s.key ? "bg-navy text-cream" : "border border-cream-border bg-white"}`}>{s.label}</Link>
          ))}
        </nav>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-cream-line text-xs uppercase tracking-wider text-muted">
            <tr><th className="p-3">Business</th><th className="p-3">Type</th><th className="p-3">State</th><th className="p-3">Client</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">Date</th></tr>
          </thead>
          <tbody className="divide-y divide-cream-line">
            {(orders ?? []).map((o) => (
              <tr key={o.id} className="hover:bg-cream/60">
                <td className="p-3 font-semibold"><Link href={`/admin/orders/${o.id}`} className="underline-offset-2 hover:underline">{o.business_name}</Link></td>
                <td className="p-3">{PATH_LABEL[o.path] ?? o.path}</td>
                <td className="p-3">{o.state}</td>
                <td className="p-3">{o.contact_name}</td>
                <td className="p-3">{money(o.total_cents)}</td>
                <td className="p-3"><span className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold">{statusLabel(o.status)}</span></td>
                <td className="p-3 text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {!orders?.length && <tr><td colSpan={7} className="p-6 text-center text-muted">No orders yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
