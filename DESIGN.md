---
name: Coyle Hall
description: Official website for Coyle Hall at the University of Notre Dame — brotherhood, tradition, and community, built in green.
colors:
  coyle-dark-green: "#064121"
  coyle-light-green: "#0A8A3F"
  coyle-accent: "#53f55c"
  nd-blue: "#0c2340"
  nd-gold: "#ae9142"
  surface-white: "#ffffff"
  surface-dark: "#000000"
  neutral-light: "#cccccc"
  ink-primary: "#444444"
  ink-muted: "#b4afb5"
typography:
  display:
    fontFamily: "Alfa Slab One, serif"
    fontSize: "clamp(4rem, 11vw, 8rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "0.08em"
  subheading:
    fontFamily: "Alfa Slab One, serif"
    fontSize: "clamp(1.5rem, 3vw, 2.5rem)"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.2em"
  headline:
    fontFamily: "Rubik, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "normal"
  title:
    fontFamily: "Rubik, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "normal"
  body:
    fontFamily: "Rubik, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Rubik, sans-serif"
    fontSize: "1.1rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "normal"
rounded:
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "28px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.coyle-dark-green}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.coyle-light-green}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  nav-link-active:
    backgroundColor: "{colors.coyle-light-green}"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  search-input:
    backgroundColor: "transparent"
    textColor: "{colors.surface-white}"
    rounded: "{rounded.md}"
    padding: "8px 20px 8px 50px"
---

# Design System: Coyle Hall

## 1. Overview

**Creative North Star: "The Brotherhood Hall"**

Coyle Hall's visual system carries the weight of a place that has been lived in and loved. This isn't a new building introducing itself — it's a community with 70 years of history moving into a new home. The design conveys permanence without stiffness, pride without performance. Every surface should feel like something earned rather than branded.

The palette is deep and committed: Coyle green dominates. The typography pairs a slab display face — wide, uppercase, institutional — with the friendly utility of Rubik at every other size. Motion is purposeful: parallax banners, staggered nav entrances, and fade-in sections that build toward the content rather than distracting from it. Interactions feel warm and tactile — a button press feels like a handshake, not a tap on glass.

This system explicitly rejects the generic university web template aesthetic: interchangeable layouts, corporate neutrals, stock imagery in card grids. It also rejects the social-media-ified hall site that looks like a feed. Coyle Hall has a specific identity. The site should be unmistakably *this* hall.

**Key Characteristics:**
- Deep Coyle green is the dominant surface color, not an accent
- Alfa Slab One owns the banner/hero layer; Rubik owns everything else
- Rounded pill shapes (16px radius) for all interactive elements — consistent, friendly, never sharp
- Parallax banners with a green tint overlay establish each page's place in the hall
- Shadows appear on state (hover, elevation) only — the default surface is flat
- Wave canvas transitions bridge the banner and the content layer on inner pages
- Dark mode inverts background to black, shifts greens lighter; the identity holds in both

## 2. Colors: The Coyle Green Palette

Green is not an accent here. It *is* the system. The palette reads as deeply saturated institutional identity, softened by white and tempered by near-black.

### Primary
- **Deep Forest Green** (`#064121`): The primary surface color. Used on the navbar (when scrolled), mobile menu full-screen overlay, dropdown menus, and as the darkest green in the homepage banner gradient. The floor of the palette.
- **Coyle Green** (`#0A8A3F`): The interactive and accent green. Hover states on nav links, active page indicators, homepage banner gradient endpoint, search result highlight marks. The voice of the system.

### Secondary
- **Bright Crew Green** (`#53f55c`): Used in dark mode as the primary and secondary interaction color. Brighter and warmer than Coyle Green; provides the same visual role at lower overall luminance.

### Tertiary
- **Notre Dame Blue** (`#0c2340`): Present in brand identity (logo area, ND institutional references) but not used as a UI surface color. Reserved for co-branding contexts.
- **Notre Dame Gold** (`#ae9142`): Same as ND Blue — brand identity, not UI. Do not introduce it as a UI accent.

### Neutral
- **Surface White** (`#ffffff`): Default light-mode body background; also used for text on all dark (green) surfaces.
- **Surface Dark** (`#000000`): Dark-mode body background.
- **Neutral Light** (`#cccccc`): Divider lines, `bg-custom-light` utility backgrounds for profile cards in light mode.
- **Ink Primary** (`#444444`): Body text color in light mode. Verified contrast against white; do not lighten further.
- **Ink Muted** (`#b4afb5`): Muted text in dark mode. Use for secondary/caption content only; check contrast before body use.

### Named Rules

**The Green-Is-The-Brand Rule.** Do not introduce a new accent color as a "complementary tone" unless it is ND Gold or ND Blue in a co-branding context. The system has one accent family: green. Its depth is the identity.

