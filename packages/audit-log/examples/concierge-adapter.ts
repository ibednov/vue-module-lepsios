import type { CRMAuditLogAdapter, CRMAuditLogEvent, CRMAuditLogQuery } from '../src/index'

export interface ConciergeAuditDto {
  id: string
  actor_id: string
  actor_email: string
  action: string
  entity_type: string
  entity_id: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface ConciergeAuditService {
  audit(query: {
    page: number
    limit: number
    action?: string
    from?: string
    to?: string
  }): Promise<{ items: ConciergeAuditDto[], total: number, page: number, limit: number }>
}

export function createConciergeAuditAdapter(service: ConciergeAuditService): CRMAuditLogAdapter<Record<string, unknown>> {
  return {
    async list(query: CRMAuditLogQuery) {
      const result = await service.audit({
        page: query.page,
        limit: query.pageSize,
        action: query.action,
        from: query.from,
        to: query.to,
      })
      const items: CRMAuditLogEvent<Record<string, unknown>>[] = result.items.map(event => ({
        id: event.id,
        action: event.action,
        actor: { id: event.actor_id, email: event.actor_email },
        target: { type: event.entity_type, id: event.entity_id },
        payload: event.metadata,
        occurredAt: event.created_at,
      }))
      return { items, total: result.total, page: result.page, pageSize: result.limit }
    },
  }
}
