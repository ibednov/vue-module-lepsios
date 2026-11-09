<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { Badge } from '@lepsios/vue/components/ui/badge'
import { Button } from '@lepsios/vue/components/ui/button'
import { Checkbox } from '@lepsios/vue/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@lepsios/vue/components/ui/dialog'
import { Input } from '@lepsios/vue/components/ui/input'
import { Label } from '@lepsios/vue/components/ui/label'
import { NativeSelect } from '@lepsios/vue/components/ui/native-select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@lepsios/vue/components/ui/table'
import type {
  CRMAICredentials,
  CRMAIProviderConfig,
  CRMAIProvidersLabels,
  CRMAIProvidersSource,
  CRMAIProviderType,
} from './index'
import { useCRMAIProviders } from './use-crm-ai-providers'

const props = withDefaults(defineProps<{
  source: CRMAIProvidersSource
  labels: CRMAIProvidersLabels
  canEdit?: boolean
  locale?: string
}>(), {
  canEdit: true,
  locale: undefined,
})

const {
  sortedItems,
  loading,
  saving,
  busyId,
  error,
  refresh,
  upsert,
  remove,
} = useCRMAIProviders(props.source)

const PROVIDER_OPTIONS: CRMAIProviderType[] = ['gigachat', 'yandex', 'openrouter', 'openai']
const REASONING_OPTIONS = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'] as const

const formOpen = ref(false)
const deleteOpen = ref(false)
const editing = ref<CRMAIProviderConfig | null>(null)
const deleteTarget = ref<CRMAIProviderConfig | null>(null)
const formError = ref<string | null>(null)

const form = reactive({
  provider: 'openrouter' as string,
  model: '',
  reasoning_effort: 'none' as string,
  enabled: true,
  priority: 100,
  authorization_key: '',
  api_key: '',
  folder_id: '',
  openrouter_api_key: '',
  openai_api_key: '',
})

const providerLabel = (provider: string) => {
  switch (provider) {
    case 'gigachat':
      return props.labels.providerGigaChat
    case 'yandex':
      return props.labels.providerYandex
    case 'openrouter':
      return props.labels.providerOpenRouter
    case 'openai':
      return props.labels.providerOpenAI
    default:
      return provider
  }
}

const reasoningLabel = (value: string) => {
  switch (value) {
    case 'none':
      return props.labels.reasoningNone
    case 'minimal':
      return props.labels.reasoningMinimal
    case 'low':
      return props.labels.reasoningLow
    case 'medium':
      return props.labels.reasoningMedium
    case 'high':
      return props.labels.reasoningHigh
    case 'xhigh':
      return props.labels.reasoningXhigh
    case 'max':
      return props.labels.reasoningMax
    default:
      return value || '—'
  }
}

const resetFormSecrets = () => {
  form.authorization_key = ''
  form.api_key = ''
  form.folder_id = ''
  form.openrouter_api_key = ''
  form.openai_api_key = ''
}

const openCreate = () => {
  editing.value = null
  form.provider = 'openrouter'
  form.model = ''
  form.reasoning_effort = 'none'
  form.enabled = true
  form.priority = 100
  resetFormSecrets()
  formError.value = null
  formOpen.value = true
}

const openEdit = (item: CRMAIProviderConfig) => {
  editing.value = item
  form.provider = item.provider
  form.model = item.model
  form.reasoning_effort = item.reasoning_effort || 'none'
  form.enabled = item.enabled
  form.priority = item.priority
  resetFormSecrets()
  formError.value = null
  formOpen.value = true
}

const openDelete = (item: CRMAIProviderConfig) => {
  deleteTarget.value = item
  formError.value = null
  deleteOpen.value = true
}

const buildCredentials = (): CRMAICredentials | undefined => {
  const creds: CRMAICredentials = {}
  let any = false
  if (form.provider === 'gigachat' && form.authorization_key.trim()) {
    creds.authorization_key = form.authorization_key.trim()
    any = true
  }
  if (form.provider === 'yandex') {
    if (form.api_key.trim()) {
      creds.api_key = form.api_key.trim()
      any = true
    }
    if (form.folder_id.trim()) {
      creds.folder_id = form.folder_id.trim()
      any = true
    }
  }
  if (form.provider === 'openrouter' && form.openrouter_api_key.trim()) {
    creds.openrouter_api_key = form.openrouter_api_key.trim()
    any = true
  }
  if (form.provider === 'openai' && form.openai_api_key.trim()) {
    creds.openai_api_key = form.openai_api_key.trim()
    any = true
  }
  return any ? creds : undefined
}

