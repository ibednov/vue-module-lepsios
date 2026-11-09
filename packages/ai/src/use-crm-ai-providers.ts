import { computed, readonly, ref } from 'vue'
import type {
  CRMAIProviderConfig,
  CRMAIProviderUpsertInput,
  CRMAIProvidersSource,
} from './index'

const sortProviders = (items: CRMAIProviderConfig[]) =>
  [...items].sort((a, b) => {
    if (a.priority !== b.priority)
      return a.priority - b.priority
    return a.id.localeCompare(b.id)
  })

/** Shared list/upsert/delete state with request-race protection for AI provider screens. */
export function useCRMAIProviders(source: CRMAIProvidersSource) {
  const items = ref<CRMAIProviderConfig[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const busyId = ref<string | null>(null)
  const error = ref<string | null>(null)
  let requestSequence = 0

  const sortedItems = computed(() => sortProviders(items.value))

  const refresh = async () => {
    const sequence = ++requestSequence
    loading.value = true
    error.value = null
    try {
      const list = await source.list()
      if (sequence !== requestSequence)
        return
      items.value = sortProviders(list)
    }
    catch (cause) {
      if (sequence !== requestSequence)
        return
      items.value = []
      error.value = cause instanceof Error ? cause.message : String(cause)
    }
    finally {
      if (sequence === requestSequence)
        loading.value = false
    }
  }

  const upsert = async (input: CRMAIProviderUpsertInput) => {
    saving.value = true
    busyId.value = input.id?.trim() || null
    error.value = null
    try {
      const saved = await source.upsert(input)
      const next = items.value.filter(item => item.id !== saved.id)
      next.push(saved)
      items.value = sortProviders(next)
      return saved
    }
    catch (cause) {
      error.value = cause instanceof Error ? cause.message : String(cause)
      throw cause
    }
    finally {
      saving.value = false
      busyId.value = null
    }
  }

  const remove = async (id: string) => {
    saving.value = true
    busyId.value = id
    error.value = null
    try {
      await source.delete(id)
      items.value = items.value.filter(item => item.id !== id)
    }
    catch (cause) {
      error.value = cause instanceof Error ? cause.message : String(cause)
      throw cause
    }
    finally {
      saving.value = false
      busyId.value = null
    }
  }

  return {
    items: readonly(items),
    sortedItems,
    loading: readonly(loading),
    saving: readonly(saving),
    busyId: readonly(busyId),
    error: readonly(error),
    refresh,
    upsert,
    remove,
  }
}
