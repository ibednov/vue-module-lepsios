# Local development and deployment for CRM modules

`@lepsios/crm-audit-log` is a workspace package nested inside the
`vue-module-lepsios` monorepo. The monorepo root is a different private npm
package, so consumers cannot install this nested package directly from a Git
URL. The module is not published to npm.

## Local development

Use Bun's built-in package link when editing the shared module and its CRM
consumer side by side. This only changes `node_modules`; it does not update the
consumer's manifest or lockfile.

Register the module once on the developer machine:

```sh
cd /path/to/vue-module-lepsios/packages/audit-log
bun link
```

Link it into a Bun-based frontend checkout:

```sh
cd /path/to/crm-host
bun link @lepsios/crm-audit-log
```

Remove the development link with `bun unlink @lepsios/crm-audit-log` from the
consumer. A clean checkout cannot resolve the package through this link.

## Production and clean Docker builds

Production images fetch the nested package from the public monorepo at a fixed
commit, then copy it into `node_modules/@lepsios/crm-audit-log` before Vite
builds. This does not require npm publication or a developer's Bun link. The
fetch must stay pinned to a full commit SHA; update the Dockerfile ref when
adopting a new module commit.

The current deployable frontends use these Docker build paths:

- Concierge CRM fetches the pinned module in its own multi-stage Dockerfile.
- The `alexbednov-crm` host fetches it once for the Spending, Wishimi, and Go
  Product microfrontends it builds together.

The standalone Wishimi, Spending, and Go Product packages are source modules,
not independently deployable applications. Build and deploy them through the
host Dockerfile. Running a frontend checkout outside these Docker paths still
requires the local Bun link above until a distributable package is published.
