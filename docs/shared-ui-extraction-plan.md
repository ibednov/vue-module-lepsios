# Plan: identical CRM admin UI via shared packages

Handoff for an implementing agent. **Work by goal** — finish one goal’s DoD before the next. Steps inside a goal are ordered; goals themselves are ordered by dependency.

Inventory date: 2026-11-12.

**Consumer execution priority (owner direction):** Wishimi, Spending, and Go Product first; Concierge second; Yarmarka third. Apply this order across goals while respecting the dependency graph below. Existing Yarmarka work is preserved, but remaining implementation and verification wait until the first two consumer groups are complete.

**North star:** admin lists/settings look and behave the same across CRMs because they share `@lepsios/vue` + `@lepsios/crm-*`, not because backends/auth/lifecycles are unified.

**Not goals:** mega-CRM app, shared auth/DB, one status enum, npm publish (owner only).

---

## Status

| Goal | Status |
| --- | --- |
| G0 Context locked | reference |
| G1 One page chrome | Wishimi + Spending/Go Product on Vue 0.7.4; Concierge/Yarmarka pending |
| G2 One table | in progress; shared parity committed, Spending wrapper removed, Yarmarka migration local |
| G3 One UI primitive source | Spending shell local tree removed; Concierge/Yarmarka pending |
| G4 Shared helpers (C≡Y forks gone) | todo |
| G5 Table/Kanban shell | shared primitives and Go Product integration local; Concierge pending |
| G6 Feature module: API keys | implementation complete locally; clean-clone pins pending |
| G7 Later modules (gated) | blocked until API compare |

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

- [ ] Package exports one header (AdminPageHeader and/or alias `CrmPageHeader`: eyebrow, leading, title, description, actions).
- [ ] Package exports one frame (AdminPage / `CrmPageFrame`: max-width + gutters).
- [ ] Package exports `CrmStateBlock`: `loading` + `error` + **label props** + default/retry slots — no hardcoded `"Loading…"`.
- [ ] Root exports fixed for anything hosts deep-import today (`CrmTeamMembersView`, `CrmAccessControlView`, Admin*).
- [ ] Wishimi deletes local PageHeader/PageFrame/StateBlock (and shell package copy).
- [ ] Spending/Go Product/Concierge list pages use package chrome on migrated screens.
- [ ] `@lepsios/vue` version + CHANGELOG; consumers pinned.
- [ ] Smoke: Wishimi users + audit; one Concierge list header.

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

---

## G2 — One table (`CrmDataTable` only)

**Outcome:** one table implementation everywhere. Yarmarka `DataTable` deleted. Spending wrapper deleted if passthrough. Capabilities of Yarmarka table live in `@lepsios/vue`.

### DoD

- [ ] Props/emits/slots matrix: Yarmarka `DataTable` vs `CrmDataTable` written in PR or vue-lepsios doc.
- [ ] Parity implemented **in CrmDataTable** (no second table):
  - server search (first-class or documented `#toolbar` + helper)
  - multi-filter toolbar affordance (`CrmListToolbar` or recipe)
  - row selection + `createSelectColumn` helper
  - bulk actions + labels
  - row-click ignores interactive controls
  - loading / error / empty / retry (error ≠ empty)
  - pagination labels; optional hide pagination
- [ ] `AdminRowActions` exported and used for simple overflow menus where applicable.
- [ ] Confirm path = package `ConfirmDialog` / `useConfirmDialog` (not ConfirmActionDialog).
- [ ] Yarmarka: all module list pages on `CrmDataTable`; `src/components/ui/data-table/*` deleted.
- [ ] Spending thin wrapper gone if 1:1.
- [ ] Wishimi/Concierge/Go Product already on CrmDataTable stay; adopt new toolbar/helpers where duplicated.
- [ ] `adoption-status.md`: Yarmarka table row updated.
- [ ] Build/typecheck green on Yarmarka + one other consumer; smoke clients + staff + one more list.

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
| retry | yes | ? | add if missing |
| server search | yes | toolbar? | first-class or recipe |
| multi filters | yes | slot | toolbar helper |
| selection + select column | yes | partial | port helper |
| bulk actions | yes | yes | align labels |
| row click + ignore controls | yes | yes | verify |
| labels bag | DataTableLabels | scattered | optional type |
| hide pagination | yes | ? | add if needed |
| meta pagination | external | CrmPagination | unify |

### Out of scope for G2

Full shad-cn tree delete (G3); kanban (G5); api-keys module (G6).

---

## G3 — One UI primitive source (no local shad-cn)

**Outcome:** hosts import `@lepsios/vue/components/ui/*` (or root). Local `shad-cn` trees have **zero** imports and are deleted.

### DoD

- [ ] Concierge: no `~/components/shad-cn` imports in app/feature code.
- [ ] Yarmarka: same.
- [ ] alexbednov-crm shell: same; `src/components/shad-cn` removed.
- [ ] Builds green; product packages don’t need shell shad-cn aliases.
- [ ] Pins aligned on one `@lepsios/vue` tag.

### Steps (order)

1. Migrate Concierge feature modules import-by-import (can split PRs).
2. Migrate Yarmarka (natural after/with G2).
3. Migrate alexbednov shell.
4. `rg shad-cn` → zero; delete directories.

### Depends on

G1/G2 ideally underway so new code doesn’t reintroduce local primitives. Can partially overlap G2 on Yarmarka.

---

## G4 — Shared helpers (kill Concierge≡Yarmarka forks)

**Outcome:** the 22 byte-identical non-shadcn files are either in `@lepsios/vue` or deleted as obsolete. No C/Y duplicate maintenance.

### Identical set (all byte-identical today)

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

- [ ] Priority helpers live in vue-lepsios and are exported.
- [ ] Concierge + Yarmarka import package; local copies deleted for migrated set.
- [ ] ConfirmActionDialog gone both sides.
- [ ] Version + CHANGELOG.

### Steps

1. Port priority items to vue-lepsios (EntityNav, confirm already G2, pagination).
2. MD/fields/dates only after audit vs existing Field*/markdown/calendar.
3. Delete locals; defer charts/animate unless requested.

### Depends on

G2 confirm path; G3 makes imports consistent.

---

## G5 — Table / Kanban shell (same switch UX)

**Outcome:** Concierge leads + Go Product commercial-proposals share `CrmViewToggle` + `CrmKanbanBoard`. Status rules stay host.

### DoD

- [x] `CrmViewToggle`: `modelValue: 'table' | 'kanban'`, label props.
- [x] `CrmKanbanBoard`: column/card slots only — **no** status API/drag policy required in v1.
- [ ] Both host pages refactored; behavior preserved (Go Product complete; Concierge pending).
- [x] Exported + CHANGELOG.

### Steps

1. [x] Add primitives in vue-lepsios (local 0.7.5 commit; release tag pending).
2. Wire Concierge `@leads/pages/index.vue`.
3. [x] Wire Go Product `commercial-proposals/pages/index.vue`.

### Depends on

G1 chrome optional; G2 table for table mode.

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

Start **only** after a short API/UX compare doc under `docs/`.

| Candidate | Consumers | Gate |
| --- | --- | --- |
| FAQ | Go Product, Concierge | list/create/edit/reorder fields match enough |
| Conversations | Concierge, Yarmarka chat | list/thread + reuse ChatShell |
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
  └─ G1 chrome ─────────────────────────────┐
  └─ G2 table ─── G3 shad-cn kill            ├─ identical UI
       │              └─ G4 helper forks ───┘
       └─ G5 kanban (after G2 table mode)
  G6 api-keys (parallel after G1 optional)
  G7 gated modules
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
