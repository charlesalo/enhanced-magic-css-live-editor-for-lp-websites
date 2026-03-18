# EnhancedMagicCSS

A Chrome extension that injects a live CSS/SCSS editor widget directly into any webpage. Write, compile, and apply styles in real time without touching source files — purpose-built for Luxury Presence templates.

---

## Installation

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the project folder.
5. The extension icon appears in your toolbar.

---

## Opening the Widget

Click the extension icon in the toolbar to open the popup, then:

- **Open Editor** — injects and opens the floating widget on the current page.
- **Toggle Visibility** — shows or hides the widget without losing your code.
- **Remove Styles** — removes all injected styles from the page.

---

## Widget Layout

The widget is a floating panel with three main areas:

| Area | Description |
|---|---|
| **Header** | Drag handle, logo, mode badge, settings icon, minimize, maximize, close |
| **Editor tab** | Main CSS/SCSS code editor |
| **Elements tab** | Template-based section picker |

The widget is **draggable** (drag the header) and **resizable** (8 handles around the edges). Position and size are saved automatically.

**Minimize** (—) collapses the widget to just the header.
**Maximize** (□) expands the widget to fill the full viewport — click again to restore to the previous size and position.
**Close** (✕) hides the widget — your code is preserved.

---

## Editor Tab

The primary workspace for writing and applying CSS/SCSS.

### Writing Code

Type any valid CSS or SCSS. The editor supports:

- Full **SCSS nesting** (`&` parent references, nested rules)
- **SASS** indent-based syntax (auto-detected and compiled)
- `$variable` declarations and `@mixin` / `@include`
- `@media`, `@keyframes`, `@supports`

### Applying Styles

| Action | How |
|---|---|
| Apply to page | Click **Apply** or press `Ctrl/Cmd + S` |
| Auto-apply | Toggle **Auto** — applies 600ms after you stop typing |
| Remove styles | Click **Clear** |

### Format Mode

Use the **BEM / SCSS dropdown** next to the Format button to choose how code is formatted and how hover-picked selectors are inserted:

- **BEM** — groups child classes with `&` notation: `.block { &__element { } }`
- **SCSS** — full class names, standard nesting: `.block__element { }`

Click **Format** to auto-format your current code in the selected mode.

### Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl/Cmd + S` | Apply CSS |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Y` or `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + /` | Toggle comment |
| `Tab` | Indent (or unindent selection) |

### Autocomplete

The editor suggests CSS properties, values, pseudo-classes, pseudo-elements, and CSS custom properties (`--variables`) from the current page. Use arrow keys to navigate, `Tab` or `Enter` to accept, `Escape` to close.

### Copy

Click **Copy** to copy the raw editor code to your clipboard.

---

## Hover Mode

Pick elements directly from the page and insert their CSS selector path into the editor.

### Activating Hover Mode

Click the **Hover** button in the toolbar. The cursor becomes a crosshair and the widget fades.

- Hover over any element — a green badge appears showing the BEM selector path.
- A **DevTools-style box model overlay** renders over the hovered element showing margin (orange), border (yellow), padding (green), and content (blue) layers, with a dimensions tooltip.
- **Click** the element to insert the selector into the editor. Hover mode exits automatically after picking.

### Alt / Cmd Hold (Quick Hover)

Hold `Alt` (Windows/Linux) or `Cmd` (Mac) while the widget is open to temporarily enter hover mode without clicking the button. The widget fades out. Pick an element — the selector inserts and the widget restores immediately.

### Pseudo-elements

If a hovered element has a `::before` or `::after`, the badge shows them. Clicking opens a small picker to choose which to insert.

### Layer Picker

Hold `Alt/Cmd + Shift` and click to see all stacked elements at that point — useful for elements hidden behind overlapping siblings or `pointer-events: none` layers.

---

## Elements Tab

Scans the page for known template sections and gives each one its own mini code editor.

### Selecting a Template

