# Pretext.js Model Handoff

Purpose: give another model enough context to understand and use `@chenglou/pretext` after studying the Learn Pretext tutorial tracks: Foundations, Core Patterns, Advanced, Creative, and Reference.

Source context: Learn Pretext is an independent community tutorial site for Cheng Lou's `pretext` library. It teaches multiline text measurement and layout without DOM reflow through 26 interactive pages across five tracks. This handoff is a distilled, implementation-focused guide, not a verbatim copy of the site.

---

## 1. Mental Model

Pretext is a JavaScript/TypeScript library for computing multiline text layout without reading layout from the DOM. Instead of rendering hidden elements and calling `offsetHeight` or `getBoundingClientRect()`, it measures text segments with the canvas text engine once, caches widths, and then computes line breaks with arithmetic.

The basic pattern is:

```ts
import { prepare, layout } from '@chenglou/pretext'

await document.fonts.ready

const prepared = prepare('Hello, world!', '16px Inter')
const result = layout(prepared, 200, 24)
// result: { lineCount: 1, height: 24 }
```

Think of the library as a text-layout ruler:

- It predicts dimensions and line breaks.
- It does not replace accessible DOM rendering.
- It is most valuable when layout must be known before, or independent of, rendering.

Core distinction:

- `prepare()` is the compile step. It analyzes, segments, measures, and caches.
- `layout()` and related APIs are execution steps. They reuse prepared data at arbitrary widths.

Use Pretext when you need reliable text dimensions before rendering, repeated relayout at different widths, 60fps interactive layout, virtualized text-heavy interfaces, canvas text wrapping, shrink-wrapped multiline text, balanced text, or custom obstacle-aware line layout.

Do not reach for it when you only need to measure one static block once. Normal browser layout is simpler there.

---

## 2. Installation and Setup

```bash
npm install @chenglou/pretext
# or
bun add @chenglou/pretext
# or
yarn add @chenglou/pretext
```

Always wait for fonts before preparing text:

```ts
await document.fonts.ready
const prepared = prepare(text, '16px Inter')
```

For dynamic fonts:

```ts
const font = new FontFace('MyFont', 'url(/my-font.woff2)')
await font.load()
document.fonts.add(font)
const prepared = prepare(text, '16px MyFont')
```

If a font loads after `prepare()`, cached widths may correspond to a fallback font. In that case, call `clearCache()` and re-prepare active texts.

---

## 3. API Surface

### `prepare(text, font, options?)`

```ts
prepare(text: string, font: string, options?: { whiteSpace?: 'normal' | 'pre-wrap' }): PreparedText
```

Use when you only need dimensions from `layout()`. The returned value is intentionally opaque.

### `layout(prepared, maxWidth, lineHeight)`

```ts
layout(prepared: PreparedText, maxWidth: number, lineHeight: number): {
  lineCount: number
  height: number
}
```

Fastest path. Use for height prediction in accordions, virtual lists, masonry cards, and resize-driven layout.

### `prepareWithSegments(text, font, options?)`

```ts
prepareWithSegments(text, font, options?): PreparedTextWithSegments
```

Like `prepare()`, but exposes:

```ts
{
  segments: string[]
  widths: number[]
  kinds: SegmentBreakKind[]
}
```

Use when you need line content, line ranges, per-segment widths, or iterator layout.

### `layoutWithLines(prepared, maxWidth, lineHeight)`

```ts
layoutWithLines(prepared: PreparedTextWithSegments, maxWidth: number, lineHeight: number): {
  lineCount: number
  height: number
  lines: Array<{
    text: string
    width: number
    start: LayoutCursor
    end: LayoutCursor
  }>
}
```

Use for canvas rendering, per-line alignment, kinetic typography, debugging, or line-by-line output.

### `walkLineRanges(prepared, maxWidth, onLine)`

```ts
walkLineRanges(
  prepared: PreparedTextWithSegments,
  maxWidth: number,
  onLine: (line: { width: number; start: LayoutCursor; end: LayoutCursor }) => void
): number
```

Low-allocation way to inspect line widths/ranges. Use for shrink-wrapping, measuring widest line, and repeated calculations where line strings are not needed.

### `layoutNextLine(prepared, cursor, maxWidth)`

```ts
layoutNextLine(
  prepared: PreparedTextWithSegments,
  start: { segmentIndex: number; graphemeIndex: number },
  maxWidth: number
): LayoutLine | null
```

Iterator-style API. Use when each line may have a different width, such as text flowing around circles, polygons, columns, or draggable obstacles.

