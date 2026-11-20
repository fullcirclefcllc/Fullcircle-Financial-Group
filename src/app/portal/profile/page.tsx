import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserAndProfile, createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export default async function Profile() {
  const { user, profile } = await getUserAndProfile();
  if (!user) redirect("/login?next=/portal/profile");
  return (
    <div className="flex flex-col gap-4 px-5 pb-8 pt-12">
      <h1 className="font-display text-[32px] font-semibold">Profile</h1>
      <dl className="card flex flex-col divide-y divide-cream-line text-sm">
        <div className="flex justify-between gap-4 px-4 py-3.5"><dt className="text-muted">Name</dt><dd className="font-semibold">{profile?.full_name || "—"}</dd></div>
        <div className="flex justify-between gap-4 px-4 py-3.5"><dt className="text-muted">Email</dt><dd className="font-semibold">{user.email}</dd></div>
      </dl>
      {profile?.role === "admin" && <Link href="/admin" className="btn-navy">Open admin</Link>}
      <form action={signOut}><button className="btn-ghost w-full">Sign out</button></form>
    </div>
  );
}
