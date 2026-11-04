# Compensation, Overrides & Chargebacks

**Purpose:** Transparent grid template agencies copy into GHL custom fields and their carrier contracts.  
**FullCircle Agency OS does not pay carrier commissions.** Carriers pay agents/agencies. This file is the **operating model** for tracking.

---

## Hierarchy (GHL)

```
IMO / FullCircle Distribution (Agency Pro account)
  └── Agency Partner (sub-account)  →  override_pct on downline
        └── Team Lead (optional)    →  override_pct
              └── Producer          →  first-year + renewal
```

Contact fields: `agent_upline`, `agent_override_pct`, `agent_production_mtd`, `agent_production_ytd`.

---

## Template Splits (Agency Sets Final Numbers)

| Product | Producer FYC (typical street) | Agency override (typical) | Renewal |
|---------|-------------------------------|---------------------------|---------|
| Term | 80–100% | 5–15% | 5–10% |
| Whole Life | 90–110% | 5–15% | 5–10% |
| IUL | 80–120% | 5–20% | 5–10% |
| Annuity | Per carrier grid | Per IMO | Trail if any |

IMO/FMO industry pattern: marketing orgs often take **1–5 points** for contracting, training, and tech. Disclose this in the agency agreement — never after first issue.

---

## Vesting (Template Language)

- Renewals vest to the writing agent while contracted and licensed.  
- If agent leaves: renewals follow the **agency agreement** (keep / buyout / forfeit after X months).  
- Chargebacks on lapses inside carrier chargeback window hit the writing agent first, then upline per contract.

Track in GHL: tag `chargeback`, opportunity field `chargeback_flag`, smart list **Chargebacks**.

---

## Bonus Triggers (Agency Optional)

| Trigger | Reward (template) |
|---------|-------------------|
| 10 term apps / month + 90% placement | Production bonus |
| $25K whole-life premium / month | Production bonus |
| 5 IULs / month **and** 90% 13-month persistency | Persistency bonus |
| New agent licensed + first app in 45 days | Recruiting bonus to upline |

Persistency bonuses copy **career-agency logic** (NYL-style persistency credits) without being captive.

---

## Agency OS SaaS vs Insurance Comp

Keep these **separate ledgers**:

| Ledger | What | Tool |
|--------|------|------|
| Carrier commissions | FYC, renewals, overrides | Carrier statements + GHL custom fields |
| Agency OS fees | Setup $2,997 / $7,500 / $15k + monthly | Stripe in GHL Payments |

Never commingle SaaS fees with premium. Snapshot billing: see recruitment playbook.

---

## GHL Tracking Workflow

On **Placed**:
1. Require `target_premium`, `carrier_name`, `assigned_agent`
2. Task: “Post FYC estimate from illustration”
3. 13 months later: persistency workflow — if lapsed, set chargeback review task

**Do not** promise specific commission percentages in consumer marketing.
