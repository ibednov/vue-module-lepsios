<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { computed, h, onMounted, reactive } from 'vue'
import { CrmDataTable } from '@lepsios/vue'
import { Button } from '@lepsios/vue/components/ui/button'
import { Input } from '@lepsios/vue/components/ui/input'
import type { CRMAuditLogAdapter, CRMAuditLogEvent, CRMAuditLogFilterField, CRMAuditLogLabels, CRMAuditLogQuery } from './index'
import { useCRMAuditLog } from './use-crm-audit-log'

const props = withDefaults(defineProps<{
  adapter: CRMAuditLogAdapter
  labels: CRMAuditLogLabels
  filterFields: CRMAuditLogFilterField[]
  pageSize?: number
  locale?: string
}>(), {
  pageSize: 50,
  locale: undefined,
})

const { items, total, loading, error, query, refresh, setFilters, setPage } = useCRMAuditLog(props.adapter, { pageSize: props.pageSize })
const filterValues = reactive<Record<string, string>>({})

const pagination = computed(() => ({
  page: query.value.page,
  perPage: query.value.pageSize,
  totalCount: total.value,
  totalPages: Math.max(1, Math.ceil(total.value / query.value.pageSize)),
}))

const formatDate = (value: string) => new Intl.DateTimeFormat(props.locale, {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value))

const columns = computed<ColumnDef<CRMAuditLogEvent, unknown>[]>(() => [
  {
    accessorKey: 'occurredAt',
    header: props.labels.time,
    cell: ({ row }) => h('span', { class: 'text-xs text-muted-foreground' }, formatDate(row.original.occurredAt)),
  },
  { accessorKey: 'action', header: props.labels.action, cell: ({ row }) => h('span', { class: 'font-mono text-xs' }, row.original.action) },
  {
    id: 'actor',
    accessorFn: event => event.actor?.name || event.actor?.email || event.actor?.id || event.actor?.kind || '',
    header: props.labels.actor,
    cell: ({ row }) => h('span', { class: 'text-sm' }, row.original.actor?.name || row.original.actor?.email || row.original.actor?.id || row.original.actor?.kind || '—'),
  },
  {
    id: 'target',
    accessorFn: event => [event.target?.type, event.target?.label, event.target?.id].filter(Boolean).join(' '),
    header: props.labels.target,
    cell: ({ row }) => h('span', { class: 'text-sm' }, [row.original.target?.type, row.original.target?.label || row.original.target?.id].filter(Boolean).join(' · ') || '—'),
  },
])

const applyFilters = () => {
  const filters: Partial<Omit<CRMAuditLogQuery, 'page' | 'pageSize'>> = {}
  for (const field of props.filterFields)
    Object.assign(filters, { [field.key]: filterValues[field.key]?.trim() || undefined })
  void setFilters(filters)
}

onMounted(() => {
  void refresh()
})
</script>

<template>
  <section class="space-y-4">
    <form class="flex flex-wrap items-end gap-3" @submit.prevent="applyFilters">
      <label v-for="field in filterFields" :key="field.key" class="grid gap-1 text-sm">
        <span>{{ field.label }}</span>
        <Input v-model="filterValues[field.key]" :type="field.type || 'text'" :placeholder="field.placeholder" />
      </label>
      <Button type="submit" :disabled="loading">
        {{ labels.applyFilters }}
      </Button>
    </form>

    <p v-if="error" class="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive" role="alert">
      {{ error }}
    </p>

    <CrmDataTable
      :data="items"
      :columns="columns"
      :loading="loading"
      :empty="!error && !items.length"
      :meta="pagination"
      :manual-pagination="true"
      :get-row-id="event => event.id"
      :loading-text="labels.loading"
      :empty-text="labels.empty"
      :prev-label="labels.previousPage"
      :next-label="labels.nextPage"
      @page-change="setPage"
    />
  </section>
</template>
