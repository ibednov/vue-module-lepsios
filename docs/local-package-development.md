# Local development and deployment for CRM modules

CRM feature packages are nested inside the `vue-module-lepsios` monorepo. The
monorepo root is a different private npm package, so consumers cannot install a
nested package directly from a Git URL. These modules are not published to npm.

## Local development

Use Bun's built-in package link when editing the shared module and its CRM
consumer side by side. This only changes `node_modules`; it does not update the
consumer's manifest or lockfile.

Register each module once on the developer machine:

```sh
cd /path/to/vue-module-lepsios/packages/audit-log
bun link
cd ../team-members
bun link
cd ../access-control
bun link
```

Link it into a Bun-based frontend checkout:

```sh
cd /path/to/crm-host
bun link @lepsios/crm-audit-log
bun link @lepsios/crm-team-members
bun link @lepsios/crm-access-control
```

Only link modules imported by that checkout: Concierge uses audit-log and
team-members; Spending uses audit-log, team-members, and access-control; Go
Product uses audit-log and access-control; `alexbednov-crm` uses all three
feature packages. These links change only `node_modules`, not the consumer
manifest or lockfile. Remove a link with `bun unlink @lepsios/<package>` from
the consumer. A clean checkout cannot resolve nested modules through these
developer-machine links.

## Production and clean Docker builds

Production images fetch required nested packages from the public monorepo at a
fixed commit, then copy them into `node_modules/@lepsios/` before Vite builds.
This does not require npm publication or a developer's Bun link. Keep the fetch
pinned to a full commit SHA and update the Dockerfile ref when adopting a new
module commit.

The current deployable frontends use these Docker build paths:

- Concierge CRM fetches audit-log and team-members in its own multi-stage
  Dockerfile. It also overlays the shared Vue 0.4.0 source at a fixed SHA after
  dependency installation because the current lockfile still pins an older
  version.
- The `alexbednov-crm` host fetches audit-log, team-members, and access-control
  once for the Spending, Wishimi, and Go Product microfrontends it builds
  together. It overlays the shared Vue 0.4.0 source at a fixed SHA for the same
  reason.

The shared feature packages and Vue source must be pushed before Docker can
fetch their pins. Until then, a clean production build cannot resolve the new
SHAs. Once the Vue commit is available remotely, regenerate the Bun lockfiles
and replace the temporary Docker overlay with the manifest pin.

The standalone Wishimi, Spending, and Go Product packages are source modules,
not independently deployable applications. Build and deploy them through the
host Dockerfile. Running a frontend checkout outside these Docker paths still
requires the local Bun link above until a distributable package is published.