### `setLocale(locale?)`

```ts
setLocale('ja')
// prepare/layout text with Japanese segmentation rules
setLocale(undefined)
```

Controls `Intl.Segmenter` locale. Use for CJK, Thai, Arabic, Hindi, emoji-heavy, and multilingual text. Reset after scoped usage to avoid surprising later code.

### `clearCache()`

```ts
clearCache()
```

Clears cached glyph measurements. Use after font swaps, variable font changes, locale segmentation changes when appropriate, or when leaving text-heavy pages and memory matters.

---

## 4. Choosing the Right API

| Need | Recommended API | Reason |
|---|---|---|
| Height and line count only | `prepare()` + `layout()` | Fastest, simplest |
| Per-line text and width | `prepareWithSegments()` + `layoutWithLines()` | Returns `lines[]` |
| Widest rendered line with minimal allocations | `prepareWithSegments()` + `walkLineRanges()` | No line-string array needed |
| Variable width per line | `prepareWithSegments()` + `layoutNextLine()` | Cursor-based line iterator |
| Segment inspection/debugging | `prepareWithSegments()` | Shows `segments`, `widths`, `kinds` |
| Locale-specific line breaking | `setLocale()` + `prepareWithSegments()` | Changes segmentation behavior |

Decision heuristic:

1. Need only dimensions? Use `layout()`.
2. Need rendered line contents? Use `layoutWithLines()`.
3. Need per-line widths only? Use `walkLineRanges()`.
4. Need different width per line? Use `layoutNextLine()`.

---

## 5. The Pipeline

`prepare()` and `prepareWithSegments()` perform four conceptual steps:

1. Raw text intake.
2. Whitespace normalization, depending on `whiteSpace` mode.
3. Segmentation using `Intl.Segmenter` and break-kind classification.
4. Canvas-based measurement and per-font width caching.

Segment kinds include concepts like:

- `text`: normal text segment.
- `space`: breakable collapsed whitespace.
- `glue`: non-breaking space (`\u00A0`).
- `soft-hyphen`: optional break point (`\u00AD`).
- `hard-break`: forced line break.
- `tab`: tab stop behavior.
- `zero-width-break`: breakable zero-width point.

Default whitespace behavior resembles `white-space: normal`: multiple spaces collapse and newlines become spaces. For preserved whitespace:

```ts
const prepared = prepare(text, font, { whiteSpace: 'pre-wrap' })
```

---

## 6. Foundations Track

### Home

The homepage demonstrates the central idea: text layout can be computed with arithmetic from a known font and width, without DOM reads. It uses `prepareWithSegments()` and `layoutWithLines()` to position individual characters in an interactive text/physics layout.

Key takeaway: once text is prepared, resize-driven relayout is cheap enough to drive interactive UI.

### Why Pretext

Problem: measuring text by writing DOM nodes and reading dimensions forces browser layout. Doing this in loops causes layout thrashing.

Traditional pattern:

```ts
const div = document.createElement('div')
div.style.cssText = `position:absolute; width:400px; font:${font}; line-height:${lineHeight}px`
div.textContent = text
document.body.appendChild(div)
const height = div.offsetHeight // forced reflow
document.body.removeChild(div)
```

Pretext pattern:

```ts
const prepared = prepare(text, font)
const { height } = layout(prepared, 400, lineHeight)
```

What CSS alone cannot easily solve:

- Arbitrary dynamic obstacle avoidance.
- True shrink-wrapped multiline width.
- Upfront variable-height virtualization.
- Balanced text beyond browser limits.
- 60fps layout during animation or drag.

### Getting Started

Minimal production pattern:

```ts
import { prepare, layout } from '@chenglou/pretext'

const FONT = '16px Inter'
const LINE_HEIGHT = 24

await document.fonts.ready

const prepared = prepare(text, FONT)
const { lineCount, height } = layout(prepared, containerWidth, LINE_HEIGHT)
```

Operational rule: re-run `prepare()` only when text or font changes; re-run `layout()` whenever width changes.

---

## 7. Core Patterns Track

### Accordion: Height Prediction

Use case: CSS height/max-height transitions need a concrete pixel height before animation starts.

Pretext approach:

```ts
const prepared = prepare(sectionText, '16px Inter')

function expand(panel: HTMLElement, contentWidth: number) {
  const { height } = layout(prepared, contentWidth, 24)
  panel.style.maxHeight = `${height + paddingY}px`
}
```

