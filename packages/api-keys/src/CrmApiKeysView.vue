<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue'
import { CrmDataTable } from '@lepsios/vue'
import type { ColumnDef } from '@tanstack/vue-table'
import { Badge } from '@lepsios/vue/components/ui/badge'
import { Button } from '@lepsios/vue/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@lepsios/vue/components/ui/dialog'
import { Input } from '@lepsios/vue/components/ui/input'
import type { CRMApiKey, CRMApiKeysLabels, CRMApiKeysSource } from './index'
import { useCRMApiKeys } from './use-crm-api-keys'

const props = defineProps<{
  source: CRMApiKeysSource
  labels: CRMApiKeysLabels
  canManage: boolean
  enabled?: boolean
  formatDate?: (value?: string | null) => string
}>()

const emit = defineEmits<{
  created: [key: CRMApiKey]
  revoked: [key: CRMApiKey]
}>()

const state = useCRMApiKeys(props.source)
const createOpen = ref(false)
const label = ref('')
const pendingRevoke = ref<CRMApiKey | null>(null)
const columns = computed<ColumnDef<CRMApiKey, unknown>[]>(() => [
  { accessorKey: 'label', header: props.labels.label },
  { accessorKey: 'id', header: props.labels.keyId, cell: ({ row }) => h('span', { class: 'font-mono text-xs' }, row.original.id) },
  { accessorKey: 'createdAt', header: props.labels.created, cell: ({ row }) => props.formatDate?.(row.original.createdAt) ?? row.original.createdAt },
  { accessorKey: 'lastUsedAt', header: props.labels.lastUsed, cell: ({ row }) => props.formatDate?.(row.original.lastUsedAt) ?? row.original.lastUsedAt ?? '' },
  { id: 'status', header: props.labels.status, cell: ({ row }) => h(Badge, { variant: row.original.active ? 'default' : 'outline' }, () => row.original.active ? props.labels.active : props.labels.revoked) },
  {
    id: 'actions',
    header: props.labels.actions,
    cell: ({ row }) => props.canManage && row.original.active
      ? h(Button, { variant: 'ghost', disabled: state.busy.value, onClick: () => pendingRevoke.value = row.original }, () => props.labels.revoke)
      : null,
  },
])

const submit = async () => {
  const result = await state.create(label.value)
  if (result) {
    createOpen.value = false
    label.value = ''
    emit('created', result)
    void state.refresh()
  }
}

const revoke = async () => {
  const key = pendingRevoke.value
  if (key && await state.revoke(key.id)) {
    pendingRevoke.value = null
    emit('revoked', key)
  }
}

const dismissIssued = () => state.clearIssued()

onMounted(() => {
  if (props.enabled !== false)
    void state.refresh()
})

defineExpose({ refresh: state.refresh, clearIssued: state.clearIssued })
</script>

<template>
  <section class="flex flex-col gap-4">
    <CrmDataTable
      :data="[...state.keys.value]"
      :columns="columns"
      :loading="state.loading.value"
      :error="state.error.value ?? ''"
      :empty="!state.keys.value.length"
      :loading-text="labels.loading"
      :empty-text="labels.empty"
      :get-row-id="row => row.id"
    >
      <template #toolbar>
        <Button v-if="canManage" @click="createOpen = true">{{ labels.create }}</Button>
      </template>
      <template #error="{ error }">
        <div class="flex flex-wrap items-center justify-center gap-3 p-4 text-sm text-destructive" role="alert">
          <span>{{ labels.loadError }}: {{ error }}</span>
          <Button variant="outline" size="sm" @click="state.refresh">{{ labels.retry }}</Button>
        </div>
      </template>
    </CrmDataTable>

    <Dialog v-model:open="createOpen">
      <DialogContent>
        <DialogHeader><DialogTitle>{{ labels.createTitle }}</DialogTitle></DialogHeader>
        <label class="grid gap-2 text-sm">
          <span>{{ labels.label }}</span>
          <Input v-model="label" maxlength="120" :placeholder="labels.labelPlaceholder" />
        </label>
        <p v-if="state.error.value" role="alert" class="text-sm text-destructive">{{ state.error.value }}</p>
        <DialogFooter>
          <Button variant="outline" :disabled="state.busy.value" @click="createOpen = false">{{ labels.cancel }}</Button>
          <Button :disabled="state.busy.value || !label.trim()" @click="submit">{{ labels.create }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="!!pendingRevoke" @update:open="open => !open && (pendingRevoke = null)">
      <DialogContent>
        <DialogHeader><DialogTitle>{{ labels.revokeConfirm }}</DialogTitle></DialogHeader>
        <p v-if="state.error.value" role="alert" class="text-sm text-destructive">{{ state.error.value }}</p>
        <DialogFooter>
          <Button variant="outline" :disabled="state.busy.value" @click="pendingRevoke = null">{{ labels.cancel }}</Button>
          <Button variant="destructive" :disabled="state.busy.value" @click="revoke">{{ labels.revoke }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog :open="!!state.issued.value" @update:open="open => !open && dismissIssued()">
      <DialogContent>
        <DialogHeader><DialogTitle>{{ labels.secretShownOnce }}</DialogTitle></DialogHeader>
        <div v-if="state.issued.value" class="grid gap-2 break-all rounded-md border bg-muted/30 p-4 font-mono text-sm">
          <p>{{ labels.label }}: {{ state.issued.value.label }}</p>
          <p>{{ labels.secret }}: {{ state.issued.value.secret }}</p>
          <slot name="connection" :issued="state.issued.value" />
        </div>
        <DialogFooter><Button @click="dismissIssued">{{ labels.closeSecret }}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>
