"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GuideAvatar, Icon } from "@/components/brand";
import {
  addonsForPath, computeTotals, DRAFT_KEY, emptyFlow, isFreeRequest, money, packageLabel, STEP_TITLES, validateStep,
  type AddonPrice, type FlowData, type Offer, type Path, type StateFee,
} from "@/lib/formation";

type Msg = { role: "user" | "assistant"; content: string; offerHolding?: boolean };

const STEP_INTROS: Record<Path, string[]> = {
  new_llc: [
    "Let's start with the basics. What's the name of your business, and what will it do? Don't worry about adding \"LLC\" — we handle that.",
    "Where will your business operate day to day? That's usually where your LLC should be formed.",
    "Who owns the business? Add each owner and their share. Most single-owner LLCs are member-managed.",
    "Your package includes a registered agent for the first year, so your home address stays off the public record. Add any extras, and tap the free reviews you'd like. No commitment.",
    "Here's everything in one place. Add your contact details and you're ready to file.",
  ],
  holding: [
    "A holding company owns your other businesses and assets. What should we name it?",
    "Wyoming and Delaware are the two most popular homes for holding companies. Which fits you?",
    "Who owns the holding company? Add each owner and their share.",
    "Your holding company comes with privacy built in. Add anything else you need, including free reviews.",
    "Here's your holding company order. Add your contact details and you're ready to file.",
  ],
  existing: [
    "Welcome back to structure. What's the legal name of your current LLC?",
    "Which state is your LLC registered in?",
    "Who owns the LLC today? This helps us set up the holding company correctly.",
    "Here's what we can add to your existing LLC. Pick anything that fits. The reviews are free.",
    "Review your order and add your contact details.",
  ],
};

