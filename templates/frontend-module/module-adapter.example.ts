import type { CRMPage } from '../../packages/contracts/src/index'

/** The adapter maps a product API into UI-friendly module operations. */
export interface EntityListParams {
  query?: string
  status?: string
  page: number
  pageSize: number
}

export interface EntityModuleAdapter<TItem, TCreateInput> {
  list(params: EntityListParams): Promise<CRMPage<TItem>>
  create(input: TCreateInput): Promise<TItem>
  /** Implement only if the product API supports status transitions. */
  updateStatus?(id: string, status: string): Promise<TItem>
}
