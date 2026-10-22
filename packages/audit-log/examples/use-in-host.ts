import { useCRMAuditLog } from '../src/use-crm-audit-log'
import { createWishimiAuditAdapter } from './wishimi-adapter'
import type { WishimiAuditService } from './wishimi-adapter'

/** Called from the host page's setup(); the service wraps its existing auth-aware API client. */
export function setupWishimiAuditLog(service: WishimiAuditService) {
  const audit = useCRMAuditLog(createWishimiAuditAdapter(service), { pageSize: 50 })
  void audit.refresh()

  return {
    audit,
    applyActorFilter: (actorKind: string) => audit.setFilters({ actorKind: actorKind || undefined }),
    openPage: (page: number) => audit.setPage(page),
  }
}

export const wishimiAuditFilters = [
  { key: 'actorKind', label: 'Actor kind' },
  { key: 'action', label: 'Event type', placeholder: 'admin.user.*' },
  { key: 'actorId', label: 'Actor ID' },
  { key: 'targetType', label: 'Target type' },
  { key: 'targetId', label: 'Target ID' },
] as const

export const conciergeAuditFilters = [
  { key: 'from', label: 'From', type: 'date' },
  { key: 'to', label: 'To', type: 'date' },
  { key: 'action', label: 'Action' },
] as const
