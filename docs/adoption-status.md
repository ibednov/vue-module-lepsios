# First-wave CRM reuse status

Updated 2026-10-23. Scope is Concierge CRM, Spending CRM, Wishimi CRM, and Go Product CRM. `edu-markdown-test` remains a reference only; Yarmarka is outside this wave.

## Shared table

`CrmDataTable` in `vue-lepsios` is the shared table implementation. Product screens keep their API calls, search/filter state, permissions, translations, columns, and domain actions; server pagination stays in each host.

| CRM | Adoption |
| --- | --- |
| Concierge | Team, contacts, applications, and leads use the shared table. Local table implementation removed. Lead Kanban remains product-owned. AI provider configuration and usage report tables remain product-specific. |
| Spending | Existing Spending table wrapper delegates to the shared table and preserves its local import path and API, including the users search/filter toolbar. |
| Wishimi | Users, audit, versions, messages, monitoring, and subscription plans use the shared table. Local `TableShell` removed. The package now declares `@lepsios/vue` `^0.3.4`, which includes `CrmDataTable`. |
| Go Product CRM | Inquiries and commercial proposals use `CrmDataTable`. FAQ ordering and customer account management keep their product-specific tables: FAQ rows are ordered/edited in place, while accounts combine role/activation mutations with a separate mobile card layout. |

Adoption commits are in the respective consumer repositories; see each repository's commit history. No changes were pushed.

## Feature module adoption

- **`@lepsios/crm-audit-log` 0.5.5**: the normalized audit DTO, query/page contract, injectable source, and shared view live under `packages/audit-log`. Concierge, Spending, Wishimi, and Go Product CRM use the shared view. Hosts own authentication and any API mapping. Bun links support local development only. Production Docker builds fetch a fixed module commit: Concierge fetches it in its own Dockerfile, and the `alexbednov-crm` host fetches it for Spending, Wishimi, and Go Product. The nested package is not published and cannot be installed directly from the monorepo's Git root.
- **`@lepsios/crm-team-members` 0.1.0**: the normalized read-only roster contract and source composable live under `packages/team-members`; the generic view lives in `vue-lepsios`. Concierge and Spending map their operator lists in host-owned adapters. Create, invite, role editing, and removal remain product-specific. Wishimi users and Go Product customer accounts are end users, outside this operator-team module.
- **`@lepsios/crm-access-control` 0.1.1**: the role/permission catalog contract and source composable live under `packages/access-control`; the generic view lives in `vue-lepsios`. Spending and Go Product CRM map their read-only catalogs in host-owned adapters. Authorization enforcement and role mutation remain host-owned. Concierge exposes an enum role hierarchy but no matching permission catalog, so it is outside this module.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Next steps

1. If standalone clean installs become necessary, publish the nested packages to a package registry; current production Docker builds already have a pinned Git checkout path for audit-log.
2. Add a Waify CRM consumer when its frontend is created and its operator-team contract is known.
3. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

All four first-wave CRM frontends use the shared audit view. Concierge and Spending use the read-only shared team roster; Spending and Go Product CRM use the shared read-only access catalog. The alexbednov-crm development build resolves canonical source packages, and its production-mode build uses vendored package copies. Local package links are for developer checkouts; production Dockerfiles fetch the audit package at a pinned commit. Automated tests were not run. Nothing was pushed.