Choose a template from the dropdown (Masterpiece, Producer, Visionary, or any custom template you've added). The extension scans the page and lists all matching sections it finds.

### Editing a Section

Click a section row to expand it. Inside you'll find:

- A CSS editor scoped to that section's selector.
- **Hover** — activates the in-section hover picker (see below).
- **Format** — formats the code.
- **Apply** — injects the code for that section only.
- **Copy** — copies the section's code.

Each section is highlighted and scrolled into view when expanded.

### Hover Picker (Elements Tab)

Each expanded section has a **Hover** button in the footer. Click it to activate the in-section hover picker:

- Hover over any element inside that section — a green dashed outline and the box model overlay appear.
- **Click** an element to insert its selector into that section's editor. Hover mode exits automatically after picking.
- Click **Hover ✕** to deactivate without picking.

**Shortcut keys also work here:** if an element accordion is open and you use `Alt/Cmd` to activate the global hover mode, picking any element will insert its selector into the currently open element's editor and exit hover mode — without switching tabs.

### Build Mode

Enable **Build Mode** in the settings tab. When active:

- A global **Moodboard** dropdown appears at the top of the Elements tab.
- Each section editor pre-loads saved code for the selected moodboard.
- Selecting an element automatically loads and applies its saved build code.
- The **Apply** button becomes **Save** — stores the code for that moodboard.
- Switch moodboards to load different code for each design variant.

---

## Settings

Open settings via the **gear icon** (⚙) in the widget header.

### Adding Custom Elements

Add your own sections to any template so they appear in the Elements tab.

| Field | What to enter |
|---|---|
| **Template** | Template name (e.g. `Masterpiece`) — type or pick from suggestions |
| **Element name** | Label shown in the list (e.g. `Featured Properties`) |
| **ID** | The element's `id` attribute — optional (e.g. `global-navbar`) |
| **Class(es)** | CSS class name(s) — see syntax below |

**Class syntax:**

- **Single class** — `featured-properties` → finds `.featured-properties`
- **Multiple classes on same element** — `redesign opening-with-search` → finds `.redesign.opening-with-search`
- **Parent › Child** — `image-section > image-wrapper` → finds `.image-section` containing `.image-wrapper`

Click **Add Element** to save.

### Moodboards

Add design moodboard names (e.g. `Coastal`, `Dark Modern`). These become options in the Build Mode moodboard dropdown, letting you save and switch between different code variants per section.

### Browse by Template

View all elements (built-in and custom) for any template. You can expand each element to view or edit its saved code per moodboard.

### Deleting Templates or Elements

Use the **Delete** section at the bottom of settings to remove a whole template or a single element. Built-in items are hidden rather than permanently deleted.

### Export

Click **Copy Elements JSON** to copy all your custom elements as JSON to the clipboard. Share this with your team or paste it into a conversation to have it added to the built-in templates.

---

## Tips

- **Selectors are inserted at the last line of the editor** — you don't need to position your cursor before picking.
- The **mode badge** in the header (CSS / SCSS / SASS) updates automatically based on what the editor detects in your code.
- The widget remembers your last tab, position, size, and format mode between sessions.
- If the widget drifts off-screen (e.g. after a resolution change), it auto-clamps back into the viewport on next open.
- On mobile screens, the widget anchors to the bottom of the viewport and cannot be dragged.
- **Maximize** is useful when working on complex sections with many nested rules — gives you full-screen editing space.

---

## Built-in Templates

### Masterpiece (50+ sections)
Covers the full Masterpiece template: homepage openings (search, full-bleed, parallax), agent/team sections, featured properties, neighborhoods, blogs, testimonials, galleries, forms, carousels, CTAs, property detail pages, neighborhood pages, and more.

### Producer (40+ sections)
Covers the full Producer template including:
- **Homepage** — rotating headlines (video & image), plain video opening, search opening
- **Property pages** — intro, description, map, mortgage calculator, virtual tour, agent CTA, features & amenities, schedule a showing, neighborhood, gallery style menu
- **Neighborhood pages** — intro, grid, overview, schools, demographics & employment, map, POI & commute, MLS geolocation CTA, similar neighborhoods
- **Blog pages** — intro, content, grid, related articles
- **Agent & team** — agent bio with detail bar, agents slider with office filter
- **General** — featured properties slider, featured neighborhoods full bleed, featured testimonials, featured blogs, instant home valuation, newsletter sign up, work with us, CTA block, custom intro, custom form, timeline, text grid, boxed text, hoverable image with info, 404, fair housing link

### Visionary
Opening with search, full-bleed CTA.
