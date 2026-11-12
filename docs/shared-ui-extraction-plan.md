# Plan: identical CRM admin UI via shared packages

Handoff for an implementing agent. **Work by goal** — finish one goal’s DoD before the next. Steps inside a goal are ordered; goals themselves are ordered by dependency.

Inventory date: 2026-11-12.

**Consumer execution priority (owner direction):** Wishimi, Spending, and Go Product first; Concierge second; Yarmarka third. This order has been applied across the consumer integrations.

**North star:** admin lists/settings look and behave the same across CRMs because they share `@lepsios/vue` + `@lepsios/crm-*`, not because backends/auth/lifecycles are unified.

**Not goals:** mega-CRM app, shared auth/DB, one status enum, npm publish (owner only).

---

## Status

| Goal | Status |
| --- | --- |
| G0 Context locked | reference |
| G1 One page chrome | Integrated in Wishimi, Spending, Go Product, Concierge, and Yarmarka. Consumer production builds pass; manual route smoke remains unverified. |
| G2 One table | Shared parity and all planned list migrations are committed, including Yarmarka's 15 lists and Concierge's remaining AI tables. The old-to-new props/emits/models/slots matrix is documented. Builds pass; clean typecheck and browser smoke remain open. |
| G3 One UI primitive source | Complete: shell, Concierge, and Yarmarka local `shad-cn` trees removed; production builds pass. |
| G4 Shared helpers (C≡Y forks gone) | Shared entity navigation, tags input, and bulk-action helper exported in Vue 0.7.6; the entity-navigation typing fix is in Vue 0.7.7. Yarmarka consumes the helpers, obsolete C/Y helper forks are removed, and consumer pin awaits remote availability. |
| G5 Table/Kanban shell | Complete in Concierge and Go Product; `@lepsios/vue` v0.7.5 is tagged. |
| G6 Feature module: API keys | Package 0.1.2 and Spending/Go Product adapters are committed; local package tag exists. Deployment pin is in the shell; remote clean-clone install awaits source availability. |
| G7 Later modules (gated) | API/UX compare is in [`g7-api-ux-compare.md`](./g7-api-ux-compare.md); FAQ and Conversations fail the extraction gates, so no module was started. |

Update this table as goals complete (version tags, PRs).

---

## G0 — Context (read first, no code)

### Repos

| Path | Package | Owns |
| --- | --- | --- |
| `/Users/alepsios/dev/mine/_shared/vue-lepsios` | `@lepsios/vue` | Generic Vue UI (SFC source). No `t()`/API/auth. Labels = props/slots. |
| `/Users/alepsios/dev/mine/_shared/vue-module-lepsios` | `@lepsios/crm-*` nested | Feature contract + `*Source` + state ± view. Host = API/auth/i18n/routes. |
| Consumers | — | Shell, nav, DTO mappers, columns, permissions, domain. |

### Consumers

| CRM | Path | Today |
| --- | --- | --- |
| Wishimi | `/Users/alepsios/dev/mine/wishimi/crm` | `@lepsios/vue` + audit. Local PageHeader/PageFrame/StateBlock. |
| Wishimi (shell pkg) | `/Users/alepsios/dev/mine/spending/alexbednov-crm/packages/wishimi` | Keep in sync with wishimi/crm per product rules. |
| Spending | `.../alexbednov-crm/packages/spending` | vue + audit/team/access/ai. Thin CrmDataTable wrapper. |
| Go Product | `.../alexbednov-crm/packages/go-product` | vue + audit/access. Local GoProductPage chrome. |
| Shell | `/Users/alepsios/dev/mine/spending/alexbednov-crm` | Local shad-cn ~203. |
| Concierge | `/Users/alepsios/dev/work/go-product/concierge/concierge-crm` | Partial vue + audit/team. Local shad-cn ~224. |
| Yarmarka | `/Users/alepsios/dev/work/go-product/yarmarka/yarmarka-crm` | **No** lepsios. Own DataTable + shad-cn ~217. **22 files byte-identical to Concierge.** |

### Pins

