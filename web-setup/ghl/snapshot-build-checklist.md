# GHL Snapshot Build Checklist — 14-Day Turnkey Deploy

**Goal:** Export a sellable FullCircle Agency OS snapshot ready for agency partners.

---

## Pre-Build Requirements

- [ ] GHL Agency Pro account ($497/mo)
- [ ] Stripe connected for payments
- [ ] A2P/TCPA registration initiated (10DLC)
- [ ] Domain purchased for agency white-label
- [ ] Carrier list finalized for dropdown fields
- [ ] Logo assets (Navy `#0A1F44`, Gold `#C9A646`)

---

## Week 1: Foundation (Days 1–7)

### Day 1 — Account Architecture
- [ ] Create master agency account
- [ ] Configure sub-account template
- [ ] Set custom menu links per [`tab-architecture.md`](tab-architecture.md)
- [ ] Create folder structure in Media Storage

### Day 2 — Custom Fields & Tags
- [ ] Import all Contact fields from [`custom-fields-and-tags.md`](custom-fields-and-tags.md)
- [ ] Import all Opportunity fields
- [ ] Create all tags
- [ ] Build Smart Lists

### Day 3 — Pipelines
- [ ] Build Term Life pipeline (10 stages)
- [ ] Build Whole Life pipeline (11 stages)
- [ ] Build IUL pipeline (12 stages)
- [ ] Build Agent Recruitment pipeline
- [ ] Build Agency Recruitment pipeline
- [ ] Build Retention pipeline

### Day 4 — Forms
- [ ] Term Needs Analysis form
- [ ] Whole Life Financial Discovery form
- [ ] IUL Pre-Qualification + Needs Analysis form
- [ ] Agent recruiting application form
- [ ] Agency partner application form
- [ ] Suitability acknowledgment form

### Day 5 — Workflows (Part 1)
- [ ] New lead assignment (round-robin by certification)
- [ ] Needs analysis scheduled → confirmation sequence
- [ ] Quote presented → 3-touch follow-up
- [ ] App submitted → client status update
- [ ] Policy placed → book of business + 11-month review trigger

### Day 6 — Workflows (Part 2)
- [ ] Agent onboarding sequence (7 emails over 14 days)
- [ ] Agency provisioning workflow (agreement → sub-account)
- [ ] License expiration alerts (90/60/30 days)
- [ ] At-risk retention save sequence
- [ ] Weekly KPI scorecard email (Monday 7am)

### Day 7 — Compliance Workflows
- [ ] Certification gate: block pipeline access without cert flags
- [ ] Suitability doc missing → alert to compliance role
- [ ] NIGO flag → manager notification
- [ ] TCPA consent capture on all forms

---

## Week 2: Content & Launch (Days 8–14)

### Day 8 — Training Academy
- [ ] Create Membership site: FullCircle Agency OS Academy
- [ ] Build course structure per [`membership-training-portal.md`](membership-training-portal.md)
- [ ] Upload Getting Started + Compliance courses (minimum viable)
- [ ] Configure certification automations

### Day 9 — Marketing Assets
- [ ] Build Term lead capture funnel
- [ ] Build IUL lead capture funnel
- [ ] Build Agency recruitment landing page
- [ ] Build Agent recruitment landing page
- [ ] Email templates: welcome, quote follow-up, review reminder

### Day 10 — Dashboards
- [ ] Executive KPI dashboard per [`kpi-dashboard-spec.md`](kpi-dashboard-spec.md)
- [ ] Agent personal dashboard
- [ ] Term / Whole / IUL product dashboards
- [ ] Compliance alert dashboard

### Day 11 — Calendars
- [ ] Discovery call calendar (30 min)
- [ ] Illustration review calendar (15 min)
- [ ] Agency demo calendar (45 min)
- [ ] Agent interview calendar (30 min)
- [ ] Round-robin assignment rules

### Day 12 — Test Data & QA
- [ ] Create 5 test contacts (agent, client, recruit)
- [ ] Run full Term pipeline test (lead → placed)
- [ ] Run agent onboarding workflow test
- [ ] Verify certification gates work
- [ ] Verify KPI widgets populate

### Day 13 — Snapshot Export
- [ ] Export snapshot: `FullCircle-Agency-OS-v1.0`
- [ ] Document included assets in snapshot README
- [ ] Test import into blank sub-account
- [ ] Verify all workflows active after import

### Day 14 — Go Live
- [ ] Agency recruitment funnel live
- [ ] Stripe products: Starter $2,997 / Growth $7,500
- [ ] Sales deck linked in recruitment pipeline
- [ ] Support channel configured
- [ ] First agency partner onboarding scheduled

---

## Snapshot Export Includes

| Asset | Count |
|-------|-------|
| Pipelines | 6 |
| Custom fields | 40+ |
| Tags | 30+ |
| Workflows | 15+ |
| Forms | 6 |
| Funnels | 4 |
| Email templates | 20+ |
| SMS templates | 10+ |
| Membership courses | 7 categories |
| Dashboards | 4 |
| Smart Lists | 8+ |
| Calendar templates | 4 |

---

## Post-Deploy: Agency Partner Onboarding

When new agency signs:
1. Import snapshot to new sub-account (15 min)
2. Apply their branding (1 hr)
3. Configure their carrier list (30 min)
4. Create agent seats (15 min)
5. Principal completes Agency Admin cert (Day 1)
6. First agent completes Term cert (Week 1)
7. First app submitted (Week 2–4 target)

**Total deploy time per agency:** 14 days (matches 90-day success plan in recruitment playbook)

---

## Version Control

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-06 | Initial release — Term, Whole, IUL, recruitment, retention |
| v1.1 | TBD | Annuities pipeline, commission integration |

Store snapshot changelog in this file when updating.
