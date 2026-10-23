# @lepsios/crm-audit-log

Reusable audit log view and state for CRM hosts. Event fields and list request/response follow `go-lepsios/audit/HTTP_API.md`; the module does not map Concierge or Wishimi DTOs.

## Host integration

The package exposes one canonical event and pagination contract. The host passes its authenticated list call through `CRMAuditLogSource`. If the backend already follows the shared HTTP contract, the source can return `data` directly. If a product API differs, implement a mapper in that product's frontend repository next to its API client; the shared view and state continue to consume canonical data.

The source interface is the extension point. Hosts can provide a default pass-through source or a custom adapter without forking the UI module. A generic mapping example is in [`examples/custom-source.ts`](./examples/custom-source.ts).

For a canonical API, the host source is a thin authenticated call:

```ts
import { useCRMAuditLog } from '@lepsios/crm-audit-log/vue'
import type { CRMAuditLogSource } from '@lepsios/crm-audit-log'
import { fetchAuditEvents } from './services/audit-service'

const auditApi: CRMAuditLogSource = {
  async list(query) {
    const { data, error } = await fetchAuditEvents(query)
    if (error)
      throw new Error(error)
    if (!data)
      throw new Error('Audit API returned no data')
    return data
  },
}

const audit = useCRMAuditLog(auditApi, { pageSize: 50 })
void audit.refresh()
```

The wrapper above only unwraps the host API client's result. A custom source may also translate legacy field names, filter names, or pagination, but that translation stays beside the host API client and returns the canonical package types.

The reusable view is exported from `@lepsios/crm-audit-log/component`:

```vue
<script setup lang="ts">
import { CrmAuditLogView } from '@lepsios/crm-audit-log/component'
import { auditApi } from './audit-api'

const filterFields = [
  { key: 'actor_kind', label: 'Actor kind', type: 'select', placeholder: 'Any actor kind', options: [{ value: 'admin', label: 'Admin' }, { value: 'user', label: 'User' }] },
  { key: 'type', label: 'Event type' },
  { key: 'actor_id', label: 'Actor ID' },
]
const labels = { time: 'Time', action: 'Event type', actor: 'Actor', actorKind: 'Actor kind', target: 'Target', details: 'Details', applyFilters: 'Apply', resetFilters: 'Reset', loading: 'Loading', empty: 'No events', previousPage: 'Previous page', nextPage: 'Next page' }
</script>

<template>
  <CrmAuditLogView :source="auditApi" :filter-fields="filterFields" :labels="labels" />
</template>
```

Authentication, endpoint URL, permission checks, supported filter controls, and translations remain in the host. UI components and table behavior come from `vue-lepsios`. Domain timelines such as Spending expense history and Go Product proposal history are not audit logs.
