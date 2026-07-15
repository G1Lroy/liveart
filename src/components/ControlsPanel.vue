<script setup lang="ts">
import { useEditorStore } from '@/stores/editor'

defineProps<{ cropping: boolean }>()
const emit = defineEmits<{ apply: []; clear: []; cancel: [] }>()

const store = useEditorStore()
</script>

<template>
  <div class="pa-4">
    <div class="text-caption text-medium-emphasis mb-2">Controls</div>

    <div v-if="cropping" class="d-flex flex-wrap ga-2">
      <v-btn size="small" color="primary" @click="emit('apply')">Apply</v-btn>
      <v-btn size="small" variant="text" @click="emit('clear')">Remove crop</v-btn>
      <v-btn size="small" variant="text" @click="emit('cancel')">Cancel</v-btn>
    </div>

    <template v-else>
      <div class="d-flex align-center ga-1 mb-2">
        <v-btn icon="mdi-undo" size="small" variant="text" :disabled="!store.canUndo" @click="store.undo()" />
        <v-btn icon="mdi-redo" size="small" variant="text" :disabled="!store.canRedo" @click="store.redo()" />
        <v-divider vertical class="mx-1" />
        <v-btn size="small" variant="text" :disabled="!store.isDirty" @click="store.reset()">Reset</v-btn>
        <v-btn
          size="small"
          variant="text"
          :disabled="!store.isDirty"
          @pointerdown="store.showOriginal = true"
          @pointerup="store.showOriginal = false"
          @pointerleave="store.showOriginal = false"
        >
          Original
        </v-btn>
      </div>
      <div class="text-caption text-medium-emphasis">{{ store.recipe.length }} ops in recipe</div>
    </template>
  </div>
</template>
