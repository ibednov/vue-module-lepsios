# Concierge as the first implementation profile

Concierge CRM is the reference frontend for the first reusable module pattern. Its app is Vue 3 with file-based routes under `src/microfrontends/@concierge/modules`, shadcn-vue components, and Vue I18n. Leads, applications, and contacts use the shared `CrmDataTable` from `vue-lepsios`; the Lead Kanban view remains product-owned.

## Keep from Concierge

- Domain modules and product adapters stay separate. Pages do not call `fetch` directly.
- Use the shared TanStack table's server-side search, filtering, loading, retry and localized labels. Keep API pagination in the feature page because the wrapper's own pagination is client-side.
- Keep auth and permission checks in the product's existing auth/session boundary.
- Keep product DTO mapping and error text in the module adapter.

## Add as the reusable list pattern

- Table is the default list view.
- A module may enable a second Kanban view when its status lifecycle makes columns useful. View selection is presentation state; it does not create new business statuses.
- Kanban status changes call the module adapter and then reconcile with the server response. Disable drag/drop or status controls when the adapter has no supported transition operation.
- Create forms use a separate `/create/` route. Detail and edit keep their own routes.
- Loading, empty, filtered-empty, error/retry and permission-denied states are explicit and localized.

## Concierge domain boundaries

| Module | Status workflow | Reusable views | Important rule |
| --- | --- | --- | --- |
| `@leads` | `new`, `in_conversation`, `contact_requested`, `abandoned`, `converted`, `closed` | Table + Kanban | Lead is AI qualification and may convert into an Application. Manual create is not exposed by its API. |
| `@applications` | `new`, `in_progress`, `contacted`, `won`, `lost` | Table first; Kanban after transition-specific UX | Application carries contact and consent; `lost` requires a reason. It is created by Lead conversion, not manual CRUD. |
| `@conversations` | `active`, `closed`, `ai_limit_reached` | Inbox/list, not generic Kanban by default | A conversation is a message thread with ownership and live interaction. |
| `@team` | role/active state | Table | Existing create form is inline; move it to a dedicated route when implementing the shared UX, preserving owner/admin rules. |

Do not implement Lead and Application as aliases of one generic request. They can share table mechanics and primitive fields while keeping separate types, statuses, permissions, create flows and API adapters.

The files in `templates/frontend-module/pages/` are Vue starters. Adapt alias imports and inject product-specific columns, filters, permission gates, routes, labels and API operations. The list adapter translates `{items,total,page,limit}` into the shared `CRMPage<T>` shape. Do not add manual create screens for Leads or Applications unless the backend exposes and authorizes those operations.
