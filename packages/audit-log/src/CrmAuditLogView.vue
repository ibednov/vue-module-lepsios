<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import { computed, h, onMounted, reactive } from 'vue'
import { RouterLink } from 'vue-router'
import { CrmDataTable } from '@lepsios/vue'
import { Button } from '@lepsios/vue/components/ui/button'
import { Input } from '@lepsios/vue/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@lepsios/vue/components/ui/select'
import type { CRMAuditLogEvent, CRMAuditLogFilterField, CRMAuditLogLabels, CRMAuditLogQuery, CRMAuditLogSource } from './index'
import { useCRMAuditLog } from './use-crm-audit-log'

const props = withDefaults(defineProps<{
  source: CRMAuditLogSource
  labels: CRMAuditLogLabels
  filterFields: CRMAuditLogFilterField[]
  initialFilters?: Partial<Omit<CRMAuditLogQuery, 'page' | 'pageSize'>>
  actorLink?: (event: CRMAuditLogEvent) => string | undefined
  pageSize?: number
  locale?: string
}>(), {
  pageSize: 50,
  locale: undefined,
})

const { items, total, loading, error, query, refresh, setFilters, setPage } = useCRMAuditLog(props.source, {
  pageSize: props.pageSize,
  initialQuery: props.initialFilters,
})
const filterValues = reactive<Record<string, string>>(Object.fromEntries(
  props.filterFields.map(field => [field.key, String(props.initialFilters?.[field.key] ?? '')]),
))
const ALL_FILTER_VALUE = '__all__'

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
    accessorKey: 'occurred_at',
    header: props.labels.time,
    cell: ({ row }) => h('span', { class: 'text-xs text-muted-foreground' }, formatDate(row.original.occurred_at)),
  },
  { accessorKey: 'type', header: props.labels.action, cell: ({ row }) => h('span', { class: 'font-mono text-xs' }, row.original.type) },
  {
    id: 'actor',
    accessorFn: event => event.actor_email || event.actor_id,
    header: props.labels.actor,
    cell: ({ row }) => {
      const actor = row.original
      const label = actor.actor_email || actor.actor_id || '—'
      const to = props.actorLink?.(actor)
      return to && actor.actor_id
        ? h(RouterLink, { to, class: 'break-all text-sm underline-offset-2 hover:underline' }, () => label)
        : h('span', { class: 'break-all text-sm' }, label)
    },
  },
  { accessorKey: 'actor_kind', header: props.labels.actorKind },
  {
    id: 'target',
    accessorFn: event => `${event.target_type} ${event.target_id}`,
    header: props.labels.target,
    cell: ({ row }) => h('span', { class: 'text-sm' }, [row.original.target_type, row.original.target_id].filter(Boolean).join(' · ') || '—'),
  },
  {
    id: 'details',
    accessorFn: event => JSON.stringify(event.payload ?? {}),
    header: props.labels.details,
    cell: ({ row }) => {
      const payload = row.original.payload
      if (payload == null || (typeof payload === 'object' && !Object.keys(payload as object).length))
        return h('span', { class: 'text-sm text-muted-foreground' }, '—')
      return h('details', { class: 'max-w-[32rem] text-sm' }, [
        h('summary', { class: 'cursor-pointer text-primary hover:underline' }, props.labels.details),
        h('pre', { class: 'mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted/40 p-2 font-mono text-xs' }, JSON.stringify(payload, null, 2)),
      ])
    },
  },
])

const applyFilters = () => {
  const filters: Partial<Omit<CRMAuditLogQuery, 'page' | 'pageSize'>> = {}
  for (const field of props.filterFields)
    Object.assign(filters, { [field.key]: filterValues[field.key] === ALL_FILTER_VALUE ? undefined : filterValues[field.key]?.trim() || undefined })
  void setFilters(filters)
}

const resetFilters = () => {
  const filters: Partial<Omit<CRMAuditLogQuery, 'page' | 'pageSize'>> = {}
  for (const field of props.filterFields) {
    filterValues[field.key] = ''
    Object.assign(filters, { [field.key]: undefined })
  }
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
        <Select v-if="field.type === 'select'" v-model="filterValues[field.key]">
          <SelectTrigger>
            <SelectValue :placeholder="field.placeholder" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem :value="ALL_FILTER_VALUE">{{ field.placeholder }}</SelectItem>
            <SelectItem v-for="option in field.options || []" :key="option.value" :value="option.value">
              {{ option.label }}
            </SelectItem>
          </SelectContent>
        </Select>
        <Input v-else v-model="filterValues[field.key]" :type="field.type || 'text'" :placeholder="field.placeholder" />
      </label>
      <Button type="submit" :disabled="loading">
        {{ labels.applyFilters }}
      </Button>
      <Button type="button" variant="outline" :disabled="loading" @click="resetFilters">
        {{ labels.resetFilters }}
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
