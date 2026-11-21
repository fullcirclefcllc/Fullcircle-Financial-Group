import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FormationFlow from "@/components/FormationFlow";
import { OFFERS, type AddonPrice, type Offer, type Path, type StateFee } from "@/lib/formation";

export const dynamic = "force-dynamic";

const PATHS: Path[] = ["new_llc", "holding", "existing"];

export default async function StartPage({
  params, searchParams,
}: { params: Promise<{ path: string }>; searchParams: Promise<{ offer?: string }> }) {
  const { path } = await params;
  const { offer: offerParam } = await searchParams;
  const offer = OFFERS.includes(offerParam as Offer) ? (offerParam as Offer) : null;
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
      offer={offer}
    />
  );
}
