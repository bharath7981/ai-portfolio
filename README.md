# AI Portfolio

A single-page portfolio built with Next.js 14 (App Router), Tailwind CSS, Lenis smooth scrolling,
GSAP ScrollTrigger pinned section flow, Framer Motion staggered reveals, and a Three.js /
React Three Fiber ambient 3D background.

## Design system — "Blueprint"

The visual direction is an engineering blueprint / schematic aesthetic rather than a generic
SaaS-gradient hero, since the content itself is about system architecture and pipelines.

**Palette** (`tailwind.config.js`):
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0A2540` | Primary background |
| `ink-deep` | `#071B30` | Alternating section background |
| `paper` | `#EAF2FF` | Primary text (cyanotype white) |
| `fog` | `#A9BBD1` | Secondary/muted text |
| `signal` | `#F5A623` | Amber accent — CTAs, active states, the one color doing real work |
| `wire` | `#5EEAD4` | Teal accent — status, data, secondary emphasis |
| `line` | `#2A4A6B` | Hairline borders and the grid background |

**Type:** Space Grotesk (`font-display`, headings only) + IBM Plex Sans (`font-sans`, body) +
IBM Plex Mono (`font-mono`, labels/eyebrows/tags) — loaded via `<link>` in `app/layout.jsx`
head, fetched by the browser at runtime rather than `next/font`, so the build itself has no
network dependency.

**Signature element:** the Three.js background (`ThreeBackground.jsx`) is a wireframe
icosahedron with pulsing "node" markers at its vertices — meant to read as an agent/pipeline
graph rather than a decorative glass blob, tying the 3D layer to the actual subject matter.

**Structural devices:**
- Section eyebrows read as drawing-sheet labels ("Sheet 02/05 — Projects") via the shared
  `SheetLabel` helper in `Sections.jsx` — justified numbering since the sections are a real
  fixed sequence, not decorative.
- Cards use `CornerFrame.jsx`, a corner-bracket wrapper, instead of soft-shadow rounded cards.
- Skills render as a labeled datasheet (`SkillsSection`) instead of a pill cloud.
- `Header.jsx` adds a fixed top progress bar (scroll position) and a live "01/05" sheet
  counter driven by `IntersectionObserver` on `.portfolio-section` elements.

**Accessibility:** `prefers-reduced-motion` disables the wireframe's rotation/pulse and cuts
CSS animation/transition durations globally (`globals.css`); all interactive elements get a
visible amber `:focus-visible` outline.

## Stack

- **Next.js 14** (App Router, JavaScript)
- **Tailwind CSS** for styling
- **Lenis** for smooth momentum scrolling
- **GSAP + ScrollTrigger** for the pinned section transition flow
- **Framer Motion** for staggered text/card reveal animations
- **Three.js / @react-three/fiber / @react-three/drei** for the floating glass icosahedron + sparkles background

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. As you scroll, each section
pins and fades/scales into the next, with the glass 3D shape and particles animating behind the content.

## Project structure

```
app/
  layout.jsx        Root layout, Google Fonts <link>, metadata
  page.jsx           Assembles header + background + scroll wrappers + sections
  globals.css         Tailwind directives, blueprint grid, reduced-motion rules
components/
  Header.jsx          Fixed nav: scroll progress bar + live section indicator
  SmoothScroll.jsx     Lenis + GSAP ticker sync
  PortfolioFlow.jsx    ScrollTrigger pin/scale/fade between sections
  ThreeBackground.jsx  Wireframe node-graph + sparkles (see Design system)
  CornerFrame.jsx       Reusable corner-bracket panel wrapper
  Sections.jsx         About / Projects / Skills / Experience / Contact
```

## Customizing content

All copy lives in `components/Sections.jsx` — edit the `projects` and `skills` arrays,
the headline text, the education block, and the contact email/link directly there.

## Fonts

The layout uses a system font stack (`app/globals.css`) rather than `next/font/google`, so the
build never depends on reaching Google Fonts over the network. If you want `Inter` /
`JetBrains Mono` specifically, add them back in `app/layout.jsx`:

```jsx
import { Inter, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// then: <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
```

## Notes on the build

- Uses the `lenis` package (the current maintained release — the original
  `@studio-freight/lenis` package was renamed/deprecated upstream).
- `ThreeBackground` wraps the 3D content in a `<Suspense>` boundary, which
  `@react-three/drei`'s `MeshTransmissionMaterial` and `Sparkles` expect.
- Sections use `viewport={{ once: false }}` so reveal animations replay on
  re-entry while scrolling back up — change to `once: true` if you'd rather
  they only animate the first time.

## Production build

```bash
npm run build
npm start
```