Why it matters: no hidden rendering, no `offsetHeight`, no reflow loop. The content can remain real DOM text for accessibility.

### Chat Bubbles: True Shrink-Wrap

Problem: CSS `fit-content` for multiline bubbles often resolves to max width, not the actual widest rendered line.

Pretext approach:

```ts
import { prepareWithSegments, walkLineRanges } from '@chenglou/pretext'

function shrinkWrapWidth(text: string, maxContentWidth: number) {
  const prepared = prepareWithSegments(text, '16px Inter')
  let widest = 0
  walkLineRanges(prepared, maxContentWidth, line => {
    widest = Math.max(widest, line.width)
  })
  return Math.ceil(widest)
}

const contentWidth = shrinkWrapWidth(message, maxBubbleWidth - paddingX)
bubble.style.width = `${contentWidth + paddingX}px`
```

Use for chat bubbles, tooltips, badges, labels, narrow cards, or any UI where the container should hug the actual wrapped text.

### Masonry: Predict Card Heights

Use case: position variable-height cards in columns before measuring DOM.

```ts
const cards = texts.map(text => ({
  text,
  prepared: prepare(text, font),
}))

function layoutMasonry(containerWidth: number) {
  const colCount = chooseColumnCount(containerWidth)
  const colWidth = (containerWidth - gap * (colCount - 1)) / colCount
  const colHeights = Array(colCount).fill(0)

  for (const card of cards) {
    const { height: textHeight } = layout(card.prepared, colWidth - paddingX, lineHeight)
    const cardHeight = textHeight + titleHeight + paddingY
    const col = colHeights.indexOf(Math.min(...colHeights))
    placeCard(card, col, colHeights[col], colWidth, cardHeight)
    colHeights[col] += cardHeight + gap
  }
}
```

Key: card text is prepared once, but layout can run every resize.

### Balanced Text: Binary Search Width

Goal: find the narrowest width that keeps the same line count as the full-width layout.

```ts
function findBalancedWidth(prepared, maxWidth: number, lineHeight: number) {
  const targetLineCount = layout(prepared, maxWidth, lineHeight).lineCount
  if (targetLineCount <= 1) return maxWidth

  let lo = 0
  let hi = maxWidth

  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2)
    const { lineCount } = layout(prepared, mid, lineHeight)
    if (lineCount <= targetLineCount) hi = mid
    else lo = mid
  }

  return hi
}
```

This makes `layout()` useful as a search predicate. Since layout calls are cheap, 10-ish iterations for pixel precision are practical.

### Pipeline: Inspecting Text Internals

Use `prepareWithSegments()` to understand line-breaking inputs:

```ts
const prepared = prepareWithSegments(text, font)
prepared.segments.forEach((segment, i) => {
  console.log(prepared.kinds[i], segment, prepared.widths[i])
})
```

Useful for debugging non-breaking spaces, soft hyphens, line-break surprises, locale behavior, and whitespace normalization.

---

## 8. Advanced Track

### Rich API

The tutorial frames the API as three paths:

1. Fast path: `prepare()` + `layout()` for dimensions.
2. Lines path: `prepareWithSegments()` + `layoutWithLines()` for line text and widths.
3. Iterator path: `prepareWithSegments()` + `layoutNextLine()` for variable-width line-by-line layout.

Example iterator loop:

```ts
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
while (true) {
  const line = layoutNextLine(prepared, cursor, maxWidthForThisLine)
  if (!line) break
  draw(line.text, line.width)
  cursor = line.end
}
```

### Editorial Layout: Obstacles

Use `layoutNextLine()` where each line's width depends on the vertical position and obstacles.

```ts
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = paddingTop

while (y < columnHeight) {
  const { offset, width } = availableLineBox(y, obstacles, columnWidth)
  const line = layoutNextLine(prepared, cursor, width)
  if (!line) break

  ctx.fillText(line.text, columnLeft + offset, y)
  cursor = line.end
  y += lineHeight
}
```

Obstacle logic typically computes horizontal chord overlap at the line's vertical midpoint. If an obstacle intersects the line row, reduce available width or add a left offset.

### Virtualized Lists

Pretext solves the hard part of variable-height virtualization: knowing item heights before rendering.

```ts
const measured = data.map(item => {
  const prepared = prepare(item.text, font)
  const { height } = layout(prepared, textWidth, lineHeight)
  return { ...item, prepared, height: height + paddingY }
})

let top = 0
for (const item of measured) {
  item.top = top
  top += item.height
}
spacer.style.height = `${top}px`
```

