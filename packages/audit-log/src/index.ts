export type CRMAuditLogId = string

export interface CRMAuditLogActor {
  id?: CRMAuditLogId | null
  kind?: string
  name?: string
  email?: string
}

export interface CRMAuditLogTarget {
  type: string
  id?: CRMAuditLogId | null
  label?: string
}

/** Product-neutral view of one immutable event from a host's audit API. */
export interface CRMAuditLogEvent<TPayload = unknown> {
  id: CRMAuditLogId
  action: string
  actor?: CRMAuditLogActor | null
  target?: CRMAuditLogTarget | null
  payload?: TPayload
  occurredAt: string
}

export interface CRMAuditLogQuery {
  page: number
  pageSize: number
  from?: string
  to?: string
  action?: string
  actorKind?: string
  actorId?: CRMAuditLogId
  targetType?: string
  targetId?: CRMAuditLogId
}

export interface CRMAuditLogPage<TPayload = unknown> {
  items: CRMAuditLogEvent<TPayload>[]
  page: number
  pageSize: number
  total: number
}

/** Implement in the host so authentication, endpoint details, and DTO mapping stay product-owned. */
export interface CRMAuditLogAdapter<TPayload = unknown> {
  list(query: CRMAuditLogQuery): Promise<CRMAuditLogPage<TPayload>>
}

/** Host-provided authorization check; UI visibility does not replace server-side authorization. */
export interface CRMAuditLogAccess {
  canRead(): boolean
}
