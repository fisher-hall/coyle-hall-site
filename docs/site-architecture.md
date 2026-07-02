# Site Architecture

Reference document for understanding how the site is built and how the pieces fit together. Read this when something breaks or when you need to make a structural change.

---

## How Hugo works (30-second version)

Hugo is a static site generator. At build time it reads:
1. **Content files** (`content/`) — Markdown or HTML files with front matter
2. **Data files** (`data/`) — YAML/JSON structured data
3. **Layout templates** (`layouts/`) — Go HTML templates that combine content + data into pages

The output is a folder of plain HTML, CSS, and JS files (`public/`) that gets published to GitHub Pages. There is no server, no database, and no PHP/Node at runtime. The site is entirely static.

---

## Theme vs. custom code

The site is built on the **hugoplate** theme (in `themes/hugoplate/` and vendored in `_vendor/`).

Hugo's lookup order means files in the root `layouts/` directory **override** their counterpart in the theme. The same applies to `assets/` (CSS/JS) — if a file exists at `assets/css/site/navbar.css` in the project root, Hugo uses that instead of any same-named file in the theme.

**Rule: never edit anything inside `themes/` or `_vendor/`.** Those directories are controlled by the theme version. All customizations belong in the project root.

---

## Directory map

### `content/english/`
Page content. Most pages are `.html` files that use shortcodes to pull in components.

| Path | What it is |
|---|---|
| `_index.html` | Homepage — banner, awards section, fast facts, Instagram feed |
| `hall-staff/_index.md` | Hall Staff index page (stub — layout handles everything) |
| `hall-gov/_index.md` | Hall Government index page (stub) |
| `hall-commissioners/_index.md` | Hall Commissioners index page (stub) |
| `incoming-students.html` | Welcome Weekend / New Crew page |
| `events/` | Event pages (Car Smash, Crunk, Formal, Regatta, etc.) |
| `about/` | History, location, building details, St. Adalbert's |

### `data/`
Structured data consumed by layouts. YAML is preferred over JSON for human readability.

| File | Used by |
|---|---|
| `hall-staff/staff.yaml` | `layouts/hall-staff/hall_staff.html` |
| `hall-staff/past.yaml` | Same layout (Past Staff accordion) |
| `hall-gov/government.yaml` | `layouts/hall-gov/hall_gov.html` |
| `hall-gov/past.yaml` | Same layout (Past Gov accordion) |
| `hall-commissioners/commissioners.yaml` | `layouts/hall-commissioners/hall_commissioners.html` |
| `hall-commissioners/past.yaml` | Same layout (Past Commissioners accordion) |
| `welcome-weekend/cochairs.yaml` | `layouts/shortcodes/welcome-cochairs.html` |
| `social.json` | Footer and navbar social links |
| `theme.json` | Design tokens consumed by the hugoplate theme |

### `layouts/`
Custom page templates. Files here shadow the theme.

| Path | Purpose |
|---|---|
| `hall-staff/hall_staff.html` | Full Hall Staff page (reads `data/hall-staff/`) |
| `hall-gov/hall_gov.html` | Full Hall Government page (reads `data/hall-gov/`) |
| `hall-commissioners/hall_commissioners.html` | Full Commissioners page (reads `data/hall-commissioners/`) |
| `partials/components/a11y-panel-overlay.html` | Accessibility preferences panel |
| `shortcodes/banner.html` | Inner-page parallax banner |
| `shortcodes/event-carousel.html` | Auto-detecting photo carousel for event pages |
| `shortcodes/event-countdown.html` | Reusable countdown block |
| `shortcodes/welcome-cochairs.html` | Co-chair cards on the incoming students page |
| `shortcodes/ticker.html` | Homepage scrolling photo strip |
| `404.en.html` | Custom 404 page |

### `assets/css/`
Entry point: `custom.css` (imports everything in order).

| File | Purpose |
|---|---|
| `colors.css` | All CSS custom properties / design tokens. Edit color values here. |
| `home.css` | Homepage-only styles (banner, ticker, fast facts, Instagram) |
| `site/navbar.css` | Floating navbar (desktop + mobile), inline search, scroll behavior |
| `site/a11y-prefs.css` | Accessibility panel UI + all rendering hooks (high contrast, dyslexia font, etc.) |
| `site/base.css` | Global resets, typography, heading weights |
| `site/footer.css` | Footer styles |
| `site/search.css` | Inline search bar and results dropdown |
| `site/interactions.css` | Tilt effect, fade-in, skip link, scroll behavior |
| `ui-elements/button.css` | Button component styles |
| `ui-elements/carousel.css` | Carousel component |
| `ui-elements/switch.css` | Toggle switch (theme switcher + a11y panel) |
| `ui-elements/checkbox.css` | Custom styled checkbox |
| `ui-elements/banner.css` | Page banner wrapper, wave divider |
| `ui-elements/countdown.css` | Countdown number grid |

