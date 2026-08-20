# Client Retention Pipeline

**Pipeline Name:** Retention & Policy Servicing  
**Purpose:** Prevent lapses, drive reviews, protect persistency KPIs

---

## Stages

| # | Stage | Definition | Max Days | Auto-Action |
|---|-------|------------|----------|-------------|
| 1 | **Review Due** | 11-month or annual review triggered | 14 | Schedule review call |
| 2 | **Review Scheduled** | Client booked | 7 | Pre-review policy summary sent |
| 3 | **Review Complete** | Annual needs analysis updated | — | Update suitability docs |
| 4 | **At-Risk Identified** | Missed premium, life change, dissatisfaction | 3 | Tag `retention:at-risk`, manager alert |
| 5 | **Retention Outreach** | Save attempt in progress | 14 | Escalating touch sequence |
| 6 | **Saved** | Policy retained or restructured | — | Remove at-risk tag |
| 7 | **Lapsed** | Policy terminated | — | Tag `retention:lapsed`, chargeback check |
| 8 | **Win-Back** | Re-engage lapsed client | 90 | Nurture campaign |

---

## Auto-Triggers into Pipeline

| Trigger | Source | Action |
|---------|--------|--------|
| 11 months in-force | Workflow on Placed date | Create retention opportunity |
| Missed premium notice | Manual entry or carrier feed | Stage: At-Risk |
| Client life event | Contact field update (job change, divorce, new child) | Schedule review |
| Persistency drop | KPI alert | Manager review of agent book |

---

## 11-Month Review Script

1. Confirm coverage still meets needs
2. Review beneficiary designations
3. Discuss life changes since placement
4. Whole/IUL: Review cash value statement
5. Cross-sell assessment (additional products?)
6. Referral ask (if satisfaction high)
7. Update suitability documentation

---

## At-Risk Save Sequence

| Day | Action |
|-----|--------|
| 0 | Agent call + SMS |
| 2 | Email: "Your coverage review" |
| 5 | Manager call (if premium >$500/mo) |
| 7 | Offer payment plan or restructure |
| 14 | Final save attempt → Lapsed if no response |

---

## KPI Contribution

- **13-Month Persistency**
- **Lapse Ratio**
- **Chargeback Rate**
- **Client Retention Rate**
