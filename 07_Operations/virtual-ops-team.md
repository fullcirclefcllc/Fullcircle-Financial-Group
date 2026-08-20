# Virtual Ops Team — FullCircle Financial Group

**Your daily command center.** Open this file every morning. Dispatch work to agents instead of reinventing prompts.

---

## Agent Roster

| Agent | Owns | Invoke with |
|-------|------|-------------|
| **OpsChief** | Pipeline, sprint, onboarding, client folders | *"Pipeline pulse — what's stale, today's 10 touches"* |
| **MarketingArchitect** | Campaigns, DMs, email sequences, JV pitches | *"Write 10 warm DMs for realtors — PPA hook"* |
| **SalesCloser** | Proposals, follow-ups, objections | *"Draft proposal for [name] — [package], notes: [paste]"* |
| **ContentProducer** | Social batch, reels, case studies | *"Weekly content batch — 5 posts, 2 reels"* |
| **FulfillmentLead** | PPA blueprints, trackers, SOP execution | *"Run PPA blueprint — intake + call notes attached"* |
| **AutomationEngineer** | Forms, payments, sequences, repo wiring | *"Wire intake form to Formspree + pipeline entry"* |

**You stay on:** discovery calls, final close, walkthroughs, IUL/trust decisions, partner relationships.

Full agent definitions: [`.cursor/AGENTS.md`](../.cursor/AGENTS.md)

---

## Daily Dispatch (Non-Negotiables)

- [ ] **10 outbound touches** (DM, email, call, or referral ask)
- [ ] **2–3 discovery calls** booked or held
- [ ] **Pipeline update** in [`lead-pipeline.md`](lead-pipeline.md)
- [ ] **1 content touch** (post, story, or scheduled draft)
- [ ] **Same-day proposal** if discovery call happened yesterday

---

## Weekly Rhythm

| Day | Agent | Action |
|-----|-------|--------|
| **Monday** | ContentProducer | Run weekly content batch → approve → schedule |
| **Tuesday** | MarketingArchitect | Outbound campaign + JV partner touch |
| **Wednesday** | OpsChief | Full pipeline review — move every lead one stage |
| **Thursday** | SalesCloser | Follow-up blitz on PROPOSED + DECISION stages |
| **Friday** | FulfillmentLead | Client delivery audit — trackers, milestones, open SOP steps |
| **Daily** | OpsChief | 8am pipeline pulse (automation or manual) |

---

## Invoke Prompts (Copy-Paste)

### OpsChief
```
You are OpsChief for FullCircle Financial Group. Read CLAUDE.md, lead-pipeline.md, and 14-day-sprint-plan.md.
Give me: (1) stale leads over 48hrs, (2) today's 10 outbound targets, (3) pipeline stage changes needed, (4) any client onboarding gaps.
```

### MarketingArchitect
```
You are MarketingArchitect for FCFG. Read the relevant marketing kit in 05_Templates-and-Proposals/marketing/ and ideal-client-avatar.md.
Create [DM batch / email sequence / JV pitch] for [audience]. Match brand voice: authoritative, not salesy. Include CTA to Calendly or PPA.
```

### SalesCloser
```
You are SalesCloser for FCFG. Read proposal-template.md, pricing-and-packages.md, and pipeline-flow.md.
Draft a complete proposal for [client name], package [Foundation/Blueprint/PPA/etc.], based on these discovery notes: [paste].
Send within 24hr SLA. Include deposit amount and urgency hook.
```

### ContentProducer
```
You are ContentProducer for FCFG. Read brand-guide.md, expert-positioning-strategy.md, and one marketing kit.
Produce: 5 social posts (IG/LinkedIn), 2 reel scripts (60 sec), 1 case study card. Navy/gold brand. Problem-first hooks.
```

### FulfillmentLead
```
You are FulfillmentLead for FCFG. Read fulfillment-playbook.md and the relevant SOP in 04_Services/.
Run PPA blueprint using Prompts 0–4 with these notes: [paste intake + call notes]. Output all 13 sections per blueprint-template.md.
```

### AutomationEngineer
```
You are AutomationEngineer for FCFG. Read gap-analysis.md and vendor-partner-list.md.
Implement [specific automation]. Document changes. Do not break existing workflows.
```

---

## Escalation Rules (Requires Breyon Before Sending)

| Output type | Rule |
|-------------|------|
| Proposals over $7,500 | Review pricing and scope before send |
| Client-facing blueprints | Review numbers and compliance language |
| Partner/JV agreements | Review before send |
| Public social posts | Quick scan for accuracy |
| Payment links / form wiring | Confirm amounts before deploy |

Everything else: agent drafts → you approve in batch.

---

## Handoff Protocol

```
LEAD → MarketingArchitect (outbound) → SalesCloser (discovery follow-up)
     → SalesCloser (proposal) → OpsChief (ENROLLED → create client folder)
     → FulfillmentLead (delivery) → ContentProducer (case study after win)
```

When deal moves to **ENROLLED** in [`pipeline-flow.md`](pipeline-flow.md):
1. OpsChief creates `02_Clients/[Name]/` from templates
2. SalesCloser archives proposal in client folder
3. FulfillmentLead starts package SOP + progress tracker

---

## Human Hire Triggers

| Role | Hire when | Takes from you |
|------|-----------|----------------|
| **VA / Ops Associate** | 5+ active clients OR 3+ PPAs/week | Folder setup, tracker updates, intake chasing |
| **Sales Closer** | 20+ discovery calls/week | Follow-ups, proposal polish, deposit collection |
| **Content VA** | Content batch exceeds 2 hrs/week | Scheduling, Canva, posting |
| **Media Buyer** | Funnel live + $1.5K–3K/mo ad budget | Paid traffic |

AI agents cover these functions until thresholds hit.

---

## Cursor Automations

| Automation | Trigger | Skill | Output |
|------------|---------|-------|--------|
| Monday Content Batch | Weekly Mon 7am | `fcfg-content` | Draft in `07_Operations/content-calendar/` |
| Pipeline Pulse | Daily 8am | `fcfg-ops-chief` | Update `lead-pipeline.md` |
| Post-Discovery Proposal | Manual | `fcfg-sales` | Proposal in client/prospect folder |

Setup specs: [`.cursor/automations/`](../.cursor/automations/)

---

## Phase 2 Automation Backlog (AutomationEngineer)

Priority from [`gap-analysis.md`](gap-analysis.md):

1. Intake form backend → [`website/intake-form.html`](../website/intake-form.html) + [`phase2-intake-and-payments.md`](phase2-intake-and-payments.md)
2. Stripe payment links (PPA $1,497, Foundation $2,997)
3. 3-touch follow-up sequence → [`onboarding-workflow.md`](onboarding-workflow.md)
4. E-sign path for service agreements
