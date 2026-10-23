# Local package development and deployment

CRM packages live in `vue-module-lepsios/packages/*`. The repository root is a
separate private package, so a consumer cannot install one nested module by
pointing Bun at the Git repository root. The packages are not published to a
registry yet.

## Local development

Consumer manifests declare only the packages they use as Bun workspaces under
`vendor/vue-module-lepsios/packages/`. In a local checkout, make that path a
symlink to the canonical shared repository, then run the consumer's normal
install command:

```sh
cd /path/to/consumer
mkdir -p vendor
ln -s /path/to/mine/_shared/vue-module-lepsios vendor/vue-module-lepsios
bun install
```

The package manager links the selected workspaces into `node_modules`. Editing
the shared repository updates the consumer immediately. The `vendor` link is
ignored by consumer repositories and must not be committed. The same setup
works when `vue-module-lepsios` is checked out elsewhere; use the real path to
that checkout.

Do not use a generic Git dependency for these nested packages: Git installs the
root package, whose identity differs from the feature modules. Do not copy
module directories into `node_modules` after installing dependencies.

## Production and clean Docker builds

Each consumer's Dockerfile checks out the shared repository at a full commit
SHA and copies only that consumer's selected package directories into
`/app/vendor/vue-module-lepsios/packages/` before `bun install --frozen-lockfile`.
The consumer's workspace declarations then let Bun install and link those
packages normally. Keep the checkout pinned to a full SHA and update the lock
file with the corresponding module commit.

`@lepsios/vue` lives at the root of its own repository, so consumers install it
as a direct Git dependency pinned in `package.json` and `bun.lock`. During
local development, `bun link` can point `@lepsios/vue` at a working checkout;
that link is optional and local to the developer machine.
