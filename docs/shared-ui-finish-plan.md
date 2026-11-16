# Finish plan: shared UI extraction to done

Goal: close crooks after G1–G6, then **prod chrome parity** (same shell/nav/account/table behavior live). No new product features. No FAQ/Conversations. No npm publish without owner.

## Done when

### Package / pin (F1–F7)

1. `@lepsios/vue` CRM path: ConfirmDialog props-only (no `t()` / `useI18n`).
2. No misleading `AdminDataTable` export.
3. Consumer peers floor `^0.8.0` (no `^0.5`).
4. Cosmetics cleaned where safe; **keep `shadcn.css`**.
5. Docs agree: smoke open stays open unless re-smoked.
6. Hosts pin **pushed** github tags; typecheck green on touched apps.
7. Prod shell deploy when owner says push/deploy.

### Prod chrome parity (C1–C6) — closed 2026-11-16

| ID | Criterion | Status |
| --- | --- | --- |
| C1 | One sidebar footer: `CrmSidebarAccount` (identity + labeled lang/theme + logout + optional `#menu`) | **done** (0.8.17) |
| C2 | Header = breadcrumbs + expand; no duplicate lang/theme in header | **done** |
| C3 | Clickable 3-level nav + section/module **hubs** (`CrmNavHub`) | **done** (0.8.15–0.16) |
| C4 | Wishimi + Spending true **section → module → leaf** (not 2-level flatten) | **done** |
| C5 | Spending IA splits: Audit ≠ Access; title-suggestions under Platform **Контент**; settings = flags/MCP/AI | **done** |
| C6 | One bulk path: host `selectedIds` + `bulk-actions`; checkboxes **modelValue**; clear emits `clearSelection` | **done** (0.8.18 + title-suggestions fix) |

## Out of scope (explicit)

- Yarmarka deferred local ui-* until 2nd consumer.
- Concierge detail custom headers.
- Spending API-backed keys smoke (Telegram poll on API start).
- God-table split / dual Admin-Crm naming beyond alias removal.
- G7 modules, registry publish, Waify.
- Non-admin Datepicker/Timepicker i18n strip (separate pass).
- Full authenticated browser smoke until owner sessions.
- Forcing notifications into every product footer (Spending `#menu` only).

## Status

| Step | Status |
| --- | --- |
| F1 ConfirmDialog / i18n | **done** |
| F2 AdminDataTable + bump | **done** |
| F3 peer floors + host pins | **done** — current shell pin **`#v0.8.18`** |
| F4 cosmetic leftovers | **done** |
| F5 docs truth | **done** — adoption-status + this file + extraction status table |
| F6 verify | **done** typecheck on pin cuts; live smoke still open |
| F7 prod cutover push | **done** tags + shell deploys as requested |
| C1–C6 chrome/bulk parity | **done** — see table above |

## Remaining (non-blocking)

1. Authenticated browser smoke still **open**.
2. Spending API keys smoke blocked on Telegram polling.
3. Optional non-admin `useI18n` strip.
4. Optional «Контент» label rename.
