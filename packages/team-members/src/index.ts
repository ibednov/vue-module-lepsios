/** Product-neutral projection of an operator/team account for CRM roster lists. */
export interface CRMTeamMember {
  /** Opaque identifier supplied by the product API. */
  id: string
  /** Main human-readable identity; a host may use email when no name exists. */
  displayName: string
  email?: string
  /** Product-specific identifiers such as Telegram ID, rendered as secondary metadata. */
  identifiers?: Array<{ label: string, value: string }>
  /** A member can hold one or more product-defined role keys. */
  roleKeys: string[]
  createdAt?: string
}

/** Read-only list projection. Hosts retain all write operations and authorization. */
export interface CRMTeamMembersSource {
  list(): Promise<CRMTeamMember[]>
}

export interface CRMTeamMembersLabels {
  identity: string
  email: string
  roles: string
  createdAt: string
  search: string
  loading: string
  empty: string
  previous: string
  next: string
  unnamed?: string
}
