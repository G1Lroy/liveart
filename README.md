# Image Editor

Client side image editor: upload, crop, adjust brightness / contrast / saturation, apply a filter, undo, export.

Demo: TODO add link after deploy

## Setup

Node 18+.

```bash
git clone TODO add repo url
cd liveart
npm i
npm run dev
```

Runs on http://localhost:5173. Tests: `npm test`.

## How it works

The original is loaded once into an `ImageBitmap` and never written to. Edits live separately, as a list of operations, and what you see is the original with that list applied on the fly.

```ts
type Op =
  | { type: 'crop'; rect: Rect }
  | { type: 'brightness'; value: number }
  | { type: 'contrast'; value: number }
  | { type: 'saturation'; value: number }
  | { type: 'filter'; name: 'greyscale' | 'sepia' | 'invert' | 'vintage' }
```

Everything follows from that. Reset clears the list, undo steps back through snapshots of it, and the JSON export is the list itself, so replaying it on the source reproduces the result.

```
src/core/ops.ts       operation types and list handling
src/core/render.ts    list to pixels
src/stores/editor.ts  source, history, actions
src/components/       panels and canvas
```

## Key decisions

**The list is normalised, not an event log.** One op per type, a slider replaces its own op. A log would grow without bound while dragging, and three hundred intermediate brightness values render the same pixel as the last one. Order is not lost, it is fixed by the pipeline in `render.ts`.

**Neutral values are dropped.** A slider back at 100 removes its op, so the JSON only lists what is actually applied.

**Undo commits per gesture, not per slider tick.** Otherwise one undo would shift brightness by one percent. Mid-drag the list lives in `draft`, outside history.

**Crop is stored in source pixels,** not preview pixels, so the list is resolution independent. That is the point for print: a recipe captured on screen has to reproduce on artwork of any size.

**Preview and export share one `render`,** differing only by a size cap, so the file cannot drift from what was on screen.

**Pixels go through `ctx.filter`.** The browser does the work and there is one code path, but it needs Safari 17+. A manual `ImageData` pass would be portable and slower, and would mean hand writing saturation and sepia matrices.

**Only the core is tested,** since those functions are pure and check without a DOM: filter strings, crop resolution, draft versus history.

## Extras

Both bonus items are in, and neither cost much. The store keeps the op list, rendering sits apart from it, so exporting the operations is just serialising the store.

Filters are greyscale, sepia, invert and vintage, mutually exclusive. A filter is a named preset, not a single css function: `vintage` expands to `sepia(0.45) saturate(1.4) contrast(0.9)`. The name is what gets stored, so the preset can be retuned later without breaking recipes already exported.

```json
{
  "version": 1,
  "source": { "width": 1920, "height": 1080 },
  "ops": [
    { "type": "crop", "rect": { "x": 100, "y": 50, "w": 800, "h": 600 } },
    { "type": "brightness", "value": 120 },
    { "type": "filter", "name": "sepia" }
  ]
}
```

`version` lets the shape change later while old files stay readable. `source` pins the dimensions the crop refers to, so a recipe cannot be silently replayed against a different image.

Undo and redo were not asked for. They are in the LiveArt demo, and on top of a list of operations they came out to about twenty lines, so they went in too.
