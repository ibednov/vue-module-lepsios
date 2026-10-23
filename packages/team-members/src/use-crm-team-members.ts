import { readonly, ref } from 'vue'
import type { CRMTeamMember, CRMTeamMembersSource } from './index'

/** Loads the shared roster projection while leaving permissions and writes to the host. */
export function useCRMTeamMembers(source: CRMTeamMembersSource) {
  const members = ref<CRMTeamMember[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let sequence = 0

  const refresh = async () => {
    const request = ++sequence
    loading.value = true
    error.value = null
    try {
      const result = await source.list()
      if (request === sequence)
        members.value = result
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

  return { members: readonly(members), loading: readonly(loading), error: readonly(error), refresh }
}
