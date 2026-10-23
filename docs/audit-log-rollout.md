# CRM audit log rollout

## Goal and boundary

Use the `go-lepsios/audit` HTTP contract for cross-product actor-action audit
feeds. The Vue package owns the shared event/list types, paging and reusable
view. Each CRM host owns authentication, permission checks, API calls and any
adapter needed to translate a legacy API response into the shared types.

This contract does not turn product activity into an audit log. Expense or
wallet activity and commercial proposal status history retain their domain
meaning and endpoints.

## Current repository map

| Product | Backend state | CRM frontend state | Work |
| --- | --- | --- | --- |
| Concierge | `concierge-api` serves canonical `/api/v1/admin/audit-events` alongside the legacy endpoint. | `concierge-crm` uses the shared view and a host-owned authenticated source; its Docker build fetches the module at a pinned commit. | Integrated; production image path added locally. |
| Wishimi | `wishimi-back` serves the shared contract and pins `audit/v0.2.1`. | `wishimi/crm` uses the shared view and its host-owned API source. | Integrated through `alexbednov-crm` host. |
| Waify | `waify-api` and the existing `waify-web` API client match the shared event/list contract with filters and `total`. | No separate CRM frontend yet. | Add the future CRM as a consumer later. |
| Spending | `spending-bot` serves `/internal/crm/audit-events` with the shared contract and records successful writes behind CRM permissions. Request bodies are not copied into audit payloads. | Spending CRM uses the shared view and an authenticated host-owned API source; user histories remain domain timelines. | Integrated through `alexbednov-crm` host. |
| Go Product CRM | `site-api` serves `/api/v1/admin/audit-events`; migration backfills proposal and MCP audit entries, while permission-protected CRM writes are logged going forward. | Go Product CRM uses the shared view and an authenticated host-owned API source; proposal activity remains on its detail page. | Integrated through `alexbednov-crm` host. |

## Delivery sequence

1. **Done locally:** align all five backend APIs on the `go-lepsios/audit`
   wire contract and pin the consumers to `audit/v0.2.1`.
2. Keep `@lepsios/crm-audit-log` canonical and injectable through
   `CRMAuditLogSource`. A host whose API differs implements a mapper next to
   its API client. The package provides the reusable view and state; shared
   base UI components continue to come from `vue-lepsios`.
3. **Done for local development:** Bun's built-in `bun link` registers the
   package from `packages/audit-log`, then links it into each CRM host without
   changing manifests or lockfiles. This link is developer-local only.
4. **Done for production builds:** Concierge and the `alexbednov-crm` host
   sparse-clone `packages/audit-log` from this public repository at a pinned
   full commit SHA and copy it into `node_modules` before the frontend build.
   The nested package cannot be installed directly from the monorepo root.
   Standalone package installs remain unsupported until npm publication.
5. Add a Waify CRM consumer when that frontend is created.

## Completion checks

- All global-feed APIs use the same query names, event fields, string IDs,
  response envelope, and `items/total/limit/offset` pagination.
- Every consumer can use the canonical source directly or inject a host-owned
  adapter through `CRMAuditLogSource`.
- Product-specific auth, event names, payloads, and retention stay with the
  backend; domain timelines remain on their own APIs and screens.
