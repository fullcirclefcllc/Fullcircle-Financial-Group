# Client Acquisition Workflows

**GHL Location:** Automations → Workflows

---

## Workflow 1: New Lead (Product-Routed)

**Trigger:** Form submission or funnel opt-in

| Step | Action |
|------|--------|
| 1 | Detect product interest from form/funnel |
| 2 | Apply tag `product:term|whole|iul` |
| 3 | Create opportunity in correct pipeline → New Lead |
| 4 | Round-robin assign to certified agent for that product |
| 5 | SMS intro within 5 minutes (speed to first touch KPI) |
| 6 | Email: product education one-pager |
| 7 | If no contact in 48hrs → nurture sequence |

---

## Workflow 2: Needs Analysis Scheduled

**Trigger:** Calendar booking — Discovery Call

| Step | Action |
|------|--------|
| 1 | Move pipeline → Needs Analysis Scheduled |
| 2 | Send confirmation SMS + email |
| 3 | Send pre-call form (product-specific needs analysis) |
| 4 | Reminder SMS 24hr before |
| 5 | Reminder SMS 1hr before |
| 6 | Post-call: if no notes logged in 2hr → agent reminder |

---

## Workflow 3: Quote Presented — 3-Touch Follow-Up

**Trigger:** Pipeline stage → Quote Presented

| Step | Action | Delay |
|------|--------|-------|
| 1 | Email: quote summary + next steps | Immediate |
| 2 | SMS check-in | Day 1 |
| 3 | Email: case study / social proof | Day 3 |
| 4 | Call task assigned to agent | Day 5 |
| 5 | Email: "Questions about your coverage?" | Day 7 |
| 6 | If no movement → manager review task | Day 10 |

---

## Workflow 4: Application Submitted

**Trigger:** Pipeline stage → App Submitted

| Step | Action |
|------|--------|
| 1 | Set `app_submitted_date` |
| 2 | Email client: "Application received" |
| 3 | SMS: expected timeline for underwriting |
| 4 | Create underwriting follow-up tasks (Day 7, 14, 21) |
| 5 | Notify agent of any carrier requests |

---

## Workflow 5: Policy Placed

**Trigger:** Pipeline stage → Placed

| Step | Action |
|------|--------|
| 1 | Set `in_force_date`, apply `stage:placed` tag |
| 2 | Email client: congratulations + policy summary |
| 3 | Add to Book of Business smart list |
| 4 | Update agent production fields |
| 5 | Schedule 11-month retention review |
| 6 | If IUL/Whole → tag `fcfg-upsell-eligible` |
| 7 | Request referral (if NPS positive) |
| 8 | Update KPI dashboard (workflow internal) |

---

## Workflow 6: Cross-Sell Nurture

**Trigger:** Term policy Placed + no Whole/IUL tag on contact

| Step | Action | Delay |
|------|--------|-------|
| 1 | Email: "Permanent protection conversation" | Day 30 post-placement |
| 2 | Create Whole Life opportunity (draft) | Day 60 |
| 3 | Agent task: cross-sell call | Day 90 |
| 4 | If high income → IUL education email | Day 90 |
