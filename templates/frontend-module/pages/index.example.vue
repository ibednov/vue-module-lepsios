<script setup lang="ts" generic="TItem extends { id: string, status: string }">
import type { ColumnDef } from '@tanstack/vue-table'
import type { DataTableLabels } from '~/components/ui/data-table/data-table-types'
import { computed, h, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Button } from '~/components/shad-cn/ui/button'
import { Badge } from '~/components/shad-cn/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/shad-cn/ui/dropdown-menu'
import DataTable from '~/components/ui/data-table/data-table.vue'
import type { EntityModuleAdapter } from '../module-adapter.example'

const props = defineProps<{
  adapter: EntityModuleAdapter<TItem, unknown>
  statuses: readonly string[]
  allowedTransitions: (item: TItem) => readonly string[]
  title: string
  detailPath: (item: TItem) => string
  itemTitle: (item: TItem) => string
  statusLabel: (status: string) => string
  canCreate: boolean
  canChangeStatus: (item: TItem) => boolean
  canUseKanban?: boolean
  tableLabels: DataTableLabels
  labels: {
    create: string
    search: string
    table: string
    kanban: string
    empty: string
    loadError: string
    updateError: string
    retry: string
    id: string
    status: string
    actions: string
    open: string
    moveTo: string
    previous: string
    next: string
    page: (current: number, pages: number) => string
  }
}>()

const view = ref<'table' | 'kanban'>('table')
const items = ref<TItem[]>([])
const query = ref('')
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)
const error = ref('')
const filters = ref<Record<string, unknown>>({})
const savingIds = ref(new Set<string>())
const pages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const columns = computed(() => props.statuses.map(status => ({
  status,
  items: items.value.filter(item => item.status === status),
})))

const tableColumns = computed<ColumnDef<TItem, unknown>[]>(() => [
  {
    id: 'title',
    header: () => props.labels.id,
    cell: ({ row }) => h(RouterLink, {
      to: props.detailPath(row.original),
      class: 'font-medium text-primary hover:underline',
    }, () => props.itemTitle(row.original)),
  },
  {
    accessorKey: 'status',
    header: () => props.labels.status,
    cell: ({ row }) => h(Badge, { variant: 'outline' }, () => props.statusLabel(row.original.status)),
  },
  {
    id: 'actions',
    enableSorting: false,
    header: () => props.labels.actions,
    cell: ({ row }) => h(DropdownMenu, {}, {
      default: () => [
        h(DropdownMenuTrigger, { asChild: true }, () => h(Button, {
          variant: 'ghost',
          size: 'icon',
          'aria-label': props.labels.actions,
        }, () => '⋯')),
        h(DropdownMenuContent, { align: 'end' }, () => [
          h(DropdownMenuItem, {}, () => h(RouterLink, {
            to: props.detailPath(row.original),
          }, () => props.labels.open)),
        ]),
      ],
    }),
  },
])

onMounted(load)

async function load() {
  loading.value = true
  error.value = ''
  try {
    const result = await props.adapter.list({
      query: query.value || undefined,
      status: typeof filters.value.status === 'string' ? filters.value.status : undefined,
      page: page.value,
      pageSize: pageSize.value,
    })
    items.value = result.items
    total.value = result.total
  }
  catch {
    error.value = props.labels.loadError
  }
  finally {
    loading.value = false
  }
}

function onSearchChange(value: string) {
  query.value = value
  page.value = 1
  void load()
}

function onFilterChange(value: { key: string, value: unknown }) {
  filters.value = { ...filters.value, [value.key]: value.value }
  page.value = 1
  void load()
}

async function move(item: TItem, status: string) {
  if (!props.adapter.updateStatus || !props.canChangeStatus(item))
    return
  if (!props.allowedTransitions(item).includes(status))
    return

  savingIds.value = new Set(savingIds.value).add(item.id)
  error.value = ''
  try {
    await props.adapter.updateStatus(item.id, status)
    await load()
  }
  catch {
    error.value = props.labels.updateError
  }
  finally {
    const next = new Set(savingIds.value)
    next.delete(item.id)
    savingIds.value = next
  }
}