- `@lepsios/vue`: git tag or `vendor/vue-lepsios` workspace.
- `@lepsios/crm-*`: `lepsiosModules` + vendor script, or symlink `vendor/vue-module-lepsios` → `_shared/vue-module-lepsios`.
- See `docs/local-package-development.md`, `docs/integration.md`. Never install monorepo root as a feature package.

### Invariants

1. Shared UI: no `t()` / `useI18n()`.
2. Shared modules: no product fetch — host `*Source` only.
3. Domain stays in hosts (catalog, bookings, wishlists, plans, proposal editors, …).
4. lead ≠ application ≠ inquiry ≠ plan-request.
5. Yarmarka **in scope for UI identity**; domain modules stay local.
6. Match style; no drive-by refactors; don’t kill user dev servers; no npm publish unless owner.

### Already shared (reuse)

- Admin: `CrmDataTable`, `CrmPagination`, `AdminPageHeader`, `AdminPage`, `AdminEmptyState`, `AdminRowActions`, team/access views, sidebar nav, service switcher.
- Modules: `crm-audit-log`, `crm-team-members` (read), `crm-access-control` (read), `crm-ai`.
- Confirm: `ConfirmDialog` / `useConfirmDialog`.
- Contracts draft: `packages/contracts` (`CRMApiKey*`, …).
- UI rules: `docs/ui-contract.md`.

### Read before coding

`vue-lepsios/ARCHITECTURE.md`, `src/index.ts`, `crm-data-table.vue`, Yarmarka `data-table.vue`, Wishimi `PageHeader`/`StateBlock`/`PageFrame`, this file, `ui-contract.md`.

---

## G1 — One page chrome

**Outcome:** every list/settings page uses the same header + frame + loading/error gate from `@lepsios/vue`. No local PageHeader/PageFrame/StateBlock forks; Concierge/Yarmarka/Go Product stop hand-rolling headers.

### DoD

- [x] Package exports one header (AdminPageHeader and/or alias `CrmPageHeader`: eyebrow, leading, title, description, actions).
- [x] Package exports one frame (AdminPage / `CrmPageFrame`: max-width + gutters).
- [x] Package exports `CrmStateBlock`: `loading` + `error` + **label props** + default/retry slots — no hardcoded `"Loading…"`.
- [x] Root exports fixed for anything hosts deep-import today (`CrmTeamMembersView`, `CrmAccessControlView`, Admin*).
- [x] Wishimi deletes local PageHeader/PageFrame/StateBlock (and shell package copy).
- [x] Spending/Go Product/Concierge/Yarmarka migrated list/settings screens use package chrome.
- [x] `@lepsios/vue` version + CHANGELOG; G1 consumers pinned to v0.7.5.
- [ ] Manual route smoke: Wishimi users + audit; one Concierge list header.

### Steps (order)

1. **vue-lepsios:** align Wishimi header/frame APIs with Admin*; add `CrmStateBlock`; export gaps; bump.
2. **Wishimi** (+ packages/wishimi): switch imports; delete locals.
3. **Spending / Go Product:** replace GoProductPage-equivalent chrome where it’s only title+description+slot.
4. **Concierge:** replace hand-rolled `<header>` blocks on module index pages.
5. **Yarmarka:** same chrome when touching pages (can batch with G2).

### Sources to fold

- `wishimi/crm/src/shared/components/PageHeader.vue`, `PageFrame.vue`, `StateBlock.vue`
- Inline headers in Concierge team/leads/etc.
- Go Product page wrapper pattern

### Out of scope for G1

Table behavior, shad-cn deletion, new crm-* modules.

### Depends on

The shared package source and label/slot contract in `ui-contract.md`.

---

## G2 — One table (`CrmDataTable` only)

**Outcome:** one table implementation everywhere. Yarmarka `DataTable` deleted. Spending wrapper deleted if passthrough. Capabilities of Yarmarka table live in `@lepsios/vue`.

### DoD

