export type CRMAIProviderType = 'gigachat' | 'yandex' | 'openrouter' | 'openai'
export type CRMAIReasoningEffort = 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh' | 'max'

export interface CRMAIProviderConfig {
  id: string
  provider: CRMAIProviderType | string
  model: string
  reasoning_effort: CRMAIReasoningEffort | string
  enabled: boolean
  priority: number
  has_credentials: boolean
  updated_at?: string
}

export interface CRMAICredentials {
  authorization_key?: string
  api_key?: string
  folder_id?: string
  openrouter_api_key?: string
  openai_api_key?: string
}

export interface CRMAIProviderUpsertInput {
  /** Empty/omit = create */
  id?: string
  provider: string
  model: string
  reasoning_effort: string
  enabled: boolean
  priority: number
  /** Omit = keep existing on update */
  credentials?: CRMAICredentials
}

/** Host supplies authenticated product API. */
export interface CRMAIProvidersSource {
  list(): Promise<CRMAIProviderConfig[]>
  upsert(input: CRMAIProviderUpsertInput): Promise<CRMAIProviderConfig>
  delete(id: string): Promise<void>
}

/** All UI strings come from host i18n — package has no product copy. */
export interface CRMAIProvidersLabels {
  title: string
  description: string
  add: string
  edit: string
  delete: string
  save: string
  cancel: string
  confirmDelete: string
  confirmDeleteBody: string
  provider: string
  model: string
  reasoningEffort: string
  priority: string
  enabled: string
  credentials: string
  hasCredentials: string
  noCredentials: string
  loading: string
  empty: string
  errorLoad: string
  errorSave: string
  errorDelete: string
  providerGigaChat: string
  providerYandex: string
  providerOpenRouter: string
  providerOpenAI: string
  secretAuthorizationKey: string
  secretApiKey: string
  secretFolderId: string
  secretOpenRouter: string
  secretOpenAI: string
  secretHintKeep: string
  yandexBothRequired: string
  retry: string
  actions: string
  enabledYes: string
  enabledNo: string
  reasoningNone: string
  reasoningMinimal: string
  reasoningLow: string
  reasoningMedium: string
  reasoningHigh: string
  reasoningXhigh: string
  reasoningMax: string
}