During scroll, binary-search the first visible item by `top`, render only the viewport plus buffer, and position rows absolutely.

Accessibility note: add `role`, `aria-setsize`, `aria-posinset`, and consider an alternate non-virtualized access path.

### Canvas Rendering

Canvas has no multiline wrapping API. Pretext supplies the line breaks.

```ts
const prepared = prepareWithSegments(text, font)
const { lines } = layoutWithLines(prepared, maxWidth, lineHeight)

ctx.font = font
ctx.textBaseline = 'top'
lines.forEach((line, i) => {
  ctx.fillText(line.text, x, y + i * lineHeight)
})
```

Use line widths for alignment, decorations, hit targets, width indicators, text along paths, multi-column canvas layouts, or animated canvas effects.

Accessibility note: canvas text is invisible to assistive technology. Provide a DOM mirror or `aria-label`/fallback content.

### i18n Deep Dive

Use `setLocale()` before preparing text when segmentation should follow a specific language:

```ts
setLocale('ja')
const prepared = prepareWithSegments(japaneseText, '16px system-ui')
const result = layoutWithLines(prepared, 400, 24)
setLocale(undefined)
```

Notes:

- CJK may break between many characters.
- Thai requires dictionary-like segmentation because words are not space-delimited.
- Arabic and bidirectional text need correct browser/segmenter behavior.
- Emoji widths and clusters can differ by browser/platform/font.
- Locale should be scoped and reset when done.

---

## 9. Creative Track

The creative demos show that text layout data can become animation/game data. General pattern:

1. Prepare text.
2. Compute line positions.
3. Derive character, block, or collision positions.
4. Animate independently of DOM layout.

### Kinetic Typography

Use `layoutWithLines()` to get line baselines, then a canvas context to measure individual characters for per-character positions.

```ts
const prepared = prepareWithSegments(text, font)
const { lines } = layoutWithLines(prepared, maxWidth, lineHeight)

const chars = []
for (const [lineIndex, line] of lines.entries()) {
  let x = 0
  for (const char of line.text) {
    const width = ctx.measureText(char).width
    chars.push({ char, x, y: lineIndex * lineHeight })
    x += width
  }
}
```

Then animate `y + Math.sin(time + i * phase) * amplitude`, or scatter/gather characters between home and random positions.

### ASCII Art

Pretext can measure ASCII characters so proportional positioning works even when not using a strictly monospaced grid.

```ts
const widths = new Map<string, number>()
for (const char of ASCII_CHARS) {
  const p = prepareWithSegments(char, font)
  widths.set(char, p.widths[0] ?? fallbackWidth)
}
```

Use brightness-to-character mapping, then advance `x` by the measured width of the chosen character.

### Text Physics

Represent each character as a physics body. Pretext supplies home positions; the simulation handles gravity, collisions, dragging, and return forces.

Use cases: playful typography, particle text, interactive title treatments.

### ASCII Tanks

A complete artillery game where terrain, tanks, projectiles, explosions, and debris are text characters. Pretext measures game glyphs so cells and hitboxes align with rendered text.

Core idea: use measured glyph/cell dimensions for world coordinates and collision rather than assuming fixed character sizes.

### Text Rain

Characters fall and collect into reconstructed text. Pretext measures character widths and line layout for the caught text output.

### Text Tetris

A game mechanic built around reflow: rotating a falling block changes its width constraint; `layout()` instantly computes the new block height and line count.

```ts
function computeBlock(prepared, widthIndex) {
  const outerWidth = WIDTH_STATES[widthIndex]
  const innerWidth = outerWidth - paddingX
  const { height, lineCount } = layout(prepared, innerWidth, lineHeight)
  return { width: outerWidth, height: height + paddingY, lineCount }
}
```

### Breaking Spaces

A space-invaders style game where the battlefield width oscillates and every text enemy/player reflows every frame. Collision uses the current reflowed dimensions.

Lesson: because `layout()` is cheap, even deliberately excessive per-frame text relayout can become a gameplay primitive.

---

## 10. Reference Track

### Performance

Reference numbers from the tutorial:

| Operation | Approximate cost | Notes |
|---|---:|---|
| `prepare()` short text | ~0.1-0.15ms | First call; cache helps repeated segments |
| `prepare()` paragraph | ~0.3-0.5ms | More text/segments |
| `layout()` | ~0.005-0.008ms | Any width, very cheap |
| `layoutWithLines()` | ~0.02-0.03ms | Allocates line objects |
| DOM `offsetHeight` | ~1-10ms | Forced layout per element |

