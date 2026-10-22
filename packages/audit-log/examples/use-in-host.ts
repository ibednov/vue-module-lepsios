import { useCRMAuditLog } from '../src/use-crm-audit-log'
import type { CRMAuditLogSource } from '../src/index'

/** Pass the host's authenticated client; its response follows go-lepsios/audit. */
export function setupAuditLog(source: CRMAuditLogSource) {
  const audit = useCRMAuditLog(source, { pageSize: 50 })
  void audit.refresh()

  return {
    audit,
    filterByActor: (actor_kind: string) => audit.setFilters({ actor_kind: actor_kind || undefined }),
    openPage: (page: number) => audit.setPage(page),
  }
}

export const auditLogFilters = [
  { key: 'actor_kind', label: 'Actor kind' },
  { key: 'type', label: 'Event type', placeholder: 'admin.user.*' },
  { key: 'actor_id', label: 'Actor ID' },
  { key: 'target_type', label: 'Target type' },
  { key: 'target_id', label: 'Target ID' },
] as const