**The No-Warm-Neutral Rule.** The body background is white (`#ffffff`) in light mode and black (`#000000`) in dark mode. Do not replace these with beige, cream, paper, or warm near-whites. Warmth is carried by the green palette and photography, not the background.

## 3. Typography

**Display Font:** Alfa Slab One (serif, Google Fonts)
**Body Font:** Rubik (sans-serif, Google Fonts, weights 500/600/700/800)

**Character:** Alfa Slab One is reserved for the hero layer only — full-width banners, page headings over imagery. Its width and weight make it institutional and unmissable at large sizes; it should never appear at body sizes. Rubik handles everything else: warm, geometric, legible across weights, it gives the system approachability without informality.

### Hierarchy
- **Display** (Alfa Slab One, 400, `clamp(4rem, 11vw, 8rem)`, line-height 0.95, letter-spacing 0.08em, uppercase): Banner hero headings over full-width imagery. The hall's name, page name, or a single tradition title. Never more than 3 words. Never at content-section level.
- **Subheading** (Alfa Slab One, 400, `clamp(1.5rem, 3vw, 2.5rem)`, line-height 1.1, letter-spacing 0.2em, uppercase): Banner subheadings directly under display text. One line maximum.
- **Headline** (Rubik 800, `clamp(2rem, 4vw, 3rem)`, line-height 1.1): Section-opening h1 elements. First heading of a content page.
- **Title** (Rubik 700, 1.875rem / 30px, line-height 1.2): H2 section titles within page content. Named sections like "Building a Legacy", "Keeping it Alive".
- **Body** (Rubik 500, 1rem / 16px, line-height 1.65): All paragraph text. Cap at 65–75ch for readability.
- **Label** (Rubik 600, 1.1rem, line-height 1.3): Navigation links, captions, stat labels, UI affordance text.

### Named Rules

**The Slab-Only-Over-Images Rule.** Alfa Slab One appears exclusively in the banner layer — over full-width photography with the green tint overlay. Never use it as a content section heading, card title, or inline heading. Rubik owns those.

**The No-Third-Typeface Rule.** The system uses exactly two typefaces. Do not add a third, even for a "special section." Weight and size contrast within Rubik provides all the hierarchy needed below the banner.

## 4. Elevation

This is a flat-by-default system. Surfaces sit at rest without shadow. Depth appears only as a response to state or structural need — to signal interactivity, separate a floating layer, or ground a popover.

### Shadow Vocabulary
- **Interactive lift** (`0 4px 8px rgba(0,0,0,0.1)`): Appears on hover for buttons, nav links, social icon links, and any clickable card. Confirms interactivity. Never present at rest.
- **Dropdown** (`0 8px 25px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.2)`): Desktop nav dropdown menus and the mobile search container. Two-layer shadow that grounds a floating layer above the page.
- **Panel** (`0 8px 32px rgba(0,0,0,0.3)`): Search results panel, inline search slot. Heavier than dropdown — used for larger floating surfaces.
- **Card** (`shadow-lg` / Tailwind): Images in content sections. Adds depth to photography without interactive implication.

### Named Rules

**The Flat-At-Rest Rule.** No element carries a shadow in its default, non-hovered state unless it is a floating layer (dropdown, panel, modal). State triggers shadow; rest earns flatness.

## 5. Components

### Buttons
Warm and tactile — pressing a button should feel like engaging something physical, not tapping glass.
- **Shape:** Rounded pill (16px radius)
- **Primary (dark green):** Background `#064121`, text white, padding 12px 24px. Scale hover: `transform: scale(1.05)` + `box-shadow: 0 4px 8px rgba(0,0,0,0.1)`. Transition: `0.15s ease-in-out`.
- **Primary (light green):** Background `#0A8A3F`, text white. Used as CTA on dark surfaces (mobile nav "Incoming Students" resolved state).
- **Ghost / Outline:** White background, dark green text. Used for the "Incoming Students" nav CTA on light surfaces. Border-radius 16px, no explicit border.

### Navigation
The floating navbar is the system's signature. It starts transparent over banner imagery and gains a green tinted blur on scroll.
- **Default (over banner):** Background transparent, backdrop-filter none. All link text white.
- **Scrolled state:** Background `rgba(6, 65, 33, 0.7)` with `backdrop-filter: blur(16px)`. Box-shadow `0 6px 24px rgba(0,0,0,0.2)`.
- **Nav link default:** Transparent bg, white text, Rubik 600, 1.1rem, padding 12px 16px.
- **Nav link hover:** Background `#0A8A3F`, white text, border-radius 16px, `translateY(-1px)`. Transition 0.2s ease.
- **Nav link active:** Background `#0A8A3F`, white text, border-radius 12px.
- **Dropdown:** Background `#064121`, border-radius 16px, `0 8px 25px rgba(0,0,0,0.3)`. Items hover to `#0A8A3F` with 16px radius.
- **Mobile menu:** Full-screen overlay, background `#064121`. Nav links at 1.9rem Rubik 700, centered, staggered translateY entrance animation. Hamburger morphs to X on open.

