# Hall Government

---

## How the page works

The Hall Government page is self-contained in `layouts/hall-gov/hall_gov.html`. It reads all data from `data/hall-gov/government.yaml` — **the markdown files under `content/english/hall-gov/` are legacy placeholders and are not used by the current layout.**

The page has two sections:
1. **Current government** — card grid driven by `data/hall-gov/government.yaml`
2. **Past government** — collapsible accordion driven by `data/hall-gov/past.yaml`

Cards display in the order entries appear in the YAML file.

---

## Updating a government member's info

Open `data/hall-gov/government.yaml`:

```yaml
members:
  - name: "Tanner Postell"
    role: "Hall President"
    image: "/images/headshots/hall-gov/26-27/tannerpostell.jpg"
    email: "tpostell@nd.edu"
    hometown: "Dallas, TX"
    major: "Finance"
    minor: "Engineering Corporate Practice"
    hobbies: "Basketball, cooking"
    favoritepart: "The people"

  - name: "Peter Belin"
    role: "Hall VP - Fall"
    image: "/images/headshots/hall-gov/26-27/peterbelin.jpg"
    email: "pbelin@nd.edu"
    # optional fields can be omitted entirely
```

The role prefix `"Hall "` is automatically stripped for display. So `"Hall VP - Fall"` renders as `"VP - Fall"` on the card.

---

## Field reference

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Full name |
| `role` | Yes | e.g. `"Hall President"`, `"Hall VP - Fall"`, `"Hall VP - Spring"` |
| `image` | Yes | Path to headshot |
| `email` | Yes | ND email address |
| `hometown` | No | Displayed on expanded bio panel |
| `major` | No | Single string or list (see below) |
| `minor` | No | Single string or list |
| `hobbies` | No | Free text |
| `favoritepart` | No | Displayed in quotes on the card |

### Major and minor — single value or list

```yaml
major: "Finance"

major:
  - "Finance"
  - "Philosophy"    # → Majors: Finance & Philosophy
```

---

## Adding a new officer

Add a new entry to the `members` array. Order determines card order on the page — put the President first, then VPs.

```yaml
  - name: "New Officer"
    role: "Hall VP - Spring"
    image: "/images/headshots/hall-gov/26-27/newofficer.jpg"
    email: "nofficer@nd.edu"
```

---

## Photos

Place headshots in `assets/images/headshots/hall-gov/<YY-YY>/` (e.g., `26-27/`).
- Square crop preferred
- Filename: lowercase, no spaces (`firstnamelastname.jpg`)
- Format: `.jpg` or `.png` — Hugo converts to 400px WebP at build time

---

## Replacing government (new school year)

**Step 1 — Archive the outgoing government.**

Open `data/hall-gov/past.yaml` and prepend a new year block:

```yaml
years:
  - year: "2026–2027"
    members:
      - name: "Tanner Postell"
        title: "Hall President"
        image: "/images/headshots/hall-gov/26-27/tannerpostell.jpg"
      - name: "Peter Belin"
        title: "Hall VP - Fall"
        image: "/images/headshots/hall-gov/26-27/peterbelin.jpg"
      - name: "Aidan Sachs"
        title: "Hall VP - Spring"
        image: "/images/headshots/hall-gov/26-27/aidansachs.jpg"
  - year: "2025–2026"
    # ... existing entries stay here
```

**Step 2 — Overwrite `government.yaml`** with the incoming officers.

**Step 3 — Add headshots** to `assets/images/headshots/hall-gov/<YY-YY>/`.

See [`year-rollover.md`](year-rollover.md) for the full annual checklist.

---

## Past government format

`data/hall-gov/past.yaml`:

```yaml
years:
  - year: "2026–2027"
    members:
      - name: "Full Name"
        title: "Role Title"
        image: "/images/headshots/hall-gov/26-27/name.jpg"  # Optional
```

Most recent year goes at the top. Images are lazy-loaded when the accordion is first opened.
