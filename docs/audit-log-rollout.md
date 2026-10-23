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
| Concierge | `concierge-api` serves canonical `/api/v1/admin/audit-events` alongside the legacy endpoint. | `concierge-crm` still uses its existing global audit page and legacy source. | Switch the page source and view to the common module. |
| Wishimi | `wishimi-back` serves the shared contract and pins `audit/v0.2.1`. | `wishimi/crm` has a global audit page on the canonical endpoint. | Replace local table/state with the shared CRM module. |
| Waify | `waify-api` and the existing `waify-web` API client match the shared event/list contract with filters and `total`. | No separate CRM frontend yet. | Add the future CRM as a consumer later. |
| Spending | `spending-bot` serves `/internal/crm/audit-events` with the shared contract and records successful writes behind CRM permissions. Request bodies are not copied into audit payloads. | Spending CRM has no global audit page yet; its user histories remain domain timelines. | Add the host source and common audit view. |
| Go Product CRM | `site-api` serves `/api/v1/admin/audit-events`; migration backfills proposal and MCP audit entries, while permission-protected CRM writes are logged going forward. | Go Product CRM has no global audit page yet; proposal activity remains on its detail page. | Add the host source and common audit view. |

## Delivery sequence

1. **Done locally:** align all five backend APIs on the `go-lepsios/audit`
   wire contract and pin the consumers to `audit/v0.2.1`.
2. Keep `@lepsios/crm-audit-log` canonical and injectable through
   `CRMAuditLogSource`. A host whose API differs implements a mapper next to
   its API client. The package provides the reusable view and state; shared
   base UI components continue to come from `vue-lepsios`.
3. **Blocked on package distribution setup:** make the versioned Vue workspace
   package installable by the CRM builds. The local `vue-module-lepsios`
   checkout has no Git remote and `@lepsios/crm-audit-log@0.4.1` is not
   available from npm, so the four independent CRM builds cannot resolve it.
   Do not add local absolute paths or copy the shared implementation into each
   product repository as a substitute for a distributable package.
4. Integrate the shared Vue module into Wishimi, Spending, Concierge, and Go
   Product CRM using each host's authenticated API source.
5. Add a Waify CRM consumer when that frontend is created.

## Completion checks

- All global-feed APIs use the same query names, event fields, string IDs,
  response envelope, and `items/total/limit/offset` pagination.
- Every consumer can use the canonical source directly or inject a host-owned
  adapter through `CRMAuditLogSource`.
- Product-specific auth, event names, payloads, and retention stay with the
  backend; domain timelines remain on their own APIs and screens.
