# Agent Onboarding Workflows

**GHL Location:** Automations → Workflows

---

## Workflow 1: New Agent Hired

**Trigger:** Contact tag added `status:onboarding`

| Step | Action | Delay |
|------|--------|-------|
| 1 | Send welcome email + login credentials | Immediate |
| 2 | Enroll in Membership: Getting Started | Immediate |
| 3 | Assign onboarding task to agency admin | Immediate |
| 4 | SMS: "Complete Platform Ready cert today" | 1 hour |
| 5 | Email: Compliance course reminder | Day 2 |
| 6 | If Compliance not complete → admin alert | Day 5 |
| 7 | Enroll in Term Foundations after Compliance | On cert |
| 8 | Email: "Schedule your CRM training call" | Day 3 |
| 9 | Assign 10 practice leads (sandbox) | Day 7 |
| 10 | Check: Term Certified? → assign live leads | Day 14 |
| 11 | 30-day check-in task for manager | Day 30 |

---

## Workflow 2: Agency Partner Provisioned

**Trigger:** Pipeline stage → Sub-Account Provisioned

| Step | Action | Delay |
|------|--------|-------|
| 1 | Create GHL sub-account from snapshot | Immediate |
| 2 | Send agency welcome email + admin login | Immediate |
| 3 | Enroll principal in Agency Admin Certification | Immediate |
| 4 | Schedule Day 1 kickoff call | Immediate |
| 5 | Email: 90-day onboarding checklist | Day 1 |
| 6 | Week 1 check-in task | Day 7 |
| 7 | Week 4 production review task | Day 28 |
| 8 | 90-day success call scheduled | Day 85 |

---

## Workflow 3: Certification Unlocked

**Trigger:** Membership course completed + quiz passed

| Step | Action |
|------|--------|
| 1 | Set corresponding `agent_cert_*` field = true |
| 2 | Send certification badge email |
| 3 | Update user role permissions (pipeline access) |
| 4 | Notify agency admin of new certified agent |
| 5 | If IUL Mastery → add to IUL Case Design Lab invite list |

---

## Workflow 4: License Expiration Alerts

**Trigger:** Custom field `agent_license_expiry` date-based

| Days Before | Action |
|-------------|-------|
| 90 | Email agent + tag `compliance:license-expiring` |
| 60 | SMS agent + task for admin |
| 30 | Email agent + admin + restrict new app submissions |
| 0 | Tag `agent_license_status=Expired`, admin alert, pipeline access restricted |
