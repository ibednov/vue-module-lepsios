import type { CRMTeamMembersSource } from '../src/index'

/** Example host-owned staff DTO; each consumer maps its own API fields. */
interface StaffDto {
  id: string
  full_name?: string
  email?: string
  role_keys: string[]
  created_at?: string
}

interface StaffApi {
  list(): Promise<StaffDto[]>
}

export function createTeamMembersSource(api: StaffApi): CRMTeamMembersSource {
  return {
    async list() {
      return (await api.list()).map(member => ({
        id: member.id,
        displayName: member.full_name || member.email || '',
        email: member.email,
        roleKeys: member.role_keys,
        createdAt: member.created_at,
      }))
    },
  }
}
