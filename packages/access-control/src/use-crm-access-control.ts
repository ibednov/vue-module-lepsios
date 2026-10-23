import { readonly, ref } from 'vue'
import type { CRMAccessControlSource, CRMAccessRole } from './index'

/** Shared loading and error state for read-only role/permission catalogs. */
export function useCRMAccessControl(source: CRMAccessControlSource) {
  const roles = ref<CRMAccessRole[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let sequence = 0

  const refresh = async () => {
    const request = ++sequence
    loading.value = true
    error.value = null
    try {
      const result = await source.listRoles()
      if (request === sequence)
        roles.value = result
    }
    catch (cause) {
      if (request === sequence)
        error.value = cause instanceof Error ? cause.message : String(cause)
    }
    finally {
      if (request === sequence)
        loading.value = false
    }
  }

  return { roles: readonly(roles), loading: readonly(loading), error: readonly(error), refresh }
}
