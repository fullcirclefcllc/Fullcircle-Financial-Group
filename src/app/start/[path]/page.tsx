import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormationFlow from "@/components/FormationFlow";
import type { AddonPrice, Path, StateFee } from "@/lib/formation";

export const dynamic = "force-dynamic";

const PATHS: Path[] = ["new_llc", "holding", "existing"];

export default async function StartPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;
  if (!PATHS.includes(path as Path)) notFound();

  const supabase = await createClient();
  const [{ data: prices }, { data: fees }, { data: { user } }] = await Promise.all([
    supabase.from("addon_prices").select("*").order("sort"),
    supabase.from("state_fees").select("*").order("name"),
    supabase.auth.getUser(),
  ]);

  return (
    <FormationFlow
      path={path as Path}
      prices={(prices ?? []) as AddonPrice[]}
      fees={(fees ?? []) as StateFee[]}
      signedIn={!!user}
      bookingUrl={process.env.NEXT_PUBLIC_BOOKING_URL ?? ""}
    />
  );
}
