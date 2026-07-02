# Incoming Students / New Crew Page

**URL:** `/incoming-students/` (also aliased to `/new-crew/`)

**Content file:** `content/english/incoming-students.html`

This is a full custom HTML file, not a Markdown page. All content is edited directly in this file.

---

## Updating the Welcome Weekend countdown

The countdown is controlled by the `data-target-date` attribute on the countdown element near the top of the file (around line 10):

```html
<div data-countdown data-target-date="2026-08-21T09:00:00">
```

Update this date to the first morning of Welcome Weekend for the new year. The format is ISO 8601: `YYYY-MM-DDTHH:MM:SS` (capital T between date and time, no timezone suffix).

The countdown automatically disappears when the date passes. The JS controller is `assets/js/countdown.js`.

> **Note:** The old documentation referenced `static/Countdown.js` — that file no longer exists. The current countdown is handled entirely by `data-countdown`/`data-target-date` attributes.

---

## Updating the co-chairs

The co-chair cards are rendered by the `{{< welcome-cochairs >}}` shortcode. The data behind them lives in `data/welcome-weekend/cochairs.yaml`.

See [`welcome_weekend_cochairs.md`](welcome_weekend_cochairs.md) for the full guide on updating co-chairs, adding headshots, and all available fields.

---

## Updating packing lists

The What to Bring / What to Want / What's Not Allowed lists are plain HTML `<ul>` elements in `incoming-students.html`. Find the relevant section and edit the `<li>` items directly.

---

## Updating room information

Room dimensions, furniture details, and any links to official ND Residential Life pages are also in this file. Search the file for the relevant text and update in place.

Check the ND Office of Residential Life website each year to confirm the linked resources (FAQs, floor plans) are still current and that the URLs haven't changed.

---

## Updating the Welcome Weekend schedule / CTA buttons

CTA buttons near the top of the page link to resources like:
- Coyle Hall Room Guide
- Residential Life FAQs
- Floor Plans
- Welcome Weekend official page

These are `<a>` tags in the HTML file. Update the `href` values if the linked pages move. The ND links in particular tend to change URLs between years.

---

## Page structure overview

The page sections, top to bottom:
1. **Banner** — parallax banner image via `{{< banner >}}` shortcode
2. **Countdown** — Welcome Weekend countdown grid
3. **Co-chairs** — `{{< welcome-cochairs >}}` shortcode card grid
4. **Info sections** — room details, packing lists, CTA links
