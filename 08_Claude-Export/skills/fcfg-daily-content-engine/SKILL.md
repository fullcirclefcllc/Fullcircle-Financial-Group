---
name: "fcfg-daily-content-engine"
description: "Use when Breyon asks for tomorrow's (or a day's) Instagram, TikTok and Shorts content for Full Circle Financial Group's credit and funding brand: drafts reel script, Stories, caption and short cut in parallel, then runs the compliance gate."
---

# FCFG Daily Content Engine

Produces one day of content for @breyonmiller (Full Circle Financial Group): personal credit, business credit with no personal guarantee, and funding, for a Phoenix-area audience.

## Voice and brand
- Breyon is a former pro basketball player whose career ended early; he built the plan he never had. Founder and Financial Architect of FCFG. Four pillars: Fix it. Build it. Fund it. Protect it.
- Plain, direct, confident, faith-friendly, no hype. Short sentences. Speaks to one person.
- Brand: navy, gold, cream; Cinzel headlines on covers.

## Content mix (over each week)
50% education, 20% results (consented, redacted), 15% origin story, 15% worldview.

## Inputs
- Today's topic or idea number. If the FCFG Content & Fulfillment Playbook (30-idea list) is available, take the next idea from it; otherwise ask Breyon for a topic or propose one that fits the weekly mix.
- Any real client result to feature (only with confirmed written consent).

## Graph
Run these four jobs in parallel (subagents if available); none depends on another:
1. **Reel script (25-45s):** hook in the first 2 seconds, body, on-screen text, ends with one keyword CTA: SCORE (personal credit), FUND (funding / no-PG), or PAYDEX (business credit).
2. **3 Story frames:** one behind-the-scenes, one result or win, one poll/question sticker.
3. **Caption + first comment:** caption under 150 words with the keyword CTA; first comment repeats the keyword.
4. **Short cut:** a TikTok/YouTube Shorts version under 30 seconds.

## Verify
Run every piece through the `fcfg-compliance-gate` skill (fresh context). Apply its rewrites. If any piece is missing from the four jobs, say which one before finishing.

## Output
One content card per platform (Instagram Reel, Stories, TikTok, Shorts) with the final text, plus a filming note (shot, setting, B-roll). Save as `content/YYYY-MM-DD.md` when file tools are available.

## Human gate
Never post, schedule or publish anything. Breyon films and posts.