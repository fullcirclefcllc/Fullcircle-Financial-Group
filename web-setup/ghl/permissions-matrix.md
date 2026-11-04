# Role Permissions Matrix — GHL Team Roles

**Configure in:** GHL → Settings → Team → Roles

| Capability | Owner | Sales Mgr | Producer Term | Producer IUL | Recruiter | Compliance | Admin |
|------------|:-----:|:---------:|:-------------:|:------------:|:---------:|:----------:|:-----:|
| All pipelines | ✓ | ✓ | Term only | Term+WL+IUL | Recruit only | Read | ✓ |
| Contacts (all) | ✓ | ✓ | Assigned | Assigned | Recruit tags | Agents | ✓ |
| Delete contacts | ✓ | | | | | | ✓ |
| Workflows edit | ✓ | | | | | ✓ (compliance) | ✓ |
| Membership admin | ✓ | | | | | ✓ | ✓ |
| Payments / Stripe | ✓ | | | | | | ✓ |
| Snapshots | ✓ | | | | | | ✓ |
| Reporting / KPIs | All | Team | Self | Self | Recruit KPIs | Compliance KPIs | All |
| Export contacts | ✓ | ✓ | | | | ✓ | ✓ |
| SMS campaigns | ✓ | ✓ | Assigned | Assigned | Recruit | | ✓ |

**Certification gates:** GHL cannot fully hide a pipeline by custom field alone. Combine:

1. Role = Producer Term vs Producer IUL  
2. Workflow: if opportunity created on IUL pipeline and `agent_cert_iul` is false → move to Term + notify manager  
3. Calendar round-robin filters certified users only  

Review roles quarterly when headcount changes.
