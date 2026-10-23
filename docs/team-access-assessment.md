# Team and access module assessment

Reviewed on 2026-10-23 across Concierge CRM, Spending CRM, Wishimi CRM, and Go Product CRM.

| CRM | What the current feature manages | Candidate boundary |
| --- | --- | --- |
| Concierge | Staff accounts created with email/password and one enum role (`owner`, `admin`, `manager`, `viewer`); owner/admin checks govern the UI. | Team management, but creation and role policy are Concierge-specific. |
| Spending | CRM staff identities with Telegram IDs and multiple roles; staff roles are toggled through API operations. Role-to-permission mapping is read from the API and displayed as a read-only matrix. | Staff assignment and read-only permission view; not the same onboarding flow as Concierge. |
| Wishimi | User detail can replace the product user's roles (`user`/`admin`). No operator team or permission catalog was found in the CRM UI. | End-user administration, not staff/team management. |
| Go Product | Product accounts can be created and assigned product roles; a role page reads permission summaries. The accounts are product users, not a distinct operator staff directory. | Product account administration and role presentation, not a common staff module. |

## Decision

Create `@lepsios/crm-team-members` as a read-only normalized roster module for Concierge and Spending. The shared contract covers an opaque ID, display name, optional email, optional product identifiers, product role keys, and an optional created timestamp. Each host maps its own endpoint and DTO. Password-backed staff creation, invites, multi-role assignment, and removal stay in host pages because the products expose different operations. The generic list view is in `vue-lepsios`.

Create `@lepsios/crm-access-control` for a read-only role and permission catalog view, shared by Spending and Go Product CRM. Hosts map their catalog DTOs to role identifiers, localized display names, and permission keys. This module does not authorize requests or mutate roles. Concierge has a fixed role enum without a permission catalog and remains outside this slice. Go Product customer account operations remain product-owned and do not enter the team roster module.

Wishimi CRM users are end users with product entitlements, not CRM operators; do not map them into `team-members` or treat their entitlements as the shared access catalog.

## Current reusable layer

The shared employee, role, and permission DTOs are adapter targets only where host semantics fit. They do not authorize a host to unify account records, role lifecycle, permissions enforcement, or API endpoints.
