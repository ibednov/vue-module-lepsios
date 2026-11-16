# Finish plan: shared UI extraction to done

Goal: close the crooks left after G1–G6. No new features. No FAQ/Conversations modules. No npm publish.

## Done when

1. `@lepsios/vue` CRM path does not call `t()` / `useI18n` on ConfirmDialog (admin/* already clean).
2. Misleading export `AdminDataTable` removed.
3. Consumer peers for `@lepsios/vue` floor at `^0.8.0` (no `^0.5`).
4. Cosmetic leftovers removed where safe: empty `data-table/` dirs, unused local spinner, `components.json` CLI stubs. **Keep `shadcn.css`** (theme tokens).
5. Docs agree on smoke: open stays open unless re-smoked; no conflicting “passed vs open”.
6. Wishimi / product package peers `^0.8.0` minimum.
7. Hosts pin **pushed** `#v0.8.4`; typecheck green.

## Out of scope (explicit)

- Yarmarka deferred local ui-* (md/date/field/animate) until 2nd consumer.
- Concierge detail `[id]` custom headers (product chrome, not list chrome DoD).
- Spending API-backed keys smoke (API start forces Telegram poll).
- God-table split, triple empty merge, dual Admin/Crm naming beyond dangerous alias.
- G7 modules, registry publish, Waify.
- Non-admin `useI18n` in Datepicker/Timepicker/upload/file/carousel (not CRM list path; separate pass).
- Authenticated browser smoke re-run (stays open until owner sessions).

## Status

| Step | Status |
| --- | --- |
| F1 ConfirmDialog / i18n | **done** — `df3e1fb` / tag `v0.8.4` **pushed** |
| F2 AdminDataTable + bump | **done** |
| F3 peer floors + host pins | **done** — peers `^0.8.0`; shell/Concierge/Yarmarka `#v0.8.4` + lockfiles |
| F4 cosmetic leftovers | **done** |
| F5 docs truth | **done** |
| F6 verify | **done** — typecheck green shell + Concierge + Yarmarka on 0.8.4 |
| F7 prod cutover push | **in progress** — vue-lepsios pushed; consumers/modules next |

## Remaining (non-blocking for pin cutover)

1. Authenticated browser smoke still **open** (Wishimi users/audit, Concierge list, Yarmarka clients/staff/orders, API keys).
2. Spending API-backed keys smoke blocked on Telegram polling.
3. Optional: strip `useI18n` from non-admin shared widgets.
