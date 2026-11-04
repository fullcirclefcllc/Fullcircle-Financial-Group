# Phase 2 — Intake Backend, Stripe, E-Sign

**Owner:** AutomationEngineer  
**Status:** Spec live. Replace placeholder IDs before production.

---

## 1. Website Intake → Email + CRM

[`website/intake-form.html`](../website/intake-form.html) posts JSON to:

1. **Formspree** — `https://formspree.io/f/{FORMSPREE_FORM_ID}` emails `fullcirclefcllc@gmail.com`  
2. **GHL inbound webhook** (optional) — creates contact + opportunity in FCFG pipeline  

### Setup (15 min)

1. Create a Formspree form → paste the form ID into `intake-form.html` (`FORMSPREE_FORM_ID`).  
2. In GHL: Settings → Integrations → Inbound Webhook → copy URL into `GHL_WEBHOOK_URL`.  
3. Map webhook fields: name, email, phone, income, entity, goals.  
4. Test submit → confirm email + GHL contact.

If both IDs are still `REPLACE_ME`, the form still shows success **and** stores a local error in the console — do not launch ads until IDs are real.

---

## 2. Stripe Payment Links

Create in Stripe Dashboard → Payment Links. Paste URLs below when live.

| Product | Amount | Link | Notes |
|---------|--------|------|--------|
| Profit Protection Audit | $1,497 | `STRIPE_PPA` | Full upfront |
| Foundation deposit (50%) | $1,498.50 | `STRIPE_FOUNDATION_DEP` | $2,997 package |
| Foundation paid in full | $2,997 | `STRIPE_FOUNDATION` | |
| Blueprint deposit (50%) | $3,750 | `STRIPE_BLUEPRINT_DEP` | $7,500 package |
| Done With You deposit (50%) | $7,500 | `STRIPE_DWY_DEP` | $15,000 package |
| Agency OS Starter | $2,997 | `STRIPE_AGENCY_STARTER` | GHL snapshot |
| Agency OS Growth | $7,500 | `STRIPE_AGENCY_GROWTH` | |

After payment: Stripe email receipt → Breyon sends service agreement (e-sign) → OpsChief creates client folder.

**Do not** publish links until amounts confirmed.

---

## 3. E-Sign Path

| Option | Use |
|--------|-----|
| **DocuSign / HelloSign** | Convert [`02_Clients/_templates/service-agreement.md`](../02_Clients/_templates/service-agreement.md) to PDF template |
| **GHL Documents** (if on plan) | Agency OS agreements for downline |

Workflow: Proposal accepted → send agreement → signed → send Stripe link if deposit not collected on the call.

---

## 4. 3-Touch Follow-Up

Already in [`onboarding-workflow.md`](onboarding-workflow.md) (Day 1 / 3 / 7).  
Insurance product quotes use [`web-setup/ghl/templates/email-sms-library.md`](../web-setup/ghl/templates/email-sms-library.md).

---

## 5. CRM Decision

Default for **insurance distribution / Agency OS:** GoHighLevel Agency Pro.  
FCFG advisory pipeline can stay markdown [`lead-pipeline.md`](lead-pipeline.md) until GHL sub-account for FullCircle is provisioned from the same snapshot.
