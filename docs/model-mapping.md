# Existing model mapping

This is the read-only audit summary for selecting shared contracts. It records meanings, not permission to replace product-owned APIs or databases. The first implementation group is Concierge, Spending, Wishimi, and Go Product CRM. Yarmarka is reference material only for this rollout; edu is a source of patterns, not a migration target.

| Shared concept | Go Product | Yarmarka | Concierge | Spending | Wishimi |
| --- | --- | --- | --- | --- | --- |
| Intake/request | Inquiry with name, contact, source, status, message | Leads/booking/order workflows; order and booking are separate lifecycles | `Lead` is an AI-qualified conversation; `Application` is a converted, consent-bearing business request | `PlanRequest` refers to a specific plan purchase/change | Not a core current module |
| Person/contact | Account has a phone and product roles | Client/contact and staff identities are separate | Contact is visitor/phone/email identity; staff user is an operator | Spending user is account/Telegram-linked end user; staff access is separate | Admin/end user DTO has its own account and subscription fields |
| Chat | No general chat module in this CRM | Chat module exists for product customer workflows | Conversation/message is a core inbox and AI/human interaction | None as a core CRM workflow | Admin `messages` are product messages and should not be assumed to be conversation events |
| Staff | Accounts plus product role assignments | Staff records refer to role IDs / role assignments | Staff users with enum role and active status | Staff/access records and end users are separate | Admin users and product end users require adapters |
| Roles/permissions | Permission catalogs and role→permission summaries from API | Configurable role and permission records exist | Current role is primarily enum based | Access contracts are application owned | Role/features are currently backend strings/flags |
| User preferences | Locale/notification preferences; global language settings are separate | Product settings, branches and tenant configuration | Company settings and AI/widget settings are separate | Account notifications and plan/usage settings | Subscription/product settings are separate from operator UI preferences |
| API credentials | Integration key and MCP key; one-time secret | Integration module is product-specific | Integration-provider configuration | Encryption/integration flows are product-specific | No common API-key feature assumed |

## Important non-equivalences

- Concierge `Lead` and `Application` must remain separate: qualification can create an application and attach consent. A generic `Request` name would lose this lifecycle.
- A `CRMEmployee` is an operator/staff identity, not every end user. Spending and Wishimi end-user DTOs carry billing, usage and product-specific fields that must not be placed on the shared employee model.
- A conversation is a thread; a message is an immutable event in that thread. CRM `messages` feeds and message entities in another product are not interchangeable without checking sender, channel and delivery semantics.
- A role key is not a permission grant. Keep role assignment and permission evaluation service-owned; the contract only standardizes identifiers and presentation shape.
- Product enums, status transition rules, auth/session behavior, storage IDs and locales remain adapters/capabilities owned by each application.

## Candidate contract boundaries

1. Stable primitives: opaque IDs, UTC timestamps, localized API errors, pagination, audit metadata.
2. Reusable platform entities: staff identity, role, permission, employee preference, credential metadata, audit event.
3. Configurable domain families: `Request<TFields>`, `Conversation<TFields>`, `Message<TMetadata>`, `Contact<TFields>`.
4. Product adapters: explicit mapping from snake_case/API DTOs to these contracts; never use the shared types as a database migration by themselves.
