# Changelog

## 0.5.7

- Accept the compatible Vue component package 0.5.x used by current CRM consumers.

## 0.5.6

- Support the shared Vue package 0.4.x used by current CRM consumers.

## 0.5.5

- Render audit select filters with native controls to avoid the runtime failure in the shared view.

## 0.5.4

- Remove the unused read-access interface; permission enforcement stays in the host application.

## 0.5.3

- Pass a mutable row array to the shared table while keeping composable state readonly.

## 0.5.2

- Support host-provided initial filter values and apply them to both controls and the first request.

## 0.5.1

- Add an optional host-provided actor link resolver.

## 0.5.0

- Add shadcn-vue select filters with host-provided options.
- Add a reset-filters action and expandable event payload details.

## 0.4.1

- Document the source interface as the host extension point for custom API adapters.
- Add a generic legacy API mapping example; product-specific adapters stay with their host API clients.

## 0.4.0

- Align event and list query types with the `go-lepsios/audit` HTTP contract.
- Replace product-specific DTO adapters with one authenticated host API source.
- Use string event IDs and the shared `type/actor_*/target_*/occurred_at` fields.

## 0.3.0

- Add `CrmAuditLogView.vue`, a reusable audit list and filter UI composed from `vue-lepsios` components.
- Add localized-label contract for the view.

## 0.2.0

- Add `useCRMAuditLog` for shared paging, filters, loading/error state, and stale-request protection.
- Add Concierge and Wishimi adapter examples.

## 0.1.0

- Add provider-neutral event, actor, target, pagination, query, and adapter contracts for CRM audit logs.