- [x] Props/emits/models/slots migration matrix: Yarmarka `DataTable` vs `CrmDataTable` in `adoption-status.md`.
- [x] Parity implemented **in CrmDataTable** (no second table):
  - server search (first-class or documented `#toolbar` + helper)
  - multi-filter toolbar affordance (`CrmListToolbar` or recipe)
  - row selection + `createSelectColumn` helper
  - bulk actions + labels
  - row-click ignores interactive controls
  - loading / error / empty / retry (error ≠ empty)
  - pagination labels; optional hide pagination
- [x] `AdminRowActions` exported and used for simple overflow menus where applicable.
- [x] Confirm path = package `ConfirmDialog` / `useConfirmDialog` (not ConfirmActionDialog).
- [x] Yarmarka: all module list pages on `CrmDataTable`; `src/components/ui/data-table/*` deleted.
- [x] Spending thin wrapper gone if 1:1.
- [x] Wishimi/Concierge/Go Product remain on `CrmDataTable`; duplicated toolbar/helpers were adopted where applicable.
- [x] `adoption-status.md`: Yarmarka table row updated.
- [ ] Build/typecheck green on Yarmarka + one other consumer; manual route smoke on clients + staff + another list. Production builds pass; current typecheck is blocked by existing shared-source and dependency errors, and no browser smoke was run.

### Steps (order)

1. **vue-lepsios:** matrix + implement gaps additively; export row-actions; bump.
2. **Spending:** drop wrapper if useless; adopt shared toolbar/helpers.
3. **Go Product / Wishimi:** adopt shared toolbar/helpers where duplicated.
4. **Concierge:** adopt shared toolbar/helpers where duplicated.
5. **Yarmarka:** add `@lepsios/vue` pin; migrate module-by-module (clients/staff first); URL query/filter logic stays host.
6. If a Yarmarka behavior is missing → **fix vue-lepsios**, don’t keep local table.

### Parity checklist

| Capability | Yarmarka | CrmDataTable | Action |
| --- | --- | --- | --- |
| columns + data | yes | yes | — |
| loading/error/empty texts | yes | yes | align names |
| retry | yes | yes (`retryLabel` + `retry`) | — |
| server search | yes | `#toolbar` recipe | host supplies search state |
| multi filters | yes | `#toolbar` slot | host composes filters |
| selection + select column | yes | yes (`createSelectColumn`) | — |
| bulk actions | yes | yes | align labels |
| row click + ignore controls | yes | yes | verify |
| labels bag | DataTableLabels | individual label props | Yarmarka passes host labels |
| hide pagination | yes | yes (`hidePagination`) | — |
| meta pagination | external | CrmPagination | unify |

### Out of scope for G2

Full shad-cn tree delete (G3); kanban (G5); api-keys module (G6).

### Depends on

Shared table API and host-owned list/query state. G1 chrome can be adopted
independently; G3–G5 use the completed G1/G2 surface.

---

## G3 — One UI primitive source (no local shad-cn)

**Outcome:** hosts import `@lepsios/vue/components/ui/*` (or root). Local `shad-cn` trees have **zero** imports and are deleted.

### DoD

- [x] Concierge: no `~/components/shad-cn` imports in app/feature code; local tree removed (commit `7690174`).
- [x] Yarmarka: same (commit `1ad4dd5`).
- [x] alexbednov-crm shell: same; `src/components/shad-cn` removed (commit `c3efb39`; stale aliases cleaned in `b767c8e`).
- [x] Builds green; product packages don’t need shell shad-cn aliases.
- [x] G3 consumers use the same `@lepsios/vue` v0.7.5 tag; new G4 APIs are released as v0.7.6.

### Steps (order)

1. Migrate Concierge feature modules import-by-import (can split PRs).
2. Migrate Yarmarka (natural after/with G2).
3. Migrate alexbednov shell.
4. `rg shad-cn` → zero; delete directories.

### Depends on

G1/G2 ideally underway so new code doesn’t reintroduce local primitives. Can partially overlap G2 on Yarmarka.

### Out of scope

Rewriting product-specific compositions, editors, charts, or business controls
when only their underlying primitive is shared.

---

## G4 — Shared helpers (kill Concierge≡Yarmarka forks)

**Outcome:** the 22 byte-identical non-shadcn files are either in `@lepsios/vue` or deleted as obsolete. No C/Y duplicate maintenance.

