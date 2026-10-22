# @lepsios/crm-audit-log

Reusable CRM feature logic and contracts for a global audit log. The module owns normalized event types and the common list state (filters, page, loading, error, stale request handling). The host owns its authenticated API client and maps product DTOs through an adapter. UI primitives and table implementation stay in `vue-lepsios`; the host composes those with this module.

## Package contents

- `.` exports event, actor, target, query, page, adapter, and access contracts.
- `./vue` exports `useCRMAuditLog`, the shared Vue composable for the list feature.
- `./component` exports `CrmAuditLogView.vue`, a ready list and filter view built with table and form controls from `vue-lepsios`.
- `examples/` contains concrete Concierge and Wishimi API mappings and host setup.

## Host integration

```ts
import { useCRMAuditLog } from '@lepsios/crm-audit-log/vue'
import { createWishimiAuditAdapter } from './wishimi-audit-adapter'

const audit = useCRMAuditLog(createWishimiAuditAdapter(auditService), { pageSize: 50 })
void audit.refresh()

// Filters reset pagination; page changes call the host adapter again.
await audit.setFilters({ actorKind: 'admin' })
await audit.setPage(2)
```

Or use the included view and supply the filters and localized strings supported by that API:

```vue
<script setup lang="ts">
import { CrmAuditLogView } from '@lepsios/crm-audit-log/component'
import { auditAdapter } from './audit-adapter'

const filterFields = [
  { key: 'actorKind', label: 'Actor kind' },
  { key: 'action', label: 'Event type' },
  { key: 'actorId', label: 'Actor ID' },
]
const labels = { time: 'Time', action: 'Action', actor: 'Actor', target: 'Target', applyFilters: 'Apply', loading: 'Loading', empty: 'No events', previousPage: 'Previous page', nextPage: 'Next page' }
</script>

<template>
  <CrmAuditLogView :adapter="auditAdapter" :filter-fields="filterFields" :labels="labels" />
</template>
```

The table and inputs come from `vue-lepsios`; the host provides auth-aware API calls, supported filters, page title, translations, and permission gating. See the [composable setup](./examples/use-in-host.ts) and both adapter examples.

The [Concierge adapter](./examples/concierge-adapter.ts) maps its `page/limit` API and `action/entity_type/entity_id/metadata/created_at` DTO. The [Wishimi adapter](./examples/wishimi-adapter.ts) converts `page` to `offset` and maps `type/target_type/target_id/payload/occurred_at`. Both preserve their authenticated host service rather than moving credentials or endpoint rules into the package.

Keep the original event payload intact so a product can render or inspect its own metadata. The module does not define event names, permissions, storage, or product-specific filters. Concierge and Wishimi have confirmed global audit feeds; Spending per-user activity and Go Product per-record histories are outside this module.
