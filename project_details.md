# project_details.md

Living context document for `scocos_portfolio_v2`. Update this inline as decisions are made. Language here should match the code — if they diverge, the code wins.

---

## Glossary

**WindLetters** — *(removed from Hero.tsx, replaced by HeroCanvas)*. Was a DOM-based per-character scatter component. Retained in git history.

**PretextWindHeadline** — *(removed from Hero.tsx, replaced by HeroCanvas)*. Was a Pretext-measured headline scatter component. Logic moved into HeroCanvas.

**StickyVessel** — Three.js rotating amphora (`src/components/StickyVessel.tsx`). Sticky left `md:col-span-3` column. Profile via CatmullRom spline (22 waypoints, 160 samples, 128 radial segs) matched to reference.jpg silhouette. Texture built on Canvas 2D: terracotta base + black glaze zones + section PNG composited via `multiply` blend (white disappears, black stays = authentic black-figure pottery). 6 PNGs in `/public/`: coding, graduation, engineering, planning, awards, music. Section → PNG mapped in `SECTION_PNG` config. Handles: `TubeGeometry` along CatmullRom arc. Scroll drives rotation via MotionValue; `IntersectionObserver` swaps texture per section.

**HeroPillar** — Purely decorative half Doric column (`src/components/HeroPillar.tsx`). Fills `md:col-span-2` of the hero, bleeds `BLEED_PX` past the right viewport edge. No text. Composed of: abacus band, echinus SVG arc, fluted shaft (`.pillar-shaft` + `.pillar-flutes`), base plinth, and a right-edge fade overlay (`.pillar-fade-right`). All sizing from CONFIG block constants.

**HeroCanvas** — Three.js WebGL canvas component (`src/components/HeroCanvas.tsx`). Renders both the hero name and headline as per-character `PlaneGeometry` meshes with `CanvasTexture` sprites drawn using the browser's CSS-loaded fonts (GFS Didot for name, Inter for headline). Pretext provides headline line-breaks; Canvas 2D `measureText()` provides x positions within each line. Spring-physics animation loop (RAF, no React re-renders on scroll). `MotionValue` from Hero is subscribed synchronously before `document.fonts.ready` to never miss a scroll update.

**PretextBody** — Reusable React island (`src/components/PretextBody.tsx`). Dynamically imports `@chenglou/pretext`, measures text with `ResizeObserver`, and renders per-line spans with a staggered `motion` entrance. Used in profile, experience, education, contact, and certifications sections.

**ScrollNav** — Fixed navigation header (`src/components/ScrollNav.tsx`). Fades in once the hero has scrolled past (scroll progress ~5.5%). Uses global `useScroll()` from Motion.

**Hero** — Main hero section (`src/components/Hero.tsx`). Full-viewport section with the name in display font + animated headline. Currently the only content above the fold. `client:only="react"` because it depends on scroll state.

**ZephyrName** — Sticky-scroll giant name component (`src/components/ZephyrName.tsx`). Renders the name in a 180vh section; the name sticks and characters scatter+blur as you scroll through. Built, not wired. Alternative full-bleed intro treatment.

**IntroReveal** — Black curtain page-load transition (`src/components/IntroReveal.tsx`). A fixed black overlay that slides up on mount, revealing the page below. Has a gold line sweep at the bottom before it exits. Built, not wired into `index.astro`.

**Aegean accent** — The color `--aegean: #005f8f` used to highlight the "Z" in "Ollantay **Z**. Scocos". Appears in `WindLetters`, `ZephyrName`, and link hover states.

**Gold accent** — Token `--gold` used for the Z-slash detail in `ZephyrName` and the IntroReveal sweep line. Was missing from `global.css`; now defined as `#c9a84c` (antique warm gold).

**Greek border** — CSS class `greek-border` referenced in `IntroReveal.tsx` (`<div className="... greek-border ..."/>`). Not yet defined in `global.css`. Intended as a decorative meander/key pattern strip.

**Display font** — GFS Didot, loaded via Google Fonts. Applied via `.font-display` utility class. Used for large headings (name, role titles, section h2s).

**Marble theme** — Overall aesthetic. Background `--marble: #fbfaf7`, warm off-white. Paired with olive text, aegean accents, and sand/stone secondary surfaces.

**Pretext** — `@chenglou/pretext`. Used to compute line breaks and character positions without DOM reflow. `prepare*()` runs when text/font changes; `layout*()` runs when width changes. See `pretext_js_model_handoff.md` for full API.

