## Hall Commissioners

### How the page works

The page is entirely self-contained in `layouts/hall-commissioners/hall_commissioners.html`. It does not use `{{ .Content }}` — all HTML, CSS, and JS wiring lives in the layout. `content/english/hall-commissioners/_index.md` only provides front matter (title + layout name) and can otherwise be ignored.

The banner image path and heading are variables at the very top of the layout:

```go-html-template
{{- $bannerImg     := "/images/BannerImages/LakeBanner.png" -}}
{{- $bannerHeading := "Commissioners" -}}
```

The page has a **coming-soon toggle** near the top of the layout:

```go-html-template
{{- $comingSoon := true -}}
```

- `true` — hides the commissioner cards and shows a "Coming Soon" placeholder with the image placeholder and a short message. The Past Commissioners accordion is still visible.
- `false` — shows the full commissioner card grid as normal.

Flip this flag at the start of each new year while commissioners are being selected, then set it back to `false` once the YAML is populated.

---

The page has two sections:

1. **Current commissioners** — driven by `data/hall-commissioners/commissioners.yaml`. Cards render in the order listed in that file. Hidden when `$comingSoon` is `true`.
2. **Past commissioners** — a collapsible accordion at the bottom, driven by `data/hall-commissioners/past.yaml`, organized by year. Always visible regardless of `$comingSoon`.

---

### Cards

Each card shows:
- A headshot with a shimmer placeholder while it loads. The image is converted to WebP by Hugo's asset pipeline.
- Name and role. The word " Commissioner" is automatically stripped from the role display (so "Sports Commissioner" shows as "Sports").
- An expand button (+ / ×) that reveals the bio panel. The panel animates open and closed symmetrically using `grid-template-rows`.
- Bio fields: Hometown, Major/Majors, Minor/Minors, Hobbies, Favorite Part of Coyle (in quotes), and an email button.

Cards with no optional fields and no email show no expand button.

---

### Updating a current commissioner's info

Open `data/hall-commissioners/commissioners.yaml` and find the entry by name:

```yaml
commissioners:
  - name: "Daniel Burke"
    role: "Website Commissioner"
    image: "/images/headshots/danielburke.jpg"
    email: "dburke6@nd.edu"
    hometown: "Beverly Hills, MI"
    major: "Computer Science"
    minor: "Engineering Corporate Practice"
    hobbies: "Running, Skiing, Graphic Design"
    favoritepart: "Fisher/Coyle DH table"
```

`name`, `role`, `image`, and `email` are required. All other fields are optional — omit them entirely to hide that row on the card.

#### Display order

Cards render top-left to bottom-right in the order entries appear in the file. Move entries up or down to reorder.

#### Major and minor — single value or list

Both support a plain string or a YAML list. The label pluralizes automatically. When exactly two values are given, they are joined with " & " instead of a comma.

```yaml
major: "Finance"                    # → Major: Finance

major:
  - Finance
  - Program of Liberal Studies      # → Majors: Finance & Program of Liberal Studies

major:
  - Finance
  - Economics
  - Statistics                      # → Majors: Finance, Economics, Statistics
```

Same rules apply to `minor` / `minor:` list.

#### Photo

Place a square headshot in `assets/images/headshots/` and set `image` to `/images/headshots/<filename>.jpg`. Hugo resizes it to 400px wide WebP at build time. If no photo exists yet, a placeholder is shown.

---

### Replacing commissioners (new school year)

**Step 1 — Archive the outgoing class.**

Open `data/hall-commissioners/past.yaml` and prepend a new year block:

```yaml
years:
  - year: "2025–2026"
    members:
      - name: "New Person"
        title: "Sports Commissioner"
        image: "/images/headshots/newperson.jpg"
      # ... rest of outgoing class
  - year: "2024–2025"
    # ... existing entries stay here
```

Keep the newest year at the top. The `image` field is optional — omit it to show a placeholder.

**Step 2 — Replace entries in `commissioners.yaml`.**

Overwrite each entry with the new person's information. Same role, new person: just update the fields in place.

**Step 3 — Reorder or add/remove roles as needed.**

Add a new entry anywhere in the list to add a role. Delete an entry to remove a role. Move entries to change grid order.

---

### Adding a new commissioner role

```yaml
  - name: "First Last"
    role: "New Role Commissioner"
    image: "/images/headshots/firstlast.jpg"
    email: "flast@nd.edu"
```

Optional fields (`hometown`, `major`, `minor`, `hobbies`, `favoritepart`) can be added as needed.

---

### Past commissioners format

`data/hall-commissioners/past.yaml`:

```yaml
years:
  - year: "2025–2026"           # Display label for the year heading
    members:
      - name: "Full Name"       # Required
        title: "Role Title"     # Required (shown without stripping "Commissioner")
        image: "/images/headshots/name.jpg"  # Optional; placeholder shown if missing
```

- Most recent year goes at the top.
- Grid: 3 columns on small mobile, up to 6 on desktop.
- Images are lazy-loaded — the real photo is only fetched when the accordion is first opened.
