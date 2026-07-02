# Annual Year Rollover Guide

Do this at the start of each new academic year (August/September). Steps are ordered — complete them top to bottom.

---

## 1. Hall Staff

**File:** `data/hall-staff/staff.yaml`

**a) Archive the outgoing staff.**
Open `data/hall-staff/past.yaml` and prepend a new year block at the top of the `years` array. Copy names and roles from the outgoing `staff.yaml` before overwriting it.

```yaml
years:
  - year: "2026–2027"
    members:
      - name: "Joey Quinones"
        title: "Rector"
        image: "/images/headshots/hall-staff/26-27/joeyquinones.jpg"
      # ... rest of outgoing staff
  - year: "2025–2026"
    # ... existing entries remain here
```

**b) Overwrite `staff.yaml`** with the incoming rector, priest, ARs, and RAs.
See [`hall_staff.md`](hall_staff.md) for the full schema.

**c) Add headshots** to `assets/images/headshots/hall-staff/<YY-YY>/` (e.g., `27-28/`).

---

## 2. Hall Government

**File:** `data/hall-gov/government.yaml`

**a) Archive the outgoing government.**
Prepend a new year block to `data/hall-gov/past.yaml`.

**b) Overwrite `government.yaml`** with the new president and VPs.
See [`hall_gov.md`](hall_gov.md) for the full schema.

**c) Add headshots** to `assets/images/headshots/hall-gov/<YY-YY>/`.

---

## 3. Hall Commissioners

**File:** `data/hall-commissioners/commissioners.yaml`

**a) Turn on the coming-soon flag** while the new class is being assembled.
In `layouts/hall-commissioners/hall_commissioners.html`, near the top:

```go-html-template
{{- $comingSoon := true -}}
```

This hides the card grid and shows a placeholder. The Past Commissioners accordion remains visible.

**b) Archive the outgoing class.**
Prepend a new year block to `data/hall-commissioners/past.yaml`.

**c) Overwrite `commissioners.yaml`** with the new class once selected.

**d) Turn off the coming-soon flag** (`false`) once the YAML is fully populated.

See [`hall_commissioners.md`](hall_commissioners.md) for the full schema and card fields.

---

## 4. Welcome Weekend Co-Chairs

**File:** `data/welcome-weekend/cochairs.yaml`

Replace the entries with the incoming co-chairs for the new Welcome Weekend.
Add headshots to `assets/images/headshots/cochairs/<YY-YY>/`.

See [`welcome_weekend_cochairs.md`](welcome_weekend_cochairs.md) for the full schema.

---

## 5. Update the Welcome Weekend countdown date

**File:** `content/english/incoming-students.html`

Find the `data-target-date` attribute (around line 10) and update it to the first day of Welcome Weekend for the new year:

```html
<div data-countdown data-target-date="2027-08-20T09:00:00">
```

Use ISO 8601 format. The time `09:00:00` is the traditional start of Welcome Weekend morning activities — adjust if needed.

---

## 6. Update packing lists and room info

**File:** `content/english/incoming-students.html`

The What to Bring / What to Want / What's Not Allowed lists are plain HTML in this file. Edit them directly. Also review the room dimensions and any links to official ND Residential Life pages for accuracy.

---

## 7. Review navigation

**File:** `config/_default/menus.en.toml`

Check that all nav links still point to valid pages. If a new event page was added or an existing one removed, update the menu here.

---

## 8. Headshot naming conventions

Follow the existing pattern to keep things consistent:

- Lowercase, no spaces, no punctuation: `firstname lastname.jpg` → `firstnamelastname.jpg`
- Place in the correct subdirectory for the year: `assets/images/headshots/hall-staff/27-28/`
- Square crop is strongly preferred. Hugo resizes to 400px WebP at build time.
- For the co-chairs, use the same convention: `assets/images/headshots/cochairs/27-28/`

---

## 9. Smoke test before announcing

Run the site locally before pushing:

```bash
hugo server
```

Check:
- Hall Staff page — all cards render, photos load
- Hall Government page — all cards render
- Hall Commissioners page — either coming-soon or full grid depending on flag
- Incoming Students page — countdown shows correct date, co-chairs render
- No broken images (look for alt text placeholders)

Then push to `main`. GitHub Actions will build and deploy to GitHub Pages automatically (usually a few minutes).
