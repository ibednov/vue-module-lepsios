# CRM UI reuse status

Updated 2026-11-13. Scope includes Concierge CRM, Spending CRM, Wishimi CRM, Go Product CRM, and Yarmarka CRM. `edu-markdown-test` remains a reference only. Yarmarka is included for shared UI identity; its business modules stay product-owned.

## Shared table

`CrmDataTable` in `vue-lepsios` is the shared table implementation. Product screens keep their API calls, search/filter state, permissions, translations, columns, and domain actions; server pagination stays in each host.

### Yarmarka table API migration matrix

Compared the removed `src/components/ui/data-table/data-table.vue` and
`data-table-types.ts` with `CrmDataTable` in `vue-lepsios`.

| Old Yarmarka API | Shared API | Migration |
| --- | --- | --- |
| Props: `columns`, `data` | Props: `columns`, `data` | Direct |
| `searchKey`, `searchPlaceholder`, `globalSearch`, `serverSearch`; `v-model:search`; `searchChange` | `#toolbar` slot; host-owned query state | Product search controls stay in each page; server/client filtering remains host-owned |
| `isFilterable`, `filterData`, `isFilterOptionDefault`; `filterValue`, `filterValues`; `filterChange` | `#toolbar` slot | Hosts render the filters and own their state/query mapping |
| `hidePagination` | `hidePagination` | Direct |
| `selectable`, `rowIdKey`; `v-model:rowSelection` | `selectedIds`, `getRowId`; `v-model:rowSelection`; `createSelectColumn` | Column selection and ID mapping use shared API |
| `DataTableBulkAction { label, icon?, variant?, onClick(ids) }` | `CrmBulkAction { key, label, variant?, confirmTitle?, confirmDescription?, confirmLabel?, cancelLabel? }`; `bulkAction({ key, ids })` | Host maps the stable action key to its operation; optional confirmation is shared |
| `labels: DataTableLabels` bag | `emptyText`, `loadingText`, `retryLabel`, `previousLabel`, `nextLabel`, `bulkActionsLabel`, selection and pagination label props | Host labels are passed as individual props/callbacks |
| `rowClickable`; `rowClick(row)` | `rowClick({ event, row })` | Shared component skips interactive controls; host reads the row from payload |
| `loading`, `errorMessage`; `retry` | `loading`, `error`, `retryLabel`; `retry` | Error remains distinct from empty state |
| No public content slots | `#toolbar`, `#error`, `#empty`, `#cell:<columnId>` | Additive host composition points |
| No pagination metadata model | `meta: PaginationMeta`; `pageChange(page)` | Host maps API pagination to shared metadata |

| CRM | Adoption |
| --- | --- |
| Spending shell (`alexbednov-crm`) | Local `src/components/shad-cn` tree removed; the shell auto-import resolver targets `@lepsios/vue/components/ui/*`. Spending and Go Product layouts use shared `CrmPageFrame`; list/settings page headers use `AdminPageHeader`. Vue v0.7.8 is pinned and locked; frozen-lockfile install, production build, and typecheck pass. User-local phone-select/audit-log changes remain uncommitted. |
| Concierge | Module lists, AI provider configuration, and AI usage report use `CrmDataTable`; local table and `shad-cn` implementations are removed. Lead Kanban uses the shared shell. Vue v0.7.8 is pinned; frozen-lockfile install, production build, and typecheck pass. |
| Spending | `packages/spending/src/shared/index.ts` directly reexports `CrmDataTable` from `@lepsios/vue`; users search/filter controls remain product-owned. |
| Wishimi | Users, audit, versions, messages, monitoring, and subscription plans use the shared table. Local `TableShell` removed. Shared `CrmPageFrame`, `CrmPageHeader`, and `CrmStateBlock` are used. Standalone and shell package changes are pushed; shell validation passes with pinned Vue v0.7.8. |
| Go Product CRM | Inquiries and commercial proposals use `CrmDataTable`. List/settings pages use `AdminPageHeader` and the shell uses `CrmPageFrame`. FAQ ordering and customer account management keep their product-specific tables: FAQ rows are ordered/edited in place, while accounts combine role/activation mutations with a separate mobile card layout. Shell build and typecheck pass with pinned Vue v0.7.8. |
| Yarmarka | All 15 module list pages use `CrmDataTable`; local table and `shad-cn` trees are removed. All 40 module roots use `AdminPage`, and 16 list headers use `AdminPageHeader`. Shared confirm, entity navigation, tags input, and bulk-action helpers are used where applicable; unused local pagination, clipboard, and utility files are removed. Vue v0.7.9 is pinned; frozen-lockfile install, production build, and typecheck pass. PhoneSelect imports from its Vue entry point (commit `47d2bc0`). Manual route smoke remains open. |

