<script setup lang="ts">
import { getAdjust, setAdjust, type AdjustType } from '@/core/ops'
import { useEditorStore } from '@/stores/editor'

const SLIDERS: { type: AdjustType; label: string }[] = [
  { type: 'brightness', label: 'Brightness' },
  { type: 'contrast', label: 'Contrast' },
  { type: 'saturation', label: 'Saturation' },
]

const store = useEditorStore()

function onInput(type: AdjustType, value: unknown) {
  store.setDraft(setAdjust(store.recipe, type, Number(value)))
}
</script>

<template>
  <div class="pa-4">
    <div class="text-caption text-medium-emphasis mb-2">Adjust</div>
    <v-slider
      v-for="slider in SLIDERS"
      :key="slider.type"
      :model-value="getAdjust(store.recipe, slider.type)"
      :label="slider.label"
      :min="0"
      :max="200"
      :step="1"
      thumb-label
      density="compact"
      hide-details
      class="mb-2"
      @update:model-value="onInput(slider.type, $event)"
      @end="store.commitDraft()"
    />
  </div>
</template>
