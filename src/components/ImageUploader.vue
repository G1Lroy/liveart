<script setup lang="ts">
import { ref } from 'vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const error = ref<string | null>(null)

async function onChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  error.value = null
  try {
    await store.load(file)
  } catch {
    error.value = 'Could not read that file as an image'
  }
}
</script>

<template>
  <div class="pa-4">
    <v-file-input
      accept="image/*"
      label="Image"
      prepend-icon="mdi-image-outline"
      density="compact"
      hide-details
      @change="onChange"
    />
    <v-alert v-if="error" type="error" density="compact" class="mt-3" :text="error" />
  </div>
</template>
