# Audit log candidate assessment

Reviewed on 2026-10-23 across the four first-wave CRM consumers.

| CRM | Existing behavior | Match to a global audit log |
| --- | --- | --- |
| Concierge | `/api/v1/admin/audit`, date range and action filters, page/limit pagination; events have actor ID/email, action, entity type/ID, metadata and creation time. Navigation is restricted to owner/admin, and the API remains responsible for authorization. | Yes |
| Wishimi | `/admin/audit-events`, offset/limit pagination; filters include actor kind/ID, event type and target type/ID. Events have actor and target identifiers, payload and occurrence time. | Yes |
| Spending | User activity remains attached to individual spending records. A separate global feed now records successful writes through permission-protected CRM routes. | Yes for the new global endpoint. Preserve user activity as a separate domain timeline. |
| Go Product CRM | Proposal detail retains its own timeline. A separate global feed now combines backfilled proposal/MCP events with successful CRM API writes. | Yes for the new global endpoint. Preserve proposal activity as a separate domain timeline. |

## Shared boundary

`@lepsios/crm-audit-log` standardizes only the normalized event, query/page, adapter, and read-access contracts. The host owns authentication, endpoint calls, permission enforcement, translations, event labels, and mapping from its DTO. API-specific filters are optional in the normalized query and may be ignored when an endpoint does not support them. The original payload stays opaque and is not interpreted by the shared contract.

The package ships a reusable CRM audit view and paging/filter state. Its table, inputs, and buttons come from `vue-lepsios`; each host supplies the authenticated source, labels, filters, and permission gating. All four CRM hosts now have a global endpoint to integrate. Entity activity remains separate from this module.

## Compatibility notes

- Map numeric and string API identifiers to opaque strings.
- Map Concierge's `action/entity_type/entity_id/metadata/created_at` and Wishimi's `type/target_type/target_id/payload/occurred_at` in their respective host adapters.
- Preserve actor kind and labels when present; they are optional because existing feeds provide different actor details.
- Use one-based page numbers in the feature contract; adapters translate Wishimi's offset-based API.
- Keep authorization checks server-side. The shared access contract is for host integration and UI gating only.
