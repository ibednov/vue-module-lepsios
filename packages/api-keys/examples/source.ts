import type { CRMApiKeysSource } from '../src'

/** The host closes over its owner scope, auth/session, locale, and service functions. */
export function createApiKeysSource(api: {
  list(): Promise<unknown>
  create(label: string): Promise<unknown>
  revoke(id: string): Promise<void>
}): CRMApiKeysSource {
  return {
    async list() {
      return mapList(await api.list())
    },
    async create({ label }) {
      return mapIssued(await api.create(label))
    },
    revoke: id => api.revoke(id),
  }
}

function mapList(value: unknown) {
  if (!Array.isArray(value))
    throw new Error('API key list response must be an array')
  return value.map((record) => {
    if (!record || typeof record !== 'object')
      throw new Error('API key list item must be an object')
    const key = record as Record<string, unknown>
    return {
      id: String(key.id ?? ''),
      label: String(key.label ?? ''),
      active: Boolean(key.active),
      createdAt: String(key.createdAt ?? key.created_at ?? ''),
      lastUsedAt: (key.lastUsedAt ?? key.last_used_at ?? null) as string | null,
      revokedAt: (key.revokedAt ?? key.revoked_at ?? null) as string | null,
    }
  })
}

function mapIssued(value: unknown) {
  if (!value || typeof value !== 'object')
    throw new Error('API key create response must be an object')
  const record = value as Record<string, unknown>
  if (typeof record.secret !== 'string' || !record.secret)
    throw new Error('API key create response did not contain its one-time secret')
  return {
    id: String(record.id ?? ''),
    label: String(record.label ?? ''),
    active: Boolean(record.active),
    createdAt: String(record.createdAt ?? record.created_at ?? ''),
    lastUsedAt: (record.lastUsedAt ?? record.last_used_at ?? null) as string | null,
    revokedAt: (record.revokedAt ?? record.revoked_at ?? null) as string | null,
    secret: record.secret,
  }
}
