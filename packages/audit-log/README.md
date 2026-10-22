# @lepsios/crm-audit-log

Framework-agnostic contracts for a global CRM audit log. The package defines the boundary between a shared audit-log feature and each product's API; it does not define event names, permissions, storage, or product-specific filters.

Each host maps its API DTOs to `CRMAuditLogEvent` and implements `CRMAuditLogAdapter`. Keep the original event payload intact so a product can render or inspect its own metadata.

Concierge's global admin audit feed and Wishimi's global admin audit feed both fit this boundary. Their API filters and pagination differ, so the host adapter translates `CRMAuditLogQuery`. Spending's per-user activity and Go Product's per-record histories are not global audit logs and are not represented by this package.
