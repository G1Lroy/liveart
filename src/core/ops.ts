export type Rect = { x: number; y: number; w: number; h: number }

export type FilterName = 'greyscale' | 'sepia' | 'invert' | 'vintage'

export type Op =
  | { type: 'crop'; rect: Rect }
  | { type: 'brightness'; value: number }
  | { type: 'contrast'; value: number }
  | { type: 'saturation'; value: number }
  | { type: 'filter'; name: FilterName }

export type OpType = Op['type']
export type AdjustType = 'brightness' | 'contrast' | 'saturation'
export type Recipe = Op[]

export const NEUTRAL = 100

const ORDER: OpType[] = ['crop', 'brightness', 'contrast', 'saturation', 'filter']

export function setOp(recipe: Recipe, op: Op): Recipe {
  const rest = recipe.filter((item) => item.type !== op.type)
  return [...rest, op].sort((a, b) => ORDER.indexOf(a.type) - ORDER.indexOf(b.type))
}

export function removeOp(recipe: Recipe, type: OpType): Recipe {
  return recipe.filter((item) => item.type !== type)
}

export function findOp<T extends OpType>(recipe: Recipe, type: T) {
  return recipe.find((item) => item.type === type) as Extract<Op, { type: T }> | undefined
}

export function setAdjust(recipe: Recipe, type: AdjustType, value: number): Recipe {
  if (value === NEUTRAL) return removeOp(recipe, type)
  return setOp(recipe, { type, value })
}

export function getAdjust(recipe: Recipe, type: AdjustType): number {
  return findOp(recipe, type)?.value ?? NEUTRAL
}
