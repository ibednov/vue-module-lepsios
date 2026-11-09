# @lepsios/crm-ai

Reusable AI provider-config contract, Vue state, and providers table/dialog UI for CRM hosts.

The package is product-neutral: it does **not** embed Spending, Concierge, or other API paths. The host supplies:

1. `CRMAIProvidersSource` — authenticated `list` / `upsert` / `delete`
2. `CRMAIProvidersLabels` — all visible strings from host i18n
3. `canEdit` — whether mutate controls are shown

## Host integration

```ts
import type { CRMAIProvidersSource } from '@lepsios/crm-ai'
import { CrmAiProvidersView } from '@lepsios/crm-ai/component'

const source: CRMAIProvidersSource = {
  list: () => api.listProviders(),
  upsert: input => api.upsertProvider(input),
  delete: id => api.deleteProvider(id),
}
```

```vue
<template>
  <CrmAiProvidersView
    :source="source"
    :labels="labels"
    :can-edit="canEdit"
  />
</template>
```

Optional composable without the view: `@lepsios/crm-ai/vue` → `useCRMAIProviders`.

Credential fields are write-only. Empty secret inputs omit `credentials` so the backend keeps existing sealed values.