export default function FormationFlow({
  path, prices, fees, signedIn, bookingUrl, offer,
}: { path: Path; prices: AddonPrice[]; fees: StateFee[]; signedIn: boolean; bookingUrl: string; offer?: Offer | null }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [flow, setFlow] = useState<FlowData>(() => emptyFlow(path, offer));
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [ask, setAsk] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resume a saved draft for this path.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d?.flow?.path === path) {
          const saved: FlowData = { ...emptyFlow(path, offer), ...d.flow };
          if (offer && !saved.addons.includes(offer)) saved.addons = [...saved.addons, offer];
          setFlow(saved);
          setStep(Math.min(Number(d.step) || 0, 4));
          setMsgs(Array.isArray(d.msgs) ? d.msgs.slice(-30) : []);
        }
      }
    } catch {}
    setLoaded(true);
  }, [path, offer]);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ flow, step, msgs: msgs.slice(-30) })); } catch {}
  }, [flow, step, msgs, loaded]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [step]);
  useEffect(() => {
    if (msgs.length) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length, thinking]);

  const totals = useMemo(() => computeTotals(flow, prices, fees), [flow, prices, fees]);
  const addons = useMemo(() => addonsForPath(path, prices), [path, prices]);
  const launchAddons = addons.filter((a) => (a.grp ?? "launch") === "launch");
  const growthAddons = addons.filter((a) => a.grp === "growth");
  const freeRequest = isFreeRequest(totals);
  const holdingPrice = prices.find((p) => p.key === "holding_addon")?.price_cents ?? null;
  const set = (patch: Partial<FlowData>) => { setError(null); setFlow((f) => ({ ...f, ...patch })); };
  const toggleAddon = (key: string, on?: boolean) =>
    setFlow((f) => {
      const has = f.addons.includes(key);
      const want = on ?? !has;
      return { ...f, addons: want ? (has ? f.addons : [...f.addons, key]) : f.addons.filter((k) => k !== key) };
    });

  function next() {
    const err = validateStep(step, flow);
    if (err) return setError(err);
    setError(null);
    setStep((s) => Math.min(s + 1, 4));
  }
  function back() {
    if (step === 0) router.push("/");
    else { setError(null); setStep((s) => s - 1); }
  }

  async function sendQuestion(text: string) {
    const q = text.trim();
    if (!q || thinking) return;
    const history: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(history);
    setAsk("");
    setThinking(true);
    try {
      const res = await fetch("/api/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          context: { path, step: STEP_TITLES[step], state: flow.state, addons: flow.addons, businessName: flow.businessName },
        }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, {
        role: "assistant",
        content: data.reply ?? "Sorry — I couldn't answer that just now. Try again, or book a call with our team.",
        offerHolding: !!data.offerHolding && path !== "holding",
      }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I couldn't connect just now. Please try again in a moment." }]);
    } finally {
      setThinking(false);
    }
  }

  async function pay() {
    for (let s = 0; s <= 4; s++) {
      const err = validateStep(s, flow);
      if (err) { setStep(s); return setError(err); }
    }
    if (!signedIn) {
      router.push(`/login?next=${encodeURIComponent(`/start/${path}${offer ? `?offer=${offer}` : ""}`)}`);
      return;
    }
    setPaying(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flow, offer: offer ?? null }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout couldn't start.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout couldn't start.");
      setPaying(false);
    }
  }

  const stateName = (code: string) => fees.find((f) => f.code === code)?.name ?? code;

  return (
    <div className="app-shell flex h-[100dvh] flex-col bg-cream">
      {/* Header */}
      <header className="flex flex-col gap-3.5 bg-navy px-5 pb-4 pt-12 text-cream">
        <div className="flex items-center gap-3">
          <button onClick={back} aria-label="Back" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-navy-light">
            <Icon.Back />
          </button>
          <div className="flex-1 text-[13px] text-mist">Step {step + 1} of 5 · {STEP_TITLES[step]}</div>
          <div className="text-[13px] font-semibold text-gold">{money(totals.totalCents)}</div>
        </div>
        <div className="grid grid-cols-5 gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={step + 1} aria-label="Progress">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1 rounded-sm ${i <= step ? "bg-gold" : "bg-navy-line"}`} />
          ))}
        </div>
      </header>

      {/* Body */}
      <div ref={scrollRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
        <GuideBubble>{STEP_INTROS[path][step]}</GuideBubble>

        {step === 0 && (
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="bn" className="label">{path === "existing" ? "Your LLC's legal name" : path === "holding" ? "Holding company name" : "Business name"}</label>
              <input id="bn" className="input" value={flow.businessName} onChange={(e) => set({ businessName: e.target.value })}
                placeholder={path === "holding" ? "e.g. Miller Family Holdings" : "e.g. Desert Peak Consulting"} />
              <p className="mt-1.5 text-xs text-muted">We check name availability with the state before filing.</p>
            </div>
            <div>
              <label htmlFor="bp" className="label">What does the business do?{path === "existing" && " (optional)"}</label>
              <textarea id="bp" rows={3} className="input h-auto py-3" value={flow.businessPurpose}
                onChange={(e) => set({ businessPurpose: e.target.value })} placeholder="One or two sentences is plenty" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-2.5">
            {path === "holding" ? (
              (["WY", "DE"] as const).map((code) => (
                <ChoiceCard key={code} selected={flow.state === code} onClick={() => set({ state: code })}
                  title={stateName(code)}
                  sub={code === "WY" ? "Strong privacy, low ongoing costs" : "Well-known business courts, popular with investors"} />
              ))
            ) : (
              <>
                <ChoiceCard selected={flow.state === "AZ"} onClick={() => set({ state: "AZ" })}
                  title="Arizona" sub={path === "existing" ? "Registered in Arizona" : "Where you live and do business"} />
                <div className={`card flex flex-col gap-2 p-4 ${flow.state !== "AZ" ? "ring-2 ring-navy" : "border border-cream-border"}`}>
                  <label htmlFor="st" className="text-[15px] font-semibold">Another state</label>
                  <select id="st" className="input" value={flow.state === "AZ" ? "" : flow.state}
                    onChange={(e) => e.target.value && set({ state: e.target.value })}>
                    <option value="">Choose a state…</option>
                    {fees.filter((f) => f.code !== "AZ").map((f) => <option key={f.code} value={f.code}>{f.name}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <fieldset className="flex flex-col gap-3">
              <legend className="label">Owners</legend>
              {flow.members.map((m, i) => (
                <div key={i} className="card flex items-end gap-2 p-3">
                  <div className="flex-1">
                    <label htmlFor={`mn${i}`} className="mb-1 block text-xs font-semibold text-muted">Full name</label>
                    <input id={`mn${i}`} className="input h-11" value={m.name}
                      onChange={(e) => set({ members: flow.members.map((x, j) => j === i ? { ...x, name: e.target.value } : x) })} />
                  </div>
                  <div className="w-20">
                    <label htmlFor={`mp${i}`} className="mb-1 block text-xs font-semibold text-muted">Share %</label>
                    <input id={`mp${i}`} type="number" min={0} max={100} inputMode="numeric" className="input h-11 px-3" value={m.percent}
                      onChange={(e) => set({ members: flow.members.map((x, j) => j === i ? { ...x, percent: Number(e.target.value) } : x) })} />
                  </div>
                  {flow.members.length > 1 && (
                    <button aria-label={`Remove ${m.name || "owner"}`} className="flex h-11 w-11 items-center justify-center rounded-xl text-muted hover:bg-cream"
                      onClick={() => set({ members: flow.members.filter((_, j) => j !== i) })}>
                      <Icon.Trash size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button className="btn-ghost self-start" onClick={() => set({ members: [...flow.members, { name: "", percent: 0 }] })}>
                <Icon.Plus size={16} /> Add an owner
              </button>
            </fieldset>
            <fieldset className="flex flex-col gap-2.5">
              <legend className="label">Who runs it day to day?</legend>
              <ChoiceCard selected={flow.management === "member"} onClick={() => set({ management: "member" })}
                title="The owners (member-managed)" sub="Most common for small businesses" />
              <ChoiceCard selected={flow.management === "manager"} onClick={() => set({ management: "manager" })}
                title="Appointed managers (manager-managed)" sub="Common for holding companies and passive owners" />
            </fieldset>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            {growthAddons.length > 0 && (
              <>
                <div className="eyebrow">Grow after you file</div>
                {growthAddons.filter((a) => a.key === "business_credit").map((a) => {
                  const on = flow.addons.includes(a.key);
                  return (
                    <label key={a.key} className={`flex cursor-pointer flex-col gap-3 rounded-2xl p-4 ${on ? "bg-navy text-cream ring-2 ring-gold" : "bg-navy text-cream"}`}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 h-5 w-5 accent-gold" checked={on} onChange={() => toggleAddon(a.key)} />
                        <div className="flex-1">
                          <div className="font-brand text-[13px] tracking-[0.12em] text-gold">BUSINESS CREDIT</div>
                          <div className="mt-1 text-base font-semibold">{a.label}</div>
                          {a.description && <div className="mt-1 text-[13px] leading-relaxed text-mist">{a.description}</div>}
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between border-t border-navy-line pt-3">
                        <span className="text-[13px] text-mist">Get started for</span>
                        <span className="font-display text-[28px] font-semibold text-gold">{money(a.price_cents)}</span>
                      </div>
                    </label>
                  );
                })}
                <div className="card flex flex-col divide-y divide-cream-line">
                  {growthAddons.filter((a) => a.key !== "business_credit").map((a) => (
                    <label key={a.key} className="flex min-h-[44px] cursor-pointer items-center gap-3 px-4 py-3.5">
                      <input type="checkbox" className="h-5 w-5 accent-navy" checked={flow.addons.includes(a.key)} onChange={() => toggleAddon(a.key)} />
                      <div className="flex-1">
                        <div className="text-sm font-semibold">{a.label}</div>
                        {a.description && <div className="text-xs text-muted">{a.description}</div>}
                      </div>
                      <div className="rounded-full bg-cream px-2.5 py-1 text-xs font-semibold">{money(a.price_cents)}</div>
                    </label>
                  ))}
                </div>
              </>
            )}
            {launchAddons.length > 0 && <div className="eyebrow mt-2">Launch kit</div>}
            <div className="card flex flex-col divide-y divide-cream-line">
              {launchAddons.map((a) => (
                <label key={a.key} className="flex min-h-[44px] cursor-pointer items-center gap-3 px-4 py-3.5">
                  <input type="checkbox" className="h-5 w-5 accent-navy" checked={flow.addons.includes(a.key)} onChange={() => toggleAddon(a.key)} />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{a.label}</div>
                    {a.description && <div className="text-xs text-muted">{a.description}</div>}
                  </div>
                  <div className="text-sm font-semibold">{a.price_cents == null ? "Quoted" : money(a.price_cents)}</div>
                </label>
              ))}
            </div>
            {flow.addons.includes("holding_addon") && (
              <fieldset className="flex flex-col gap-2">
                <legend className="label">Holding company state</legend>
                <div className="grid grid-cols-2 gap-2">
                  {(["WY", "DE"] as const).map((code) => (
                    <button key={code} onClick={() => set({ holdingState: code })} aria-pressed={flow.holdingState === code}
                      className={`h-12 rounded-xl text-sm font-semibold ${flow.holdingState === code ? "bg-navy text-cream" : "border border-cream-border bg-white"}`}>
                      {stateName(code)}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {totals.quoted.length > 0 && (
              <p className="text-xs text-muted">Items marked &quot;Quoted&quot; aren&apos;t charged today. We&apos;ll confirm the price with you.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2.5 rounded-2xl bg-navy p-[18px] text-cream">
              <div className="flex items-baseline justify-between">
                <div className="font-brand text-[13px] tracking-[0.12em] text-gold">{packageLabel(flow, fees).toUpperCase()}</div>
                {totals.lines[0] && path !== "existing" && <div className="font-display text-2xl font-semibold">{money(totals.lines[0].cents)}</div>}
              </div>
              <div className="font-display text-xl">{flow.businessName || "Your business"}</div>
              {path === "new_llc" && (
                <ul className="flex flex-col gap-1.5 text-[13px] text-mist">
                  {["Articles of organization filed for you", "Registered agent, first year", "S-corp election", "Lifetime client portal"].map((t) => (
                    <li key={t} className="flex items-center gap-2"><Icon.Check size={16} className="text-gold" />{t}</li>
                  ))}
                </ul>
              )}
              <div className="text-[13px] text-mist">
                Owners: {flow.members.map((m) => `${m.name || "—"} (${m.percent}%)`).join(", ")} · {flow.management === "member" ? "Member-managed" : "Manager-managed"}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="cn" className="label">Your name</label>
                <input id="cn" className="input" autoComplete="name" value={flow.contactName} onChange={(e) => set({ contactName: e.target.value })} />
              </div>
              <div>
                <label htmlFor="cp" className="label">Phone</label>
                <input id="cp" className="input" type="tel" autoComplete="tel" value={flow.contactPhone} onChange={(e) => set({ contactPhone: e.target.value })} />
              </div>
            </div>
            <div className="card flex flex-col gap-2 p-4 text-sm">
              {totals.lines.map((l) => (
                <div key={l.key} className="flex justify-between"><span>{l.label}</span><span className="font-semibold">{money(l.cents)}</span></div>
              ))}
              {totals.stateFee && (
                <div className="flex justify-between text-muted">
                  <span>{totals.stateFee.label}</span>
                  <span>{totals.stateFee.cents == null ? "Confirmed after order" : money(totals.stateFee.cents)}</span>
                </div>
              )}
              {totals.quoted.map((l) => (
                <div key={l.key} className="flex justify-between text-muted"><span>{l.label}</span><span>Quoted</span></div>
              ))}
            </div>
            <p className="text-xs leading-relaxed text-muted">
              Full Circle Formations is a filing service, not a law firm, and doesn&apos;t give legal or tax advice. Questions?{" "}
              {bookingUrl && <a href={bookingUrl} target="_blank" rel="noreferrer" className="font-semibold text-navy underline">Book a call</a>}
            </p>
          </div>
        )}

        {/* Conversation */}
        {msgs.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] whitespace-pre-line rounded-[16px_4px_16px_16px] bg-navy px-3.5 py-3 text-sm leading-relaxed text-cream">{m.content}</div>
            </div>
          ) : (
            <GuideBubble key={i}>
              <div className="whitespace-pre-line">{m.content}</div>
              {m.offerHolding && !flow.addons.includes("holding_addon") && (
                <button onClick={() => toggleAddon("holding_addon", true)}
                  className="mt-2.5 min-h-[44px] self-start rounded-full bg-gold px-3.5 text-[13px] font-semibold text-navy">
                  + Add holding company{holdingPrice != null ? ` · ${money(holdingPrice)}` : ""}
                </button>
              )}
              {m.offerHolding && flow.addons.includes("holding_addon") && (
                <div className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold"><Icon.Check size={16} /> Holding company added</div>
              )}
            </GuideBubble>
          )
        )}
        {thinking && <GuideBubble><span className="animate-pulse text-muted">Thinking…</span></GuideBubble>}
      </div>

      {/* Footer */}
      <footer className="flex flex-col gap-3 border-t border-cream-line bg-cream px-5 pb-7 pt-3">
        {error && <p role="alert" className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-900">{error}</p>}
        <form className="flex items-center gap-2" onSubmit={(e) => { e.preventDefault(); sendQuestion(ask); }}>
          <label htmlFor="ask" className="sr-only">Ask the guide</label>
          <input id="ask" className="h-[46px] flex-1 rounded-full border border-cream-border bg-white px-4 text-sm focus:border-navy focus:outline-none"
            placeholder="Ask anything about your LLC…" value={ask} onChange={(e) => setAsk(e.target.value)} />
          <VoiceButton onText={(t) => sendQuestion(t)} />
          <button type="submit" aria-label="Send question" disabled={!ask.trim() || thinking}
            className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-navy text-gold disabled:opacity-40">
            <Icon.Send size={20} />
          </button>
        </form>
        {step < 4 ? (
          <button onClick={next} className="btn-navy w-full">Continue</button>
        ) : (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-[15px] font-semibold">Total today</span>
              <span className="font-display text-[30px] font-semibold">
                {money(totals.totalCents)}{" "}
                {totals.stateFee?.cents == null && path !== "existing" && <span className="font-sans text-xs font-normal text-muted">+ state fee</span>}
              </span>
            </div>
            <button onClick={pay} disabled={paying || (totals.totalCents <= 0 && !freeRequest)} className="btn-gold w-full">
              <Icon.Lock size={18} />{" "}
              {paying
                ? freeRequest ? "Sending…" : "Opening secure checkout…"
                : freeRequest
                  ? signedIn ? "Send my request" : "Sign in to send my request"
                  : signedIn ? "Pay and get started" : "Sign in to pay and get started"}
            </button>
            <p className="text-center text-xs text-muted">
              {totals.totalCents <= 0 && !freeRequest
                ? "Choose at least one item to continue."
                : freeRequest
                  ? "No payment needed. We'll reach out to schedule your review."
                  : path === "existing" ? "We'll reach out within one business day to get started." : "Filed in 3–5 business days, depending on the state"}
            </p>
          </>
        )}
        <Link href="/" className="sr-only">Start over</Link>
      </footer>
    </div>
  );
}

function GuideBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <GuideAvatar />
      <div className="flex max-w-[85%] flex-col rounded-[4px_16px_16px_16px] bg-white px-3.5 py-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

function ChoiceCard({ selected, onClick, title, sub }: { selected: boolean; onClick: () => void; title: string; sub: string }) {
  return (
    <button onClick={onClick} aria-pressed={selected}
      className={`flex min-h-16 items-center gap-3 rounded-[14px] bg-white px-4 py-3.5 text-left ${selected ? "border-2 border-navy" : "border border-cream-border"}`}>
      <div className="flex-1">
        <div className="text-[15px] font-semibold">{title}</div>
        <div className="mt-0.5 text-xs text-muted">{sub}</div>
      </div>
      {selected ? (
        <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#0A1F44" /><path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="#C9A646" strokeWidth="2.2" strokeLinecap="round" /></svg>
      ) : (
        <span aria-hidden="true" className="h-[22px] w-[22px] rounded-full border-2 border-cream-border" />
      )}
    </button>
  );
}

/* Voice input using the browser's speech recognition, when available. */
function VoiceButton({ onText }: { onText: (t: string) => void }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    const w = window as unknown as Record<string, unknown>;
    setSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
  }, []);
  if (!supported) return null;
  function start() {
    const w = window as unknown as Record<string, new () => {
      lang: string; interimResults: boolean; start: () => void;
      onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void;
    }>;
    const Rec = w.SpeechRecognition || w.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.onresult = (e) => { const t = e.results[0]?.[0]?.transcript; if (t) onText(t); };
    rec.onend = () => setListening(false);
    setListening(true);
    rec.start();
  }
  return (
    <button type="button" onClick={start} aria-label={listening ? "Listening" : "Speak your question"}
      className={`flex h-[46px] w-[46px] items-center justify-center rounded-full ${listening ? "bg-gold text-navy" : "bg-navy text-gold"}`}>
      <Icon.Mic size={20} />
    </button>
  );
}
