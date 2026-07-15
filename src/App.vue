<script setup lang="ts">
import { ref, watch } from 'vue'
import AdjustPanel from '@/components/AdjustPanel.vue'
import ControlsPanel from '@/components/ControlsPanel.vue'
import CropTool from '@/components/CropTool.vue'
import EditorCanvas from '@/components/EditorCanvas.vue'
import ExportPanel from '@/components/ExportPanel.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import ImageUploader from '@/components/ImageUploader.vue'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const cropping = ref(false)
const cropTool = ref<InstanceType<typeof CropTool>>()

watch(() => store.sourceUrl, () => (cropping.value = false))

function applyCrop() {
  cropTool.value?.apply()
  cropping.value = false
}

function clearCrop() {
  cropTool.value?.clear()
  cropping.value = false
}
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent width="300">
      <ImageUploader />
      <template v-if="store.hasImage">
        <v-divider />
        <div class="pa-4">
          <v-btn
            size="small"
            variant="tonal"
            prepend-icon="mdi-crop"
            :disabled="cropping"
            @click="cropping = true"
          >
            Crop
          </v-btn>
        </div>
        <v-divider />
        <AdjustPanel />
        <v-divider />
        <FilterPanel />
        <v-divider />
        <ExportPanel />
      </template>

      <template v-if="store.hasImage" #append>
        <v-divider />
        <ControlsPanel
          :cropping="cropping"
          @apply="applyCrop"
          @clear="clearCrop"
          @cancel="cropping = false"
        />
      </template>
    </v-navigation-drawer>

    <v-main class="main-area">
      <CropTool v-if="cropping" ref="cropTool" />
      <EditorCanvas v-else-if="store.hasImage" />
      <div v-else class="empty text-medium-emphasis">Upload an image to start</div>
    </v-main>
  </v-app>
</template>

<style scoped>
.main-area {
  height: 100vh;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