Performance rules:

- Prepare after fonts are loaded.
- Prepare once per text/font change.
- Layout on every resize or animation frame as needed.
- Batch prepare large datasets during idle time.
- Use `walkLineRanges()` instead of `layoutWithLines()` when you only need widths.
- Clear cache after font swaps or when memory matters.

### Browser Engines

Pretext adjusts for browser layout differences. The tutorial notes differences between Blink, WebKit, and Gecko around line-fit epsilon, CJK handling, prefix widths, and soft-hyphen behavior. Consumer code normally does not need browser-specific branches.

### Caveats

#### Font strings must match CSS exactly

Best practice:

```ts
const font = getComputedStyle(element).font
const prepared = prepare(text, font)
```

Common pitfalls:

- Relative units like `1rem`; compute pixels first.
- Missing weight/style, e.g. using `16px Inter` for bold text.
- Different fallback list than CSS.
- Quoting font names inconsistently.

#### `system-ui` is platform-dependent

`16px system-ui` resolves to different real fonts across operating systems. Measurements match the current browser, but are not portable across devices. Use a loaded web font for cross-platform consistency.

#### CSS features Pretext does not model

Avoid expecting exact matches when your rendered CSS uses:

- `text-indent`
- `word-spacing`
- `letter-spacing`
- `text-wrap: balance` or `pretty`
- `hyphens: auto`
- hanging punctuation
- complex flex/grid sizing interactions

Keep measured containers simple: font, line-height, width, and normal word wrapping.

#### Soft hyphens

Pretext supports `\u00AD`. When a line breaks at a soft hyphen, the hyphen appears and its width counts in the line.

#### White-space modes

Default is similar to normal wrapping. Use `{ whiteSpace: 'pre-wrap' }` for preserved spaces/newlines.

### Accessibility

Pretext is a measurement tool, not a rendering tool.

Rules:

1. Render text in the DOM for screen readers whenever possible.
2. Use Pretext measurements to set size/position, not to hide all semantic content.
3. For canvas text, provide a hidden DOM mirror or suitable label/fallback.
4. For virtualized lists, use `aria-setsize`, `aria-posinset`, `role`, and labels.
5. Custom controls still need keyboard support, ARIA roles/states, and focus management.
6. Respect `prefers-reduced-motion` for animated reflow.
7. Maintain WCAG contrast, especially when rendering text manually on canvas.

Example accessible measurement pattern:

```ts
const prepared = prepare(text, font)

function update(width: number) {
  const { height } = layout(prepared, width, lineHeight)
  container.style.height = `${height}px`
  container.textContent = text // real DOM text remains accessible
}
```

---

## 11. Recipes

### Resize Observer Height Measurement

```ts
const prepared = prepare(text, font)
const observer = new ResizeObserver(entries => {
  const width = entries[0].contentRect.width
  const { height } = layout(prepared, width, lineHeight)
  element.style.height = `${height}px`
})
observer.observe(container)
```

### React Hook

```tsx
import { prepare, layout } from '@chenglou/pretext'
import { useEffect, useMemo, useRef, useState } from 'react'

export function usePretextHeight(text: string, font: string, lineHeight: number) {
  const ref = useRef<HTMLDivElement | null>(null)
  const prepared = useMemo(() => prepare(text, font), [text, font])
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width
      setHeight(layout(prepared, width, lineHeight).height)
    })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [prepared, lineHeight])

  return { ref, height }
}
```

### Virtual Scroll Height Index

```ts
const items = data.map(item => {
  const prepared = prepare(item.text, font)
  const { height } = layout(prepared, width, lineHeight)
  return { ...item, prepared, height: height + paddingY, top: 0 }
})

let top = 0
for (const item of items) {
  item.top = top
  top += item.height
}
```

### Variable-Width Lines Around Obstacles

```ts
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = 0

while (true) {
  const { x, width } = getLineBoxForY(y)
  const line = layoutNextLine(prepared, cursor, width)
  if (!line) break
  ctx.fillText(line.text, x, y)
  cursor = line.end
  y += lineHeight
}
```

### Shrink-Wrap Width

```ts
function getWidestLine(text: string, maxWidth: number) {
  const prepared = prepareWithSegments(text, font)
  let width = 0
  walkLineRanges(prepared, maxWidth, line => {
    width = Math.max(width, line.width)
  })
  return Math.ceil(width)
}
```

### Canvas Text with Accessible Mirror

