# Universal UI remaining cutover (no business)

Goal: every host admin uses `@lepsios/vue` for reusable chrome/widgets. Domain pages stay hosts. No FAQ/leads/orders modules.

## Rules

1. Prefer **reuse** existing exports over new components.
2. Prefer **delete dead** local UI over porting “for later”.
3. New package code only if ≥2 live consumers or typed Field gap with live use.
4. Labels = props only. No product fetch/auth/i18n in shared.
5. Stage intentional paths only — no `git add -A`, no cypress/vendor.

## Waves

| Wave | Action |
| --- | --- |
| W1 | Confirm dead local widgets (C/Y animate/dashboard/card-grid/md/code/magic…); delete if no callers monorepo-wide |
| W2 | Reuse existing: ConfirmDialog, AdminPageHeader/CrmPageHeader, CrmStateBlock, clipboardCopy, formatDate/date utils, Spinner; drop local phone.ts dupes |
| W3 | Port pure live C≡Y only if still needed after W1 (AnimateNumber, DualChart) |
| W4 | New universal only if live gap remains (CodeBlock / MagicSlot / DateRangePicker / textarea-md) |
| W5 | Pins/docs/typecheck/commit/push |

## Status

| Wave | Status |
| --- | --- |
| W1 delete dead | done (C/Y dead ui-* deleted) |
| W2 reuse existing | done (ConfirmDialog, formatDateTimeBasedOnLocale, AdminPageHeader batch, phone.ts gone) |
| W3 port C≡Y live | n/a — no live dual widgets left after W1 |
| W4 new universal | deferred — specialized Spending date formats stay host |
| W5 ship | done — vue 0.8.5 tagged; hosts pinned |
