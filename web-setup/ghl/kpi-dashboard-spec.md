# Executive KPI Dashboard — FullCircle Agency OS

**Configure in:** GHL → Dashboard → Custom Widgets + Reports

These are the metrics top IMOs, BGAs, and large agencies track. Every widget includes definition, formula, target, and GHL data source.

---

## Tier 1: Executive Dashboard (Agency Owner / IMO)

### Production KPIs

| KPI | Definition | Formula | Target | GHL Source |
|-----|------------|---------|--------|------------|
| **Total Premium (MTD)** | Sum of target premium on placed apps | SUM(opportunity.custom.target_premium) WHERE stage=Placed, close_date=this month | Agency goal | Opportunities — Placed stage |
| **Total Premium (YTD)** | Year-to-date placed premium | SUM target_premium, YTD | Annual goal | Opportunities — Placed |
| **Applications Submitted (MTD)** | Apps sent to carrier | COUNT(opportunities) WHERE stage=App Submitted+ | 20+/agent/mo | Pipeline stages |
| **Placement Ratio** | Apps that become in-force | Placed ÷ App Submitted × 100 | 75%+ | Pipeline conversion |
| **Average Premium per App** | Revenue quality | Total Premium ÷ Placed Apps | Varies by product | Calculated |
| **Time to Issue** | Days from app to in-force | AVG(in_force_date - app_submitted_date) | <21 days | Custom date fields |

### Product Mix KPIs

| KPI | Definition | Formula | Target | GHL Source |
|-----|------------|---------|--------|------------|
| **Term Mix %** | Term as share of apps | Term Apps ÷ Total Apps × 100 | 30–40% | Tag: product:term |
| **Whole Life Mix %** | Whole as share | Whole Apps ÷ Total Apps × 100 | 20–25% | Tag: product:whole |
| **IUL Mix %** | IUL as share | IUL Apps ÷ Total Apps × 100 | 25–35% | Tag: product:iul |
| **Cross-Sell Ratio** | Clients with 2+ products | Multi-product clients ÷ Total clients × 100 | 40%+ | Contact tags |

### Persistency & Retention KPIs

| KPI | Definition | Formula | Target | GHL Source |
|-----|------------|---------|--------|------------|
| **13-Month Persistency** | Policies still in force at 13 months | In-force at 13mo ÷ Placed 13mo ago × 100 | 90%+ | Custom field: persistency_status |
| **Lapse Ratio** | Policies lapsed | Lapsed ÷ In-force × 100 | <10% | Retention pipeline |
| **Chargeback Rate** | Commission chargebacks | Chargebacks ÷ Placed × 100 | <5% | Tag: chargeback |
| **Client Retention Rate** | Clients with active policies | Active clients ÷ Total clients × 100 | 85%+ | Smart list |

### Agent & Agency KPIs

| KPI | Definition | Formula | Target | GHL Source |
|-----|------------|---------|--------|------------|
| **Active Agents** | Licensed, appointed, producing | COUNT(contacts) WHERE tag=agent AND status=active | Grow 10%/qtr | Contacts |
| **Agent Retention (2yr)** | Agents still after 24 months | Active at 24mo ÷ Hired 24mo ago × 100 | 60%+ | Custom field: hire_date |
| **New Agents (MTD)** | Recruited this month | COUNT agent recruitment pipeline → Contracted | 2+/mo | Agent pipeline |
| **New Agencies (QTD)** | Agency partners signed | COUNT agency pipeline → Provisioned | Tier-dependent | Agency pipeline |
| **Production per Agent** | Average agent output | Total Premium ÷ Active Agents | $15K+/agent/mo | Calculated |

### Lead & Marketing KPIs

