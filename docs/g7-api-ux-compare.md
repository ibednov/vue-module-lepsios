# G7 API/UX comparison gate

Compared 2026-11-12 before starting any later feature module. Result: neither
FAQ nor Conversations has enough matching workflow to extract a shared CRM
feature contract. Keep both implementations product-owned.

## FAQ

| Concern | Go Product | Concierge | Gate result |
| --- | --- | --- | --- |
| Purpose | Publish localized FAQ content | Review AI generated suggestions | Different operator workflow |
| Fields | Localized question/answer maps, position, published state | Topic, plain question/answer, tags, occurrence count, pending/approved/rejected status | No stable shared record shape |
| Operations | List, get, create, update, delete | List, edit suggestion, approve, reject | CRUD and moderation contracts differ |

Sources: Go Product `packages/go-product/src/modules/faq/services/faq-service.ts`
and `types/faq.ts`; Concierge `@faq/services/faq-service.ts` and
`types/faq-types.ts`.

## Conversations

| Concern | Concierge | Yarmarka | Gate result |
| --- | --- | --- | --- |
| Purpose | Operator inbox and customer support workflow | Customer support chat | Shared product intent only |
| List | Search, status, pagination, assignment and related lead/task context | Cursor pagination, unread/read state, SSE updates | Query and list state differ |
| Thread actions | Reply, take over, queue/AI handoff, close, assign, lead/task operations | Send/read messages, update read markers, subscribe to events | Action contracts do not align |
| Message roles | Visitor and operator with workflow state | Customer and staff messages | Partial overlap only |

Sources: Concierge `@applications/services/crm-service.ts` and
`@conversations/pages/index.vue` / `[id].vue`; Yarmarka
`chat/services/chat-service.ts`, `stores/chat-store.ts`, and
`types/chat-types.ts`.

## Decision

- Do not create FAQ or Conversations feature packages from these contracts.
- A generic chat/message presentation component may be evaluated separately
  if another concrete consumer needs it; that does not justify a shared
  conversation data module.
- Reopen either gate only after a product adds a second matching workflow and
  the API operations and state transitions are compared again.
