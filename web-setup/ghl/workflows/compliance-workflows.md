# Compliance Workflows

**GHL Location:** Automations → Workflows

---

## Workflow 1: Suitability Documentation Gate

**Trigger:** Pipeline moves to App Submitted

| Check | Action if Fail |
|-------|----------------|
| `client_suitability_complete` = true | Block stage move, alert agent |
| Needs analysis form on file | Block, send form link |
| Illustration acknowledged (Whole/IUL) | Block, send ack form |

**Alert:** Email compliance role + agent manager

---

## Workflow 2: TCPA Consent Capture

**Trigger:** Any form submission or inbound SMS

| Step | Action |
|------|--------|
| 1 | Log consent timestamp on contact |
| 2 | Apply tag `tcpa:consent-captured` |
| 3 | If no consent → block outbound SMS workflows |
| 4 | Include opt-out language in first SMS |

---

## Workflow 3: NIGO Alert

**Trigger:** Custom field `nigo_flag` = true

| Step | Action |
|------|--------|
| 1 | Tag opportunity `nigo` |
| 2 | Email agent: NIGO resolution checklist |
| 3 | Task: resolve within 48 hours |
| 4 | If unresolved at 48hr → manager alert |
| 5 | Track in NIGO KPI dashboard |

---

## Workflow 4: Chargeback Processing

**Trigger:** Tag added `chargeback`

| Step | Action |
|------|--------|
| 1 | Set `chargeback_flag=true` on opportunity |
| 2 | Notify agent + agency admin |
| 3 | Create retention outreach if policy still active |
| 4 | Log in commission tracking |
| 5 | If pattern (3+ chargebacks/agent/quarter) → coaching task |

---

## Workflow 5: Weekly Compliance Report

**Trigger:** Every Monday 8am

**Email to agency owner + compliance role:**
- Open compliance alerts
- Licenses expiring in 30 days
- Agents missing certifications
- Apps submitted without suitability docs (last 7 days)
- NIGO count
- TCPA consent gaps on active SMS contacts

---

## Workflow 6: Illustration Red Flag Review (IUL/Whole)

**Trigger:** Pipeline stage → Illustration Review

| Step | Action |
|------|--------|
| 1 | Task assigned to IUL lead / compliance |
| 2 | Checklist from IUL pipeline doc |
| 3 | If passed → move to Illustration Presented |
| 4 | If failed → return to Illustration Requested with notes |

---

## Regulatory Document Vault

Store in Media Storage `/agency-os/compliance/`:
- NAIC Market Conduct Guidelines (latest)
- State suitability requirements
- Carrier-specific suitability forms
- TCPA/A2P compliance guide
- E&O requirements checklist
- Privacy policy + data processing agreement template

**Workflow:** When NAIC update published → admin task to review + update training module within 5 business days.
