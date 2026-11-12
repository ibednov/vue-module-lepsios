# @lepsios/crm-api-keys

Reusable API-key contract, Vue state, and optional view for CRM hosts. The host supplies authenticated API operations, owner context, localized labels, permissions, and product-specific connection text.

## Contract

`CRMApiKeysSource` has `list()`, `create({ label })`, and `revoke(id)`. List records never contain secrets; only `create` returns a `CRMApiKeyIssue` with the one-time secret. The package does not fetch a secret after creation.

Products with owner-scoped APIs close over that owner in their source adapter. Product-specific endpoint URLs, auth/session handling, snippet headers, and post-revoke refresh policy remain in the host.

## State

```ts
import { useCRMApiKeys } from '@lepsios/crm-api-keys/vue'
import type { CRMApiKeysSource } from '@lepsios/crm-api-keys'

const source: CRMApiKeysSource = {
  list: () => api.listKeys(),
  create: ({ label }) => api.createKey(label),
  revoke: id => api.revokeKey(id),
}
const apiKeys = useCRMApiKeys(source)
await apiKeys.refresh()
```

## Optional view

`CrmApiKeysView` is exported from `@lepsios/crm-api-keys/component`. Pass a complete labels bag and `canManage`. Use its `connection` slot to render the product's endpoint and required headers from the one-time `issued` object. `formatDate` can apply the host's locale formatting.

```vue
<CrmApiKeysView :source="source" :labels="labels" :can-manage="canManage">
  <template #connection="{ issued }">
    <pre>{{ buildConnectionSnippet(issued) }}</pre>
  </template>
</CrmApiKeysView>
```

The view owns table and dialog composition. The optional source mapper example is in [`examples/source.ts`](./examples/source.ts).
