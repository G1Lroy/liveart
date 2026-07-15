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

**The list is normalised, not an event log.** One op per type, a slider replaces its own op rather than appending. A log would grow without bound while dragging, for nothing: three hundred intermediate brightness values render the same pixel as the last one. Apply order is not lost, it is fixed by the pipeline in `render.ts`.

**Neutral values are dropped.** A slider back at 100 removes its op, so the JSON only lists what is actually applied.

**Undo is a history of snapshots, committed per gesture,** not per slider tick, otherwise one undo would shift brightness by one percent. Mid-drag the list lives in `draft`, outside history.

**Crop is stored in source pixels** via `getData(true)`, not preview pixels, so the list is resolution independent. For print that is the point: a recipe captured on screen has to reproduce on artwork of any size.

**Preview and export share one `render`,** differing only by a size cap, so the downloaded file cannot drift from what was on screen.

**Pixels go through `ctx.filter`,** not a manual `ImageData` pass. The browser does the work and there is a single code path, but this needs Safari 17+. A manual pass would be portable and much slower, and would mean hand writing saturation and sepia matrices. Not worth it at this size.

**Only the core is tested:** filter string assembly, crop resolution, and draft versus history. The `core` functions are pure so they check without a DOM or a canvas.

## Bonus

Both are in, and neither cost much. The store keeps the op list and rendering sits apart from it, so exporting the operations is just serialising the store.

Filters are greyscale, sepia, invert and vintage, mutually exclusive. A filter is a named preset rather than a single css function: `vintage` expands to `sepia(0.45) saturate(1.4) contrast(0.9)`. The name is what gets stored, so the preset can be retuned without invalidating exported recipes.

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

`version` lets the shape change later while old files stay readable. `source` pins the dimensions the crop coordinates refer to, so a recipe cannot be silently replayed against a different image.

Undo and redo are not in the requirements. They are in the LiveArt demo, and with a list of operations they were about twenty lines in the store, so they went in too.
