# Production & Retention Workflows

**GHL Location:** Automations → Workflows  
Pairs with [`kpi-dashboard-spec.md`](../kpi-dashboard-spec.md) and [`retention-pipeline.md`](../pipelines/retention-pipeline.md).

---

## WF: Opportunity Placed → Book of Business

**Trigger:** Any product pipeline → stage **Placed**

1. Set `in_force_date` = today if empty  
2. Require `target_premium`, `policy_number`, `carrier_name` (task if missing)  
3. Tag `stage:placed`, `product:*`  
4. `client_persistency_status` = Active  
5. Add to smart list Book of Business  
6. Schedule wait **11 months** → create Retention opportunity “Annual Review” + calendar link  
7. Client email: policy in force (library template)

---

## WF: Quote-to-Bind Clock

**Trigger:** Stage **Quote Presented** / **Illustration Presented**

- Day 1, 3, 7 follow-up (email-sms library)  
- Day 10: if still in stage → task to manager “stall”  
- Lost after 14 days with no activity (optional; agency can disable)

---

## WF: Speed-to-Lead Timer

**Trigger:** Contact created from funnel form

- Immediate SMS + email  
- If no outbound message logged in **5 minutes** → notify assigned user + manager  
- Custom field `first_touch_at` stamped on first conversation  
- KPI: Speed to First Touch

---

## WF: Weekly Conversation Counter

**Trigger:** Call/SMS conversation marked as “meaningful” (custom: call outcome = Connected)

- Increment `agent_conversations_wtd`  
- Reset every Monday 12:01am  
- Agents below 20 conversations by Thursday → coaching task (AgencyView-style early warning)

---

## WF: Placement Ratio Watch

**Trigger:** Stage **App Submitted**

- 90-day rolling: if agent placement (Placed ÷ Submitted) &lt; 60% → compliance + manager review (NIGO / rushed apps)

---

## WF: 13-Month Persistency Sweep

**Trigger:** `in_force_date` + 13 months

- If still Active → `persistency_13mo` = true (count toward 90%+ target)  
- If Lapsed → `persistency_13mo` = false, tag `chargeback` review, Retention stage Lapsed

---

## WF: Grace / Lapse Save

**Trigger:** Tag `retention:at-risk` or stage **Grace Period**

- SMS + email Day 0, 2, 5  
- Call task to writing agent immediately  
- If saved → remove at-risk tag, log save reason  
- If lapsed → chargeback checklist

---

## WF: Monday Executive Scorecard

**Trigger:** Weekly Monday 7:00am (agency timezone)

Email owner using KPI widgets / custom values:

- Premium MTD vs goal  
- Placement ratio  
- 13-month persistency  
- New agencies / agents  
- License expirations 30 days  
- Open NIGO and compliance alerts  

---

## WF: Producer Churn Early Warning

If **two consecutive weeks** of:

- Conversations down **and**  
- Time-to-first-attempt &gt; 2 hours **and**  
- No apps submitted  

→ Create task “Retention conversation with producer” (do not auto-fire recruiting replacement).
