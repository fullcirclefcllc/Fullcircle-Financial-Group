# Profit Protection Audit — Claude Fulfillment Playbook

*Use these 5 prompts in sequence after every paid diagnostic call. Paste call notes at each step. Turn intake notes + call notes into a finished 13-page blueprint in 60–90 minutes.*

---

## Before You Start

After the diagnostic call, immediately:
1. Open a new Claude conversation
2. Run Prompt 0 (Master Context) — this loads your voice and framework
3. Run Prompts 1–4 in order, pasting your notes at each step
4. Final polish: swap in real numbers, add client name, remove any hedged language

**Time per audit with Claude:**
- Diagnostic call: 45 min
- Blueprint generation (Prompts 0–4): 45–60 min
- Your review + polish: 30–45 min
- Walkthrough call: 60 min
- **Total: ~3.5 hours @ $1,497 = ~$427/hour**

---

## Prompt 0 — Master Context (Run First)

```
You are drafting a Profit Protection Blueprint for a client of FullCircle Financial Group. The advisor is Breyon Miller, The Financial Architect, with 30 years of experience in IUL, asset protection, business credit, LLC/entity formation, tax strategy, and estate planning.

The Four Pillars of Full Circle's framework are:
1. Protection — Life insurance, disability, umbrella, trust, estate plan
2. Structure — LLC, Holding Company, entity separation, anonymity
3. Leverage — IUL policy loans, business credit, tax reduction strategy
4. Scale — Fractional CFO, retainer, legacy planning, succession

Voice: Authoritative, confident, education-first. Never salesy. Specific, not vague. Uses real numbers whenever possible. Reveals problems clearly before prescribing solutions. The client is the protagonist; Breyon is the architect who designed their system.

The blueprint structure is:
I. Cover Page
II. Executive Summary
III. Your Current State (4-pillar scorecard)
IV. Tax Leakage Analysis (Schedule C vs. S-Corp)
V. Entity Recommendation
VI. Protection Gap Matrix
VII. Leverage Plan
VIII. 90-Day Implementation Roadmap
IX. 5-Year Wealth Trajectory
X. Recommended Next Engagement

Confirm you understand this framework and are ready to receive client notes.
```

---

## Prompt 1 — Diagnosis (4-Pillar Scorecard)

```
Here are the intake questionnaire answers and diagnostic call notes for [CLIENT NAME], a [profession] earning approximately $[X] annually.

[PASTE ALL INTAKE ANSWERS AND CALL NOTES HERE]

Based on these notes:
1. Score each of the four pillars (Protection, Structure, Leverage, Scale) on a scale of 1–10. Explain each score in 2–3 sentences using specific evidence from the notes.
2. Identify the top 3 critical gaps — the vulnerabilities causing the most financial leakage or risk right now.
3. Write a "pattern statement" — one paragraph that captures their overall financial situation in plain language, written in second person ("You have built..."). This will open the Executive Summary.

Output: Pillar scores with explanations, top 3 gaps, and the pattern statement.
```

---

## Prompt 2 — Tax Leakage Analysis

```
Client context: [CLIENT NAME], [profession], $[X] gross income, current entity: [ENTITY], current tax approach: [APPROACH].

Using the notes above, produce Section IV of the blueprint:

1. Current State Analysis: Estimate their current SE tax burden and effective tax rate on self-employment income. Show the math.
2. Schedule C vs. S-Corp Comparison: Build a side-by-side table showing:
   - Gross income
   - SE tax (Schedule C vs. S-Corp with reasonable salary)
   - Federal income tax estimate
   - State income tax (estimate if state not specified)
   - Net take-home comparison
   - Total annual tax savings from S-Corp election
3. Missing Deductions Analysis: List the top 5–7 deductions they are likely not taking, with estimated annual savings for each. Include: home office, vehicle mileage, health insurance premiums, retirement contributions (SEP IRA or solo 401k), section 199A QBI deduction, Augusta Rule if applicable.
4. Total Recoverable Leakage: Sum all identified savings and present as a bold total. This is the headline number for the walkthrough call.

Format as a clean, readable section with headers, tables, and bullet points.
```

---

## Prompt 3 — Full Blueprint Drafting