const dialogTitle = computed(() =>
  editing.value ? props.labels.edit : props.labels.add,
)

const onSave = async () => {
  formError.value = null
  if (!form.provider.trim() || !form.model.trim()) {
    formError.value = props.labels.errorSave
    return
  }
  if (form.provider === 'yandex') {
    const hasKey = Boolean(form.api_key.trim())
    const hasFolder = Boolean(form.folder_id.trim())
    if (hasKey !== hasFolder) {
      formError.value = props.labels.yandexBothRequired
      return
    }
  }
  try {
    const credentials = buildCredentials()
    await upsert({
      id: editing.value?.id,
      provider: form.provider,
      model: form.model.trim(),
      reasoning_effort: form.reasoning_effort,
      enabled: form.enabled,
      priority: Number(form.priority) || 0,
      ...(credentials ? { credentials } : {}),
    })
    formOpen.value = false
  }
  catch {
    formError.value = error.value || props.labels.errorSave
  }
}

const onConfirmDelete = async () => {
  if (!deleteTarget.value)
    return
  formError.value = null
  try {
    await remove(deleteTarget.value.id)
    deleteOpen.value = false
    deleteTarget.value = null
  }
  catch {
    formError.value = error.value || props.labels.errorDelete
  }
}

onMounted(() => {
  void refresh()
})
</script>

