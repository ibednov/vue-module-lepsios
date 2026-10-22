# First-wave CRM reuse status

Updated 2026-10-23. Scope is Concierge CRM, Spending CRM, Wishimi CRM, and Go Product CRM. `edu-markdown-test` remains a reference only; Yarmarka is outside this wave.

## Shared table

`CrmDataTable` in `vue-lepsios` is the shared table implementation. Product screens keep their API calls, search/filter state, permissions, translations, columns, and domain actions; server pagination stays in each host.

| CRM | Adoption |
| --- | --- |
| Concierge | Team, contacts, applications, and leads use the shared table. Local table implementation removed. Lead Kanban remains product-owned. |
| Spending | Existing Spending table wrapper delegates to the shared table and preserves its local import path and API. |
| Wishimi | Users, audit, versions, messages, monitoring, and subscription plans use the shared table. Local `TableShell` removed. The package now declares `@lepsios/vue` `^0.3.4`, which includes `CrmDataTable`. |
| Go Product CRM | Already uses `CrmDataTable` in commercial proposals; no duplicate migration was made. |

Adoption commits are in the respective consumer repositories; see each repository's commit history. No changes were pushed.

## Feature module candidates

- **`@lepsios/crm-audit-log` 0.1.0**: normalized event, query/page, adapter, and read-access contracts are committed under `packages/audit-log`. Concierge and Wishimi are confirmed global-feed candidates. Spending user activity and Go Product entity histories are not global logs. Consumer adapters are still pending package distribution and host integration.
- **Team members**: not ready as one module. Concierge creates password-backed staff with an enum role; Spending assigns multiple roles to Telegram-linked staff. Wishimi role editing and Go Product account management concern product end users, not operator teams.
- **Access control**: not ready as one module. The four systems do not share a confirmed permission schema and set of read/write operations. Each host retains its own permission checks and API.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Next steps

1. Decide how to distribute individual packages from this repository (workspace/package publishing or another versioned mechanism); do not install by absolute local path.
2. Add Concierge and Wishimi `audit-log` API adapters against the committed contract, keeping endpoint auth and event-label translations in each host.
3. After those adapters establish the vertical slice, decide whether the shared module needs a UI layer in `vue-lepsios` or stays a contract plus host composition.
4. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

Changes were checked with `git diff --check`. Automated tests were not run. Wishimi has no installed `node_modules`, so its typecheck/build was unavailable. Concierge typecheck remains blocked by pre-existing type errors in the installed shared Vue dependency; changed page files had no reported errors in the prior filtered run. Nothing was pushed.
