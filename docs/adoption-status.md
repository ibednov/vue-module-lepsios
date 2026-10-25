# First-wave CRM reuse status

Updated 2026-10-25. Scope is Concierge CRM, Spending CRM, Wishimi CRM, and Go Product CRM. `edu-markdown-test` remains a reference only; Yarmarka is outside this wave.

## Shared table

`CrmDataTable` in `vue-lepsios` is the shared table implementation. Product screens keep their API calls, search/filter state, permissions, translations, columns, and domain actions; server pagination stays in each host.

| CRM | Adoption |
| --- | --- |
| Concierge | Team, contacts, applications, and leads use the shared table. Local table implementation removed. Lead Kanban remains product-owned. AI provider configuration and usage report tables remain product-specific. |
| Spending | Existing Spending table wrapper delegates to the shared table and preserves its local import path and API, including the users search/filter toolbar. |
| Wishimi | Users, audit, versions, messages, monitoring, and subscription plans use the shared table. Local `TableShell` removed. The package consumes `CrmDataTable` from `vue-lepsios`. |
| Go Product CRM | Inquiries and commercial proposals use `CrmDataTable`. FAQ ordering and customer account management keep their product-specific tables: FAQ rows are ordered/edited in place, while accounts combine role/activation mutations with a separate mobile card layout. |

Adoption commits are in the respective consumer repositories; see each repository's commit history. Clean clone and deployment verification remain tracked in those repositories.

## Feature module adoption

- **`@lepsios/crm-audit-log` 0.5.8**: the normalized audit DTO, query/page contract, injectable source, and shared view live under `packages/audit-log`. Concierge, Spending, Wishimi, and Go Product CRM use the shared view. Hosts own authentication, permission checks, route registration, and API mapping. Existing backend endpoints match the `go-lepsios/audit` response DTO. The package accepts `@lepsios/vue` 0.4.x and 0.5.x.
- **`@lepsios/crm-team-members` 0.1.1**: the normalized read-only roster contract and source composable live under `packages/team-members`; the generic view lives in `vue-lepsios`. Concierge and Spending map their operator lists in host-owned adapters. Create, invite, role editing, and removal remain product-specific. The shared view searches and paginates the loaded list locally; only use it when the host list operation returns the complete roster. Wishimi users and Go Product customer accounts are end users, outside this operator-team module.
- **`@lepsios/crm-access-control` 0.1.2**: the role/permission catalog contract and source composable live under `packages/access-control`; the generic view lives in `vue-lepsios`. Spending and Go Product CRM map their read-only catalogs in host-owned adapters. Authorization enforcement and role mutation remain host-owned. Concierge exposes an enum role hierarchy but no matching permission catalog, so it is outside this module.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Remaining work

1. The nested packages have semver manifests and changelogs but are not published. Before registry release, choose registry access policy and perform an authorized release.
2. Verify consumer frozen installs and production builds from clean clones after their workspace lockfiles and pinned source SHAs are current; that work belongs to the consumer repositories.
3. Add a Waify CRM consumer when its frontend is created and its operator-team contract is known.
4. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

The adoption matrix above records the confirmed module consumers. The audit
response shape was checked against Concierge API, Spending API, Wishimi backend,
and Go Product site-api. Team-members and access-control are read-only frontend
contracts and require no new backend endpoints. Consumer workspace lockfiles,
pinned Git commits, and clean production builds need verification in their
owning repositories. Packages are not published; pushes and releases require
separate authorization.
