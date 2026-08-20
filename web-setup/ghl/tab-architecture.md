# GHL Custom Menu — Full Tab Architecture

**Configure in:** GHL → Settings → Custom Menu Links (Agency + Sub-Account views)

This is the master navigation for FullCircle Agency OS. Each tab maps to a GHL module, folder, or external link.

---

## Agency-Level Menu (IMO / Principal View)

| Tab | Icon | GHL Module | Purpose |
|-----|------|------------|---------|
| **Command Center** | dashboard | Dashboard | Executive KPI dashboard — see kpi-dashboard-spec.md |
| **Agencies** | business | Sub-Accounts | Manage downline agency sub-accounts |
| **Recruitment** | person_add | Opportunities | Agency + agent recruitment pipeline |
| **Production** | trending_up | Custom Report | Premium, apps, persistency by agency |
| **Compliance** | verified_user | Contacts + Workflows | Licensing, appointments, alerts |
| **Training HQ** | school | Membership | Master course library |
| **Snapshots** | cloud_upload | Settings → Snapshots | Deploy/update agency templates |
| **Billing** | payments | Payments / SaaS | Agency billing, Stripe |
| **Support** | help | Conversations | Agency support channel |

---

## Sub-Account Menu (Individual Agency View)

### Section 1: Command Center

| Tab | Module | Access |
|-----|--------|--------|
| **Dashboard** | Dashboard | All agents (filtered by role) |
| **My KPIs** | Custom Dashboard | Agent view — personal production |
| **Team KPIs** | Custom Dashboard | Agency admin only |

### Section 2: Products (Separated Pipelines)

| Tab | Pipeline | Folder Tag | Who Uses |
|-----|----------|------------|----------|
| **Term Life** | Term Life Pipeline | `product:term` | All certified agents |
| **Whole Life** | Whole Life Pipeline | `product:whole` | Whole Life Certified+ |
| **IUL** | IUL Pipeline | `product:iul` | IUL Mastery Certified+ |
| **Annuities** | Annuities Pipeline (Phase 2) | `product:annuity` | Cross-Sell Certified+ |

Each product tab opens:
- Pipeline board (Opportunities filtered by pipeline)
- Product-specific forms (needs analysis)
- Illustration request workflow
- Application tracking stages

### Section 3: Clients & Book

| Tab | Module | Purpose |
|-----|--------|---------|
| **Contacts** | Contacts | All clients + prospects |
| **Book of Business** | Smart Lists | In-force policies, renewals |
| **Policy Servicing** | Opportunities | Changes, loans, withdrawals |
| **Retention** | Retention Pipeline | Lapse prevention, reviews |

### Section 4: Recruiting & Team

| Tab | Module | Purpose |
|-----|--------|---------|
| **Recruit Agents** | Agent Recruitment Pipeline | Individual agent recruiting |
| **Recruit Agencies** | Agency Recruitment Pipeline | Downline agency partners |
| **Team Roster** | Contacts (tag: agent) | All licensed agents |
| **Hierarchy** | Custom Fields | Upline/downline, overrides |

### Section 5: Training Academy

| Tab | Module | Purpose |
|-----|--------|---------|
| **Academy Home** | Membership | Course catalog landing |
| **Term Track** | Membership Category | Term Foundations certification |
| **Whole Life Track** | Membership Category | Whole Life Architecture |
| **IUL Track** | Membership Category | IUL Mastery |
| **Compliance** | Membership Category | NAIC, suitability, TCPA |
| **Sales & Marketing** | Membership Category | Scripts, objection handling, digital |
| **Agency Admin** | Membership Category | GHL admin, KPI management |

### Section 6: Marketing

| Tab | Module | Purpose |
|-----|--------|---------|
| **Campaigns** | Campaigns | Email/SMS blasts |
| **Social Planner** | Social Planner | Scheduled posts |
| **Funnels** | Funnels | Lead capture pages by product |
| **Websites** | Sites | Agency-branded site |
| **Reputation** | Reputation | Reviews management |

### Section 7: Operations

| Tab | Module | Purpose |
|-----|--------|---------|
| **Calendar** | Calendars | Appointments by product type |
| **Conversations** | Conversations | SMS, email, WhatsApp |
| **Documents** | Media Storage | Carrier guides, compliance docs |
| **Workflows** | Automations | All active automations |
| **Forms** | Forms | Needs analysis, intake, recruiting |

### Section 8: Finance

| Tab | Module | Purpose |
|-----|--------|---------|
| **Commissions** | Custom + Reports | Production tracking (manual or integrated) |
| **Invoices** | Payments | Client fees (if applicable) |
| **Chargebacks** | Smart List | Lapsed/charged back policies |

---

## Role-Based Permissions

| Role | Visible Tabs |
|------|--------------|
| **Agency Owner** | All tabs |
| **Sales Manager** | Products, Clients, Recruiting, Marketing, Training (no Finance admin) |
| **Producer (Term)** | Term, Contacts, Calendar, Conversations, Term Track |
| **Producer (IUL)** | Term + Whole + IUL, IUL Track, all client tabs |
| **Recruiter** | Recruit Agents, Recruit Agencies, Conversations, Recruitment workflows |
| **Compliance Officer** | Compliance, Documents, all agent licensing fields |
| **Agency Admin (GHL)** | Operations, Workflows, Snapshots (if permitted) |

Configure in GHL → Settings → Team → Roles & Permissions.

---

## Folder Structure (Media Storage)

```
/agency-os/
├── carrier-guides/
│   ├── term/
│   ├── whole-life/
│   └── iul/
├── compliance/
│   ├── naic-updates/
│   ├── suitability-forms/
│   └── tcpa-a2p/
├── scripts/
│   ├── term/
│   ├── whole-life/
│   └── iul/
├── illustrations/
├── recruiting/
│   ├── agency-deck/
│   └── agent-deck/
└── branding/
    ├── logos/
    └── email-templates/
```

---

## Smart Lists (Quick Access Tabs)

Create as pinned Smart Lists visible from Contacts:

| Smart List | Filter |
|------------|--------|
| Hot Term Leads | Pipeline=Term, Stage=Needs Analysis or Quote, updated <7 days |
| IUL Illustrations Pending | Tag=illustration-requested, no tag=illustration-complete |
| Licensing Expiring 90 Days | Custom field: license_expiry within 90 days |
| Lapse Risk | Tag=in-force, persistency flag=at-risk |
| New Agents (Onboarding) | Pipeline=Agent Recruitment, Stage=Contracting |
| Agency Prospects | Pipeline=Agency Recruitment, Stage=Qualification+ |

---

## Sub-Account Naming Convention

```
[AgencyName]-[State]-[Tier]
Example: SmithFinancial-TX-Growth
```

Tags on sub-account: `tier:starter|growth|enterprise`, `state:TX`, `onboarded:2026-06`

---

## Snapshot Export Checklist

When exporting GHL snapshot for resale, include:

- [ ] All 6 pipelines (term, whole, IUL, agent recruit, agency recruit, retention)
- [ ] Custom menu links (this document)
- [ ] All custom fields and tags
- [ ] All workflows (onboarding, compliance, nurture)
- [ ] Membership courses (all tracks)
- [ ] Funnels (1 per product + agency recruitment)
- [ ] Forms (needs analysis × 3 products)
- [ ] Email/SMS templates
- [ ] Dashboard widgets (KPI spec)
- [ ] Calendar templates (discovery, illustration review, app submission)

See [`snapshot-build-checklist.md`](snapshot-build-checklist.md) for build sequence.
