# Integration strategy

The canonical source is the `vue-module-lepsios` repository. It owns shared CRM modules and their contracts; `vue-lepsios` owns reusable Vue components. Absolute-path imports and `file:` dependencies pointing outside a project are unsuitable for CI and Dokploy because those systems clone one repository at a time.

## Runtime package connection

Once this repository has a GitHub remote and a release pipeline, publish `@alexbednov/crm-contracts` (or consume a pinned git tag). Each consumer pins a version and owns any adapters. Avoid floating `main` dependencies.

The current repositories intentionally vendor package sources in `alexbednov-crm/packages/*` for production builds. Preserve that deployment contract until a verified packaging flow replaces it. `vite.config.ts` uses canonical sibling sources in development and vendored copies for production; do not remove the mirror without changing Docker build inputs and deployment validation.

## Repository references before publication

Consumers should name this canonical repo in their project README/CRM architecture doc, but must keep working source inside the repository. This makes the design discoverable without introducing an unresolvable submodule URL. After the owner chooses/publishes the remote, replace those local-workspace references with a pinned git submodule or package dependency.

## Compatibility

- Semantic version model fields and schema changes.
- Additive optional fields are minor; removals/renames/meaning changes are major.
- Create compatibility fixtures from each consuming API before adopting write operations.
- Keep API error localization and authentication product-specific.
