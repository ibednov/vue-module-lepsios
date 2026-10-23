# Integration strategy

`vue-module-lepsios` owns reusable CRM feature modules and their contracts;
`vue-lepsios` owns reusable Vue UI components. Product repositories retain
authentication, authorization, API calls, field mapping, translations, and
product-specific composition.

## Audit log module

`@lepsios/crm-audit-log` is the shared view and frontend contract for the
`go-lepsios/audit` HTTP DTO. The package lives under
`packages/audit-log` in this monorepo. Since the repository root is a separate
private package, the nested module is not directly installable through a
Git dependency, and it is not published to npm.

For local development, consumers use Bun's local package link. That link is
machine-local and must not be treated as a production dependency.

For deployment builds, the supported delivery path is a multi-stage Docker
build that clones this public repository at a fixed full commit SHA, sparse
checks out `packages/audit-log`, and copies that directory to
`node_modules/@lepsios/crm-audit-log` before running the frontend build. The
Concierge CRM has its own fetch stage. The `alexbednov-crm` host does the same
for its Spending, Wishimi, and Go Product microfrontends. Bump the pinned SHA
only when the consuming CRM adopts the corresponding shared module revision.

This provides reproducible production builds without a local link or registry
publication. Standalone frontend checkouts still need `bun link` for local
development; standalone npm/Bun installation is unsupported until the module
is published as a distributable package.

## Compatibility

- Keep semantic versioning for module APIs and shared models. Additive optional
  fields are minor changes; removals, renames, or meaning changes are major.
- Each host owns adapters for any legacy API field or pagination mapping.
- Keep authentication, API error localization, permissions, and business rules
  product-specific.
