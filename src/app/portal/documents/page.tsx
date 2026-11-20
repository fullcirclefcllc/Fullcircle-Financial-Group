import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/supabase/server";
import { Icon } from "@/components/brand";

export const dynamic = "force-dynamic";

export default async function Documents() {
  const { supabase, user } = await getUserAndProfile();
  if (!user) redirect("/login?next=/portal/documents");
  const { data: docs } = await supabase
    .from("documents")
    .select("id, name, created_at, orders(business_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="flex flex-col gap-4 px-5 pb-8 pt-12">
      <h1 className="font-display text-[32px] font-semibold">Documents</h1>
      {!docs?.length ? (
        <div className="card p-5 text-sm leading-relaxed text-muted">
          Your filed articles, EIN letter, S-corp election and other documents will appear here as soon as they&apos;re ready.
        </div>
      ) : (
        <ul className="card flex flex-col divide-y divide-cream-line">
          {docs.map((d) => {
            const biz = (d.orders as unknown as { business_name: string } | null)?.business_name;
            return (
              <li key={d.id}>
                <a href={`/api/documents/${d.id}`} className="flex min-h-[56px] items-center gap-3 px-4 py-3">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-gold"><Icon.Doc size={20} /></span>
                  <span className="flex-1">
                    <span className="block text-sm font-semibold">{d.name}</span>
                    <span className="block text-xs text-muted">{biz ? `${biz} · ` : ""}{new Date(d.created_at).toLocaleDateString()}</span>
                  </span>
                  <span className="text-xs font-semibold">Open</span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