| KPI | Definition | Formula | Target | GHL Source |
|-----|------------|---------|--------|------------|
| **Lead Conversion Rate** | Leads to appointments | Appointments ÷ Leads × 100 | 25%+ | Pipeline + Calendar |
| **Appointment Show Rate** | Shows vs booked | Shows ÷ Booked × 100 | 70%+ | Calendar status |
| **Lead-to-Close Rate** | Leads to placed app | Placed ÷ Leads × 100 | 15%+ | Full funnel |
| **Cost per Lead** | Ad spend efficiency | Ad Spend ÷ Leads | <$50 term, <$150 IUL | Manual / ad integration |
| **Speed to First Touch** | Response time | AVG(first_contact - lead_created) | <5 min | Workflow timestamp |

### Compliance KPIs

| KPI | Definition | Formula | Target | GHL Source |
|-----|------------|---------|--------|------------|
| **License Compliance %** | Agents with valid license | Valid licenses ÷ Active agents × 100 | 100% | Custom field: license_status |
| **Appointment Coverage** | Agents appointed for product sold | Appointed ÷ Active × 100 | 100% | Custom fields |
| **NIGO Rate** | Not-in-good-order apps | NIGO apps ÷ Submitted × 100 | <10% | Tag: nigo |
| **Compliance Alerts Open** | Unresolved alerts | COUNT open compliance tasks | 0 | Workflow tasks |
| **Suitability Docs Complete** | Needs analysis on file | Documented ÷ Placed × 100 | 100% | Custom field: suitability_complete |

---

## Tier 2: Agent Dashboard (Individual Producer)

| Widget | Shows |
|--------|-------|
| My Premium MTD | Personal placed premium |
| My Apps MTD | Submitted + placed count |
| My Pipeline | Open opportunities by stage |
| My Appointments | This week calendar |
| My Licensing Status | Expiry countdown |
| My Training Progress | Course completion % |
| My Persistency | Personal 13-month rate |

---

## Tier 3: Product Dashboards (Per Pipeline)

Create one dashboard tab per product (Term / Whole / IUL):

| Widget | Term | Whole | IUL |
|--------|------|-------|-----|
| Pipeline value | ✓ | ✓ | ✓ |
| Apps by stage | ✓ | ✓ | ✓ |
| Avg face amount | ✓ | ✓ | ✓ |
| Avg premium | ✓ | ✓ | ✓ |
| Illustration pending | — | ✓ | ✓ |
| Underwriting pend | ✓ | ✓ | ✓ |
| Decline rate | ✓ | ✓ | ✓ |

---

## GHL Dashboard Build Instructions

### Step 1: Custom Fields Required
See [`custom-fields-and-tags.md`](custom-fields-and-tags.md) — all KPI fields must exist before widgets work.

### Step 2: Pipeline Stage Mapping
Each "Placed" stage move should trigger workflow to set:
- `target_premium`
- `in_force_date`
- `product_type` tag
- `persistency_status = active`

### Step 3: Widget Types in GHL
| Data Type | GHL Widget |
|-----------|------------|
| Sum/count | Opportunity report widget |
| Conversion % | Funnel report |
| Agent leaderboard | Custom report — group by assigned user |
| Compliance alerts | Task count widget |
| Training % | Membership progress (manual or integration) |

### Step 4: Weekly Scorecard Email
Workflow: Every Monday 7am → email agency owner with:
- Premium MTD vs goal
- Top 3 agents
- Lapse alerts
- Licensing expiring this month
- Open compliance items

---

## Red / Yellow / Green Thresholds

| KPI | Green | Yellow | Red |
|-----|-------|--------|-----|
| 13-Month Persistency | 90%+ | 80–89% | <80% |
| Placement Ratio | 75%+ | 60–74% | <60% |
| Lapse Ratio | <8% | 8–12% | >12% |
| Lead Conversion | 25%+ | 15–24% | <15% |
| License Compliance | 100% | 95–99% | <95% |
| Time to Issue | <21 days | 21–35 days | >35 days |
| Agent Retention (2yr) | 60%+ | 45–59% | <45% |

---

## Benchmark Sources

Metrics aligned with IMO/FMO industry standards from:
- Financialize IMO/FMO Playbook (2026)
- AgencyBloc upline management benchmarks
- Insurnest FMO IUL KPI framework
- Vymo distribution management platform standards