function changePage(next: number) {
  if (next < 1 || next > pages.value || next === page.value)
    return
  page.value = next
  void load()
}
</script>

<template>
  <main class="space-y-6">
    <header class="flex flex-wrap items-start justify-between gap-4">
      <h1 class="text-3xl font-semibold tracking-tight">{{ title }}</h1>
      <RouterLink v-if="canCreate" to="create/">
        <Button>{{ labels.create }}</Button>
      </RouterLink>
    </header>

    <nav v-if="canUseKanban" class="flex gap-2" :aria-label="title">
      <Button variant="outline" :aria-pressed="view === 'table'" @click="view = 'table'">
        {{ labels.table }}
      </Button>
      <Button variant="outline" :aria-pressed="view === 'kanban'" @click="view = 'kanban'">
        {{ labels.kanban }}
      </Button>
    </nav>

    <DataTable
      v-if="view === 'table'"
      v-model:search="query"
      v-model:filter-values="filters"
      :columns="tableColumns"
      :data="items"
      :global-search="false"
      :server-search="true"
      :search-placeholder="labels.search"
      :filter-data="[{ key: 'status', label: labels.status, options: statuses.map(status => ({ value: status, label: statusLabel(status) })) }]"
      :is-filterable="true"
      :is-filter-option-default="true"
      :hide-pagination="true"
      :labels="tableLabels"
      :loading="loading"
      :error-message="error"
      @search-change="onSearchChange"
      @filter-change="onFilterChange"
      @retry="load"
    />

    <section v-else aria-label="Kanban board">
      <p v-if="loading" role="status">{{ tableLabels.loading }}</p>
      <div v-else-if="error" role="alert" class="flex items-center gap-3">
        <span>{{ error }}</span>
        <Button variant="outline" @click="load">{{ labels.retry }}</Button>
      </div>
      <p v-else-if="items.length === 0">{{ labels.empty }}</p>
      <div v-else class="grid min-w-0 auto-cols-[minmax(17rem,1fr)] grid-flow-col gap-4 overflow-x-auto pb-3">
        <section
          v-for="column in columns"
          :key="column.status"
          class="min-h-48 space-y-3 rounded-xl border bg-muted/20 p-3"
          :aria-label="statusLabel(column.status)"
        >
          <header class="flex items-center justify-between gap-2">
            <Badge variant="outline">{{ statusLabel(column.status) }}</Badge>
            <span class="text-sm text-muted-foreground">{{ column.items.length }}</span>
          </header>
          <article
            v-for="item in column.items"
            :key="item.id"
            class="space-y-3 rounded-lg border bg-card p-4 shadow-sm"
          >
            <RouterLink :to="detailPath(item)" class="font-medium hover:underline">
              {{ itemTitle(item) }}
            </RouterLink>
            <label v-if="canChangeStatus(item) && adapter.updateStatus" class="grid gap-1 text-sm">
              <span>{{ labels.moveTo }}</span>
              <select
                :value="item.status"
                :disabled="savingIds.has(item.id)"
                @change="move(item, ($event.target as HTMLSelectElement).value)"
              >
                <option :value="item.status">{{ statusLabel(item.status) }}</option>
                <option
                  v-for="nextStatus in allowedTransitions(item)"
                  :key="nextStatus"
                  :value="nextStatus"
                >
                  {{ statusLabel(nextStatus) }}
                </option>
              </select>
            </label>
          </article>
        </section>
      </div>
    </section>

    <footer class="flex items-center justify-between gap-4">
      <span>{{ tableLabels.showingRows(items.length, total) }}</span>
      <div class="flex items-center gap-2">
        <Button variant="outline" :disabled="loading || page <= 1" @click="changePage(page - 1)">
          {{ labels.previous }}
        </Button>
        <span class="text-sm text-muted-foreground">{{ labels.page(page, pages) }}</span>
        <Button variant="outline" :disabled="loading || page >= pages" @click="changePage(page + 1)">
          {{ labels.next }}
        </Button>
      </div>
    </footer>
  </main>
</template>
