import { describe, expect, it } from 'vitest'
import { setOp, type Recipe } from './ops'
import { buildFilter, resolveCrop } from './render'

describe('buildFilter', () => {
  it('joins adjustments in canonical order', () => {
    let recipe: Recipe = []
    recipe = setOp(recipe, { type: 'contrast', value: 90 })
    recipe = setOp(recipe, { type: 'brightness', value: 110 })
    expect(buildFilter(recipe)).toBe('brightness(110%) contrast(90%)')
  })
})

describe('resolveCrop', () => {
  it('returns the stored rect and falls back to the full image without one', () => {
    const recipe: Recipe = [{ type: 'crop', rect: { x: 10, y: 20, w: 100, h: 50 } }]
    expect(resolveCrop(recipe, 800, 600)).toEqual({ x: 10, y: 20, w: 100, h: 50 })
    expect(resolveCrop([], 800, 600)).toEqual({ x: 0, y: 0, w: 800, h: 600 })
  })
})
