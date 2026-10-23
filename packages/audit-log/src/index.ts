export type CRMAuditLogId = string

/** Wire event defined by go-lepsios/audit's shared HTTP contract. */
export interface CRMAuditLogEvent<TPayload = unknown> {
  id: CRMAuditLogId
  type: string
  actor_id: string
  actor_kind: string
  actor_email?: string
  target_type: string
  target_id: string
  payload: TPayload
  occurred_at: string
}

/** UI state uses page numbering; the shared API contract uses limit/offset. */
export interface CRMAuditLogQuery {
  page: number
  pageSize: number
  from?: string
  to?: string
  type?: string
  actor_kind?: string
  actor_id?: CRMAuditLogId
  target_type?: string
  target_id?: CRMAuditLogId
}

export interface CRMAuditLogListQuery {
  limit: number
  offset: number
  from?: string
  to?: string
  type?: string
  actor_kind?: string
  actor_id?: CRMAuditLogId
  target_type?: string
  target_id?: CRMAuditLogId
}

export interface CRMAuditLogListData<TPayload = unknown> {
  items: CRMAuditLogEvent<TPayload>[]
  total: number
  limit: number
  offset: number
}

/** Host supplies its authenticated API call; returned data follows go-lepsios/audit. */
export interface CRMAuditLogSource<TPayload = unknown> {
  list(query: CRMAuditLogListQuery): Promise<CRMAuditLogListData<TPayload>>
}

/** Host-provided authorization check; UI visibility does not replace server-side authorization. */
export interface CRMAuditLogAccess {
  canRead(): boolean
}

export interface CRMAuditLogLabels {
  time: string
  action: string
  actor: string
  target: string
  details: string
  applyFilters: string
  resetFilters: string
  loading: string
  empty: string
  previousPage: string
  nextPage: string
}

export interface CRMAuditLogFilterField {
  key: keyof Omit<CRMAuditLogQuery, 'page' | 'pageSize'>
  label: string
  type?: 'date' | 'select' | 'text'
  placeholder?: string
  options?: Array<{ value: string, label: string }>
}
