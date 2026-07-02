# Welcome Weekend Co-Chairs

---

## How the section works

The co-chair cards on the Incoming Students / New Crew page are driven by `data/welcome-weekend/cochairs.yaml` and rendered by the `{{< welcome-cochairs >}}` shortcode in `content/english/incoming-students.html`.

The layout renders a 3-column card grid (responsive — stacks on mobile) with a circular headshot, name, title, grade, and major for each co-chair.

---

## Updating co-chairs (new year)

**Step 1 — Replace entries in `cochairs.yaml`.**

Open `data/welcome-weekend/cochairs.yaml` and replace the entries with the incoming co-chairs:

```yaml
cochairs:
  - name: "First Last"
    title: "Co-Chair"
    grade: "Junior"
    major: "Computer Science"
    image: "/images/headshots/cochairs/27-28/firstlast.jpg"
    image_position: "center 30%"

  - name: "Second Person"
    title: "Co-Chair"
    grade: "Senior"
    major:
      - "Economics"
      - "Philosophy"
    image: "/images/headshots/cochairs/27-28/secondperson.jpg"
    image_position: "center 25%"
```

**Step 2 — Add headshots.**

Place headshots in `assets/images/headshots/cochairs/<YY-YY>/` (e.g., `27-28/`).
- Filename: lowercase, no spaces (`firstlast.jpg`)
- Crop: square or portrait is fine — the image is displayed in a circle with `object-fit: cover`
- Format: `.jpg` or `.png` — Hugo converts to WebP at build time
- Minimum size: 400px wide for crisp display

---

## Field reference

| Field | Required | Notes |
|---|---|---|
| `name` | Yes | Full name, displayed as the card heading |
| `title` | No | Defaults to `"Co-Chair"` if omitted |
| `grade` | No | Year in school, e.g. `"Junior"` |
| `major` | No | Single string or YAML list (see below) |
| `image` | No | Path to headshot. Placeholder shown if omitted. |
| `image_position` | No | CSS `object-position` for portrait cropping. Default `"center 30%"`. |

### Major — single value or list

```yaml
major: "Computer Science"             # → Major: Computer Science

major:
  - "Economics"
  - "Philosophy"                      # → Majors: Economics & Philosophy

major:
  - "Economics"
  - "Philosophy"
  - "Mathematics"                     # → Majors: Economics, Philosophy, Mathematics
```

The label ("Major" vs "Majors") pluralizes automatically.

### `image_position`

Controls where the circular crop is centered. Useful when the headshot has the subject's face at a non-center position. Examples:

```yaml
image_position: "center 20%"    # shows top of frame (good for tall portraits)
image_position: "center 40%"    # slightly below center
image_position: "center center" # dead center (default if not set)
```

---

## Adding or removing co-chairs

The grid adapts to however many entries are in the YAML. Add an entry to add a card; delete an entry to remove one. The shortcode renders them in file order.

If you ever have an odd number of co-chairs, the grid will have an orphaned card on the last row — this is fine; it centers automatically.

---

## Shortcode location

The `{{< welcome-cochairs >}}` shortcode is called in `content/english/incoming-students.html`. If you need to move or reorder the co-chairs section on the page, find this shortcode call in that file.

The shortcode template itself is at `layouts/shortcodes/welcome-cochairs.html`.