### Cards / Image Containers
- **Corner Style:** Gently curved (border-radius: 16px / `rounded-2xl`)
- **Background:** Transparent; content section bg is white (light) / black (dark)
- **Shadow:** `shadow-lg` on imagery. No shadow on cards at rest; only on hover.
- **Interactive Tilt:** Images in content sections have `.interactive-tilt` — `scale(1.03)` hover with a radial white-glint pseudo-element. Transition: `cubic-bezier(0.25, 1, 0.5, 1)`.

### Search Input
- **Style:** Ghost/transparent, white border `2px solid rgba(255,255,255,0.9)`, border-radius 16px. Search icon absolutely positioned left 20px.
- **Focus:** Border goes fully opaque (`rgba(255,255,255,1)`). No background fill, no box-shadow.
- **Results panel:** Fixed floating, background `rgba(10, 132, 61, 0.5)` with `backdrop-filter: blur(16px)`, border-radius 24px, `0 8px 32px rgba(0,0,0,0.3)`.

### Banner / Hero (Signature Component)
The page-establishing layer that gives every page its visual identity.
- **Structure:** Fixed `page-banner-wrapper` (z-index: -1), `background-image` CSS parallax, green tint overlay (`rgba(10, 132, 61, 0.5)`), Alfa Slab One heading centered.
- **Height:** `clamp(400px, 50vh, 600px)` desktop; `clamp(300px, 40vh, 450px)` mobile.
- **Wave transition:** Canvas-drawn wave at the bottom of the banner softens the cut to the white content layer.
- **Parallax:** Background-position driven by JS scroll offset (`--page-parallax-bg-y`).

### Fade-In Sections
- All content sections use `.fade-in-section`: start at `opacity: 0; transform: translateY(40px)`. On IntersectionObserver trigger: `opacity: 1; transform: none`. Transition `0.8s ease`.
- **Reduced motion:** Provide `@media (prefers-reduced-motion: reduce) { .fade-in-section { opacity: 1 !important; transform: none !important; transition: none !important; } }` — the class must not gate content visibility for users who disable animation.

## 6. Do's and Don'ts

### Do:
- **Do** use `#064121` (Deep Forest Green) as the primary identity surface for navbars, overlays, and dropdown menus.
- **Do** use `#0A8A3F` (Coyle Green) for hover states, active links, CTA buttons, and interactive indicators.
- **Do** keep Alfa Slab One exclusively for banner/hero headings over full-width imagery with the green tint layer. Rubik owns everything below.
- **Do** honor `prefers-reduced-motion` on all animations — especially `.fade-in-section`, parallax, and mobile nav stagger. Content must be visible without the transition firing.
- **Do** verify `#444` body text on white (`#ffffff`) background passes WCAG AA (4.5:1) before switching to any lighter gray.
- **Do** use border-radius 16px as the universal interactive element radius — nav links, buttons, dropdowns, search input — for visual consistency.
- **Do** let the photography and green palette carry warmth. The body background is white or black; never beige, cream, or tinted near-white.

### Don't:
- **Don't** build the site to look like a generic ND department page: muted neutrals, interchangeable card grids, corporate spacing. Coyle Hall has a specific identity; the site should be unmistakably *this* hall.
- **Don't** introduce social-media-style layouts — card feeds, infinite scroll, Instagram-grid composition. This is a place, not a platform.
- **Don't** use gradient text (`background-clip: text`). Use solid color for all text — emphasis via weight or size.
- **Don't** add a third typeface. The system has two: Alfa Slab One (banners only) and Rubik (everything else).
- **Don't** add a colored side-stripe border to cards, callouts, or list items as a decorative accent. Use full borders, background tints, or nothing.
- **Don't** use ND Gold (`#ae9142`) or ND Blue (`#0c2340`) as UI accent colors. They appear only in co-branding or institutional attribution contexts.
- **Don't** soften the body background to cream, sand, or any warm near-white. The warmth of the brand lives in the green palette and photography, not the background.
- **Don't** add section eyebrows ("ABOUT", "PROCESS") as a default scaffold. The banner heading establishes each page; content sections use titled headings, not kickers.
- **Don't** animate layout properties (width, height, margin, padding). Animate only transform and opacity.
- **Don't** show shadow at rest on buttons or nav links. Shadow is a state response (hover, focus), not a default style.
