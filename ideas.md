# Case Study Design Direction

## Selected Approach: Editorial Long-form

A single, deliberate design philosophy informed by Medium, Apple Newsroom, and senior PD case study sites (Bryn Jackson, Vitaly Friedman, Linear changelog). The case study itself is a piece of design craft.

### Core Principles
1. **Reading-first.** Long-form column (~640–720px) optimized for legibility.
2. **Figures as breakouts.** Design artifacts break out of the column at large/full-bleed widths to give the work its due.
3. **No buzzwords, no fluff.** Plain language; every sentence does work.
4. **Editorial pacing.** Section openers, marginalia for definitions, captions with intent.

### Color Philosophy
Warm off-white (#FAF9F6) background to feel like paper. Deep ink (#1A1A1A) for body. Single warm accent indigo (#2540D6) — a more saturated cousin of Meta blue — used sparingly for kickers, key terms, and figure numbering. Subtle grain on hero only.

### Typography System
- **Display + body:** Source Serif 4 (variable) — editorial serif with strong contrast. Used at 18–20px body, 60–80px display.
- **UI / labels / captions:** Inter Tight — neutral sans for kickers, captions in small caps, figure numbers, marginalia.
- **Pairing rule:** Serif owns prose. Sans owns metadata. Never mix within a sentence.

### Layout Paradigm
- Single-column editorial layout, NOT centered hero + grid template.
- Asymmetric: prose column anchored ~40% from left edge on desktop. Right margin used for marginalia (inline definitions of ads concepts).
- Figure breakouts: 3 widths — column (default), wide (1.5x), full-bleed.
- Section openers: oversized number + section title, lots of vertical space above.

### Signature Elements
- **Marginalia** for inline definitions (e.g., "Ad Set" defined in the right margin first time it appears) — replaces tooltips, which Shane explicitly rejected.
- **Figure numbering** in small-caps serif (e.g., "Fig. 03 — The four-level hierarchy of Ads Manager").
- **Custom hand-drawn-feeling diagrams** for foundational concepts (Ads Manager L1–L4, IA decision matrix). These are NOT generic flowcharts; they're considered illustrations.
- **Lightbox** with smooth scale-in for any UI screenshot — click to inspect.

### Interaction Philosophy
Calm and considered. Subtle fades on scroll, no parallax theatrics. Lightbox is the only "feature" interaction. Hover states on links use a precise underline animation.

### Animation Guidelines
- Figures and section headings: 400ms ease-out fade + 8px slide-up on enter-viewport.
- Lightbox: 250ms scale from origin.
- Link underlines: 200ms grow from left.
- Scroll progress indicator (1px line at top).
- NO bouncy easings, NO marquees, NO confetti.

### What we are NOT doing
- No centered hero with full-width gradient background.
- No purple/pink gradients or "AI" aesthetics.
- No emoji icons.
- No card grid summary.
- No tooltips on inline terms — use marginalia instead.
- No Inter as the only font.
