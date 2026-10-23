# Local development with the CRM audit package

The repository uses npm-compatible workspaces for packages inside this
repository. Workspaces do not span the separate CRM repositories. For local
cross-repository development, link the package into each CRM host's existing
`node_modules`; this does not edit the host's `package.json` or lockfile.

From the `vue-module-lepsios` checkout:

```sh
node scripts/link-audit-log.mjs \
  /path/to/wishimi/crm \
  /path/to/spending/spending-crm \
  /path/to/alexbednov-crm \
  /path/to/concierge-crm \
  /path/to/go-product/crm
```

Pass both the feature repository and its build host when they are separate
directories. The script only creates `node_modules/@lepsios/crm-audit-log`
symlinks. It refuses to replace an existing path unless it already points at
this package. Remove those symlinks when local development is finished. This
is a developer workspace link, not a dependency declaration for clean installs
or deployment; hosts will need a distributable package source before those
builds can install the module independently.
