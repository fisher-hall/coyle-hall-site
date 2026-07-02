# Coyle Hall Site — Maintainer Documentation

This is the handoff guide for whoever maintains the Coyle Hall website. Start here.

---

## Quick reference — most common tasks

| Task | Where to go |
|---|---|
| Update hall staff (new year) | [`hall_staff.md`](hall_staff.md) |
| Update hall government (new year) | [`hall_gov.md`](hall_gov.md) |
| Update commissioners (new year) | [`hall_commissioners.md`](hall_commissioners.md) |
| Update Welcome Weekend co-chairs | [`welcome_weekend_cochairs.md`](welcome_weekend_cochairs.md) |
| Update countdown date | [`incoming_students.md`](incoming_students.md) |
| Update packing list / room info | [`incoming_students.md`](incoming_students.md) |
| Instagram feed issues | [`behold-instagram-feed.md`](behold-instagram-feed.md) |
| Full annual rollover checklist | [`year-rollover.md`](year-rollover.md) |
| Deploying changes | [`deployment.md`](deployment.md) |
| Visitor analytics | [`analytics.md`](analytics.md) |
| Technical / architectural reference | [`site-architecture.md`](site-architecture.md) |

---

## Tech stack at a glance

- **Hugo** — static site generator. Content and data files → HTML at build time. No server, no database.
- **Tailwind CSS v4** — utility CSS classes applied directly in layout templates.
- **GitHub Pages** — hosting. A push to `main` triggers an automatic build and deploy via GitHub Actions.
- **Hugoplate** — the base theme (vendored in `_vendor/`). Do not edit the theme directly; all customizations live in `layouts/`, `assets/css/`, and `assets/js/`.

---

## Repository layout

```
coyle-hall-site/
├── content/english/       # Page content (markdown and HTML files)
├── data/                  # YAML data files — people, past members, social links
│   ├── hall-staff/
│   ├── hall-gov/
│   ├── hall-commissioners/
│   └── welcome-weekend/
├── layouts/               # Custom page templates and shortcodes
├── assets/
│   ├── css/               # All custom CSS
│   ├── js/                # All custom JavaScript
│   └── images/            # Headshots and page images (processed by Hugo to WebP)
├── static/                # Files served as-is (fonts, SVGs, legacy images)
├── config/                # Hugo config (site params, menus, language)
├── docs/                  # ← you are here
└── themes/hugoplate/      # Base theme (do not edit)
```

---

## First-time setup

Prerequisites: Hugo (extended, v0.147+), Go, Node.js, Yarn.

```bash
yarn install          # install Node dependencies
yarn project-setup    # copies theme assets into place (run once)
hugo server           # start local dev server at http://localhost:1313
```

Changes to CSS or JS are picked up automatically on save. Changes to YAML data files rebuild the affected pages instantly.

---

## Ownership and accounts

| Service | Purpose | Account |
|---|---|---|
| GitHub | Source code, hosting (Pages), and CI/CD | `fisher-hall` org — add new maintainer as collaborator |
| Namecheap | Domain registration (`coylehallnd.com`) | Transfer to new maintainer |
| Cloudflare | DNS and Web Analytics | Transfer to new maintainer |
| Behold.so | Instagram feed proxy | `dburke6` — transfer in account settings |

---

## The most important rules

1. **Never edit files inside `themes/`** — those changes are overwritten when the theme is updated. Put overrides in `layouts/` or `assets/` instead.
2. **Images in `assets/images/` are processed** to WebP at build time. Images in `static/images/` are served as-is. Headshots should always go in `assets/images/headshots/`.
3. **All people data lives in YAML files** under `data/`. The markdown files under `content/english/hall-staff/` and `content/english/hall-gov/` are legacy placeholders and are not read by the current layouts.
4. **Deploys happen automatically** — pushing to `main` triggers a GitHub Actions build that publishes to GitHub Pages. There is no manual upload step.
