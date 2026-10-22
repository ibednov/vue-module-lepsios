# @lepsios/crm-audit-log

Reusable audit log view and state for CRM hosts. Event fields and list request/response follow `go-lepsios/audit/HTTP_API.md`; the module does not map Concierge or Wishimi DTOs.

## Host integration

The host passes its authenticated list call. Its response `data` must already match the shared audit contract:

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

The wrapper only unwraps the host API client's result; it does not rename or reshape audit events. When product APIs return the shared contract, there is no per-product adapter.

The reusable view is exported from `@lepsios/crm-audit-log/component`:

```vue
<script setup lang="ts">
import { CrmAuditLogView } from '@lepsios/crm-audit-log/component'
import { auditApi } from './audit-api'

const filterFields = [
  { key: 'actor_kind', label: 'Actor kind' },
  { key: 'type', label: 'Event type' },
  { key: 'actor_id', label: 'Actor ID' },
]
const labels = { time: 'Time', action: 'Event type', actor: 'Actor', target: 'Target', applyFilters: 'Apply', loading: 'Loading', empty: 'No events', previousPage: 'Previous page', nextPage: 'Next page' }
</script>

<template>
  <CrmAuditLogView :source="auditApi" :filter-fields="filterFields" :labels="labels" />
</template>
```

Authentication, endpoint URL, permission checks, supported filter controls, and translations remain in the host. UI components and table behavior come from `vue-lepsios`. Domain timelines such as Spending expense history and Go Product proposal history are not audit logs.
