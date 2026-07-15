import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useEditorStore } from './editor'

describe('editor store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('keeps a draft out of history until the gesture ends', () => {
    const store = useEditorStore()
    store.setDraft([{ type: 'brightness', value: 110 }])
    store.setDraft([{ type: 'brightness', value: 130 }])
    expect(store.recipe).toEqual([{ type: 'brightness', value: 130 }])
    expect(store.canUndo).toBe(false)

    store.commitDraft()
    expect(store.canUndo).toBe(true)
    store.undo()
    expect(store.recipe).toEqual([])
    store.redo()
    expect(store.recipe).toEqual([{ type: 'brightness', value: 130 }])
  })
})
