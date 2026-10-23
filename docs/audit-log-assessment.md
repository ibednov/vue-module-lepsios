# Audit log candidate assessment

Reviewed on 2026-10-23 across the four first-wave CRM consumers.

| CRM | Existing behavior | Match to a global audit log |
| --- | --- | --- |
| Concierge | `/api/v1/admin/audit`, date range and action filters, page/limit pagination; events have actor ID/email, action, entity type/ID, metadata and creation time. Navigation is restricted to owner/admin, and the API remains responsible for authorization. | Yes |
| Wishimi | `/admin/audit-events`, offset/limit pagination; filters include actor kind/ID, event type and target type/ID. Events have actor and target identifiers, payload and occurrence time. | Yes |
| Spending | Activity feed is attached to an individual user's spending record. | No; keep within the user detail feature unless a global audit feed is found. |
| Go Product CRM | Histories are attached to inquiry or commercial proposal detail records. | No; these are entity timelines, not a global audit feed. |

## Shared boundary

`@lepsios/crm-audit-log` standardizes only the normalized event, query/page, adapter, and read-access contracts. The host owns authentication, endpoint calls, permission enforcement, translations, event labels, and mapping from its DTO. API-specific filters are optional in the normalized query and may be ignored when an endpoint does not support them. The original payload stays opaque and is not interpreted by the shared contract.

The package ships a reusable CRM audit view and paging/filter state. Its table, inputs, and buttons come from `vue-lepsios`; each host supplies the authenticated source, labels, filters, and permission gating. Concierge and Wishimi are the confirmed first integrations. Do not migrate Spending or Go Product histories to this module without evidence of a global feed with matching semantics.

## Compatibility notes

- Map numeric and string API identifiers to opaque strings.
- Map Concierge's `action/entity_type/entity_id/metadata/created_at` and Wishimi's `type/target_type/target_id/payload/occurred_at` in their respective host adapters.
- Preserve actor kind and labels when present; they are optional because existing feeds provide different actor details.
- Use one-based page numbers in the feature contract; adapters translate Wishimi's offset-based API.
- Keep authorization checks server-side. The shared access contract is for host integration and UI gating only.
