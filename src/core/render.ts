import { findOp, type FilterName, type Recipe, type Rect } from './ops'

// A filter is a named preset, so one entry may expand to several css functions.
const FILTER_CSS: Record<FilterName, string> = {
  greyscale: 'grayscale(1)',
  sepia: 'sepia(1)',
  invert: 'invert(1)',
  vintage: 'sepia(0.45) saturate(1.4) contrast(0.9)',
}

export function buildFilter(recipe: Recipe): string {
  const parts: string[] = []
  for (const op of recipe) {
    if (op.type === 'brightness') parts.push(`brightness(${op.value}%)`)
    if (op.type === 'contrast') parts.push(`contrast(${op.value}%)`)
    if (op.type === 'saturation') parts.push(`saturate(${op.value}%)`)
    if (op.type === 'filter') parts.push(FILTER_CSS[op.name])
  }
  return parts.length > 0 ? parts.join(' ') : 'none'
}

export function resolveCrop(recipe: Recipe, width: number, height: number): Rect {
  const op = findOp(recipe, 'crop')
  if (!op) return { x: 0, y: 0, w: width, h: height }
  const x = clamp(op.rect.x, 0, width - 1)
  const y = clamp(op.rect.y, 0, height - 1)
  return { x, y, w: clamp(op.rect.w, 1, width - x), h: clamp(op.rect.h, 1, height - y) }
}

export function render(source: ImageBitmap, recipe: Recipe, maxSize?: number): HTMLCanvasElement {
  const crop = resolveCrop(recipe, source.width, source.height)
  const scale = maxSize ? Math.min(1, maxSize / Math.max(crop.w, crop.h)) : 1
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(crop.w * scale))
  canvas.height = Math.max(1, Math.round(crop.h * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2d context is not available')
  ctx.filter = buildFilter(recipe)
  ctx.drawImage(source, crop.x, crop.y, crop.w, crop.h, 0, 0, canvas.width, canvas.height)
  return canvas
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
