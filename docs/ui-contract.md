# CRM UI contract

## List pages

1. Page heading at the left, title and total count; primary create action at the right.
2. Search and filters in a single toolbar with content-sized controls. They must not expand into multiple huge full-width fields unless the layout is narrow.
3. One shared table style for records, accounts, roles, permissions, credentials, FAQ and templates. Columns are localized and labels are not raw backend identifiers.
4. Use semantic badges for status and roles. Multiple roles render as multiple badges.
5. A row action uses one overflow dropdown. Keep row actions out of the main data columns except a single compact menu trigger.
6. Keep table visible at all widths; on small viewports use horizontal scrolling or the project's established responsive table component. Avoid a second unrelated card-list implementation.
7. Loading, empty, empty-after-filter, error and retry behavior are explicit. A failed API call must not appear as an empty result.

## Create and edit

- When the product API and business workflow support manual creation, put primary entity forms on a dedicated `/create/` route; do not embed the form above a list. Do not invent a create operation when records originate from a conversion or consent workflow.
- Show a page title, short purpose description, grouped fields, field validation, submit/cancel actions, and a useful post-save destination.
- Secret API credentials are displayed once after successful creation and never shown again from list/detail endpoints.
- Use canonical `v-model` for controlled Vue inputs.

## Page layout

- Product lists and catalogs use available width and consistent page gutters. A dashboard may use cards; CRUD catalogs use tables.
- Forms and preference settings use a readable maximum width aligned to the page grid. Avoid a small block visually floating at the center of a mostly empty viewport.
- Content not yet editable states what is available and where the source of truth lives. Use a compact state block aligned with the page header.

## API feedback

- Show localized API `message` verbatim when API contract provides it. Network errors receive a localized, human-readable label and retry affordance.
- Never render raw `Failed to fetch` as the only user-facing state.
- Keep operation-specific busy state and disable only affected actions.
