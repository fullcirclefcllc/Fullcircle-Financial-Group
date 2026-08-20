# GHL Custom Fields & Tags — FullCircle Agency OS

**Configure in:** GHL → Settings → Custom Fields (Contact + Opportunity)

---

## Contact Custom Fields — Agents

| Field Name | Type | Options / Format | Used For |
|------------|------|------------------|----------|
| `agent_npn` | Text | National Producer Number | Licensing |
| `agent_license_number` | Text | State license # | Compliance |
| `agent_license_state` | Dropdown | US states | Compliance |
| `agent_license_status` | Dropdown | Active, Expired, Pending, Suspended | KPI: License Compliance |
| `agent_license_expiry` | Date | MM/DD/YYYY | 90/60/30 day alerts |
| `agent_eo_expiry` | Date | MM/DD/YYYY | E&O tracking |
| `agent_hire_date` | Date | MM/DD/YYYY | Retention KPI |
| `agent_archetype` | Dropdown | Digital Nomad, Community Pillar, Cross-Sell Pro, Agency Builder | Recruiting |
| `agent_cert_term` | Checkbox | — | Term pipeline access |
| `agent_cert_whole` | Checkbox | — | Whole pipeline access |
| `agent_cert_iul` | Checkbox | — | IUL pipeline access |
| `agent_cert_admin` | Checkbox | — | Agency admin access |
| `agent_upline` | Text | Contact name/ID | Hierarchy |
| `agent_override_pct` | Number | % | Commission |
| `agent_appointment_carriers` | Multi-select | Carrier list | Appointment tracking |
| `agent_production_mtd` | Number | $ | Dashboard (manual or workflow) |
| `agent_production_ytd` | Number | $ | Dashboard |

---

## Contact Custom Fields — Clients

| Field Name | Type | Options / Format | Used For |
|------------|------|------------------|----------|
| `client_dob` | Date | MM/DD/YYYY | Underwriting |
| `client_age` | Number | Auto-calc | Illustrations |
| `client_health_class` | Dropdown | Preferred, Standard, Substandard, Declined | Underwriting |
| `client_smoker` | Dropdown | Yes, No | Underwriting |
| `client_annual_income` | Number | $ | Needs analysis |
| `client_net_worth` | Number | $ | Needs analysis |
| `client_primary_goal` | Dropdown | Protection, Cash Value, Retirement, Estate, Business | Product routing |
| `client_existing_policies` | Text | Long text | Cross-sell |
| `client_suitability_complete` | Checkbox | — | Compliance KPI |
| `client_persistency_status` | Dropdown | Active, At-Risk, Lapsed, Pending | Retention KPI |
| `client_products_owned` | Multi-select | Term, Whole, IUL, Annuity | Cross-sell ratio |

---

## Opportunity Custom Fields — All Products

| Field Name | Type | Used For |
|------------|------|----------|
| `product_type` | Dropdown | Term, Whole Life, IUL, Annuity |
| `carrier_name` | Dropdown | Carrier list |
| `target_premium` | Number | KPI: Premium |
| `target_face_amount` | Number | Production tracking |
| `app_submitted_date` | Date | Time to Issue |
| `in_force_date` | Date | Time to Issue, Persistency |
| `policy_number` | Text | Book of business |
| `underwriting_status` | Dropdown | Pending, Approved, Declined, Rated |
| `illustration_requested` | Checkbox | IUL/Whole workflow |
| `illustration_complete` | Checkbox | IUL/Whole workflow |
| `suitability_doc_url` | URL | Compliance |
| `nigo_flag` | Checkbox | NIGO KPI |
| `chargeback_flag` | Checkbox | Chargeback KPI |
| `assigned_agent` | Text | Leaderboard |

---

## Tags — Master List

### Product Tags
- `product:term`
- `product:whole`
- `product:iul`
- `product:annuity`

### Pipeline Stage Tags (auto-applied by workflow)
- `stage:lead`
- `stage:needs-analysis`
- `stage:illustration`
- `stage:quote-presented`
- `stage:app-submitted`
- `stage:underwriting`
- `stage:placed`
- `stage:lost`

### Agent Tags
- `role:agent`
- `role:agency-owner`
- `role:recruiter`
- `role:compliance`
- `status:active-agent`
- `status:inactive-agent`
- `status:onboarding`

### Agency Partner Tags
- `tier:starter`
- `tier:growth`
- `tier:enterprise`
- `partner:agency`

### Compliance Tags
- `compliance:license-expiring`
- `compliance:eo-expiring`
- `compliance:appointment-missing`
- `compliance:alert-open`

### Retention Tags
- `retention:at-risk`
- `retention:review-due`
- `retention:lapsed`
- `chargeback`

### Recruitment Tags
- `recruit:agent-prospect`
- `recruit:agency-prospect`
- `recruit:qualified`
- `recruit:contracted`

---

## Smart Lists (Pre-Built)

| Name | Filters |
|------|---------|
| All Active Agents | tag=role:agent AND tag=status:active-agent |
| Licensing Expiring 90 Days | agent_license_expiry within 90 days |
| IUL Pipeline Active | pipeline=IUL AND stage not in (Placed, Lost) |
| At-Risk Policies | tag=retention:at-risk |
| Agency Prospects Hot | pipeline=Agency Recruitment AND stage=Qualification, Demo Scheduled |
| NIGO Applications | nigo_flag=true |
| Uncertified IUL Agents | tag=role:agent AND agent_cert_iul=false |
| Multi-Product Clients | client_products_owned count > 1 |

---

## Workflow Tag Triggers

| Event | Auto-Tag |
|-------|----------|
| Agent hired | `role:agent`, `status:onboarding` |
| Term cert complete | `agent_cert_term=true` |
| IUL cert complete | `agent_cert_iul=true` |
| App submitted | `stage:app-submitted`, product tag |
| Policy placed | `stage:placed`, remove pipeline stage tags |
| 11-month policy review | `retention:review-due` |
| License 90 days out | `compliance:license-expiring` |
| Agency signed | `partner:agency`, tier tag |
