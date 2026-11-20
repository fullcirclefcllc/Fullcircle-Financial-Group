"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Orbit, Wordmark } from "@/components/brand";

function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") || "/portal";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(params.get("error"));
  const [busy, setBusy] = useState(false);

  const site = typeof window !== "undefined" ? window.location.origin : "";
  const redirectTo = `${site}/auth/callback?next=${encodeURIComponent(next)}`;

  async function emailLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await createClient().auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setBusy(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  async function google() {
    setError(null);
    const { error } = await createClient().auth.signInWithOAuth({ provider: "google", options: { redirectTo } });
    if (error) setError(error.message);
  }

  return (
    <main className="app-shell relative flex flex-col gap-8 overflow-hidden bg-navy px-6 pb-10 pt-14 text-cream">
      <Orbit className="pointer-events-none absolute -right-[170px] -top-[120px] h-[420px] w-[420px] opacity-35" />
      <Link href="/" aria-label="Home"><Wordmark /></Link>
      <div className="mt-6">
        <h1 className="font-display text-[36px] font-semibold leading-tight">Sign in to continue</h1>
        <p className="mt-2 text-[15px] text-mist">Your progress is saved. We&apos;ll bring you right back.</p>
      </div>

      {sent ? (
        <div role="status" className="rounded-2xl bg-navy-light p-5 text-[15px] leading-relaxed">
          Check <strong>{email}</strong> for a sign-in link. You can close this tab after you click it.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <button onClick={google} className="btn-gold w-full">Continue with Google</button>
          <div className="flex items-center gap-3 text-xs text-mist">
            <span className="h-px flex-1 bg-navy-line" /> or <span className="h-px flex-1 bg-navy-line" />
          </div>
          <form onSubmit={emailLink} className="flex flex-col gap-3">
            <label htmlFor="email" className="text-sm font-semibold">Email</label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="input" placeholder="you@business.com" />
            <button disabled={busy} className="btn-navy w-full border border-navy-line">
              {busy ? "Sending…" : "Email me a sign-in link"}
            </button>
          </form>
        </div>
      )}
      {error && <p role="alert" className="rounded-xl bg-red-100 p-3 text-sm text-red-900">{error}</p>}
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
