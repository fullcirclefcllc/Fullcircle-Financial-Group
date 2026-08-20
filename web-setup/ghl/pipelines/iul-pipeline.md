# IUL Pipeline

**Pipeline Name:** Indexed Universal Life  
**GHL Location:** Opportunities → Pipelines → IUL  
**Access:** IUL Mastery Certified agents only

---

## Stages

| # | Stage | Definition | Max Days | Auto-Action |
|---|-------|------------|----------|-------------|
| 1 | **New Lead** | IUL-qualified lead (income $75K+, goal alignment) | 1 | Tag `product:iul`, assign IUL certified agent |
| 2 | **Contacted** | Initial IUL conversation | 2 | Send IUL education one-pager |
| 3 | **Discovery Scheduled** | Deep financial discovery booked | 3 | Financial snapshot + IUL pre-qual form |
| 4 | **Needs Analysis Complete** | IUL suitability confirmed | 3 | Document: protection vs CSV vs retirement goal |
| 5 | **Illustration Requested** | BGA/carrier illustration ordered | 5 | Set `illustration_requested=true` |
| 6 | **Illustration Review** | Internal review before client presentation | 2 | Compliance: red flag check |
| 7 | **Illustration Presented** | Client walkthrough complete | 7 | Guaranteed vs non-guaranteed columns explained |
| 8 | **Quote Accepted** | Client committed | 3 | Application package |
| 9 | **App Submitted** | Application to carrier | 14 | Set `app_submitted_date` |
| 10 | **Underwriting** | Full underwriting | 35 | Status updates |
| 11 | **Placed** | In-force IUL policy | — | Persistency + 11-month review scheduled |
| 12 | **Lost** | Did not proceed | — | Lost reason |

---

## IUL Pre-Qualification Gate (Before Pipeline Entry)

Client must meet minimum criteria:
- [ ] Age 25–65 (carrier dependent)
- [ ] Income $75K+ OR net worth $250K+ OR business owner
- [ ] Can commit $300–$500+/mo minimum premium
- [ ] Primary goal: protection + living benefits OR tax-free retirement supplement
- [ ] 3–5 year horizon before meaningful CSV access (expectation set)
- [ ] Not replacing employer 401(k) as primary retirement (suitability)

---

## Illustration Red Flags (Compliance — Review Stage)

Flag and fix before client presentation:
- [ ] Illustrated crediting rate exceeds current carrier cap
- [ ] Loans shown without impact on death benefit/cash value
- [ ] Premium shown as "flexible" without minimum premium risk
- [ ] Cash value access implied in Year 1–2 without disclosure
- [ ] Comparison to market investments without suitability disclaimer
- [ ] Missing guaranteed column discussion

Aligns with FCFG IUL SOP: [`04_Services/Pillar-3-Capital/IUL-consultation-SOP.md`](../../../04_Services/Pillar-3-Capital/IUL-consultation-SOP.md)

---

## IUL Needs Analysis Fields

| Field | Purpose |
|-------|---------|
| Primary goal | Protection / CSV growth / Retirement supplement / Business liquidity |
| Monthly premium capacity | Minimum $300–$500 |
| Desired death benefit | Face amount target |
| Health class estimate | Pre-underwriting |
| Existing life policies | Replace vs supplement |
| Tax bracket | IUL tax advantage relevance |
| Access timeline | When client needs CSV/loans |
| Risk tolerance | Index crediting explanation level |

---

## Presentation Script Outline (Illustration Presented Stage)

1. **Why IUL** — Protection + indexed growth + tax-free access
2. **How it works** — Premium → death benefit + cash value → index crediting
3. **Guaranteed column** — Worst case scenario
4. **Non-guaranteed column** — Assumed scenario (stress-test)
5. **Policy loans** — Tax-free access mechanics, impact on policy
6. **Missed premium** — What happens, no-lapse guarantee riders if applicable
7. **Next steps** — Application, underwriting, timeline

---

## FCFG Upsell Integration

IUL clients are ideal for FullCircle 4-Pillar upsell:
- **Structure** — LLC for business owners
- **Protection** — Trust + asset protection review
- **Leverage** — Business credit system
- Tag client `fcfg-upsell-eligible` on Placed for FCFG referral workflow

---

## KPI Contribution

- **IUL Mix %**
- **Average Premium** (IUL typically highest)
- **Illustration-to-App Conversion** — App Submitted ÷ Illustration Presented
- **13-Month Persistency**
- **NIGO Rate** (IUL apps more complex)
