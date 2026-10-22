import type { CRMAuditLogAdapter, CRMAuditLogEvent, CRMAuditLogQuery } from '../src/index'

export interface WishimiAuditDto {
  id: number
  type: string
  actor_id: string
  actor_kind: string
  target_type: string
  target_id: string
  payload: unknown
  occurred_at: string
}

export interface WishimiAuditService {
  listAudit(query: {
    limit: number
    offset: number
    actor_kind?: string
    type?: string
    actor_id?: string
    target_type?: string
    target_id?: string
  }): Promise<{
    data?: { items: WishimiAuditDto[], total: number, limit: number, offset: number }
    error?: string | null
  }>
}

export function createWishimiAuditAdapter(service: WishimiAuditService): CRMAuditLogAdapter {
  return {
    async list(query: CRMAuditLogQuery) {
      const result = await service.listAudit({
        limit: query.pageSize,
        offset: (query.page - 1) * query.pageSize,
        actor_kind: query.actorKind,
        type: query.action,
        actor_id: query.actorId,
        target_type: query.targetType,
        target_id: query.targetId,
      })
      if (result.error)
        throw new Error(result.error)
      const data = result.data ?? { items: [], total: 0, limit: query.pageSize, offset: 0 }
      const items: CRMAuditLogEvent[] = data.items.map(event => ({
        id: String(event.id),
        action: event.type,
        actor: { id: event.actor_id, kind: event.actor_kind },
        target: { type: event.target_type, id: event.target_id },
        payload: event.payload,
        occurredAt: event.occurred_at,
      }))
      return {
        items,
        total: data.total,
        page: Math.floor(data.offset / data.limit) + 1,
        pageSize: data.limit,
      }
    },
  }
}
