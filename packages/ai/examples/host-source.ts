import type {
  CRMAIProviderConfig,
  CRMAIProviderUpsertInput,
  CRMAIProvidersSource,
} from '../src/index'

/**
 * Stub host source shape. Wire authenticated product API in the host app —
 * this package never embeds product paths or auth.
 */
export const exampleCRMAIProvidersSource: CRMAIProvidersSource = {
  async list(): Promise<CRMAIProviderConfig[]> {
    return []
  },
  async upsert(input: CRMAIProviderUpsertInput): Promise<CRMAIProviderConfig> {
    return {
      id: input.id || 'example-id',
      provider: input.provider,
      model: input.model,
      reasoning_effort: input.reasoning_effort,
      enabled: input.enabled,
      priority: input.priority,
      has_credentials: Boolean(input.credentials),
    }
  },
  async delete(_id: string): Promise<void> {},
}
