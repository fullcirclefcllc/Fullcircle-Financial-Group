import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SYSTEM = `You are the Full Circle Formations guide, inside an app where business owners form an LLC or holding company with Full Circle Financial Group (Phoenix, Arizona).

How to answer:
- Plain, warm, confident English. Short: 2-5 sentences, or a few short bullet lines when comparing options. No jargon without a one-line explanation.
- Topics: LLC basics, choosing a state, member vs manager managed, operating agreements, registered agents, EINs, privacy, holding companies (Wyoming/Delaware), S-corp elections, business credit and funding readiness, protecting the business with life insurance.
- What's included in the $199 LLC package: articles filed for the client, registered agent for the first year, S-corp election, lifetime client portal. Holding company: $250. Expedite: $50. State filing fees are extra and vary by state. Typical completion: 3-5 business days depending on the state.
- Good general guidance: form the operating LLC where the business actually operates (forming elsewhere usually means registering as a foreign LLC at home too). A Wyoming holding company that owns the operating LLC is a common privacy layer.
- Never invent specific state fees, deadlines, tax rates or legal outcomes. If something depends on the person's situation (taxes, liability, multi-state, partners disputes), say so and suggest booking a strategy call with the Full Circle team.
- You are not a lawyer or CPA. When a question is legal or tax in nature, end with one short line: "This is general information, not legal or tax advice."
- Stay on topic. If asked something unrelated, steer back politely.
- If a holding company would genuinely help this person (privacy, multiple businesses, real estate, asset protection) and they haven't added one, end your reply with the exact token [[OFFER_HOLDING]] on its own line. Use it at most when relevant, never in every reply.`;

type InMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return NextResponse.json({ reply: "The guide isn't switched on yet. Please book a call with our team for answers." });

  let body: { messages?: InMsg[]; context?: Record<string, unknown> };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Bad request" }, { status: 400 }); }

  const messages = (body.messages ?? [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Ask a question first." }, { status: 400 });
  }
  // The API requires the conversation to start with a user turn.
  while (messages.length && messages[0].role !== "user") messages.shift();

  const ctx = body.context ?? {};
  const context = `Where the client is in the app: path=${String(ctx.path ?? "")}, step=${String(ctx.step ?? "")}, state=${String(ctx.state ?? "")}, add-ons selected=${JSON.stringify(ctx.addons ?? [])}, business name=${String(ctx.businessName ?? "").slice(0, 80)}.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.GUIDE_MODEL || "claude-haiku-5-5",
      max_tokens: 500,
      system: `${SYSTEM}\n\n${context}`,
      messages,
    }),
  });
  if (!res.ok) {
    console.error("guide error", res.status, await res.text());
    return NextResponse.json({ reply: "I couldn't answer that just now. Please try again in a moment." });
  }
  const data = await res.json();
  let reply: string = (data.content ?? []).filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n").trim();
  const offerHolding = reply.includes("[[OFFER_HOLDING]]");
  reply = reply.replace(/\[\[OFFER_HOLDING\]\]/g, "").trim();

  // Save the conversation for signed-in clients (best effort).
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const all = [...messages, { role: "assistant", content: reply }];
      const { data: existing } = await supabase.from("guide_conversations").select("id").eq("user_id", user.id).maybeSingle();
      if (existing) await supabase.from("guide_conversations").update({ messages: all, updated_at: new Date().toISOString() }).eq("id", existing.id);
      else await supabase.from("guide_conversations").insert({ user_id: user.id, messages: all });
    }
  } catch {}

  return NextResponse.json({ reply, offerHolding });
}
