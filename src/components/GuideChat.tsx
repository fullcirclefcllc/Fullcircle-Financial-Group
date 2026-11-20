"use client";
import { useEffect, useRef, useState } from "react";
import { GuideAvatar, Icon } from "@/components/brand";

type Msg = { role: "user" | "assistant"; content: string };

/** Standalone guide chat for the portal. */
export function GuideChat({ initial }: { initial: Msg[] }) {
  const [msgs, setMsgs] = useState<Msg[]>(initial);
  const [ask, setAsk] = useState("");
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs.length, busy]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const q = ask.trim();
    if (!q || busy) return;
    const history = [...msgs, { role: "user" as const, content: q }];
    setMsgs(history);
    setAsk("");
    setBusy(true);
    try {
      const res = await fetch("/api/guide", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history, context: { path: "portal", step: "client portal" } }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "assistant", content: data.reply ?? "Please try again in a moment." }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I couldn't connect just now. Please try again." }]);
    } finally { setBusy(false); }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
        <Bubble role="assistant" content="Ask me anything about your business structure, credit, funding or protection. I'll point you to the right next step." />
        {msgs.map((m, i) => <Bubble key={i} {...m} />)}
        {busy && <Bubble role="assistant" content="Thinking…" />}
        <div ref={end} />
      </div>
      <form onSubmit={send} className="flex items-center gap-2 border-t border-cream-line px-5 py-3">
        <label htmlFor="pg" className="sr-only">Ask the guide</label>
        <input id="pg" value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask anything…"
          className="h-[46px] flex-1 rounded-full border border-cream-border bg-white px-4 text-sm focus:border-navy focus:outline-none" />
        <button aria-label="Send question" disabled={!ask.trim() || busy}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-navy text-gold disabled:opacity-40"><Icon.Send size={20} /></button>
      </form>
    </div>
  );
}

function Bubble({ role, content }: Msg) {
  if (role === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-line rounded-[16px_4px_16px_16px] bg-navy px-3.5 py-3 text-sm leading-relaxed text-cream">{content}</div>
      </div>
    );
  return (
    <div className="flex items-start gap-2.5">
      <GuideAvatar />
      <div className="max-w-[85%] whitespace-pre-line rounded-[4px_16px_16px_16px] bg-white px-3.5 py-3 text-sm leading-relaxed">{content}</div>
    </div>
  );
}
