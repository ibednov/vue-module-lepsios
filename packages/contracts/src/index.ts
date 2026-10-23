export type EntityId = string
export type ISODateTime = string
export type LocaleCode = string
export type ExtensionFields = Record<string, unknown>

export interface CRMContact {
  id?: EntityId
  name?: string
  email?: string
  phone?: string
  externalId?: string
}

export interface CRMRequest<TFields extends ExtensionFields = ExtensionFields> {
  id: EntityId
  title: string
  description?: string
  status: string
  contact: CRMContact
  source?: string
  assigneeId?: EntityId | null
  tags?: string[]
  customFields?: TFields
  createdAt: ISODateTime
  updatedAt?: ISODateTime
  closedAt?: ISODateTime | null
}

export interface CRMConversation<TFields extends ExtensionFields = ExtensionFields> {
  id: EntityId
  contact: CRMContact
  status: string
  channel: string
  assigneeId?: EntityId | null
  customFields?: TFields
  createdAt: ISODateTime
  updatedAt?: ISODateTime
  lastMessageAt?: ISODateTime | null
}

export interface CRMMessage {
  id: EntityId
  conversationId: EntityId
  senderId?: EntityId | null
  senderType: 'contact' | 'employee' | 'system' | 'agent'
  text?: string
  attachments?: CRMFileReference[]
  metadata?: ExtensionFields
  createdAt: ISODateTime
}

export interface CRMFileReference {
  id?: EntityId
  name: string
  url?: string
  mimeType?: string
  size?: number
}

export interface CRMUserPreferences {
  userId: EntityId
  locale?: LocaleCode
  timezone?: string
  notifications?: Record<string, boolean>
  tablePreferences?: Record<string, { visibleColumns?: string[], pageSize?: number }>
  customFields?: ExtensionFields
  updatedAt?: ISODateTime
}

export interface CRMRole {
  id: EntityId
  key: string
  name: string
  description?: string
  permissionKeys: string[]
  isSystem?: boolean
  customFields?: ExtensionFields
}

export interface CRMPermission {
  key: string
  resource: string
  action: string
  description?: string
}

export interface CRMEmployee {
  id: EntityId
  userId?: EntityId
  name: string
  email?: string
  phone?: string
  roleKeys: string[]
  active: boolean
  customFields?: ExtensionFields
  createdAt: ISODateTime
  updatedAt?: ISODateTime
}

export interface CRMApiKeyMetadata {
  id: EntityId
  label: string
  prefix?: string
  status: 'active' | 'revoked' | 'expired'
  scopes?: string[]
  createdById?: EntityId
  createdAt: ISODateTime
  lastUsedAt?: ISODateTime | null
  expiresAt?: ISODateTime | null
}

export interface CRMApiKeyIssued {
  key: CRMApiKeyMetadata
  /** Returned once by creation/rotation; never stored or returned by list APIs. */
  secret: string
}

export interface CRMAuditEvent {
  id: EntityId
  actorId?: EntityId | null
  action: string
  resource: string
  resourceId?: EntityId
  changes?: ExtensionFields
  createdAt: ISODateTime
}

export interface CRMPage<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  hasMore?: boolean
}

export interface CRMError {
  error: string
  message: string
  code: number
  details?: { request_id?: string, [key: string]: unknown }
}
