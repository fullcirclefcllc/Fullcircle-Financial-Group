---
name: "fcfg-weekly-scorecard"
description: "Use on Fridays or when Breyon asks how the week went: builds Full Circle Financial Group's weekly KPI scorecard from ads, GHL pipeline, payments and monitoring data, red/green against targets, with one fix."
---

# FCFG Weekly KPI Scorecard

A 20-minute Friday review for Full Circle Financial Group's credit and funding growth push.

## Anchors (the only sources of truth)
- **Cash collected** comes from GoHighLevel (GHL) payments only, never pipeline value.
- Every other number comes from its source system. Never estimate or fill a missing number.

## Graph
Pull these four sources in parallel (connected tools if available; otherwise ask Breyon to attach CSV exports):
1. Meta Ads Manager: spend, leads, cost per lead (by ad angle if available).
2. GHL pipeline: new leads, booked, showed, won, median speed to first contact.
3. GHL payments: cash collected this week, by offer (personal credit, Business Credit Build, Funding Placement, $97 Blueprint).
4. SmartCredit: active monitoring enrollments vs active clients.

**Fan-in guard:** if any source is missing or empty, put "MISSING: <source>" at the top and leave its metrics blank. Do not compute rates from partial data without saying so.

## Compute (plain arithmetic, show the math)
| Metric | Target | Red flag |
|---|---|---|
| Cost per lead | <= $15 | > $25 |
| Speed to first contact | < 5 min | > 30 min |
| Lead to booked | >= 20% | < 12% |
| Show rate | >= 65% | < 50% |
| Close rate (of shows) | >= 25% | < 15% |
| Cost per new client (ad spend / wins) | <= $500 | > $700 |
| Average first ticket | >= $1,900 | < $1,300 |
| Monitoring enrollment | 100% of active clients | < 90% |
| Refunds / complaints | 0 | any |

## Output
1. One-line headline: cash collected, new clients, cost per new client.
2. The scorecard table with this week's value and a Green / Yellow / Red status.
3. Week-over-week change for each metric if last week's scorecard exists.
4. **One fix only:** the single worst red metric and one concrete action for next week. Never more than one.
5. Scale rule check: if cost per client stayed under $500, note that ad spend can rise 25% next week; if it was over $700 for 7 days, recommend pausing and fixing the weakest step.

Save as `reports/scorecard-YYYY-WW.md` when file tools are available. Never change ad spend, campaigns or CRM data; report only.