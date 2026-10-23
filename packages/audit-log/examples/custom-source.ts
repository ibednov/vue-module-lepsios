import type {
  CRMAuditLogEvent,
  CRMAuditLogListData,
  CRMAuditLogListQuery,
  CRMAuditLogSource,
} from '../src/index'

/** Example legacy response owned by a host product, not by the shared module. */
interface LegacyAuditEvent {
  id: number
  action: string
  actor_id: string
  actor_email?: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown>
  created_at: string
}

interface LegacyAuditPage {
  items: LegacyAuditEvent[]
  total: number
  page: number
  limit: number
}

interface LegacyAuditAPI {
  list(query: {
    page: number
    limit: number
    action?: string
    from?: string
    to?: string
  }): Promise<LegacyAuditPage>
}

/**
 * Copy and adapt this pattern beside a host's API client when its backend has
 * not adopted the shared go-lepsios/audit wire contract yet.
 */
export function createLegacyAuditSource(api: LegacyAuditAPI): CRMAuditLogSource {
  return {
    async list(query: CRMAuditLogListQuery): Promise<CRMAuditLogListData> {
      const page = query.limit > 0 ? Math.floor(query.offset / query.limit) + 1 : 1
      const result = await api.list({
        page,
        limit: query.limit,
        action: query.type,
        from: query.from,
        to: query.to,
      })

      const items: CRMAuditLogEvent[] = result.items.map(event => ({
        id: String(event.id),
        type: event.action,
        actor_id: event.actor_id,
        actor_kind: 'admin',
        actor_email: event.actor_email,
        target_type: event.entity_type,
        target_id: event.entity_id,
        payload: event.metadata,
        occurred_at: event.created_at,
      }))

      return {
        items,
        total: result.total,
        limit: result.limit,
        offset: (result.page - 1) * result.limit,
      }
    },
  }
}
