import { createClient } from "@/lib/supabase/server";
import type { AddonPrice, StateFee } from "@/lib/formation";
import { savePrices, saveStateFees } from "../actions";

export const dynamic = "force-dynamic";

const dollars = (c: number | null) => (c == null ? "" : (c / 100).toFixed(2).replace(/\.00$/, ""));

export default async function AdminPrices() {
  const supabase = await createClient();
  const [{ data: prices }, { data: fees }] = await Promise.all([
    supabase.from("addon_prices").select("*").order("sort"),
    supabase.from("state_fees").select("*").order("name"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-4xl font-semibold">Prices</h1>

      <form action={savePrices} className="card flex flex-col gap-3 p-5 text-sm">
        <h2 className="eyebrow">Packages &amp; add-ons</h2>
        <p className="text-muted">Leave a price blank to show it as &quot;Quoted&quot; (not charged at checkout).</p>
        {((prices ?? []) as AddonPrice[]).map((p) => (
          <div key={p.key} className="flex flex-wrap items-center gap-3 border-t border-cream-line pt-3">
            <input type="hidden" name="price_key" value={p.key} />
            <div className="min-w-[220px] flex-1">
              <div className="font-semibold">{p.label}</div>
              <div className="text-xs text-muted">{p.kind === "package" ? "Package" : "Add-on"} · {p.description}</div>
            </div>
            <label className="flex items-center gap-1.5">
              <span>$</span>
              <span className="sr-only">Price for {p.label}</span>
              <input name={`price_${p.key}`} defaultValue={dollars(p.price_cents)} inputMode="decimal" className="input h-11 w-28" />
            </label>
            <label className="flex min-h-[44px] items-center gap-2">
              <input type="checkbox" name={`active_${p.key}`} defaultChecked={p.active} className="h-5 w-5 accent-navy" /> Active
            </label>
          </div>
        ))}
        <button className="btn-navy self-start">Save prices</button>
      </form>

      <form action={saveStateFees} className="card flex flex-col gap-3 p-5 text-sm">
        <h2 className="eyebrow">State filing fees (LLC)</h2>
        <p className="text-muted">Enter each state&apos;s current filing fee from its official site. Blank fees show as &quot;Confirmed after order&quot; and aren&apos;t charged.</p>
        <div className="grid gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {((fees ?? []) as StateFee[]).map((f) => (
            <label key={f.code} className="flex items-center justify-between gap-2">
              <input type="hidden" name="fee_code" value={f.code} />
              <span>{f.name}</span>
              <span className="flex items-center gap-1">$<input name={`fee_${f.code}`} defaultValue={dollars(f.llc_fee_cents)} inputMode="decimal" className="input h-10 w-24" /></span>
            </label>
          ))}
        </div>
        <button className="btn-navy self-start">Save state fees</button>
      </form>
    </div>
  );
}
