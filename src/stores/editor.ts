import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import type { Recipe } from '@/core/ops'

export const useEditorStore = defineStore('editor', () => {
  // shallowRef: there is no point wrapping an ImageBitmap in a reactive proxy.
  const source = shallowRef<ImageBitmap | null>(null)
  const sourceUrl = ref<string | null>(null)
  const sourceName = ref('image')

  const history = ref<Recipe[]>([[]])
  const cursor = ref(0)
  const draft = ref<Recipe | null>(null)
  const showOriginal = ref(false)

  const committed = computed(() => history.value[cursor.value])
  const recipe = computed(() => draft.value ?? committed.value)
  const visibleRecipe = computed<Recipe>(() => (showOriginal.value ? [] : recipe.value))
  const canUndo = computed(() => cursor.value > 0)
  const canRedo = computed(() => cursor.value < history.value.length - 1)
  const isDirty = computed(() => recipe.value.length > 0)
  const hasImage = computed(() => source.value !== null)

  function commit(next: Recipe) {
    history.value = [...history.value.slice(0, cursor.value + 1), next]
    cursor.value = history.value.length - 1
    draft.value = null
  }

  function setDraft(next: Recipe) {
    draft.value = next
  }

  function commitDraft() {
    if (draft.value) commit(draft.value)
  }

  function undo() {
    if (!canUndo.value) return
    draft.value = null
    cursor.value -= 1
  }

  function redo() {
    if (!canRedo.value) return
    draft.value = null
    cursor.value += 1
  }

  function reset() {
    commit([])
  }

  async function load(file: File) {
    if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
    source.value = await createImageBitmap(file)
    sourceUrl.value = URL.createObjectURL(file)
    sourceName.value = file.name.replace(/\.[^.]+$/, '') || 'image'
    history.value = [[]]
    cursor.value = 0
    draft.value = null
    showOriginal.value = false
  }

  return {
    source,
    sourceUrl,
    sourceName,
    recipe,
    visibleRecipe,
    showOriginal,
    canUndo,
    canRedo,
    isDirty,
    hasImage,
    load,
    commit,
    setDraft,
    commitDraft,
    undo,
    redo,
    reset,
  }
})