Adoption commits are in the respective consumer repositories; see each repository's commit history. A fresh Spending shell clone successfully vendored API Keys v0.1.2 from its pinned module ref and installed from the lockfile. No service deployment was performed.

## Feature module adoption

- **`@lepsios/crm-api-keys` 0.1.2** (remote tag `api-keys-v0.1.2`): the normalized list/create/revoke contract,
  state composable, and optional view live under `packages/api-keys`. Spending
  and Go Product APIs were compared: both return the one-time secret only on
  create, while owner scope, auth, error mapping, snippet headers, and post-revoke
  refresh policy stay host-owned. Both consumer pages now use the shared view and
  host adapters. Spending/Go Product adapter and view typecheck passes; the full
  shell production build and typecheck pass with remote Vue v0.7.8. A fresh
  shell clone fetched API Keys from its configured remote source ref and passed
  frozen-lockfile installation.

- **G7 compare:** `g7-api-ux-compare.md` records that Go Product FAQ publishing
  and Concierge FAQ suggestion moderation have different data and operations.
  Concierge operator conversations and Yarmarka customer chat also have
  different list and thread actions. Neither candidate passes the extraction
  gate, so no FAQ or Conversations package was started.

- **`@lepsios/crm-audit-log` 0.5.9**: the normalized audit DTO, query/page contract, injectable source, and shared view live under `packages/audit-log`. Concierge, Spending, Wishimi, and Go Product CRM use the shared view. Hosts own authentication, permission checks, route registration, and API mapping. Existing backend endpoints match the `go-lepsios/audit` response DTO. The package accepts `@lepsios/vue` 0.4.x–0.7.x.
- **`@lepsios/crm-team-members` 0.1.1**: the normalized read-only roster contract and source composable live under `packages/team-members`; the generic view lives in `vue-lepsios`. Concierge and Spending map their operator lists in host-owned adapters. Create, invite, role editing, and removal remain product-specific. The shared view searches and paginates the loaded list locally; only use it when the host list operation returns the complete roster. Wishimi users and Go Product customer accounts are end users, outside this operator-team module.
- **`@lepsios/crm-access-control` 0.1.2**: the role/permission catalog contract and source composable live under `packages/access-control`; the generic view lives in `vue-lepsios`. Spending and Go Product CRM map their read-only catalogs in host-owned adapters. Authorization enforcement and role mutation remain host-owned. Concierge exposes an enum role hierarchy but no matching permission catalog, so it is outside this module.
- **`@lepsios/crm-ai` 0.1.1**: provider configuration contract and shared view remain host-source driven. Its Vue peer range now includes 0.7.x, matching Spending shell's shared UI pin.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Remaining work

1. The nested packages have semver manifests and changelogs but are not published. Before registry release, choose registry access policy and perform an authorized release.
2. Manual route smoke remains open for Wishimi users/audit, one Concierge list, and Yarmarka clients/staff/another list.
3. Add a Waify CRM consumer when its frontend is created and its operator-team contract is known.
4. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

The adoption matrix above records confirmed module consumers. The audit
response shape was checked against Concierge API, Spending API, Wishimi backend,
and Go Product site-api. Team-members and access-control are read-only frontend
contracts and require no new backend endpoints. Consumer pins, frozen installs,
and production builds have been verified in their owning repositories. Packages
remain unpublished to a registry; no service deployment was performed.
