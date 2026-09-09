# About page

## Goal
Give a parent evaluating Exabyte Academy enough context — who we are, what we believe, why we're different, and who teaches — to trust the institute with their child.

## Scope
In scope:
- A single `/about` page: Who We Are, Mission & Vision, Why Choose Exabyte Academy, Our Team, Closing CTA.
- Placeholder copy and placeholder team profiles throughout, clearly not real content.
- Reusing `Section`, `Button`, `Card`, following the same conventions as `/` (one `<h1>`, page-specific metadata, alternating section backgrounds, grids stacking on mobile).

Out of scope:
- Splitting into sub-pages (team page, mission page, etc.) — revisit once there's enough real content to justify it.
- Real founder/mentor names, photos, or bios.
- Any new entries in `data/site.js` or `data/courses.js`.
- Linking course/format data into this page — About is institute-level, not course-level.

## Behaviour

### 1. Who We Are
- `<h1>` for the page, short paragraph(s): Pune-based institute teaching practical, project-based technology skills; learning by building rather than memorizing; students work on real projects, assignments, and demonstrations.

### 2. Mission and Vision
- `<h2>` "Mission and Vision", with two clearly separated blocks (e.g. two `Card`s side by side, stacking on mobile):
  - **Mission**: making technology education engaging, practical, and accessible — building confidence through projects, developing problem-solving, encouraging innovation, producing learners with real portfolios.
  - **Vision**: becoming a leading technology academy that bridges classroom education and industry expectations, partners with schools on labs, and builds a community where students turn ideas into working solutions.

### 3. Why Choose Exabyte Academy
- `<h2>`, then a grid of 4 `Card`s, one per reason: practical project-based curriculum, small batch sizes, portfolio-driven learning, certification on completion. Grid uses 2 columns on small+ screens (`sm:grid-cols-2`), stacking to 1 on mobile.

### 4. Our Team
- `<h2>` "Our Team", with two labeled sub-groups: "Founders" (2 placeholder cards) and "Mentors" (3 placeholder cards).
- Each card: a placeholder avatar (an icon or initials in a circle — not a real photo), a name field, a role field, and a short bio field.
- Placeholder content is written so it obviously reads as a placeholder rather than a plausible-sounding invented person — e.g. name shows "Founder Name", role shows "Co-Founder", bio shows "Bio coming soon." Do not invent realistic names, backstories, or credentials.

### 5. Closing CTA
- `<h2>`, own supporting copy (distinct from the homepage's and from each other), same two CTAs as the homepage: "Explore Courses" → `/courses`, "Book a Free Demo" → `/contact`.

### Heading hierarchy
- Exactly one `<h1>` (the Who We Are headline). All other section headings are `<h2>`.

### Metadata
- `app/about/page.jsx` exports its own `metadata` (title, description).

### Responsiveness
- All grids (Why Choose Us, Team) collapse to a single column on small screens.

## Data
Team members stay as an inline array in `app/about/page.jsx`, not a new `data/` file. Reasoning: `data/site.js` and `data/courses.js` hold content that's either reused across multiple pages (site contact info, courses referenced from home/contact/courses) or would change independently of code (real course catalog updates). The team roster is placeholder, used on exactly one page, and will be replaced wholesale with real content and photos later — at which point it's worth revisiting the shape (and likely adding image assets) rather than now designing a data schema for content that doesn't exist yet.

## Files
- `app/about/page.jsx` — new page (currently 404)
- No changes to `data/site.js` or `data/courses.js`

## Done when
- [ ] Visiting `/about` no longer 404s and the nav "About" link resolves correctly.
- [ ] Page has exactly one `<h1>` (Who We Are headline); every other section heading is `<h2>`.
- [ ] `/about` has its own page title and description, distinct from other pages.
- [ ] Mission and Vision appear as two distinct, clearly labeled blocks.
- [ ] Why Choose Exabyte Academy shows exactly 4 reason cards in a 2-column grid that stacks to 1 column on mobile.
- [ ] Our Team shows 2 founder cards and 3 mentor cards, each with an obvious placeholder avatar, name, role, and bio — no invented realistic-sounding people.
- [ ] Closing CTA shows both buttons linking to `/courses` and `/contact`, with copy distinct from the homepage's hero and closing CTA.
- [ ] All grids stack to a single column on a narrow viewport.
