# Local development with the CRM audit package

The repository uses npm-compatible workspaces for packages inside this
repository. Workspaces do not span separate CRM repositories. For local
cross-repository development, use Bun's built-in package linking.

Register the package once per developer machine, from the package directory:

```sh
cd /path/to/vue-module-lepsios/packages/audit-log
bun link
```

Then link it into each Bun-based CRM host:

```sh
cd /path/to/crm-host
bun link @lepsios/crm-audit-log
```

The host command creates a symlink in `node_modules` without changing its
`package.json` or lockfile. Repeat it for each host. Run
`bun unlink @lepsios/crm-audit-log` in a host to remove the link.

This is a developer-machine link, not a dependency declaration for clean
installs or deployment. Those still need a distributable package source.
