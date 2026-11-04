# Funnel Library — Agency OS (GHL Funnels / Sites)

**Configure in:** GHL → Funnels  
**Brand:** Navy `#0A1F44`, Gold `#C9A646`, Cream `#F5EFE0`, Cinzel + Cormorant Garamond.

Each funnel is **white-label**: swap logo, domain, Calendly/GHL calendar embed, and agency name.

---

## Funnel 1 — Term Life (Protection Now)

**Slug:** `/term-protection`  
**Goal:** Book 15-min quote call  
**Pages:**

1. **Opt-in** — Headline: *You don’t have a coverage problem. You have a gap problem.* Sub: Income replacement in 15 minutes. Form: name, phone, email, TCPA.
2. **Thank-you** — Calendar embed: Discovery (Term).
3. **Nurture** — Workflow: New Lead Follow-Up (see email-sms library).

**Offer:** Free term needs analysis. No illustration complexity.

---

## Funnel 2 — IUL (Architect’s Liquidity)

**Slug:** `/iul-architect`  
**Goal:** Book 45-min discovery with IUL-certified agent only  
**Pages:**

1. **Education** — *Protection that can also become a private banking system — when it is designed correctly.*  
   Bullets: death benefit, indexed crediting, policy loans, suitability gate ($300–$500+/mo).
2. **Prequal form** — `form-iul-prequal`.
3. **Thank-you (qualified)** — Illustration review calendar.
4. **Thank-you (not qualified)** — Route to Term funnel + education PDF.

**Compliance footer on every IUL page:** Illustrations are not guarantees. Caps, participation, and loan provisions vary by carrier. Product of the insurance company, not FullCircle Agency OS.

---

## Funnel 3 — Whole Life (Permanent Architecture)

**Slug:** `/whole-life`  
**Headline:** *Permanent protection. Predictable cash value. A system, not a slogan.*  
Calendar: Whole Life discovery (30 min). Form: `form-whole-discovery`.

---

## Funnel 4 — Agency Recruitment (Sell the OS)

**Slug:** `/agency-os`  
**Audience:** Principals with 3+ agents  
**Headline:** *Stop recruiting producers into chaos. Plug them into an operating system.*

**Page sections:**
1. Problem — Spreadsheets, mixed pipelines, no persistency view, training that is a Zoom recording.
2. System — Product tabs, certification gates, MDRT-grade KPIs, agency sub-accounts.
3. Proof — 30-year architect, 4-pillar framework, 14-day deploy.
4. Tiers — Starter $2,997 / Growth $7,500 / Enterprise $15,000+.
5. CTA — Agency application + 45-min Agency Demo calendar.

Copy source: [`../../agency/sales-deck.md`](../../agency/sales-deck.md)

---

## Funnel 5 — Agent Recruitment

**Slug:** `/join`  
**Headline:** *Be in business for yourself — never by yourself. Certified product tracks. One CRM.*  
CTA: Agent application + interview calendar.

Do **not** lead with “unlimited residual” or “be your own boss” hype. Lead with training gates, persistency, and support.

---

## Funnel 6 — Review / Referral (In-Force Clients)

**Trigger:** 11-month persistency workflow  
**Page:** Annual review booking + “who else needs protection” referral fields.

---

## Tracking

| Funnel | UTM / hidden field | Tag on submit |
|--------|--------------------|---------------|
| Term | `funnel=term` | `product:term` |
| IUL | `funnel=iul` | `product:iul` |
| Whole | `funnel=whole` | `product:whole` |
| Agency | `funnel=agency-os` | `recruit:agency-prospect` |
| Agent | `funnel=join` | `recruit:agent-prospect` |

Speed-to-lead target: **first SMS &lt; 5 minutes**.
