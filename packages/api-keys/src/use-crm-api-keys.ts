import { readonly, ref } from 'vue'
import type { CRMApiKey, CRMApiKeyIssue, CRMApiKeysSource } from './index'

/** Shared API key screen state. Authentication, owner context, and refresh policy remain host-owned. */
export function useCRMApiKeys(source: CRMApiKeysSource) {
  const keys = ref<CRMApiKey[]>([])
  const loading = ref(false)
  const busy = ref(false)
  const error = ref<string | null>(null)
  const issued = ref<CRMApiKeyIssue | null>(null)
  let requestSequence = 0

  const refresh = async () => {
    const sequence = ++requestSequence
    loading.value = true
    error.value = null
    try {
      const result = await source.list()
      if (sequence === requestSequence)
        keys.value = result
    }
    catch (cause) {
      if (sequence === requestSequence) {
        keys.value = []
        error.value = cause instanceof Error ? cause.message : String(cause)
      }
    }
    finally {
      if (sequence === requestSequence)
        loading.value = false
    }
  }

  const create = async (label: string) => {
    const normalizedLabel = label.trim()
    if (!normalizedLabel)
      return null
    busy.value = true
    error.value = null
    try {
      issued.value = await source.create({ label: normalizedLabel })
      return issued.value
    }
    catch (cause) {
      error.value = cause instanceof Error ? cause.message : String(cause)
      return null
    }
    finally {
      busy.value = false
    }
  }

  const revoke = async (id: string) => {
    busy.value = true
    error.value = null
    try {
      await source.revoke(id)
      keys.value = keys.value.map(key => key.id === id ? { ...key, active: false } : key)
      return true
    }
    catch (cause) {
      error.value = cause instanceof Error ? cause.message : String(cause)
      return false
    }
    finally {
      busy.value = false
    }
  }

  const clearIssued = () => {
    issued.value = null
  }

  return {
    keys: readonly(keys),
    loading: readonly(loading),
    busy: readonly(busy),
    error: readonly(error),
    issued: readonly(issued),
    refresh,
    create,
    revoke,
    clearIssued,
  }
}
