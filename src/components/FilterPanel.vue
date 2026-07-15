<script setup lang="ts">
import { computed } from 'vue'
import { findOp, removeOp, setOp, type FilterName } from '@/core/ops'
import { useEditorStore } from '@/stores/editor'

const FILTERS: { name: FilterName; label: string }[] = [
  { name: 'greyscale', label: 'Greyscale' },
  { name: 'sepia', label: 'Sepia' },
  { name: 'invert', label: 'Invert' },
  { name: 'vintage', label: 'Vintage' },
]

const store = useEditorStore()
const active = computed(() => findOp(store.recipe, 'filter')?.name ?? null)

function toggle(name: FilterName) {
  const next =
    active.value === name
      ? removeOp(store.recipe, 'filter')
      : setOp(store.recipe, { type: 'filter', name })
  store.commit(next)
}
</script>

<template>
  <div class="pa-4">
    <div class="text-caption text-medium-emphasis mb-2">Filter</div>
    <div class="d-flex flex-wrap ga-2">
      <v-chip
        v-for="filter in FILTERS"
        :key="filter.name"
        :color="active === filter.name ? 'primary' : undefined"
        :variant="active === filter.name ? 'flat' : 'outlined'"
        size="small"
        @click="toggle(filter.name)"
      >
        {{ filter.label }}
      </v-chip>
    </div>
  </div>
</template>
