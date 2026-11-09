# Local package development and deployment

CRM packages live in `vue-module-lepsios/packages/*`. The repository root is a
separate private package, so a consumer cannot install one nested module by
pointing Bun at the Git repository root. The packages are not published to a
registry yet.

## Version pins (package.json only)

Consumer **Dockerfile does not carry version pins**. Bump shared code by
changing the consumer manifest (and lockfile), then rebuild:

| Package | Where the pin lives |
|---|---|
| `@lepsios/vue` | `dependencies["@lepsios/vue"]` git URL + **tag** (e.g. `#v0.5.0-crm.1`) |
| `@lepsios/crm-*` | `lepsiosModules.ref` monorepo **tag** + `lepsiosModules.packages[]` |

```json
"lepsiosModules": {
  "repository": "https://github.com/ibednov/vue-module-lepsios.git",
  "ref": "v0.6.0",
  "packages": ["ai", "audit-log", "team-members", "access-control"]
}
```

Docker runs `scripts/vendor-lepsios-modules.mjs` (reads `lepsiosModules`) then
`bun install --frozen-lockfile`. Do not add `ARG *_REF` version defaults to the
Dockerfile for routine upgrades.

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

`bun run vendor:modules` is a no-op when those packages already exist (local
symlink). The `vendor` link is ignored by consumer repositories and must not be
committed.

Do not use a generic Git dependency for nested CRM modules: Git installs the
root package, whose identity differs from the feature modules.

## `@lepsios/vue`

Root of its own repository — install as a **git dependency with a tag** in
`package.json` / `bun.lock` (same pattern as wishimi-front). Optional local
override: sibling checkout / `bun link`; Vite may resolve sibling `src` in dev.
