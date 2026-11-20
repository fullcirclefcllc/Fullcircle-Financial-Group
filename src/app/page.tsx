import Link from "next/link";
import { Orbit, Wordmark, Icon } from "@/components/brand";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getPrices() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("addon_prices").select("key, price_cents").in("key", ["llc_package", "holding_package"]);
    const m = new Map((data ?? []).map((r) => [r.key, r.price_cents as number | null]));
    return { llc: m.get("llc_package") ?? 19900, holding: m.get("holding_package") ?? 25000 };
  } catch {
    return { llc: 19900, holding: 25000 };
  }
}

const usd = (c: number) => `$${Math.round(c / 100)}`;

const HERO = process.env.NEXT_PUBLIC_HERO_IMAGE || "/emblem.png";

export default async function Welcome() {
  const p = await getPrices();
  return (
    <main className="app-shell relative flex flex-col gap-7 overflow-hidden bg-navy px-6 pb-8 pt-14 text-cream">
      {/* 3D Full Circle seal (made in Higgsfield), saved in /public/emblem.png */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={HERO}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[460px] w-full object-cover object-center opacity-90 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
      />
      <Orbit className="pointer-events-none absolute -right-[170px] -top-[120px] h-[420px] w-[420px] opacity-20" />
      <div className="relative"><Wordmark /></div>
      <div className="relative mt-[230px] flex flex-col gap-3">
        <h1 className="font-display text-[40px] font-semibold leading-[1.05]">
          Build the structure.
          <br />
          Then build the empire.
        </h1>
        <p className="text-[15px] leading-relaxed text-mist">
          Form your LLC in 3–5 days, with a guide that answers your questions as you go.
        </p>
      </div>

      <nav aria-label="Choose your path" className="relative flex flex-col gap-3">
        <Link href="/start/new_llc" className="flex items-center gap-3.5 rounded-2xl bg-gold p-[18px] text-navy transition hover:bg-gold-soft">
          <div className="flex-1">
            <div className="text-base font-semibold">Start a new LLC</div>
            <div className="mt-0.5 text-[13px]">Registered agent + S-corp election included</div>
          </div>
          <div className="font-display text-[26px] font-semibold">{usd(p.llc)}</div>
        </Link>
        <Link href="/start/holding" className="flex items-center gap-3.5 rounded-2xl border border-navy-line bg-navy-light p-[18px] transition hover:border-gold">
          <div className="flex-1">
            <div className="text-base font-semibold">Form a holding company</div>
            <div className="mt-0.5 text-[13px] text-mist">Wyoming or Delaware, built for privacy</div>
          </div>
          <div className="font-display text-[26px] font-semibold text-gold">{usd(p.holding)}</div>
        </Link>
        <Link href="/start/existing" className="flex items-center gap-3.5 rounded-2xl border border-navy-line bg-navy-light p-[18px] transition hover:border-gold">
          <div className="flex-1">
            <div className="text-base font-semibold">I already have an LLC</div>
            <div className="mt-0.5 text-[13px] text-mist">Add a holding company, S-corp or next steps</div>
          </div>
          <Icon.Chevron className="text-gold" />
        </Link>
      </nav>

      <div className="flex-1" />
      <div className="flex items-center justify-between text-xs text-mist">
        <span>Plus state filing fee</span>
        <Link href="/portal" className="min-h-[44px] content-center text-gold underline-offset-2 hover:underline">
          Already a client? Sign in
        </Link>
      </div>
    </main>
  );
}
