# Changelog

## 0.1.3

- Accept the shared Vue component package 0.8.x.

## 0.1.2

- Import the shared data table from its component path to keep the feature module's dependency graph focused.

## 0.1.1

- Declare compatibility with `@lepsios/vue` 0.7.x.

## 0.1.0

- Add product-neutral API key contract, Vue state, and optional list/create/revoke view.
- Keep owner context, authentication, localized labels, and connection snippets host-owned.
- Keep issued secrets out of list records and expose them only from the create response.
- Format dates with a host callback and label the identifier and status columns.
- Expose refresh and created/revoked events for host-owned usage updates and notices.
- Allow hosts to disable initial loading until access checks pass.
