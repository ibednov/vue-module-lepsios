# CRM UI reuse status

Updated 2026-11-12. Scope includes Concierge CRM, Spending CRM, Wishimi CRM, Go Product CRM, and Yarmarka CRM. `edu-markdown-test` remains a reference only. Yarmarka is included for shared UI identity; its business modules stay product-owned.

## Shared table

`CrmDataTable` in `vue-lepsios` is the shared table implementation. Product screens keep their API calls, search/filter state, permissions, translations, columns, and domain actions; server pagination stays in each host.

| CRM | Adoption |
| --- | --- |
| Spending shell (`alexbednov-crm`) | Local `src/components/shad-cn` tree removed; the shell auto-import resolver now targets `@lepsios/vue/components/ui/*`. Spending and Go Product layouts use shared `CrmPageFrame`; list/settings page headers use `AdminPageHeader`. Root pin and lockfile target released v0.7.5; frozen install and production build pass against the tagged package. |
| Concierge | Team, contacts, applications, and leads use the shared table. Local table implementation removed. Lead Kanban remains product-owned. AI provider configuration and usage report tables remain product-specific. |
| Spending | Existing Spending table wrapper delegates to the shared table and preserves its local import path and API, including the users search/filter toolbar. |
| Wishimi | Users, audit, versions, messages, monitoring, and subscription plans use the shared table. Local `TableShell` removed. Shared `CrmPageFrame`, `CrmPageHeader`, and `CrmStateBlock` are used; shell build passes with Vue v0.7.5. |
| Go Product CRM | Inquiries and commercial proposals use `CrmDataTable`. List/settings pages use `AdminPageHeader` and the shell uses `CrmPageFrame`. FAQ ordering and customer account management keep their product-specific tables: FAQ rows are ordered/edited in place, while accounts combine role/activation mutations with a separate mobile card layout. Shell build passes with Vue v0.7.5. |
| Yarmarka | All 15 module list pages use shared `CrmDataTable`; the local `src/components/ui/data-table/*` implementation was removed. URL/query filters, host pagination, API actions, and domain rules remain product-owned. Build/typecheck and clients/staff/orders browser smoke passed against local shared source; release tag v0.7.4 is available, and its consumer pin/clean-clone check remain for the final product-priority stage. |

Adoption commits are in the respective consumer repositories; see each repository's commit history. Clean clone and deployment verification remain tracked in those repositories.

## Feature module adoption

- **`@lepsios/crm-api-keys` 0.1.2**: the normalized list/create/revoke contract,
  state composable, and optional view live under `packages/api-keys`. Spending
  and Go Product APIs were compared: both return the one-time secret only on
  create, while owner scope, auth, error mapping, snippet headers, and post-revoke
  refresh policy stay host-owned. Both consumer pages now use the shared view and
  host adapters. Spending/Go Product adapter and view typecheck passes; the full
  shell production build passes with local `vue-lepsios` source. Clean-clone pins
  remain pending because the required source commits are not yet available on the
  remote repositories.

- **`@lepsios/crm-audit-log` 0.5.8**: the normalized audit DTO, query/page contract, injectable source, and shared view live under `packages/audit-log`. Concierge, Spending, Wishimi, and Go Product CRM use the shared view. Hosts own authentication, permission checks, route registration, and API mapping. Existing backend endpoints match the `go-lepsios/audit` response DTO. The package accepts `@lepsios/vue` 0.4.x and 0.5.x.
- **`@lepsios/crm-team-members` 0.1.1**: the normalized read-only roster contract and source composable live under `packages/team-members`; the generic view lives in `vue-lepsios`. Concierge and Spending map their operator lists in host-owned adapters. Create, invite, role editing, and removal remain product-specific. The shared view searches and paginates the loaded list locally; only use it when the host list operation returns the complete roster. Wishimi users and Go Product customer accounts are end users, outside this operator-team module.
- **`@lepsios/crm-access-control` 0.1.2**: the role/permission catalog contract and source composable live under `packages/access-control`; the generic view lives in `vue-lepsios`. Spending and Go Product CRM map their read-only catalogs in host-owned adapters. Authorization enforcement and role mutation remain host-owned. Concierge exposes an enum role hierarchy but no matching permission catalog, so it is outside this module.
- **Incoming customer requests**: remain unnamed and unimplemented until the business process is compared across the four products. Do not use `inquiries` by default or merge Concierge lead qualification with application conversion.

## Remaining work

1. The nested packages have semver manifests and changelogs but are not published. Before registry release, choose registry access policy and perform an authorized release.
2. `@lepsios/vue` 0.7.5 is available from its remote release tag. Wishimi, Spending, and Go Product peer ranges accept 0.7.x; the Spending shell lockfile uses the released tag. Concierge and Yarmarka still need consumer adoption. Verify their clean-clone installs and production builds after those integrations land.
3. Verify consumer frozen installs and production builds from clean clones after their workspace lockfiles and pinned source tags are current; that work belongs to the consumer repositories.
4. Add a Waify CRM consumer when its frontend is created and its operator-team contract is known.
5. Compare incoming-request workflows with concrete API operations before defining a module name or model.

## Verification and delivery

The adoption matrix above records the confirmed module consumers. The audit
response shape was checked against Concierge API, Spending API, Wishimi backend,
and Go Product site-api. Team-members and access-control are read-only frontend
contracts and require no new backend endpoints. Consumer workspace lockfiles,
pinned Git commits, and clean production builds need verification in their
owning repositories. Packages are not published; pushes and releases require
separate authorization.