### `assets/js/`
| File | Purpose |
|---|---|
| `main.js` | Loaded on every page. Mobile menu, desktop dropdowns, inline search, tilt effect, scroll detection. |
| `home.js` | Homepage only. Parallax, wave canvas, Instagram feed fetch, photo ticker. |
| `a11y-prefs.js` | Accessibility panel behavior — segmented controls, toggles, focus trap, localStorage. |
| `commissioner-card.js` | Bio panel expand/collapse and Past accordion lazy image load. |
| `countdown.js` | Universal countdown timer for any `[data-countdown]` element. |
| `page-animations.js` | Wave canvas and parallax for inner-page banners. |
| `carousel.js` | Auto-playing carousel controller. |

---

## Colors and design tokens

All color values are defined as CSS custom properties in `assets/css/colors.css`. Use these tokens everywhere — never hardcode hex values in layout templates.

| Token | Light mode | Dark mode |
|---|---|---|
| `--primary-color` | `#064121` (dark green) | `#0a843d` (mid green) |
| `--secondary-color` | `#0a843d` (mid green) | `#16da64` (accent green) |
| `--coyle-dark-green` | `#064121` | (fixed) |
| `--coyle-light-green` | `#0a843d` | (fixed) |
| `--coyle-accent-green` | `#16da64` | (fixed) |
| `--nd-blue` | `#0c2340` | (fixed) |

Dark mode is triggered by the `.dark` class on `<html>`. The a11y system and theme switcher manage this class.

---

## Accessibility system

The site has a full accessibility preferences panel (`a11y-prefs.js` + `a11y-prefs.css`). User preferences are stored in `localStorage` and applied on load via an inline script in the theme's `<head>`.

Preferences supported:
- **Theme**: light / dark / follow system
- **Contrast**: normal / high / follow system
- **Motion**: full / reduced / follow system
- **Line spacing**: on / off
- **Letter spacing**: on / off
- **Dyslexia-friendly font**: on / off (uses OpenDyslexic, self-hosted in `static/fonts/`)

High contrast mode adds `html.a11y-contrast-high` to the `<html>` element and triggers extensive CSS overrides throughout `a11y-prefs.css`.

---

## Image pipeline

Images in `assets/images/` are processed by Hugo's built-in asset pipeline:
- Resized and converted to WebP at build time
- Cached in `resources/_gen/` (committed to git to speed up CI builds)
- Served via the same CDN as the rest of the site

Images in `static/images/` are copied verbatim — no processing, no format conversion. Only put files there if they need to be served as-is (SVGs, PDFs, legacy formats).

**Headshots always go in `assets/images/headshots/`.** The layouts reference them with paths like `/images/headshots/hall-staff/26-27/name.jpg` and Hugo resolves them through the pipeline.

---

## Search

The site uses a client-side inline search (no external search service). At build time, Hugo generates `/searchindex.json` containing the title, description, and body of every page. When a user clicks the search icon in the navbar, `main.js` fetches this JSON, filters it by substring match, and renders results inline.

The old search modal (`custom-search-modal.html`) is permanently hidden via CSS. `assets/js/search-new.js` is a legacy Lunr.js implementation that is no longer active.

---

## Hugo modules

The site uses Hugo modules (Go modules) for some third-party integrations. Active modules include: search index output, PWA support, image and video processing helpers, Font Awesome icons, accessibility components, and gallery slider. These are vendored locally in `_vendor/` so builds don't require internet access.

If you need to update a module: `hugo mod get -u <module-path>` then `hugo mod vendor`.

---

## Configuration files

| File | Purpose |
|---|---|
| `hugo.toml` | Root Hugo config: base URL, output formats, image quality, CSS/JS plugins |
| `config/_default/params.toml` | Site-wide params: logo, favicon, navbar behavior, SEO keywords |
| `config/_default/menus.en.toml` | Navigation structure and links |
| `config/_default/languages.toml` | Language settings (English only) |
| `config/_default/module.toml` | Hugo module imports |
| `.github/workflows/main.yml` | GitHub Pages deploy workflow and Hugo/Go version pins |
| `package.json` | Node dependencies (Tailwind CSS, Prettier) |

---

## Tailwind CSS

Tailwind v4 is used via `@tailwindcss/cli`. Because Hugo builds don't scan content files for classes the way a typical JS bundler would, Tailwind uses `hugo_stats.json` (auto-generated by Hugo's build stats) to detect which utility classes are actually used. This file is committed to the repo.

If you add a new Tailwind class that never appeared before, run `hugo` once first to regenerate `hugo_stats.json`, then the class will be included in the CSS bundle.

---

## Deployment

See [`deployment.md`](deployment.md) for the full deploy workflow.
