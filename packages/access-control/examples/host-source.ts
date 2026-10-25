import type { CRMAccessControlSource } from '../src/index'

/** Example host-owned role DTO; each consumer maps its own API fields. */
interface RoleDto {
  name: string
  permissions: string[]
}

interface AccessApi {
  listRoles(): Promise<RoleDto[]>
}

export function createAccessControlSource(api: AccessApi): CRMAccessControlSource {
  return {
    async listRoles() {
      return (await api.listRoles()).map(role => ({
        roleKey: role.name,
        permissionKeys: role.permissions,
      }))
    },
  }
}
