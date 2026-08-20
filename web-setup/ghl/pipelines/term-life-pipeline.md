# Term Life Pipeline

**Pipeline Name:** Term Life  
**GHL Location:** Opportunities → Pipelines → Term Life  
**Access:** All Term Certified agents

---

## Stages

| # | Stage | Definition | Max Days | Auto-Action |
|---|-------|------------|----------|-------------|
| 1 | **New Lead** | Inbound or outbound lead captured | 1 | Assign agent, SMS intro, tag `product:term` |
| 2 | **Contacted** | First touch completed | 2 | If no response → nurture workflow |
| 3 | **Needs Analysis Scheduled** | Discovery call booked | 3 | Calendar confirmation + pre-call form |
| 4 | **Needs Analysis Complete** | Suitability documented | 2 | Set `client_suitability_complete`, tag `stage:needs-analysis` |
| 5 | **Quote Presented** | Term quote shared with client | 5 | Follow-up sequence Day 1, 3, 7 |
| 6 | **Application Started** | App in progress | 3 | Reminder if stalled |
| 7 | **App Submitted** | Sent to carrier | 14 | Set `app_submitted_date`, tag `stage:app-submitted` |
| 8 | **Underwriting** | Carrier reviewing | 21 | Status update workflow to client |
| 9 | **Placed** | In-force policy | — | Set `in_force_date`, `target_premium`, move to Book of Business |
| 10 | **Lost** | Declined or client passed | — | Lost reason required, re-nurture option |

---

## Stage Exit Criteria

| From → To | Required |
|-----------|----------|
| New Lead → Contacted | First call/SMS logged |
| Needs Analysis Complete → Quote | Needs analysis form on file |
| Quote → App Started | Client verbal yes |
| App Submitted → Underwriting | Application confirmation from carrier |
| Underwriting → Placed | Policy number + in-force confirmation |

---

## Lost Reasons (Dropdown)

- Price / budget
- Chose competitor
- Uninsurable / declined
- No response / ghosted
- Not qualified (health)
- Timing — follow up later

---

## Key Forms

| Form | Stage | Fields |
|------|-------|--------|
| Term Needs Analysis | Before Quote | Age, income, dependents, existing coverage, term length preference, budget |
| Term Application Checklist | App Started | Carrier, face amount, premium, beneficiary |

---

## Workflows Connected

- New lead → assign round-robin to Term Certified agents
- Needs analysis scheduled → pre-call SMS + form link
- Quote presented → 3-touch follow-up
- App submitted → client status update email
- Placed → retention review scheduled at 11 months
- Lost (timing) → 90-day re-nurture

---

## KPI Contribution

- **Term Mix %** — count Placed in this pipeline
- **Placement Ratio** — Placed ÷ App Submitted
- **Time to Issue** — in_force_date − app_submitted_date
- **Average Premium** — AVG(target_premium) on Placed