```ts
const prepared = prepareWithSegments(text, font)
const { lines } = layoutWithLines(prepared, maxWidth, lineHeight)

for (const [i, line] of lines.entries()) {
  ctx.fillText(line.text, 0, i * lineHeight)
}

const mirror = document.createElement('div')
mirror.className = 'sr-only'
mirror.textContent = text
canvas.parentElement?.appendChild(mirror)
```

---

## 12. Implementation Checklist

Before using Pretext in production:

- [ ] Install `@chenglou/pretext`.
- [ ] Decide exact font shorthand and line height.
- [ ] Wait for fonts with `document.fonts.ready` or explicit `FontFace` loading.
- [ ] Prepare text when text or font changes.
- [ ] Layout when width changes.
- [ ] Use the narrowest API that returns the data you need.
- [ ] Keep text accessible through DOM or mirrors.
- [ ] Avoid unsupported CSS features if exact match matters.
- [ ] Clear/rebuild caches after font changes.
- [ ] Scope `setLocale()` and reset it.
- [ ] Test in multiple browsers for edge typography cases.

---

## 13. Common Failure Modes

### Heights are wrong after page load

Cause: prepared before font loaded.

Fix: wait for `document.fonts.ready`, call `clearCache()`, and re-prepare.

### Measurements differ from rendered DOM

Likely causes:

- Font shorthand mismatch.
- CSS letter/word spacing.
- Text rendered bold/italic but prepared as normal.
- Different width due to padding/border calculation.
- `system-ui` platform differences.
- Browser hyphenation or advanced CSS text features.

### Multilingual text breaks unexpectedly

Fix: use `setLocale(locale)` before preparing, inspect `segments/kinds`, and reset locale afterward.

### Memory grows on text-heavy pages

Fix: reuse prepared objects where possible and call `clearCache()` when leaving the page or after discarding large text sets.

### Canvas text is inaccessible

Fix: add hidden DOM mirror or fallback content.

---

## 14. What to Tell Another Model to Do

When asked to use Pretext.js:

1. Ask what dimension/layout data is needed: height, line widths, line text, or variable-width flow.
2. Choose the API path accordingly.
3. Use exact font shorthand and pixel line height.
4. Include font-loading safeguards.
5. Separate prepare-time from layout-time.
6. Reuse prepared text across resizes.
7. Preserve accessibility.
8. Mention caveats for CSS features and fonts.

Example model answer skeleton:

```ts
import { prepare, layout } from '@chenglou/pretext'

const font = getComputedStyle(sampleTextElement).font
const lineHeight = 24
await document.fonts.ready

const prepared = prepare(text, font)

function measure(width: number) {
  return layout(prepared, width, lineHeight)
}
```

Then adapt:

- Replace `layout()` with `layoutWithLines()` for canvas or line rendering.
- Replace with `walkLineRanges()` for shrink-wrap/widest-line measurement.
- Replace with `layoutNextLine()` for per-line variable widths.

---

## 15. Source Map of Tutorial Tracks

Foundations:

- Home: interactive intro and character-level layout.
- Why Pretext: layout thrashing, CSS limitations, performance motivation.
- Getting Started: install, minimal example, font loading.

Core Patterns:

- Accordion: predicted height for smooth expand/collapse.
- Chat Bubbles: exact shrink-wrapping via widest line.
- Masonry: predicted card heights and shortest-column placement.
- Balanced Text: binary search for optimal width.
- Pipeline: normalization, segmentation, and measurement internals.

Advanced:

- Rich API: choosing among fast, lines, iterator, and range APIs.
- Editorial Layout: obstacle-aware variable-width lines.
- Virtualized Lists: 10,000 variable-height rows.
- Canvas Rendering: multiline canvas text.
- i18n Deep Dive: locale-sensitive segmentation.

Creative:

- Kinetic Typography: animated characters from measured home positions.
- ASCII Art: proportional ASCII rendering.
- Text Physics: character-level physics.
- ASCII Tanks: measured glyphs as game cells.
- Text Rain: falling measured characters and reconstructed text.
- Text Tetris: width/height reflow as gameplay.
- Breaking Spaces: per-frame width changes and collision reflow.

Reference:

- API Reference: function signatures and return types.
- Performance Guide: benchmarks and caching patterns.
- Caveats & Recipes: font matching, whitespace, soft hyphens, recipes.
- Accessibility: DOM text, virtual lists, canvas mirrors, ARIA, reduced motion.
- About: attribution and project context.

