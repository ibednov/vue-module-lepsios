<script setup lang="ts" generic="TInput">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { EntityModuleAdapter } from '../module-adapter.example'

const props = defineProps<{
  adapter: EntityModuleAdapter<{ id: string }, TInput>
  makeInput: () => TInput
  labels: { title: string, back: string, description: string, create: string, creating: string, error: string }
}>()
const saving = ref(false)
const error = ref('')
const router = useRouter()

async function submit() {
  saving.value = true
  error.value = ''
  try {
    const created = await props.adapter.create(props.makeInput())
    await router.push(`../${created.id}/`)
  }
  catch {
    error.value = props.labels.error
  }
  finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="crm-module-form">
    <a href="../">{{ labels.back }}</a>
    <h1>{{ labels.title }}</h1>
    <p>{{ labels.description }}</p>
    <p v-if="error" role="alert">{{ error }}</p>
    <form @submit.prevent="submit">
      <slot />
      <button type="submit" :disabled="saving">{{ saving ? labels.creating : labels.create }}</button>
    </form>
  </main>
</template>
