# Finish plan: shared UI extraction to done

Goal: close the crooks left after G1–G6. No new features. No FAQ/Conversations modules. No npm publish.

Owner order: package truth → pins → dead leftovers → i18n invariant on shared CRM path → docs one source of truth → verify builds.

## Done when

1. `@lepsios/vue` CRM path does not call `t()` / `useI18n` on ConfirmDialog (admin/* already clean).
2. Misleading export `AdminDataTable` removed.
3. Consumer peers for `@lepsios/vue` floor at `^0.8.0` (no `^0.5`).
4. Cosmetic leftovers removed where safe: empty `data-table/` dirs, unused local spinner, `components.json` CLI stubs. **Keep `shadcn.css`** (theme tokens).
5. Docs agree on smoke: open stays open unless re-smoked; no conflicting “passed vs open”.
6. Wishimi / product package peers `^0.8.0` minimum.
7. typecheck/build green on touched paths (or honest blocker named).

## Out of scope (explicit)

- Yarmarka deferred local ui-* (md/date/field/animate) until 2nd consumer.
- Concierge detail `[id]` custom headers (product chrome, not list chrome DoD).
- Spending API-backed keys smoke (API start forces Telegram poll).
- God-table split, triple empty merge, dual Admin/Crm naming beyond dangerous alias.
- G7 modules, registry publish, Waify.
- Non-admin `useI18n` in Datepicker/Timepicker/upload/file/carousel (not CRM list path; separate pass).

## Work order

| Step | Where | Action |
| --- | --- | --- |
| F1 | vue-lepsios | ConfirmDialog props-only labels; drop useI18n. |
| F2 | vue-lepsios | Remove `AdminDataTable` export. Bump **0.8.4** + CHANGELOG + tag. |
| F3 | consumers / modules | Peer `@lepsios/vue` → `^0.8.0`. Host github pins stay `#v0.8.3` until **owner pushes** `v0.8.4`; local sibling Vite already uses `_shared/vue-lepsios`. |
| F4 | shell, Concierge, Yarmarka | Delete empty `data-table/`, unused `ui-spinner`, `components.json`. Do not delete `shadcn.css`. |
| F5 | docs | Sync extraction plan + adoption-status smoke/peers; this file = finish tracker. |
| F6 | verify | ConfirmDialog/export checks; commit per repo. |

## Status

| Step | Status |
| --- | --- |
| F1 ConfirmDialog / i18n | **done** — vue-lepsios `df3e1fb` / tag `v0.8.4` (local) |
| F2 AdminDataTable + bump | **done** |
| F3 peer floors | **done** — product packages + crm-api-keys/ai/audit-log `^0.8.0`; host tags remain `#v0.8.3` until push |
| F4 cosmetic leftovers | **done** — spinner, components.json×3, empty data-table dir |
| F5 docs truth | **done** |
| F6 verify + commit | **done** — shell typecheck green; commits local ahead 1 |

## Blocked on owner

1. `git push` + `git push --tags` in `vue-lepsios` so `#v0.8.4` resolves for frozen installs / Docker.
2. After push: bump shell/Concierge/Yarmarka to `#v0.8.4` and refresh lockfiles.
3. Optional: re-run authenticated browser smoke; until then smoke stays **open** in adoption-status.
