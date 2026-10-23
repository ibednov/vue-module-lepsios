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
| Concierge | `concierge-api` now serves canonical `/api/v1/admin/audit-events` with shared query fields and DTOs. Legacy `/api/v1/admin/audit` remains for the current frontend. | `concierge-crm` has a global audit page on the legacy endpoint. | Switch the frontend source to the canonical endpoint when the shared Vue package is released to consumers. |
| Wishimi | `wishimi-back` serves `/api/v1/admin/audit-events` using `audit.HTTPEvent` and `audit.HTTPListData`; it pins `audit/v0.2.0`. | `wishimi/crm` has a global audit page on the canonical endpoint. | Replace the page's local table/state with the shared CRM module when the package can be installed by the host. |
| Waify | `waify-api` now stores `actor_kind` and serves the shared event/list contract with filtering and `total`. | No separate CRM frontend yet; `waify-web`'s API client matches the shared response. | Add the future CRM as a consumer later. |
| Spending | `spending-bot` exposes wallet activity and plan history; no global admin audit feed was found. | Spending CRM exposes user activity/history, not a global actor-action log. | Keep domain history out of `audit-log`. Add a global admin audit feed only as a separate backend feature with an explicit event/write-coverage inventory; then integrate the shared module. |
| Go Product CRM | `site-api` exposes commercial proposal activity and has other local audit writes, but no cross-domain audit feed was found. | Go Product CRM exposes proposal activity. | Preserve proposal history. Add a separate global audit feed only after defining which cross-domain actions it must capture; then integrate the shared module. |

## Delivery sequence

1. Version and publish the `go-lepsios/audit` wire contract so consumers can
   pin a released module. Do not push without user authorization.
2. Finish the existing global-feed backends: Concierge, then Waify; reconcile
   Wishimi's module version with the released contract.
3. Keep `@lepsios/crm-audit-log` canonical and injectable through
   `CRMAuditLogSource`. A host whose API differs implements a mapper next to
   its API client. The package provides the reusable view and state; shared
   base UI components continue to come from `vue-lepsios`.
4. Integrate the shared Vue module into Concierge and Wishimi CRM using their
   global feeds, then update the package adoption notes.
5. Inventory admin mutations and retention/authorization requirements for
   Spending and Go Product before creating global feeds. Do not pass their
   wallet or proposal histories as audit events.
6. Add a Waify CRM consumer when that frontend is created.

## Completion checks

- All global-feed APIs use the same query names, event fields, string IDs,
  response envelope, and `items/total/limit/offset` pagination.
- Every consumer can use the canonical source directly or inject a host-owned
  adapter through `CRMAuditLogSource`.
- Product-specific auth, event names, payloads, and retention stay with the
  backend; domain timelines remain on their own APIs and screens.
