---
target: homepage (themes/hugoplate/layouts/index.html)
total_score: 25
p0_count: 0
p1_count: 3
timestamp: 2026-06-07T01-27-37Z
slug: themes-hugoplate-layouts-index-html
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Nav active states good; Instagram feed shows loading state — no feedback on ticker failure |
| 2 | Match System / Real World | 3 | Language is authentically hall-native; visible typo "Ammenities" undermines trust |
| 3 | User Control and Freedom | 3 | Nav cleanly escapable; ticker has no pause affordance |
| 4 | Consistency and Standards | 3 | Visual system is highly consistent; two h1 elements on one page breaks document semantics |
| 5 | Error Prevention | 2 | Duplicate McGlinn Hall links (same URL, different framing) invite confusion |
| 6 | Recognition Rather Than Recall | 3 | Nav well-labeled; fact cards have icon+label+value; ticker images anonymous |
| 7 | Flexibility and Efficiency | 2 | Search present; acceptable for informational site |
| 8 | Aesthetic and Minimalist Design | 3 | Real personality; decorative anchor icon and dual-h1 cluster create noise |
| 9 | Error Recovery | 2 | Instagram feed handles failure; ticker has no broken image handling |
| 10 | Help and Documentation | 2 | Self-explanatory for residents; no CTA for incoming students on homepage |
| **Total** | | **25/40** | **Acceptable** |

## Anti-Patterns Verdict

**LLM assessment:** Not AI-generated. The Alfa Slab One banner, rotated ticker, wave canvas, and floor plan fact card overlay are earned personality choices. The "Fishers of Men" + wavy divider + "1952 • 2025" typographic sequence is charming. Two patterns to watch: uppercase tracked "2025-2026" eyebrow treads the absolute-ban line (defensible here due to date content), and the large decorative anchor icon (`text-9xl scale(1.85) rotate(30deg)`) is noise, not identity.

**Deterministic scan:** Exit code 0 — clean. No findings.

## Overall Impression

Genuine character throughout. Wave canvas, fact card overlay, photo ticker all work. Single biggest opportunity: accessibility — three issues (aria-hidden on fact cards, missing reduced-motion on fade-in-section, continuous ticker animation) mean non-trivial users can't fully access the page. Fixable in an afternoon.

## What's Working

1. Photo ticker strip — slight rotation per image, velocity-eased hover pause. Communicates community energy better than any card grid.
2. Fast Facts floor plan overlay — using the building's actual footprint as layout anchor is genuinely distinctive.
3. Typography discipline — Alfa Slab One owns banners only, Rubik owns everything else.

## Priority Issues

**[P1] `.fade-in-section` can render content invisible**
- No `@media (prefers-reduced-motion: reduce)` override. Starts at opacity:0 — headless renderers, search crawlers, users with motion sensitivity see no content.
- Fix: Add `@media (prefers-reduced-motion: reduce) { .fade-in-section { opacity: 1 !important; transform: none !important; transition: none !important; } }` to custom.css.

**[P1] Ticker runs continuously with no reduced-motion check**
- `requestAnimationFrame` loop has no `prefers-reduced-motion` guard. Horizontal auto-scroll is a vestibular disorder trigger.
- Fix: Wrap tick() call with matchMedia check; stop the loop if reduced-motion is preferred.

**[P1] Fast fact cards are `aria-hidden="true"` but contain primary content**
- All 9 fact card divs (Location, Population, Mascot, Chapel, Amenities, Building, Dorm Colors, Sister Dorm, Learn More) are aria-hidden. Screen readers see an empty Fast Facts section.
- Fix: Remove aria-hidden="true" from the card divs. Keep it on the decorative SVG floor plan only.

**[P2] Two `<h1>` elements on one page**
- "Fishers of Men" and "1952 • 2025" are both h1. Change "1952 • 2025" to a p or h2.

**[P2] "Ammenities" spelling error**
- Visible in Fast Facts card. Should be "Amenities."

**[P2] 140-word wall-of-text intro paragraph**
- Single paragraph, no breaks. Hook sentence is buried at the end. Break into 2-3 shorter paragraphs.

## Persona Red Flags

**Jordan (Incoming Student):** No homepage CTA to the New Crew page. "Fishers of Men" heading has no context for someone who doesn't know Fisher Hall history. Abandons before finding the incoming students section.

**Casey (Mobile User):** Photo ticker has no touch pause affordance. Quote section has left-biased padding (pl-16) that creates awkward asymmetry on narrow phones.

**Sam (Accessibility):** Fast Facts section is entirely invisible to screen readers (aria-hidden). Two h1 elements fragment the document outline. Large anchor icon has no aria-hidden.

## Minor Observations

- Award logo row margin-bottom: 8rem — large whitespace gap, possibly intentional.
- McGlinn Hall linked twice in Fast Facts with different labels, same destination.
- Large anchor icon behind quote block has no aria-hidden="true".
- Instagram hover overlay caption at 0.82rem is hard to read quickly.
