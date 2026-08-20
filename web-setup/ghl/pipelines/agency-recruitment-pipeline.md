# Agency Recruitment Pipeline

**Pipeline Name:** Agency Recruitment  
**Purpose:** Recruit agency partners (not individual agents) — 3+ agent shops, IMO downline builders

---

## Stages

| # | Stage | Definition | Max Days | Auto-Action |
|---|-------|------------|----------|-------------|
| 1 | **Prospect Identified** | Agency owner in target market | 3 | Tag `recruit:agency-prospect` |
| 2 | **Outreach Sent** | Initial DM/email/call made | 2 | Follow-up sequence |
| 3 | **Responded** | Prospect engaged | 3 | Send Agency OS overview deck |
| 4 | **Qualification Call Scheduled** | 20-min discovery booked | 5 | Pre-call agency profile form |
| 5 | **Qualified** | Meets minimum criteria | 3 | Tag `recruit:qualified`, schedule demo |
| 6 | **Demo Completed** | Full Agency OS walkthrough | 5 | Send tier comparison + proposal |
| 7 | **Proposal Sent** | Starter/Growth/Enterprise proposal | 7 | 3-touch follow-up |
| 8 | **Agreement Signed** | Contract + setup fee collected | 3 | Trigger provisioning workflow |
| 9 | **Sub-Account Provisioned** | GHL sub-account live from snapshot | 7 | Kickoff call scheduled |
| 10 | **Onboarding Complete** | 90-day checklist started | 90 | Hand to agency success workflow |
| 11 | **Lost** | Did not sign | — | Nurture quarterly |

---

## Qualification Criteria (Stage 5 Gate)

Must meet 3 of 5:
- [ ] 3+ licensed agents on team
- [ ] $50K+ annual premium (or clear path within 12 months)
- [ ] Principal is full-time agency builder
- [ ] Currently using spreadsheets or generic CRM
- [ ] Expressed intent to scale team in 12 months

---

## Demo Agenda (45 min)

1. **Problem** (5 min) — Fragmented tools, no product separation, no KPI visibility
2. **Command Center** (10 min) — Executive dashboard walkthrough
3. **Product Pipelines** (10 min) — Term / Whole / IUL separated
4. **Training Academy** (5 min) — Certification tracks
5. **Recruitment Engine** (5 min) — How they recruit their own agents
6. **Pricing & Tiers** (5 min) — Starter / Growth / Enterprise
7. **Next Steps** (5 min) — Agreement + 14-day deploy timeline

---

## Provisioning Workflow (Agreement Signed →)

1. Collect setup fee via Stripe (GHL Payments)
2. Create sub-account: `[AgencyName]-[State]-[Tier]`
3. Apply FullCircle Agency OS snapshot
4. Configure custom menu (tab-architecture.md)
5. Set agency branding (logo, colors, domain)
6. Create agency owner admin user
7. Send welcome email + kickoff calendar link
8. Enroll principal in Agency Admin Certification
9. Schedule Day 1 kickoff call

---

## Revenue per Closed Agency

| Tier | Setup | Monthly | Year 1 Total |
|------|-------|---------|--------------|
| Starter | $2,997 | $197/mo | $5,361 |
| Growth | $7,500 | $497/mo | $13,464 |
| Enterprise | $15,000+ | Custom | $20,000+ |

---

## KPI Contribution

- **New Agencies (QTD)**
- **Agency Recruitment Conversion** — Provisioned ÷ Qualified
- **Average Setup Revenue**
- **Agency Retention** — still active at 12 months
