import { readonly, ref } from 'vue'
import type { CRMAuditLogEvent, CRMAuditLogQuery, CRMAuditLogSource } from './index'

export interface UseCRMAuditLogOptions {
  pageSize?: number
  initialQuery?: Partial<Omit<CRMAuditLogQuery, 'page' | 'pageSize'>>
}

/** Shared loading, filtering, paging, and request-race handling for an audit-log screen. */
export function useCRMAuditLog<TPayload = unknown>(
  source: CRMAuditLogSource<TPayload>,
  options: UseCRMAuditLogOptions = {},
) {
  const pageSize = options.pageSize ?? 50
  const query = ref<CRMAuditLogQuery>({
    page: 1,
    pageSize,
    ...options.initialQuery,
  })
  const items = ref<CRMAuditLogEvent<TPayload>[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  let requestSequence = 0

  const refresh = async () => {
    const sequence = ++requestSequence
    loading.value = true
    error.value = null

    try {
      const { page, pageSize, ...filters } = query.value
      const result = await source.list({
        ...filters,
        limit: pageSize,
        offset: (page - 1) * pageSize,
      })
      if (sequence !== requestSequence)
        return
      items.value = result.items
      total.value = result.total
      query.value.page = result.limit > 0 ? Math.floor(result.offset / result.limit) + 1 : 1
      query.value.pageSize = result.limit
    }
    catch (cause) {
      if (sequence !== requestSequence)
        return
      items.value = []
      total.value = 0
      error.value = cause instanceof Error ? cause.message : String(cause)
    }
    finally {
      if (sequence === requestSequence)
        loading.value = false
    }
  }

  const setFilters = async (filters: Partial<Omit<CRMAuditLogQuery, 'page' | 'pageSize'>>) => {
    query.value = { ...query.value, ...filters, page: 1 }
    await refresh()
  }

  const setPage = async (page: number) => {
    const totalPages = Math.max(1, Math.ceil(total.value / query.value.pageSize))
    if (!Number.isInteger(page) || page < 1 || page > totalPages || page === query.value.page)
      return
    query.value.page = page
    await refresh()
  }

  return {
    query: readonly(query),
    items: readonly(items),
    total: readonly(total),
    loading: readonly(loading),
    error: readonly(error),
    refresh,
    setFilters,
    setPage,
  }
}
