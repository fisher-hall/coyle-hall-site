# Hall Staff

---

## How the page works

The Hall Staff page is self-contained in `layouts/hall-staff/hall_staff.html`. It reads all data from `data/hall-staff/staff.yaml` — **the markdown files under `content/english/hall-staff/` are legacy placeholders and are not used by the current layout.**

The page has three sections:
1. **Rector** — large featured card with photo, bio text, and expandable panel
2. **Priest in Residence** — same large card format
3. **ARs and RAs** — standard card grid, ordered by how they appear in `staff.yaml`

All three sections are also followed by a **Past Staff** collapsible accordion, driven by `data/hall-staff/past.yaml`.

---

## Updating a staff member's info

Open `data/hall-staff/staff.yaml` and find the relevant entry.

### Rector

```yaml
rector:
  name: "Joey Quinones"
  image: "/images/headshots/hall-staff/26-27/joeyquinones.jpg"
  email: "jquinone@nd.edu"
  bio: |
    Multi-line bio text goes here.
    Line breaks are preserved via the pipe character above.
```

### Priest in Residence

```yaml
priest:
  name: "Fr. Greg Haake C.S.C."
  image: "/images/headshots/hall-staff/26-27/frgreghaake.jpg"
  email: "ghaake@nd.edu"
  website: "https://example.com"    # optional personal/parish site
  bio: |
    Bio text here.
```

### ARs and RAs

Each AR and RA is an entry in the `members` array:

```yaml
members:
  - name: "Bryce Bustamante"
    role: "Assistant Rector"
    image: "/images/headshots/hall-staff/26-27/brycebustamante.jpg"
    email: "bbustama@nd.edu"
    section: "3rd Floor"
    hometown: "San Antonio, TX"
    major: "Computer Science"
    minor: "Engineering Corporate Practice"
    hobbies: "Running, hiking"
    favoritepart: "Hall family"

  - name: "Bartosz Chramiec"
    role: "Resident Assistant"
    image: "/images/headshots/hall-staff/26-27/bartoszchramiec.jpg"
    email: "bchramie@nd.edu"
    section: "3B"
    # ... optional fields
```

---

## Field reference

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Full name |
| `role` | Yes (members only) | e.g. `"Resident Assistant"`, `"Assistant Rector"` |
| `image` | Yes | Path to headshot in `assets/images/headshots/` |
| `email` | Yes | ND email address |
| `section` | Yes (members) | Floor or section: `"3B"`, `"2nd Floor"`, etc. Shown on card. |
| `bio` | Yes (rector/priest) | Multi-line text. Use `\|` (block scalar) for line breaks. Rendered as Markdown. |
| `website` | No | Priest only — external URL added as a link on the card |
| `hometown` | No | Displayed on expanded bio panel |
| `major` | No | Single string or list (see below) |
| `minor` | No | Single string or list |
| `studying` | No | Use instead of `major` for graduate students — displays as "Program:" |
| `hobbies` | No | Free text |
| `favoritepart` | No | Displayed in quotes on the card |
| `smallname` | No | Set `true` if the name is long and causes layout issues — shrinks the font |

### Major and minor — single value or list

```yaml
major: "Computer Science"

major:
  - "Computer Science"
  - "Economics"         # → Majors: Computer Science & Economics
```

The label pluralizes automatically. Two values are joined with " & "; three or more use commas.

---

## Adding a new staff member

Add a new entry to the `members` array in `staff.yaml`. Order in the array determines card order on the page — put ARs before RAs, then order RAs by section (1A, 1B, 2A, 2B, etc.) or however the hall organizes them.

```yaml
members:
  - name: "New AR"
    role: "Assistant Rector"
    image: "/images/headshots/hall-staff/26-27/newar.jpg"
    email: "newar@nd.edu"
    section: "2nd Floor"
```

---

## Photos

Place headshots in `assets/images/headshots/hall-staff/<YY-YY>/` (e.g., `26-27/`).
- Square crop preferred
- Filename: lowercase, no spaces or punctuation (`firstnamelastname.jpg`)
- Format: `.jpg` or `.png` — Hugo converts to 400px WebP at build time

---

## Replacing staff (new school year)

**Step 1 — Archive the outgoing staff.**

Open `data/hall-staff/past.yaml` and prepend a new year block. Copy names and roles from `staff.yaml` before overwriting it.

```yaml
years:
  - year: "2026–2027"
    members:
      - name: "Joey Quinones"
        title: "Rector"
        image: "/images/headshots/hall-staff/26-27/joeyquinones.jpg"
      - name: "Bryce Bustamante"
        title: "Assistant Rector"
        image: "/images/headshots/hall-staff/26-27/brycebustamante.jpg"
      # ... rest of outgoing staff
  - year: "2025–2026"
    # ... existing entries stay here
```

Keep the most recent year at the top. The `image` field is optional — omit to show a placeholder.

**Step 2 — Overwrite `staff.yaml`** with incoming staff.

**Step 3 — Add headshots** to `assets/images/headshots/hall-staff/<YY-YY>/`.

See [`year-rollover.md`](year-rollover.md) for the full annual checklist.

---

## Past staff format

`data/hall-staff/past.yaml`:

```yaml
years:
  - year: "2026–2027"
    members:
      - name: "Full Name"       # Required
        title: "Role Title"     # Required
        image: "/images/headshots/hall-staff/26-27/name.jpg"  # Optional
```

Images are lazy-loaded — they're only fetched when the accordion is first opened.