<template>
  <section class="space-y-4" data-testid="crm-ai-providers">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div class="space-y-1">
        <h2 class="text-xl font-semibold tracking-tight">
          {{ labels.title }}
        </h2>
        <p class="max-w-3xl text-sm text-muted-foreground">
          {{ labels.description }}
        </p>
      </div>
      <div class="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          :disabled="loading || saving"
          @click="refresh"
        >
          {{ labels.retry }}
        </Button>
        <Button
          v-if="canEdit"
          type="button"
          size="sm"
          :disabled="loading || saving"
          @click="openCreate"
        >
          {{ labels.add }}
        </Button>
      </div>
    </header>

    <p
      v-if="error && !formOpen && !deleteOpen"
      class="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
      role="alert"
    >
      {{ error || labels.errorLoad }}
    </p>

    <p v-if="loading" class="text-sm text-muted-foreground">
      {{ labels.loading }}
    </p>

    <div
      v-else-if="!sortedItems.length"
      class="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground"
    >
      {{ labels.empty }}
    </div>

    <div v-else class="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{{ labels.priority }}</TableHead>
            <TableHead>{{ labels.provider }}</TableHead>
            <TableHead>{{ labels.model }}</TableHead>
            <TableHead>{{ labels.reasoningEffort }}</TableHead>
            <TableHead>{{ labels.enabled }}</TableHead>
            <TableHead>{{ labels.credentials }}</TableHead>
            <TableHead v-if="canEdit" class="text-right">
              {{ labels.actions }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            v-for="item in sortedItems"
            :key="item.id"
            :data-busy="busyId === item.id ? 'true' : undefined"
          >
            <TableCell class="font-mono text-sm">
              {{ item.priority }}
            </TableCell>
            <TableCell>{{ providerLabel(item.provider) }}</TableCell>
            <TableCell class="font-mono text-sm">
              {{ item.model }}
            </TableCell>
            <TableCell class="text-sm">
              {{ reasoningLabel(item.reasoning_effort) }}
            </TableCell>
            <TableCell>
              <Badge :variant="item.enabled ? 'default' : 'outline'">
                {{ item.enabled ? labels.enabledYes : labels.enabledNo }}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge :variant="item.has_credentials ? 'secondary' : 'outline'">
                {{ item.has_credentials ? labels.hasCredentials : labels.noCredentials }}
              </Badge>
            </TableCell>
            <TableCell v-if="canEdit" class="text-right">
              <div class="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  :disabled="saving"
                  @click="openEdit(item)"
                >
                  {{ labels.edit }}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  :disabled="saving"
                  @click="openDelete(item)"
                >
                  {{ labels.delete }}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <Dialog v-model:open="formOpen">
      <DialogContent class="max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ dialogTitle }}</DialogTitle>
          <DialogDescription>
            {{ labels.secretHintKeep }}
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-3 py-2">
          <div class="grid gap-2">
            <Label for="crm-ai-provider">{{ labels.provider }}</Label>
            <NativeSelect id="crm-ai-provider" v-model="form.provider">
              <option
                v-for="option in PROVIDER_OPTIONS"
                :key="option"
                :value="option"
              >
                {{ providerLabel(option) }}
              </option>
            </NativeSelect>
          </div>

          <div class="grid gap-2">
            <Label for="crm-ai-model">{{ labels.model }}</Label>
            <Input id="crm-ai-model" v-model="form.model" autocomplete="off" />
          </div>

          <div class="grid gap-2 sm:grid-cols-2">
            <div class="grid gap-2">
              <Label for="crm-ai-reasoning">{{ labels.reasoningEffort }}</Label>
              <NativeSelect id="crm-ai-reasoning" v-model="form.reasoning_effort">
                <option
                  v-for="option in REASONING_OPTIONS"
                  :key="option"
                  :value="option"
                >
                  {{ reasoningLabel(option) }}
                </option>
              </NativeSelect>
            </div>
            <div class="grid gap-2">
              <Label for="crm-ai-priority">{{ labels.priority }}</Label>
              <Input
                id="crm-ai-priority"
                v-model.number="form.priority"
                type="number"
              />
            </div>
          </div>

          <label class="flex items-center gap-2 text-sm">
            <Checkbox v-model:checked="form.enabled" />
            <span>{{ labels.enabled }}</span>
          </label>

          <div class="space-y-3 rounded-md border p-3">
            <p class="text-sm font-medium">
              {{ labels.credentials }}
            </p>
            <p class="text-xs text-muted-foreground">
              {{ labels.secretHintKeep }}
            </p>

            <div v-if="form.provider === 'gigachat'" class="grid gap-2">
              <Label for="crm-ai-auth-key">{{ labels.secretAuthorizationKey }}</Label>
              <Input
                id="crm-ai-auth-key"
                v-model="form.authorization_key"
                type="password"
                autocomplete="new-password"
              />
            </div>

            <template v-else-if="form.provider === 'yandex'">
              <div class="grid gap-2">
                <Label for="crm-ai-api-key">{{ labels.secretApiKey }}</Label>
                <Input
                  id="crm-ai-api-key"
                  v-model="form.api_key"
                  type="password"
                  autocomplete="new-password"
                />
              </div>
              <div class="grid gap-2">
                <Label for="crm-ai-folder">{{ labels.secretFolderId }}</Label>
                <Input
                  id="crm-ai-folder"
                  v-model="form.folder_id"
                  autocomplete="off"
                />
              </div>
            </template>

            <div v-else-if="form.provider === 'openrouter'" class="grid gap-2">
              <Label for="crm-ai-or-key">{{ labels.secretOpenRouter }}</Label>
              <Input
                id="crm-ai-or-key"
                v-model="form.openrouter_api_key"
                type="password"
                autocomplete="new-password"
              />
            </div>

            <div v-else-if="form.provider === 'openai'" class="grid gap-2">
              <Label for="crm-ai-oai-key">{{ labels.secretOpenAI }}</Label>
              <Input
                id="crm-ai-oai-key"
                v-model="form.openai_api_key"
                type="password"
                autocomplete="new-password"
              />
            </div>
          </div>

          <p
            v-if="formError"
            class="text-sm text-destructive"
            role="alert"
          >
            {{ formError }}
          </p>
        </div>

        <DialogFooter class="gap-2">
          <Button
            type="button"
            variant="outline"
            :disabled="saving"
            @click="formOpen = false"
          >
            {{ labels.cancel }}
          </Button>
          <Button type="button" :disabled="saving" @click="onSave">
            {{ labels.save }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="deleteOpen">
      <DialogContent class="max-w-md">
        <DialogHeader>
          <DialogTitle>{{ labels.confirmDelete }}</DialogTitle>
          <DialogDescription>
            {{ labels.confirmDeleteBody }}
          </DialogDescription>
        </DialogHeader>
        <p v-if="deleteTarget" class="text-sm text-muted-foreground">
          {{ providerLabel(deleteTarget.provider) }} · {{ deleteTarget.model }}
        </p>
        <p
          v-if="formError"
          class="text-sm text-destructive"
          role="alert"
        >
          {{ formError }}
        </p>
        <DialogFooter class="gap-2">
          <Button
            type="button"
            variant="outline"
            :disabled="saving"
            @click="deleteOpen = false"
          >
            {{ labels.cancel }}
          </Button>
          <Button
            type="button"
            variant="destructive"
            :disabled="saving"
            @click="onConfirmDelete"
          >
            {{ labels.delete }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </section>
</template>
