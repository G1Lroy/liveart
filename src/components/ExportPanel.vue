<script setup lang="ts">
import { canvasToBlob, downloadBlob } from '@/core/download'
import { render } from '@/core/render'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()

async function exportImage() {
  if (!store.source) return
  const canvas = render(store.source, store.recipe)
  downloadBlob(await canvasToBlob(canvas), `${store.sourceName}-edited.png`)
}

function exportRecipe() {
  if (!store.source) return
  const payload = {
    version: 1,
    source: { width: store.source.width, height: store.source.height },
    ops: store.recipe,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  downloadBlob(blob, `${store.sourceName}-recipe.json`)
}
</script>

<template>
  <div class="pa-4 d-flex flex-column ga-2">
    <v-btn color="primary" size="small" prepend-icon="mdi-download" @click="exportImage">
      Download PNG
    </v-btn>
    <v-btn variant="tonal" size="small" prepend-icon="mdi-code-json" @click="exportRecipe">
      Download JSON
    </v-btn>
  </div>
</template>
