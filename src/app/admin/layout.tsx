import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/supabase/server";
import { Wordmark } from "@/components/brand";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login?next=/admin");
  if (profile?.role !== "admin") redirect("/portal");
  return (
    <div className="min-h-[100dvh] bg-cream">
      <header className="flex flex-wrap items-center gap-x-6 gap-y-2 bg-navy px-6 py-4 text-cream">
        <Link href="/admin" aria-label="Admin home"><Wordmark /></Link>
        <nav className="flex gap-1 text-sm">
          <Link href="/admin" className="rounded-full px-3 py-2 hover:bg-navy-light">Orders</Link>
          <Link href="/admin/prices" className="rounded-full px-3 py-2 hover:bg-navy-light">Prices</Link>
          <Link href="/portal" className="rounded-full px-3 py-2 hover:bg-navy-light">Client view</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl p-6">{children}</main>
    </div>
  );
}
