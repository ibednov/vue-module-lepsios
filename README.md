# Shared CRM Vue modules

Репозиторий общих CRM-модулей, их контрактов и адаптерных примеров. Переиспользуемые Vue-компоненты находятся в `vue-lepsios`; здесь хранятся бизнес-модули и интеграционные контракты. Полные приложения, backend-код и серверные шаблоны сюда не входят.

## Структура приложения

```text
src/
  app/                 # router, plugins, bootstrap
  auth/                # frontend auth/session adapter; API remains product-owned
  components/          # shared table, page header, badges, dropdown actions, states
  layout/              # CRM shell and navigation
  locales/             # shared UI translations
  modules/
    requests/
      components/
      composables/
      pages/
        index.vue       # standard table; optional explicit Kanban view
        create.vue      # dedicated /create/ route
        [id].vue
        [id]/edit.vue
      services/         # product API adapter
      types/
      locales/
      module.config.ts
    staff/
    roles/
    permissions/
    conversations/
  shared/
    api/                # typed HTTP client and error mapping
    types/              # stable UI-level primitives
```

Product API DTOs stay in each module's `services` adapter. Shared contracts describe frontend-facing common concepts; they do not require products to share a backend, auth, storage, routes, or business lifecycle.

## UI conventions

- Entity lists compose shared components from `vue-lepsios` and keep product API calls, permissions, translations, and domain actions in the host.
- Creation lives on a separate `/create/` route. Actions for each row live in one dropdown.
- Roles and statuses use localized badges. Kanban is an optional second view for entities with a meaningful status workflow.
- Forms and all visible labels are localized. Network failures have a human-readable state and retry action.

The first adoption group is Concierge plus Spending, Wishimi, and Go Product CRM. See `docs/concierge-starter.md` for Concierge patterns and domain boundaries. `templates/frontend-module/` is an illustrative feature-module starter based on Concierge's shared DataTable, with an optional Kanban view.

## License

[PolyForm Noncommercial License 1.0.0](LICENSE). Free for noncommercial use; commercial use requires the author's written permission — contact via [alexbednov.dev](https://alexbednov.dev). See [CONTRIBUTING.md](CONTRIBUTING.md).
