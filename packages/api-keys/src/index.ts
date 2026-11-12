/** Product-neutral, one-time-secret API key contract. Secrets never appear in list records. */
export interface CRMApiKey {
  id: string
  label: string
  active: boolean
  createdAt: string
  lastUsedAt?: string | null
  revokedAt?: string | null
}

export interface CRMApiKeyIssue extends CRMApiKey {
  /** Returned by create only. Hosts must never fetch or persist it again. */
  secret: string
}

export interface CRMApiKeysSource {
  list(): Promise<CRMApiKey[]>
  create(input: { label: string }): Promise<CRMApiKeyIssue>
  revoke(id: string): Promise<void>
}

export interface CRMApiKeysLabels {
  label: string
  status: string
  created: string
  lastUsed: string
  active: string
  revoked: string
  loading: string
  empty: string
  loadError: string
  retry: string
  create: string
  createTitle: string
  labelPlaceholder: string
  cancel: string
  revoke: string
  revokeConfirm: string
  secretShownOnce: string
  secret: string
  closeSecret: string
}
