# Team and access module assessment

Reviewed on 2026-10-23 across Concierge CRM, Spending CRM, Wishimi CRM, and Go Product CRM.

| CRM | What the current feature manages | Candidate boundary |
| --- | --- | --- |
| Concierge | Staff accounts created with email/password and one enum role (`owner`, `admin`, `manager`, `viewer`); owner/admin checks govern the UI. | Team management, but creation and role policy are Concierge-specific. |
| Spending | CRM staff identities with Telegram IDs and multiple roles; staff roles are toggled through API operations. Role-to-permission mapping is read from the API and displayed as a read-only matrix. | Staff assignment and read-only permission view; not the same onboarding flow as Concierge. |
| Wishimi | User detail can replace the product user's roles (`user`/`admin`). No operator team or permission catalog was found in the CRM UI. | End-user administration, not staff/team management. |
| Go Product | Product accounts can be created and assigned product roles; a role page reads permission summaries. The accounts are product users, not a distinct operator staff directory. | Product account administration and role presentation, not a common staff module. |

## Decision

Do not create `team-members` yet. Concierge and Spending are the only confirmed operator-team consumers, but they expose materially different identity and onboarding operations: password-backed staff creation versus role assignment on Telegram-linked identities. A reusable display-only table would be a UI pattern, not a CRM feature module, and belongs in `vue-lepsios`.

Do not create `access-control` yet. Concierge's fixed enum and role hierarchy, Spending's backend-provided role map, and Go Product's product-account permissions do not establish a shared permission model or common read/write operations. Keep adapters and authorization enforcement in each host. Revisit if two products adopt the same role/permission API contract, not just a similarly shaped screen.

## Current reusable layer

The shared `CRMEmployee`, `CRMRole`, and `CRMPermission` types may be used as adapter targets where the host semantics fit. They do not authorize a host to unify its account records, role lifecycle, permissions, or API endpoints.
