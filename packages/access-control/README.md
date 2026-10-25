# `@lepsios/crm-access-control`

Read-only contract and state for displaying a product's role-to-permission
catalog. It does not authorize requests, infer effective access, edit roles,
or mutate permissions.

The confirmed first-wave consumers are Spending CRM and Go Product CRM.
Concierge's enum role hierarchy has no matching permission catalog, and
Wishimi's user entitlements are not a CRM operator access catalog; neither is
adapted to this module.

## Host adapter

Map the host's catalog DTO next to its API client. Keep authentication,
endpoint details, permission policy, localized labels, and any role mutations
in the host.

See [`examples/host-source.ts`](./examples/host-source.ts) for a typed mapping
from a host DTO. Replace its sample fields with the actual host response.

Use `useCRMAccessControl(source)` for loading/error/retry state and render the
result with `CrmAccessControlView` from `@lepsios/vue`. Pass host-localized
role and permission resolvers; the raw keys remain stable identifiers, not
user-facing copy.

## Contract

- Role and permission keys are opaque, product-owned strings.
- A listed role-to-permission mapping is descriptive catalog data. It does not
  assert that a user currently has a role or that a request is authorized.
- Hosts may supply an independent permission catalog to display permissions
  that are not assigned to any current role.
- All operations are read-only in this module.
