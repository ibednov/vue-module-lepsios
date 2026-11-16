# CRM UI reuse status

Updated **2026-11-16** (prod chrome + bulk). Canonical pin: **`@lepsios/vue` github `#v0.8.19`**.

North star: every CRM admin chrome/table/confirm comes from `@lepsios/vue` / `@lepsios/crm-*`; hosts keep domain, API, auth, i18n, routes. Wishimi UX parity on live was the first bar; all admins unified to the same shell patterns.

Finish tracker: [`shared-ui-finish-plan.md`](./shared-ui-finish-plan.md). Extraction goals: [`shared-ui-extraction-plan.md`](./shared-ui-extraction-plan.md).

## Package cuts (recent)

| Tag | Why |
| --- | --- |
| **0.8.19** | `CrmDataTable` contain long cell content |
| 0.8.18 | `CrmDataTable` emits `clearSelection` when host owns `selectedIds` |
| 0.8.17 | `CrmSidebarAccount` labeled lang/theme menu items |
| 0.8.16 | `section.links` 2-level breadcrumbs |
| 0.8.15 | `CrmNavHub` section/module landing cards |
| 0.8.x earlier | `CrmSidebarAccount`, ConfirmDialog props-only, no `AdminDataTable`, peers `^0.8.0` |

Shell `alexbednov-crm` pins **`#v0.8.19`**. Dokploy compose deploy used for Spending/Wishimi shell after nav + bulk fixes. Authenticated full-route smoke still **open** (login wall in agent browser).

## Shared table

`CrmDataTable` is the only list table. Hosts own search/filter, columns, permissions, bulk **domain** handlers. Shared owns selection chrome when wired correctly:

| Host concern | Shared API |
| --- | --- |
| Selection IDs | `:selected-ids` + host `ref<string[]>` |
| Bulk bar + confirm | `:bulk-actions` (`CrmBulkAction`), `@bulk-action` |
| Count / clear labels | `:selected-count-label`, `:clear-selection-label`, `@clear-selection` |
| Row checkboxes | **reka `modelValue` / `update:modelValue` only** — `checked` looks toggled but never writes host ids (title-suggestions bug) |
| Toolbar extras | `#toolbar` slot |

Reference hosts: go-product commercial-proposals; Spending title-suggestions (fixed 2026-11-16).

Yarmarka old `DataTable` → shared matrix unchanged (see earlier rows in git history / finish plan). Peers floor **`^0.8.0`**.

| CRM | Adoption |
| --- | --- |
| Spending shell (`alexbednov-crm`) | Shared `AdminShell`, headers, breadcrumbs, frames, UI from `@lepsios/vue`. Local shad-cn gone. Pin **#v0.8.19**. |
| Spending product | Lists via `CrmDataTable`; layout `AdminShell`. **3-level nav** (platform / system / account). Bulk on title-suggestions wired. |
| Wishimi | Shared shell + table; 3-level admin nav + hubs; account footer identity from host session. |
| Concierge | Shared shell/sidebar/breadcrumbs; lists + Kanban shared. |
| Go Product | Shared shell + `CrmDataTable` (incl. bulk reference). |
| Yarmarka | Shared table + AdminPage chrome; deferred local ui-* until 2nd consumer. |
| tea-find | Shell consumer; list quality cutover noted in shell docs. |

## Admin chrome parity (prod)

One pattern across products:

| Piece | Shared | Host |
| --- | --- | --- |
| Shell + wide toggle | `AdminShell` | open/wide state |
| Breadcrumbs (clickable, hub-aware) | `CrmBreadcrumbs` + `buildCrmNavBreadcrumbs` | items from same nav tree |
| Nav hubs | `CrmNavHub`, `resolveCrmNavHub`, `crmNavHubPath` | provide sections; hub route |
| Sidebar footer | **`CrmSidebarAccount` only** | title/subtitle/initials, lang/theme labels, logout, optional `#menu` |
| Lang / theme | footer appearance block (0.8.17+) | handlers + labels; no second header controls |
| Powered by | props on account footer | optional |
| Notifications | — | Spending only via `#menu` → profile route |

### Nav IA rules (owner)

- **3-level default:** section → module (former group) → leaf. Do not collapse to 2-level “section = former group + bare leaves”.
- **Single-leaf modules OK** (e.g. Spending **Аудит** alone under System).
- Split crowded modules by *job*, not by URL count:
  - Spending **Доступ** = staff · roles · permissions (not audit).
  - Spending **Аудит** = journal only.
  - Spending **Контент** (platform) = title-suggestions (not system settings).
  - Spending **Настройки системы** = flags · MCP · AI only.
- Leaf rows in shell maps need `array: []` (or walkers use `?? []`) — missing `array` blanked the whole Spending sidebar once.
- Hub cards for section/module clicks; leaves stay real screens.

## Feature modules

Unchanged gate: no FAQ/Conversations (`g7-api-ux-compare.md`). API keys / audit-log / team-members / access-control / AI packages as before; hosts pin Vue 0.8.x peer range.

## Remaining

1. Nested packages unpublished (owner-only npm).
2. Authenticated browser smoke **open** (Wishimi, Concierge, Yarmarka, keys, full bulk click-path).
3. Optional: non-admin `useI18n` strip on Datepicker/etc.
4. Waify CRM when frontend exists.
5. Incoming-request shared module still gated on cross-product process compare.
6. Optional rename Spending module label «Контент» if owner prefers another word for suggestions.

## Verification

Pins + lockfiles in owning repos. Shell Dokploy deploy after nav/bulk commits. Live bulk bar depends on hard-refresh post-deploy; root cause was host checkbox binding, not missing shared code.
