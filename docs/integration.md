# Integration strategy

`vue-module-lepsios` owns reusable CRM feature contracts and state; `vue-lepsios`
owns generic Vue UI components. Product repositories keep authentication,
authorization, API calls, field mappings, translations, and product-specific
composition.

## Audit log

`@lepsios/crm-audit-log` standardizes the frontend contract and view for the
`go-lepsios/audit` model. Hosts own authentication, endpoint calls, permission
checks, labels, and mapping from product DTOs.

## Installing nested packages before registry publication

The repository root is not one of the CRM feature packages. Consumers list
only the feature package paths they use as Bun workspaces under
`vendor/vue-module-lepsios/packages/`, and their Dockerfiles populate those
source paths from a pinned full commit before running `bun install`. Bun then
links the workspaces like any other local dependency. For local development,
the consumer's ignored `vendor/vue-module-lepsios` path can instead symlink to
the canonical shared repository.

This keeps each package independently named and versioned inside one Git
repository, without publishing before its base is ready. Do not copy source
directories into `node_modules` or install the monorepo root as a substitute
for a nested package.

`@lepsios/vue` is a separate repository whose package is at the repository
root. Consumers use a direct Git dependency pinned to a full commit SHA. A
local Bun link is optional for simultaneous source development.

## Compatibility

- Keep semantic versions and changelogs on each module package.
- Each host owns adapters for legacy API fields and pagination mappings.
- Keep authentication, authorization, error localization, and business rules
  product-specific.
- Publish each workspace package to a package registry after its public API
  and release flow are ready; until then, commit the selected source SHA in the
  consumer's deployment configuration and lockfile.
