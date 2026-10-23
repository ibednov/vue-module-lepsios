/** Role keys and permission keys keep the vocabulary owned by each product API. */
export interface CRMAccessRole {
  roleKey: string
  permissionKeys: string[]
}

export interface CRMAccessControlSource {
  listRoles(): Promise<CRMAccessRole[]>
}

export interface CRMAccessControlLabels {
  rolesTitle: string
  permissionsTitle: string
  permissionCount: string
  emptyRoles: string
  emptyPermissions: string
  loading: string
}
