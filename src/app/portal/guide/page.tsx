import { redirect } from "next/navigation";
import { getUserAndProfile } from "@/lib/supabase/server";
import { GuideChat } from "@/components/GuideChat";

export const dynamic = "force-dynamic";

export default async function GuidePage() {
  const { supabase, user } = await getUserAndProfile();
  if (!user) redirect("/login?next=/portal/guide");
  const { data } = await supabase.from("guide_conversations").select("messages").eq("user_id", user.id).maybeSingle();
  const initial = Array.isArray(data?.messages) ? (data!.messages as { role: "user" | "assistant"; content: string }[]).slice(-20) : [];
  return (
    <div className="flex h-full flex-col">
      <h1 className="px-5 pt-12 font-display text-[32px] font-semibold">Your guide</h1>
      <div className="min-h-0 flex-1"><GuideChat initial={initial} /></div>
    </div>
  );
}
