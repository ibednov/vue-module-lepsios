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

- **`@lepsios/crm-audit-log` 0.5.6**: the normalized audit DTO, query/page contract, injectable source, and shared view live under `packages/audit-log`. Concierge, Spending, Wishimi, and Go Product CRM use the shared view. Hosts own authentication and API mapping. Consumer manifests list only their selected module paths as Bun workspaces. Developers symlink the ignored `vendor/vue-module-lepsios` path to the shared checkout; Docker fetches a fixed module commit into that source path before `bun install`.
- **`@lepsios/crm-team-members` 0.1.0**: the normalized read-only roster contract and source composable live under `packages/team-members`; the generic view lives in `vue-lepsios`. Concierge and Spending map their operator lists in host-owned adapters. Create, invite, role editing, and removal remain product-specific. Wishimi users and Go Product customer accounts are end users, outside this operator-team module.
- **`@lepsios/crm-access-control` 0.1.1**: the role/permission catalog contract and source composable live under `packages/access-control`; the generic view lives in `vue-lepsios`. Spending and Go Product CRM map their read-only catalogs in host-owned adapters. Authorization enforcement and role mutation remain host-owned. Concierge exposes an enum role hierarchy but no matching permission catalog, so it is outside this module.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Next steps

1. After the module APIs and release ownership are stable, publish the nested packages independently to a package registry. Until then, the pinned Git checkout plus Bun workspaces provides clean Docker installs without a registry.
2. Add a Waify CRM consumer when its frontend is created and its operator-team contract is known.
3. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

All four first-wave CRM frontends use the shared audit view. Concierge and Spending use the read-only shared team roster; Spending and Go Product CRM use the shared read-only access catalog. Consumer workspace installs resolve package manifests from the pinned `vue-module-lepsios` checkout. Concierge and alexbednov-crm production builds use the same workspace paths populated before Bun installs dependencies. Automated tests were not run. Nothing was pushed.
