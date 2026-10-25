# `@lepsios/crm-team-members`

Product-neutral, read-only roster contract for CRM operator accounts. The
package does not create staff, invite users, change roles, remove members, or
enforce authorization. The host owns those operations and decides whether a
person belongs in its operator team.

The confirmed first-wave consumers are Concierge CRM and Spending CRM.
Wishimi users and Go Product customer accounts are end users, not operators,
so they do not use this module.

## Host adapter

Map the host API response next to its API client. Keep endpoint names,
authentication, DTO fields, role labels, and error localization in the host.

See [`examples/host-source.ts`](./examples/host-source.ts) for a typed mapping
from a host DTO. Replace its sample fields with the actual host response.

Use `useCRMTeamMembers(source)` for loading/error/retry state and render the
result with `CrmTeamMembersView` from `@lepsios/vue`. Supply localized labels
and an optional role-label resolver from the host. The view performs local
search and pagination over the loaded roster; use it only when the host's
existing roster operation returns the complete list.

## Contract

- `id` is an opaque string; do not parse it as a number.
- `displayName` is the host's preferred human-readable identity. `email` and
  product identifiers are optional display metadata.
- `roleKeys` are product-owned keys, not a shared role enum.
- `createdAt`, when present, is an ISO 8601 timestamp.
- The projection is read-only; writes and authorization remain in the host.