### Identical set (byte-identical at initial audit)

```
ConfirmActionDialog.vue          → package confirm (G2)
ui/ui-pagination.vue             → CrmPagination
ui/ui-entities-navigation.vue    → CrmEntityNav (new)
ui/ui-clipboard.vue              → util clipboardCopy ± small UI if needed
ui/ui-field*.vue                 → only if not covered by Field*
ui/ui-textarea-md*.vue           → port only if still required
ui/ui-date-picker*.vue, CalendarRange → align with package calendar
ui/ui-spinner, SpinnerComponent  → package spinner
ui/ui-code-block, ui-magic-slot, ModalComponent → port or replace
ui/dashboard/*, ui/animate/*     → defer unless second non-C/Y consumer needs same release
```

### DoD

- [x] Priority helpers live in vue-lepsios and are exported (`CrmEntityNavigation`, `FieldTagsInput`, `runBulkAction`; shared pagination and clipboard utility already existed).
- [x] Yarmarka imports the shared helpers; unused local pagination, clipboard, and utility files were removed. Concierge has no live entity/tags usages; its unused matching common/crypto/table/date/ui/bulk-action copies were removed.
- [x] ConfirmActionDialog gone both sides.
- [x] Vue version 0.7.6 + CHANGELOG and local `v0.7.6` tag; the entity-navigation type fix is in local `v0.7.7`.

### Steps

1. Port priority items to vue-lepsios (EntityNav, confirm already G2, pagination).
2. MD/fields/dates only after audit vs existing Field*/markdown/calendar.
3. Delete locals; defer charts/animate unless requested.

### Depends on

G2 confirm path; G3 makes imports consistent.

### Out of scope

Product-specific markdown editing, date rules, chart compositions, and entity
data/navigation policy.

---

## G5 — Table / Kanban shell (same switch UX)

**Outcome:** Concierge leads + Go Product commercial-proposals share `CrmViewToggle` + `CrmKanbanBoard`. Status rules stay host.

### DoD

- [x] `CrmViewToggle`: `modelValue: 'table' | 'kanban'`, label props.
- [x] `CrmKanbanBoard`: column/card slots only — **no** status API/drag policy required in v1.
- [x] Both host pages refactored; behavior preserved (Go Product and Concierge; Concierge commit `5bc539a` for leads shell, `7690174` for shared UI migration).
- [x] Exported + CHANGELOG.

### Steps

1. [x] Add primitives in vue-lepsios (v0.7.5; release tag available).
2. [x] Wire Concierge `@leads/pages/index.vue` (commit `5bc539a`).
3. [x] Wire Go Product `commercial-proposals/pages/index.vue`.

### Depends on

G1 chrome optional; G2 table for table mode.

### Out of scope

Status enums, permissions, drag/drop policy, API operations, and card content.

---

## G6 — Feature module: API keys

**Outcome:** `@lepsios/crm-api-keys` (product-neutral name) powers Spending + Go Product MCP/API key screens. Host = Source + labels + canManage + connection snippet.

### DoD

- [x] Package under `vue-module-lepsios/packages/api-keys`: types, `useCRMApiKeys`, optional view, examples, README, CHANGELOG, peer `@lepsios/vue`.
- [x] Contract compared to both services before UI freeze:
  - `list()`, `create({ label }) → { meta, secret }`, `revoke(id)`
  - secret shown once; list never re-fetches secret
- [x] Labels bag for all strings; snippet via slot/prop (header names differ per product).
- [x] Spending + Go Product pages use the shared view and host adapters.
- [x] `adoption-status.md` + `integration.md` note.

### Steps

1. Diff both `mcp-keys` services/pages; write contract in package `index.ts`.
2. Implement composable + view (follow audit-log/ai pattern).
3. Migrate Spending, then Go Product.
4. Vendor/pin in alexbednov-crm `lepsiosModules` (local source SHA recorded; upstream availability pending).

### Depends on

G1 chrome nice-to-have; not blocked on G3–G5.

### Out of scope

Wishimi-only settings; full auth product.

---