---

## Current State (as of 2026-05-18)

### What is working
- Full page layout and content sections (profile, skills, experience, work, education, certifications, contact)
- `PretextBody` measuring and staggered line reveal
- `ScrollNav` fade-in after hero
- Hero name in GFS Didot with per-character scroll scatter (functional but architecturally flawed)
- Design tokens, marble background, aegean/olive/gold palette

### Known Issues

| Issue | Location | Status |
|---|---|---|
| `useTransform` called in `.map()` (hooks-in-loops) | `Hero.tsx` — `WindLetters`, `PretextWindHeadline` | **Fixed** — scatter is plain state, CSS transforms computed inline |
| `--gold` CSS variable undefined | `global.css` | **Fixed** — `#c9a84c` |
| `greek-border` CSS class undefined | `global.css` | **Fixed** — SVG meander data-uri, gold stroke |
| `ZephyrName` built but not wired | `index.astro` | Decision pending (may merge into Three.js hero) |
| `IntroReveal` built but not wired | `index.astro` | **Fixed — wired in** |
| `PretextBody` doesn't await `document.fonts.ready` | `PretextBody.tsx` | Low priority; add if line-break jitter is visible |

---

## Design Direction

**Aesthetic**: Marble + Greek classical. Professional but alive. Motion should feel physical, not mechanical.

**Hero layout**:
- Left/center: Name (GFS Didot, display scale) + animated headline
- Right: Half-cut Greek Doric column, clipped at the right edge of the viewport — planned as inline SVG so no external image dependency

**Hero text animation** (planned):
- Three.js canvas overlaid on hero section
- `@chenglou/pretext` measures line positions and character x-offsets
- `troika-three-text` renders characters as WebGL meshes (SDF, crisp at all sizes)
- Scroll progress drives a physics-feel scatter: characters leave home with varied velocity, slight z-depth, light rotation — not linear index-multiplied offsets
- `prefers-reduced-motion` falls back to opacity-only fade

**Body text**: keep `PretextBody` as-is. Pretext + Motion entrance stagger is appropriate at body scale.

**Intro**: `IntroReveal` black curtain with gold sweep line. Now wired in.

---

## Implementation Plan

### Done
- [x] Define `--gold` in `global.css`
- [x] Wire `IntroReveal` into `index.astro`
- [x] Define `greek-border` in `global.css` (SVG meander/key pattern via data-uri, gold stroke)

### Next
- [x] Build `HeroCanvas.tsx` — Three.js canvas layer for hero text (scatter direction: downward, varying heights)
  - Canvas texture sprites per character (uses CSS-loaded GFS Didot via Canvas 2D API — no font file URL needed)
  - Pretext `prepareWithSegments` + `layoutWithLines` for headline line-breaking
  - Canvas 2D `measureText()` for per-character x positions
  - OrthographicCamera in pixel space — origin at canvas center, +Y up
  - Spring-physics animation loop (STIFF=0.09, DAMP=0.80) driven by MotionValue subscription
  - MotionValue subscribed synchronously (before fonts.ready) so no progress updates are missed
  - Zero React re-renders during scroll — all animation is RAF + direct DOM mutation
  - `troika-three-text` installed but not yet used (needs local font file for GFS Didot)
- [x] Doric pillar for hero right edge (`HeroPillar.tsx` — CSS/div-based, bleeds off viewport)
- [x] Section labels moved above content (inside col-9), left col-3 reserved as empty spacer
- [ ] Decide fate of `ZephyrName` (wire or retire)
- [ ] Wind effect pass over settled letters — future animation layer that sweeps across the letter field at the bottom of the hero; varying-height settle positions are intentionally preserved for this

---

## File Map

```
src/
  components/
    Hero.tsx            — Hero section (name + headline animation)
    IntroReveal.tsx     — Page-load curtain reveal
    PretextBody.tsx     — Reusable body text with Pretext measurement
    ProjectCard.tsx     — Individual project card
    ScrollNav.tsx       — Fixed nav (appears after hero scrolls)
    ZephyrName.tsx      — Sticky-scroll name treatment (unused)
  data/
    resume.ts           — Single source of truth for all copy
  pages/
    index.astro         — Page shell, imports all components
  styles/
    global.css          — CSS custom properties, font utilities, global resets
```
