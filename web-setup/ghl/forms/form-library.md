# GHL Form Library — Copy into Forms / Surveys

**Configure in:** GHL → Sites → Forms  
Every form posts to a contact + opportunity. TCPA checkbox is required on all public forms.

---

## Shared TCPA Block (append to every public form)

- Checkbox required: *I consent to receive calls, SMS, and email from [Agency] at the number provided. Message/data rates may apply. Reply STOP to opt out.*
- Hidden field: `tcpa_timestamp` (workflow sets on submit)
- Hidden field: `lead_source` (UTM or page name)

---

## 1. Term Needs Analysis

**Internal name:** `form-term-needs`  
**Maps to:** Term Life pipeline → Needs Analysis Complete

| Field | Type | Required |
|-------|------|----------|
| Full name | Text | Yes |
| Email | Email | Yes |
| Mobile | Phone | Yes |
| Date of birth | Date | Yes |
| State of residence | Dropdown (US) | Yes |
| Annual income | Number | Yes |
| Household dependents | Number | Yes |
| Existing coverage (group + individual) | Text | No |
| Desired coverage duration | Dropdown: 10 / 15 / 20 / 30 | Yes |
| Mortgage / debt to cover | Number | No |
| Smoker | Yes/No | Yes |
| Primary goal | Dropdown: Income replacement, Debt payoff, Business, Other | Yes |
| TCPA consent | Checkbox | Yes |

**On submit workflow:** Create opportunity in Term Life, stage New Lead (or Needs Analysis if booked from calendar). Tag `product:term`.

---

## 2. Whole Life Financial Discovery

**Internal name:** `form-whole-discovery`

| Field | Type | Required |
|-------|------|----------|
| Full name / email / phone / DOB | — | Yes |
| Annual income + net worth range | Number / Dropdown | Yes |
| Existing permanent policies | Text | No |
| Goal | Dropdown: Lifetime protection, Cash value, Estate, Business continuity, Gift to heirs | Yes |
| Monthly premium capacity | Number | Yes |
| Time horizon for cash value | Dropdown: 5–7 yrs, 8–12, 13+ | Yes |
| Estate / business notes | Long text | No |
| TCPA | Checkbox | Yes |

---

## 3. IUL Pre-Qualification + Needs Analysis

**Internal name:** `form-iul-prequal`  
**Gate:** If monthly budget &lt; $300 **or** income &lt; $75K without business/net-worth override → tag `iul:not-qualified` and route to Term form.

| Field | Type | Required |
|-------|------|----------|
| Full name / email / phone / DOB | — | Yes |
| Annual income | Number | Yes |
| Net worth | Number | No |
| Business owner | Yes/No | Yes |
| Monthly premium capacity | Number | Yes |
| Primary goal | Protection + living benefits / Tax-free retirement supplement / Business liquidity | Yes |
| Years until they want policy access | Number | Yes |
| Health class self-estimate | Preferred / Standard / Unknown | Yes |
| Smoker | Yes/No | Yes |
| Existing life policies (replace vs supplement) | Text | Yes |
| Tax bracket estimate | Dropdown | No |
| TCPA | Checkbox | Yes |

**Disqualifier copy (shown if fail):** “IUL is a fit when premium and time horizon support cash value. Let’s start with a Term design that protects your family now — then revisit IUL.”

---

## 4. Agent Recruiting Application

**Internal name:** `form-agent-apply`

| Field | Type |
|-------|------|
| Name, email, phone | Required |
| State(s) licensed | Multi-select |
| NPN | Text |
| Years licensed | Number |
| Current IMO/captive | Text |
| Production last 12 months (premium) | Number |
| Archetype self-select | Digital Nomad / Community Pillar / Cross-Sell Pro / Agency Builder |
| Wants to recruit a team | Yes/No |
| Why leaving current shop | Long text |
| TCPA | Required |

Creates contact tag `recruit:agent-prospect`, opportunity in Agent Recruitment.

---

## 5. Agency Partner Application

**Internal name:** `form-agency-apply`

| Field | Type |
|-------|------|
| Principal name / agency legal name | Required |
| Agents currently licensed | Number |
| Annual premium (approx) | Number |
| Current CRM | Spreadsheet / GHL / Other / None |
| States of operation | Multi-select |
| Carriers appointed | Long text |
| E&O carrier + expiry | Text + Date |
| Desired tier | Starter / Growth / Enterprise |
| Demo calendar preference | Date/time or “call me” |
| TCPA | Required |

Tag `recruit:agency-prospect`. Opportunity in Agency Recruitment.

---

## 6. Suitability Acknowledgment

**Internal name:** `form-suitability`  
**Used at:** Quote Accepted / App Started (all products)

| Field | Type |
|-------|------|
| Client name | Text |
| Product recommended | Term / Whole / IUL / Annuity |
| Needs stated in client words | Long text |
| Alternatives considered | Long text |
| Illustration reviewed (guaranteed vs non-guaranteed) | Checkbox (IUL/Whole) |
| Client acknowledges values are not guaranteed | Checkbox |
| Agent NPN | Text |
| Date | Date |

Sets `client_suitability_complete=true`. Store PDF of submission in contact files.

---

## 7. Policy Review / Retention

**Internal name:** `form-annual-review`

Income change, health change, beneficiaries, loan activity, lapse-risk flags, additional coverage interest.

---

## Form → Pipeline Routing

| Form | Pipeline | Starting stage |
|------|----------|----------------|
| Term needs | Term Life | New Lead or Needs Analysis Scheduled |
| Whole discovery | Whole Life | New Lead |
| IUL prequal (pass) | IUL | New Lead |
| IUL prequal (fail) | Term Life | New Lead + tag `routed-from-iul` |
| Agent apply | Agent Recruitment | Application Received |
| Agency apply | Agency Recruitment | Application Received |
| Suitability | Existing opportunity | Does not create new opp |