## G7 — Later feature modules (gated)

Start **only** after a short API/UX compare doc under `docs/`. The compare is
complete in [`g7-api-ux-compare.md`](./g7-api-ux-compare.md); both candidates
remain product-owned because their contracts do not match.

**Outcome:** later modules start only when at least two products share the same
operator workflow, data contract, and core operations. Current comparisons fail
that gate, so no FAQ or Conversations module is extracted.

### DoD

- [x] FAQ API/UX compare records fields and list/create/edit/reorder or moderation operations.
- [x] Conversations API/UX compare records list, thread, message, and operator actions.
- [x] Gate decision is documented for each candidate; failed candidates remain product-owned.
- [x] No module was started for a candidate that failed its gate.

### Steps

1. Compare the concrete consumer APIs and screens before implementation.
2. Record matching and divergent fields, operations, and state transitions.
3. Start a package only for candidates whose shared workflow passes the gate; otherwise document the decision and stop that candidate.

### Depends on

At least two concrete consumers and an API/UX comparison. `useCrmListQuery`
also depends on evidence that boilerplate remains after G2.

### Out of scope

Merging incoming requests/leads/inquiries by name, extracting auth recovery or
feature flags for one consumer, and extracting staff writes without a shared
write contract.

| Candidate | Consumers | Gate |
| --- | --- | --- |
| FAQ | Go Product, Concierge | **Fail**: publishing FAQ content and moderating generated suggestions use different fields and operations; see compare |
| Conversations | Concierge, Yarmarka chat | **Fail**: operator inbox workflows and customer support chat have different list/thread actions; see compare |
| Staff **writes** | Concierge create, Yarmarka staff/roles, Spending staff | explicit write contract — do not overload read-only team-members |
| `useCrmListQuery` | all list pages | only if boilerplate still hurts after G2 |
| Feature-flags / auth-recovery | Wishimi only | **no** extract until 2nd product |
| Incoming requests/leads/inquiries | many names | **blocked** until process compare — do not merge |

---

## Explicit non-extract

- Full shells (WishimiSidebar, AppSidebar*, crm-demo layout composition) — nav **data** host-owned; primitives already shared.
- Auth/session product wiring (phone OTP blocks stay in vue-lepsios; hosts wire).
- One “users” module across Wishimi users / Spending users / Go Product accounts.
- Catalog, bookings, inventory, plans, obligations, parsers, monitoring product metrics, commercial-proposal editors, encryption, widget.

---

## Per-screen recipe (any goal)

1. UI → `@lepsios/vue` / `components/ui/*`.
2. Chrome → header + frame + StateBlock (G1).
3. Table → `CrmDataTable` + host columns; toolbar/filters host or CrmListToolbar (G2).
4. Row menu → AdminRowActions when simple.
5. Confirm → package confirm.
6. Feature → `*Source` + labels + crm-* view.
7. Delete local only when `rg` is clean.
8. typecheck/build; smoke route.

```sh
cd <repo>
bun install
bun run typecheck   # or whatever scripts exist
bun run build
```

---

## Goal dependency graph

```text
G0 read
  ├─ G1 chrome ─┐
  ├─ G2 table ──┴─> G3 shared UI source ──> G4 shared helpers
  │              └───────────────────────> G5 table/Kanban shell
  ├─ G6 API keys (parallel after API compare)
  └─ G7 later modules (each candidate gated by API/UX compare)
```

Ship **goal-sized** PRs (or goal slices). Prefer completing G1 then G2 before large Yarmarka delete. G6 can run parallel once contract is clear.

---

## Docs to touch when a goal lands

- `vue-lepsios` CHANGELOG + version
- module CHANGELOG if G6/G7
- `docs/adoption-status.md`
- `docs/integration.md` if new package
- This file **Status** table

---

## Agent rules

1. One goal at a time unless user says parallel (G6 ok with G1).
2. Read files before edit; inventory with `rg`.
3. Extend CrmDataTable — never add a second table.
4. Wishimi: check both `wishimi/crm` and `packages/wishimi`.
5. Report: goal id, DoD checkboxes, versions, leftovers.
