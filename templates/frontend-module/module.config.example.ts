export type ListView = 'table' | 'kanban'

export interface ModuleConfig<TStatus extends string> {
  entity: string
  routes: { list: string, create?: string, detail: string }
  views: readonly ListView[]
  defaultView: ListView
  statuses: readonly TStatus[]
  permissions: { read: string, create?: string, update?: string }
}

export const leadModule = {
  entity: 'lead',
  routes: { list: '/leads/', detail: '/leads/:id/' },
  views: ['table', 'kanban'],
  defaultView: 'table',
  statuses: ['new', 'in_conversation', 'contact_requested', 'abandoned', 'converted', 'closed'],
  permissions: { read: 'leads.read', update: 'leads.update' },
} as const satisfies ModuleConfig<'new' | 'in_conversation' | 'contact_requested' | 'abandoned' | 'converted' | 'closed'>

export const applicationModule = {
  entity: 'application',
  routes: { list: '/applications/', detail: '/applications/:id/' },
  views: ['table'],
  defaultView: 'table',
  statuses: ['new', 'in_progress', 'contacted', 'won', 'lost'],
  permissions: { read: 'applications.read', update: 'applications.update' },
} as const satisfies ModuleConfig<'new' | 'in_progress' | 'contacted' | 'won' | 'lost'>

// Keep the route config product-specific. In Concierge, Applications are created
// by converting a qualified Lead after consent, not via manual CRUD.
