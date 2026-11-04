# Automation: FCFG Post-Discovery Proposal

- **Trigger:** Manual (run after a discovery call)
- **Skill:** `.cursor/skills/fcfg-sales/SKILL.md`
- **Output:** Proposal markdown in `02_Clients/[Name]/` or `05_Templates-and-Proposals/proposals/drafts/`

## Instructions for the agent

Read `CLAUDE.md`, `05_Templates-and-Proposals/proposals/proposal-template.md`, `07_Operations/pricing-and-packages.md`.

Use the user's call notes (name, income, entity status, pain, recommended package). Fill the proposal. Include 3-touch follow-up (Day 1/3/7) from `07_Operations/onboarding-workflow.md`. Packages over $7,500: draft only, flag for Breyon. Do not send email.
