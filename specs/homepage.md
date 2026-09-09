# Homepage

## Goal
Introduce Exabyte Academy to a parent or student arriving cold, and move them toward either browsing courses or sending an enquiry.

## Scope
In scope:
- The `/` page: hero, courses preview, why-choose-us, learning formats preview, closing CTA band.
- Reusing `Section`, `Button`, and `Card` for layout/styling consistency with `/courses`.
- Reading all course names/descriptions/icons from `data/courses.js` and format names/taglines from `formats` in the same file — nothing course-related hardcoded.

Out of scope:
- Per-course detail pages (course cards link to `/courses`, not a dedicated course page).
- Testimonials, stats, blog/news, or any section not listed below.
- Final copy — all headings/body text are placeholders to be rewritten later.
- Any new data in `data/site.js` or `data/courses.js`.

## Behaviour

### 1. Hero
- Headline, a short pitch (1-2 sentences), two CTA buttons:
  - Primary: "Explore Courses" → `/courses`.
  - Secondary: "Book a Free Demo" → `/contact`.

### 2. Courses preview
- Heading introducing the three courses.
- One `Card` per entry in `courses` (from `data/courses.js`), showing icon, name, and description — same rendering approach as the courses page's course grid.
- Each course card is a clickable link to `/courses` (no per-course page exists yet, so all cards point to the same destination).
- A "View All Courses" button below the grid, also linking to `/courses`.

### 3. Why choose us
- Heading, then exactly 3 reasons in a 3-column grid (placeholder icon/heading/short text each), matching the visual rhythm of the courses/formats grids. Content is placeholder — no data source needed.

### 4. Learning formats preview
- Heading, then one `Card` per entry in `formats` (from `data/courses.js`), showing name and tagline only — no pricing/duration/fee (that stays exclusive to `/courses`).
- Each format card links to its anchor on the courses page: `/courses#{format.slug}` (matching the existing `id={format.slug}` on the format `Card` in `app/courses/page.jsx`).

### 5. Closing CTA band
- Heading/short line, same two CTAs as the hero ("Explore Courses" → `/courses`, "Book a Free Demo" → `/contact`), matching the pattern already used at the bottom of `/courses`. The supporting copy here is distinct from the hero's pitch (different placeholder wording), even though the buttons are identical.

### Heading hierarchy
- The hero headline is the page's only `<h1>`. Every other section heading (courses preview, why choose us, learning formats preview, closing CTA band) is an `<h2>`.

### Metadata
- `app/page.js` exports its own `metadata` (title, description) rather than relying on the generic metadata in `app/layout.js`.

### Responsiveness
- All grids collapse to a single column on small screens, following the existing `sm:grid-cols-3` pattern used on `/courses`.

## Files
- `app/page.js` — replaced with the full homepage (currently a single placeholder heading), including its own `metadata` export
- `data/courses.js`, `data/site.js` — read from, not modified

## Done when
- [ ] Visiting `/` shows a hero with a headline, pitch, and both CTA buttons linking to `/courses` and `/contact`.
- [ ] The courses preview shows exactly the 3 courses from `data/courses.js`, each card linking to `/courses`, plus a "View All Courses" button linking to `/courses`.
- [ ] The why-choose-us section shows exactly 3 reasons in a responsive grid.
- [ ] The learning formats preview shows exactly the 3 formats from `data/courses.js` (name + tagline only, no fees), each card linking to its matching anchor on `/courses` (e.g. `/courses#personal-mentoring`) and that anchor scrolls to the right card.
- [ ] The closing CTA band shows both CTAs linking to `/courses` and `/contact`, with supporting copy different from the hero's.
- [ ] Adding or removing a course or format in `data/courses.js` changes the homepage grids without touching `app/page.js`.
- [ ] All grids stack to one column on a narrow viewport.
- [ ] The page has exactly one `<h1>` (the hero headline); every other section heading is an `<h2>`.
- [ ] `/` has its own page title and description in the browser tab / view-source, distinct from the generic layout metadata.
