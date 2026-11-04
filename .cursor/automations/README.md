# Cursor Automations — FCFG

Open **Cursor Automations** (Agents Window) and create these three. Full prompts live in this folder. Repo files they touch must be **committed** before a git-scoped automation can reference paths.

| Name | Trigger | Tools | Spec |
|------|---------|-------|------|
| FCFG Monday Content Batch | Weekly Monday 7:00 local | Repo / agent | [monday-content-batch.md](monday-content-batch.md) |
| FCFG Pipeline Pulse | Daily 8:00 local | Repo / agent | [pipeline-pulse.md](pipeline-pulse.md) |
| FCFG Post-Discovery Proposal | Manual | Repo / agent | [post-discovery-proposal.md](post-discovery-proposal.md) |

These are **Cursor** scheduled agents, not GHL workflows. GHL automations are in `web-setup/ghl/workflows/`.
