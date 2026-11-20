import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { money, ORDER_STATUSES, type Totals } from "@/lib/formation";
import { deleteDocument, saveNotes, updateOrderStatus, uploadDocument } from "../../actions";

export const dynamic = "force-dynamic";

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: o }, { data: history }, { data: docs }] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).maybeSingle(),
    supabase.from("order_status_history").select("*").eq("order_id", id).order("created_at", { ascending: false }),
    supabase.from("documents").select("*").eq("order_id", id).order("created_at", { ascending: false }),
  ]);
  if (!o) notFound();
  const { data: client } = await supabase.from("profiles").select("email, full_name, phone").eq("id", o.user_id).maybeSingle();
  const totals = o.totals as Totals;
  const label = (k: string) => ORDER_STATUSES.find((s) => s.key === k)?.label ?? k;

  return (
    <div className="flex flex-col gap-5">
      <Link href="/admin" className="text-sm font-semibold underline">← All orders</Link>
      <h1 className="font-display text-4xl font-semibold">{o.business_name}</h1>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="card flex flex-col gap-3 p-5 text-sm">
          <h2 className="eyebrow">Order</h2>
          <Row k="Type" v={o.path === "new_llc" ? "New LLC" : o.path === "holding" ? "Holding company" : "Existing LLC"} />
          <Row k="State" v={o.state} />
          {o.holding_state && <Row k="Holding company state" v={o.holding_state} />}
          <Row k="Purpose" v={o.business_purpose || "—"} />
          <Row k="Management" v={o.management === "member" ? "Member-managed" : "Manager-managed"} />
          <Row k="Owners" v={(o.members as { name: string; percent: number }[]).map((m) => `${m.name} (${m.percent}%)`).join(", ")} />
          <Row k="Add-ons" v={(o.addons as string[]).join(", ") || "—"} />
          <div className="border-t border-cream-line pt-3">
            {totals?.lines?.map((l) => <Row key={l.key} k={l.label} v={money(l.cents)} />)}
            {totals?.stateFee && <Row k={totals.stateFee.label} v={totals.stateFee.cents == null ? "Not set — collect separately" : money(totals.stateFee.cents)} />}
            {totals?.quoted?.map((l) => <Row key={l.key} k={l.label} v="Quote needed" />)}
            <Row k="Charged" v={money(o.total_cents)} bold />
          </div>
        </section>

        <section className="card flex flex-col gap-3 p-5 text-sm">
          <h2 className="eyebrow">Client</h2>
          <Row k="Name" v={o.contact_name || client?.full_name || "—"} />
          <Row k="Email" v={client?.email || "—"} />
          <Row k="Phone" v={o.contact_phone || client?.phone || "—"} />
          <h2 className="eyebrow mt-3">Status</h2>
          <form action={updateOrderStatus} className="flex flex-col gap-2">
            <input type="hidden" name="id" value={o.id} />
            <label htmlFor="status" className="sr-only">Status</label>
            <select id="status" name="status" defaultValue={o.status} className="input">
              {ORDER_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
            <label htmlFor="note" className="sr-only">Note</label>
            <input id="note" name="note" placeholder="Note (optional)" className="input" />
            <button className="btn-navy">Update status</button>
          </form>
          <ol className="mt-2 flex flex-col gap-1.5 text-xs text-muted">
            {(history ?? []).map((h) => (
              <li key={h.id}>{new Date(h.created_at).toLocaleString()} — <strong className="text-navy">{label(h.status)}</strong>{h.note ? ` · ${h.note}` : ""}</li>
            ))}
          </ol>
        </section>
      </div>

      <section className="card flex flex-col gap-3 p-5 text-sm">
        <h2 className="eyebrow">Documents (visible to the client)</h2>
        <form action={uploadDocument} className="flex flex-wrap items-end gap-2">
          <input type="hidden" name="id" value={o.id} />
          <div className="min-w-[200px] flex-1">
            <label htmlFor="dname" className="label">Name</label>
            <input id="dname" name="name" placeholder="e.g. Articles of Organization" className="input" />
          </div>
          <div>
            <label htmlFor="file" className="label">File</label>
            <input id="file" name="file" type="file" required className="text-sm" />
          </div>
          <button className="btn-gold">Upload</button>
        </form>
        <ul className="divide-y divide-cream-line">
          {(docs ?? []).map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-3 py-2.5">
              <a href={`/api/documents/${d.id}`} className="font-semibold underline">{d.name}</a>
              <form action={deleteDocument}>
                <input type="hidden" name="id" value={o.id} />
                <input type="hidden" name="doc_id" value={d.id} />
                <button className="text-xs font-semibold text-red-800 underline">Delete</button>
              </form>
            </li>
          ))}
          {!docs?.length && <li className="py-2 text-muted">No documents yet.</li>}
        </ul>
      </section>

      <section className="card flex flex-col gap-3 p-5 text-sm">
        <h2 className="eyebrow">Internal notes</h2>
        <form action={saveNotes} className="flex flex-col gap-2">
          <input type="hidden" name="id" value={o.id} />
          <label htmlFor="notes" className="sr-only">Notes</label>
          <textarea id="notes" name="notes" rows={4} defaultValue={o.admin_notes ?? ""} className="input h-auto py-3" />
          <button className="btn-ghost self-start">Save notes</button>
        </form>
      </section>
    </div>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted">{k}</span>
      <span className={`text-right ${bold ? "font-semibold" : ""}`}>{v}</span>
    </div>
  );
}
