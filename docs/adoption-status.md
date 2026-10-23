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

- **`@lepsios/crm-audit-log` 0.5.5**: the normalized audit DTO, query/page contract, injectable source, and shared view live under `packages/audit-log`. Concierge, Spending, Wishimi, and Go Product CRM use the shared view. Hosts own authentication and any API mapping. Bun links support local development only. Production Docker builds fetch a fixed module commit: Concierge fetches it in its own Dockerfile, and the `alexbednov-crm` host fetches it for Spending, Wishimi, and Go Product. The nested package is not published and cannot be installed directly from the monorepo's Git root.
- **Team members**: not ready as one module. Concierge creates password-backed staff with an enum role; Spending assigns multiple roles to Telegram-linked staff. Wishimi role editing and Go Product account management concern product end users, not operator teams.
- **Access control**: not ready as one module. The four systems do not share a confirmed permission schema and set of read/write operations. Each host retains its own permission checks and API.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Next steps

1. If standalone clean installs become necessary, publish the nested package to a package registry; current production Docker builds already have a pinned Git checkout path.
2. Add a Waify CRM consumer when its frontend is created.
3. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

All four first-wave CRM frontends use the shared audit view. Local package links are for developer checkouts; the Concierge and `alexbednov-crm` production Dockerfiles fetch the package at a pinned commit before building. Automated tests were not run. Typecheck attempts reported existing errors in shared Vue dependencies and no errors in the audit integrations. Nothing was pushed.