```
Using all the analysis from the previous prompts, draft the following sections of the Profit Protection Blueprint for [CLIENT NAME]:

Section I — Executive Summary (3–4 paragraphs): Open with the pattern statement, state the total recoverable leakage, preview the recommendations, and close with the 5-year wealth trajectory hook.

Section V — Entity Recommendation: Based on their current entity ([ENTITY]) and income ($[X]), recommend the optimal entity structure with specific reasoning. If S-Corp election is recommended, explain the salary-to-distribution ratio and timing.

Section VI — Protection Gap Matrix: For each protection category (life insurance, disability, umbrella, trust/estate), state: current status, the risk they are exposed to, and the specific recommended fix. Present as a table.

Section VII — Leverage Plan: Recommend specific leverage tools: IUL policy design and funding strategy, business credit roadmap (which tiers, which vendors, timeline to $[target] in available credit), and tax-advantaged savings vehicle (SEP IRA or solo 401k with contribution limit estimate).

Section VIII — 90-Day Implementation Roadmap: A month-by-month action plan (Month 1 / Month 2 / Month 3) showing which pillar items to implement in which order, with specific actions and milestones.

Section IX — 5-Year Wealth Trajectory: Compare two scenarios — "Do Nothing" vs. "Full Implementation." Show approximate net worth at year 1, 2, 3, 5 for each scenario. Include the total dollar difference between the two paths.

Section X — Recommended Next Engagement: Based on client complexity and income, recommend either Foundation ($2,997), Blueprint ($7,500), or Done With You ($15,000). Write 2–3 sentences explaining WHY this tier fits their specific situation. This is the upsell section — make it specific, not generic.
```

---

## Prompt 4 — Final Polish

```
Review the complete Profit Protection Blueprint draft for [CLIENT NAME] and do the following quality control pass:

1. Number check: Verify all dollar figures are internally consistent. Flag any number that contradicts another.
2. Language strip: Remove any hedged or soft language ("might," "could potentially," "it may be possible") — replace with direct, confident language ("will," "reduces," "eliminates").
3. Voice check: Ensure every section sounds like Breyon Miller — authoritative, specific, and empowering. Remove any generic financial advice language.
4. Pillar check: Confirm all four pillars (Protection, Structure, Leverage, Scale) are addressed. Flag any pillar with no recommendation.
5. Upsell check: Review Section X. Confirm the recommended tier is backed by at least two client-specific reasons. If it reads generic, rewrite it.
6. Headline number: Confirm the "total recoverable leakage" figure is prominent in the Executive Summary AND referenced again in Section X.

Output the revised sections with changes highlighted in [brackets] so I can see what was edited.
```

---

## Bonus — Walkthrough Call Script Generator

```
Generate a section-by-section walkthrough script for my 60-minute strategy call with [CLIENT NAME].

Client summary: [PASTE 2–3 SENTENCES ON THEIR SITUATION]
Blueprint highlights: $[X] total recoverable leakage, [top 2–3 gaps], recommended tier: [TIER AT $X]

Structure the call script as:

Opening (5 min): Welcome + agenda + expectations
Section II — Executive Summary (10 min): Deliver the pattern statement and headline number with impact
Section III — Pillar Scorecard (10 min): Walk through each score, let them react
Section IV — Tax Leakage (15 min): The line-by-line savings — this is the emotional peak
Sections V–VIII (10 min): Recommendations overview — keep it high level, you'll implement together
Section IX — Wealth Trajectory (5 min): The $[delta] difference — show them the cost of inaction
Pivot to Next Engagement (5 min): Transition script from "here's what the blueprint showed" to "here's how we implement this together"
Offer + Close (5–10 min): Present [TIER] at $[PRICE], payment structure, next steps

Include: the exact transition script from delivery to offer, responses to the 4 most common reactions (I'm in / let me think / not right now / I'll do it myself).
```

---

## Troubleshooting

**Claude generates hedged/vague content:** Add to any prompt: "Be direct and specific. Use real numbers. Avoid any phrase like 'it depends,' 'it may vary,' or 'consult a professional.' I am the professional — write as if these are my direct recommendations."

**Blueprint taking too long:** Run Prompts 1–2 in one session, save the output, start a new session with the output pasted as context for Prompt 3.

**Numbers feel off:** Run the S-Corp math manually at Collective.com's free calculator before the walkthrough call. Never present a number you haven't verified.

**Client wants a Word doc:** Copy the blueprint text into Google Docs after Claude generates it. Format manually with Cinzel headings and FCFG navy/gold colors.

---

*By audit #10, this process should take under 45 minutes. By audit #20, you'll be at 30 minutes with a library of client patterns you've already written.*
