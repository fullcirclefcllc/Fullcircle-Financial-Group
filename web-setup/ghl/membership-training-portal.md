# Training Academy — GHL Membership Portal

**Configure in:** GHL → Membership → Courses + Categories

---

## Academy Structure

```
FullCircle Agency OS Academy
├── 🏁 Getting Started (All Users)
├── 📋 Compliance & Licensing (All Agents)
├── 🔵 Term Life Track
├── 🟢 Whole Life Track
├── 🟡 IUL Mastery Track
├── 📈 Sales & Marketing
└── 🏢 Agency Admin (Agency Owners Only)
```

---

## Course Catalog

### Getting Started (Required — All Users)

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **Welcome to Agency OS** | Platform tour, login, mobile app, support | 30 min | None |
| **CRM Fundamentals** | Contacts, pipelines, conversations, calendar | 45 min | None |
| **Your First Week** | Daily checklist, KPIs, who to call for help | 20 min | None |

**Certification:** Platform Ready badge → unlock product tracks

---

### Compliance & Licensing (Required — All Agents)

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **NAIC Suitability Standards** | Market conduct, documentation, red flags | 60 min | Platform Ready |
| **TCPA & Outreach Compliance** | A2P, consent, DNC, SMS rules | 30 min | Platform Ready |
| **Documentation Requirements** | Needs analysis, illustration ack, app checklist | 45 min | Platform Ready |
| **License Maintenance** | Renewals, CE, appointments, E&O | 20 min | Platform Ready |

**Certification:** Compliance Certified → required before any product cert

---

### Term Life Track

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **Term Foundations** | Product basics, when term fits, needs analysis | 60 min | Compliance Certified |
| **Term Sales Process** | Pipeline walkthrough, quote to close | 45 min | Term Foundations |
| **Term Objection Handling** | "I have group coverage", "Term is renting" | 30 min | Term Foundations |
| **Term Application Mastery** | App completion, common NIGO errors | 30 min | Term Sales Process |

**Certification:** Term Certified → `agent_cert_term=true` → unlock Term pipeline

---

### Whole Life Track

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **Whole Life Architecture** | Permanent insurance, CSV, policy loans | 75 min | Term Certified |
| **Illustration Reading** | Guaranteed vs non-guaranteed, red flags | 60 min | Whole Life Architecture |
| **Whole Life Case Studies** | 3 anonymized scenarios | 45 min | Illustration Reading |
| **Estate & Business Applications** | Key person, buy-sell, estate liquidity | 45 min | Whole Life Architecture |

**Certification:** Whole Life Certified → `agent_cert_whole=true` → unlock Whole pipeline

---

### IUL Mastery Track

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **IUL Fundamentals** | Index crediting, caps, floors, mechanics | 90 min | Term Certified |
| **IUL Illustration Mastery** | Red flags, guaranteed column, loan impact | 75 min | IUL Fundamentals |
| **IUL Suitability Deep Dive** | Who IUL fits, who it doesn't, documentation | 60 min | IUL Fundamentals |
| **IUL Case Design** | 3 full case studies with illustrations | 90 min | IUL Illustration Mastery |
| **IUL Compliance Lab** | Scenario-based suitability drills | 60 min | IUL Suitability Deep Dive |

**Certification:** IUL Mastery Certified → `agent_cert_iul=true` → unlock IUL pipeline

Aligns with FCFG IUL SOP and fulfillment playbook standards.

---

### Sales & Marketing

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **Discovery Call Framework** | 30-min needs analysis script | 45 min | Term Certified |
| **LinkedIn Prospecting** | Profile, content, DM sequences | 30 min | None |
| **Local Market Domination** | Events, referrals, community pillar playbook | 45 min | None |
| **Cross-Sell Conversations** | Term → Whole → IUL progression | 30 min | Whole Life Certified |

---

### Agency Admin (Agency Owners Only)

| Course | Modules | Duration | Gate |
|--------|---------|----------|------|
| **Agency OS Admin** | Sub-accounts, users, permissions, menu | 60 min | Agency partner |
| **KPI Dashboard Mastery** | Read, act on, coach from KPIs | 45 min | Agency OS Admin |
| **Recruiting with Agency OS** | Agent + agency recruitment pipelines | 45 min | Agency OS Admin |
| **Snapshot Management** | Update, deploy, white-label | 30 min | Enterprise tier |

**Certification:** Agency Admin Certified → `agent_cert_admin=true`

---

## Certification Workflow (GHL Automation)

```
Course completed (100%) 
  → Quiz passed (80%+)
    → Workflow: set custom field cert flag
      → Send certification badge email
        → Unlock pipeline access (role update)
```

---

## Continuing Education

| Requirement | Frequency | Tracking |
|-------------|-----------|----------|
| Compliance refresher | Annual | Membership course + checkbox |
| Product update (carrier changes) | As needed | Push notification + mini-module |
| CE credits (state) | Per state law | External — track in `agent_ce_credits` field |

---

## Weekly Live Calls (Optional Add-On)

| Call | Day | Audience | Host |
|------|-----|----------|------|
| Wins & Case Reviews | Tuesday | All agents | Top producer |
| IUL Case Design Lab | Wednesday | IUL Certified | Breyon / IUL lead |
| Agency Builder Roundtable | Thursday | Agency owners | FCFG team |
| New Agent Office Hours | Friday | Onboarding agents | Sales manager |

Embed Zoom links in Membership community or GHL calendar.

---

## Content Upload Checklist

For each course module, upload to GHL Membership:
- [ ] Video (Loom or hosted MP4)
- [ ] PDF companion guide
- [ ] Quiz (5–10 questions)
- [ ] Completion certificate template
- [ ] Related scripts in Media Storage `/agency-os/scripts/`
