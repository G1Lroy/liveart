<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { findOp, removeOp, setOp } from '@/core/ops'
import { buildFilter } from '@/core/render'
import { useEditorStore } from '@/stores/editor'

const store = useEditorStore()
const img = ref<HTMLImageElement>()
let cropper: Cropper | null = null

const cssFilter = computed(() => buildFilter(removeOp(store.recipe, 'crop')))

onMounted(() => {
  if (!img.value) return
  cropper = new Cropper(img.value, {
    viewMode: 1,
    autoCropArea: 1,
    background: false,
    ready() {
      const op = findOp(store.recipe, 'crop')
      if (op) cropper?.setData({ x: op.rect.x, y: op.rect.y, width: op.rect.w, height: op.rect.h })
    },
  })
})

onBeforeUnmount(() => cropper?.destroy())

function apply() {
  if (!cropper) return
  const data = cropper.getData(true)
  store.commit(
    setOp(store.recipe, {
      type: 'crop',
      rect: { x: data.x, y: data.y, w: data.width, h: data.height },
    }),
  )
}

function clear() {
  store.commit(removeOp(store.recipe, 'crop'))
}

defineExpose({ apply, clear })
</script>

<template>
  <div class="crop-stage">
    <img ref="img" :src="store.sourceUrl ?? ''" alt="" />
  </div>
</template>

<style scoped>
.crop-stage {
  height: 100%;
  padding: 16px;
}

.crop-stage img {
  display: block;
  max-width: 100%;
}

.crop-stage :deep(.cropper-canvas img),
.crop-stage :deep(.cropper-view-box img) {
  filter: v-bind(cssFilter);
}
</style>
