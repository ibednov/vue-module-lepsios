# Shared CRM architecture

## Frontend layers

1. **Application shell** — Vue bootstrap, router, layout and navigation.
2. **Shared frontend primitives** — tables, page headers, badges, action menus, loading/error/empty states and localization helpers.
3. **Platform modules** — auth/session adapter, settings, staff, roles, permissions, API keys, audit and chat UI where compatible.
4. **Product modules** — requests, leads, clients, orders, appointments, plans, proposals, FAQ and other domain behavior.
5. **Product API adapters** — map each API's DTOs, errors and authentication to frontend contracts. Backend schemas and policies remain product-owned and are outside this template repository.

## Extensible models

Use a shared base plus a namespaced extension schema. Example: `Request<YarmarkaRequestFields>` includes common request identity/status/contact/assignment/timestamps and a product extension for reservation date, branch and party size. Keep fields typed and validated; `customFields` is not a reason to hide every product field in arbitrary JSON.

Status keys and available operations are configured per product. A generic request must not assume that all products share the same status values, SLA, assignment policy or resolution flow.

## Cross-project inventory (audit 2026-10-21)

| Project | Current architecture | Reuse opportunity | Product-specific boundary |
| --- | --- | --- | --- |
| `go-product/self/crm` | Vue feature package; host auto-discovers `modules/*/pages` | requests, staff, roles, permissions, API keys, settings and list UI | proposal/FAQ/content and role permission model exposed by Go Product API |
| `go-product/yarmarka/yarmarka-crm` | Vite Vue microfrontends; modular clients/orders/booking/chat/staff | tables, status badges, employees, roles, audit, chat primitives | tenant, catalog, bookings, inventory and order lifecycles |
| `go-product/concierge/concierge-crm` | Vite Vue microfrontends; leads/contacts/team/conversations/tasks | staff, request/lead, chat, FAQ, audit, role and table patterns | AI, widget, knowledge, legal, qualification and integration workflows |
| `mine/spending/alexbednov-crm` | Vite shell composition with local package mirrors for production | shell/page primitives and module-package contract | deployment-safe shell and each product's own auth |
| `mine/spending/spending-crm` | standalone Vue package mounted by shell | users, plan requests, audit-like event views, table states | plans, quotas, subscriptions, encryption and obligations |
| `mine/spending/alexbednov-crm/packages/wishimi` | standalone Vue package mounted in wishimi shell | users, messages, audit, monitoring, settings and list UI | wishlists, parsers, subscriptions and own auth |
| `mine/edu-markdown-test` | excluded by request | none in this migration | leave unchanged |

## Findings from the current implementations

- Concierge and Yarmarka are both Vue 3/Vite applications organized as microfrontends with feature folders and file-based page routes. Concierge modules live under `src/microfrontends/@concierge/modules`; Yarmarka's CRM modules live under `src/microfrontends/@crm-demo/modules`.
- Go Product is a Vue feature package with `src/modules/*`, consumed by the `alexbednov-crm` host. Its `inquiries` and `commercial-proposals` screens already demonstrate table/Kanban switching, while CRUD pages are mixed between dedicated routes and inline dialogs.
- Spending and Wishimi are separate frontend packages mounted by that same host. Spending has useful store/service/type separation and imports `CrmDataTable` from `@spending/shared`; Wishimi has a reusable `TableShell` with server pagination. Their message composer is a dialog on the list page, so it does not match the requested dedicated create route.
- Yarmarka has the broadest reusable table behavior: server filtering, sorting, row selection, bulk actions, loading/error/empty states, and optional row-click navigation. It also has separate `new.vue` routes for clients, catalog items/categories, roles, branches, and content pages.
- Concierge has a shared DataTable but its original leads, applications, contacts, conversations, tasks, audit and staff screens do not all use it consistently. Lead and Application are distinct domain records; only leads currently support a meaningful Kanban workflow in the Concierge API.

## Reuse options

1. **One runtime Vue component package.** Import common list/form components into every app. This gives a single live implementation, but current projects use different UI wrappers, routing conventions, shell composition and pagination APIs. It would require adapters and can couple unrelated releases.
2. **A shared contracts package plus copyable module blueprints.** Install versioned TypeScript contracts where compatible, and scaffold/copy Vue modules with a small product adapter. This preserves each product's UI shell and API while standardizing entity shape, list states, create routes, role badges and row-action menus. This fits the existing differences best and is the recommended first stage.
3. **One shared backend schema/service.** This would force lifecycle, auth and persistence decisions across unrelated products. The audit shows that a plan request, visitor lead, application, booking and commercial proposal do not share the same business lifecycle; do not unify their storage or endpoints as part of frontend reuse.

This repo should own reusable CRM modules, their contracts, schemas, and copyable module starters. `vue-lepsios` owns shared Vue UI components. Each product should own its API adapter and product-specific fields, allowed transitions, permissions and validation. The first adoption group is Concierge, Spending, Wishimi, and Go Product CRM. Use edu as a reference for useful patterns; Yarmarka is outside this rollout.

## Adoption order

Adopt modules in the four first-wave CRMs with host-owned API adapters. Reuse UI primitives from `vue-lepsios`. Migrate writes and database schemas only with product-specific compatibility plans, API versioning and data migrations. Do not make all products share a database or auth service as a side effect of shared frontend types.
