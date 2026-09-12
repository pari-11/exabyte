# Footer Redesign Spec

## Goal
Rework the site footer (`components/layout/Footer.jsx`) with a logo/title block, relocated social icons, corrected contact info, and a new gradient background.

## Current state
- Top row: title "Exabyte Academy" + "Stay Connected" tagline on the left, social icons on the right.
- Below: 3-column grid — Explore / Support / Reach Us.
- Reach Us shows `site.phone`, `site.email`, `site.address` from `data/site.js` (currently placeholder values).
- Background: solid `bg-footer` (`#0a3d91`).

## Changes

### 1. Logo + title block (top-left)
- Add a placeholder logo element to the left of the title text (no image asset exists yet).
  - Implementation: a fixed-size rounded box (e.g. 40x40px) with a subtle border/background tint, showing the initial "E" as a stand-in, sitting left of the text stack.
  - Swappable later: once a real logo file is added to `public/`, this box can be replaced with an `<Image>` without other layout changes.
- Title "Exabyte Academy" (from `site.name`) stays to the right of the logo box.
- "Stay Connected" stays directly below the title, same styling as today.
- Social icons are **removed from this row** (moved per #2 below).

### 2. Social icons — new location
- Move the social icon row to sit below the 3-column Explore / Support / Reach Us grid.
- Layout: a new row, full width, centered or left-aligned under the grid, above the copyright divider.
- Same icons, same hover/focus styling as today — only the position changes.

### 3. Reach Us — phone number
- Update `data/site.js`: `phone: "+91 98508 81431"` (was `+91 98765 43210` placeholder).
- Email and address remain unchanged (`info@exabyteacademy.com`, current address) per user confirmation.

### 4. Background gradient
- Replace solid `bg-footer` with a top-to-bottom gradient: dark blue (`#0a3d91`, current footer color/`--color-footer`) at the top, fading to black at the bottom.
- Implementation: `bg-gradient-to-b from-footer to-black` on the `<footer>` element. `--color-footer` is defined in `app/globals.css` under `@theme inline`, so Tailwind v4 auto-generates the `from-footer` utility — no new theme token needed.
- Existing text/icon colors (`text-sky`, `text-white/90`, `hover:text-accent`) keep working — the bottom edge is darker than today's solid blue, so contrast only improves.

### 5. Top-row layout adjustment
- Today the top row is `flex justify-between` (title block left, icons right). With icons removed, that becomes a single left-aligned block — drop `justify-between` from that row so it doesn't leave a stray gap.

## New layout order (top to bottom)
1. Logo placeholder + "Exabyte Academy" + "Stay Connected" (left-aligned block, no longer `justify-between` since icons moved out)
2. 3-column grid: Explore | Support | Reach Us (unchanged content, phone updated)
3. Social icons row (new position)
4. Divider + copyright line (unchanged)

## Files touched
- `components/layout/Footer.jsx` — layout restructure, logo placeholder, gradient class
- `data/site.js` — phone number update

## Out of scope
- No real logo image (none provided) — placeholder only, structured for easy swap-in later.
- No changes to email/address.
- No changes to Explore/Support link content.
