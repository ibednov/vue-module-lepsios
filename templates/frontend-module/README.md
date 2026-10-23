# Feature module starter

Copy this structure into `src/modules/<feature>` of a CRM frontend. Keep each feature as a vertical slice and use the host app's shared page, table, badge, dropdown and state components.

```text
<feature>/
  components/
  composables/
  pages/
    index.vue          # list/table; Kanban only as an explicit alternate view
    create.vue         # separate /create/ page
    [id].vue           # detail
    [id]/edit.vue      # edit
  services/            # API calls and DTO-to-view-model mapping
  types/               # product fields and view models
  locales/
    en.json
    ru.json
  module.config.ts     # navigation, capabilities, permission keys, columns
```

Use the module's adapter to map product API DTOs to shared frontend contracts. Do not make page components call `fetch` directly. Keep product-specific fields typed. Keep statuses and workflow operations configurable per product.

`pages/index.example.vue` demonstrates the Concierge `DataTable` wrapper, server search, filters, API pagination, localized states and optional Kanban. Adapt imports to the host's components and do not add a second table implementation. Kanban is enabled only for meaningful workflows; status changes use an API adapter and expose only allowed transitions. Creation is a separate route when the product API supports it. Row actions go in one dropdown; roles/statuses use localized badges.
