# Shared enquiry modal

## Goal
Make every currently-inert CTA (header "Book a Free Demo", and the three learning-format CTAs on `/courses`) actually open an enquiry form, pre-filled with whatever the user just clicked on.

## Scope
In scope:
- One enquiry modal, openable from any page, reusing the existing validation (`lib/validation.js`) and API route (`/api/enquiry`).
- Context prefilling: a trigger can pass a learning format (and, going forward, a course) into the modal.
- A new, optional "Preferred format" field on the enquiry form (doesn't exist today), populated from `formats` in `data/courses.js`.
- Wiring: header's "Book a Free Demo" (desktop + mobile) opens the modal with no context; each format card's CTA on `/courses` ("Enquire Now", "Book a Group Session", "Visit Our Academy") opens it pre-filled with that format.
- Modal accessibility: focus moves in on open and back to the trigger on close, focus is trapped inside while open, Escape closes it, backdrop click closes it, background scroll is locked while open.

Out of scope:
- Email sending, database persistence (unchanged from `/contact`).
- The "Talk to Us" and "Explore Courses" buttons (already link somewhere sensible).
- Adding a course-specific trigger anywhere (no such button exists yet). The context API accepts an optional course slug so a future trigger can use it, but nothing new passes one in this feature.
- Changing how `/contact` looks or behaves beyond adding the same new "Preferred format" field to keep it in sync with the modal.

## Design decisions

**Does `/contact` keep its own inline form, or become another modal trigger?**
It keeps its own inline form. `/contact` is a page someone navigated to *because* they want to send an enquiry — there's no ongoing context to protect them from losing, which is the whole reason modals exist (interrupt without abandoning the current page). Turning it into "a page whose only content is a button that opens a modal" adds a click, an animation, and a full set of focus-trap/Escape semantics for zero benefit, and is a pattern users find confusing (a dialog on a page about nothing else). The tradeoff is that the form now has two shells (an inline section on `/contact`, a dialog on everywhere else) instead of one — solved by sharing everything except the shell (see Files).

**How does a Server Component trigger open a modal that needs client state?**
A client-side `EnquiryModalProvider` sits near the root (in `app/layout.js`) holding open/closed state and the current prefill context, exposed via a `useEnquiryModal()` hook with an `open({ course, format })` function. Pages stay Server Components; only the specific button that needs to open the modal is a small client "leaf" (`EnquiryTriggerButton`), not the whole page. `app/courses/page.jsx` renders three of these instead of plain `Button`s for the format CTAs; everything else on that page — and the page itself — stays server-rendered. `Header.jsx` is already a client component, so its two "Book a Free Demo" buttons call the hook directly instead of using the leaf component.

**Where does the modal live, and how do triggers reach it?**
The modal itself is rendered once, inside `EnquiryModalProvider`, which wraps `{children}` in `app/layout.js` — a sibling to `Header`/`main`/`Footer`, so it overlays whichever page is showing. It's a fixed-position overlay (`position: fixed; inset: 0`) with a z-index above the sticky header, not a portal — nothing on this site has overflow/stacking-context issues that would require one. Triggers never touch the modal directly; they only call `open(context)` from the hook, and the provider decides what renders.

**Navigating away or hitting Escape mid-typing?**
Escape and a route change both discard whatever was typed, with no confirmation prompt — consistent with how the form already behaves elsewhere (`/contact` resets to blank on "Send another enquiry" with no warning either). A route change is detected via `usePathname`, which only changes on an actual navigation — a hash-only change to the current URL (e.g. clicking a `/courses#personal-mentoring` link while already on `/courses`) does not change the pathname, so it does not close the modal. Backdrop clicks are different: see Accessibility below — once the form has been edited, an accidental backdrop click no longer closes it.

## Behaviour

### Form fields (modal and `/contact`, shared)
Same fields as today (full name, email, mobile, city, course, message, consent), plus:
- **Preferred format** (new): dropdown populated from `formats` in `data/courses.js`, optional. Placeholder option "Any format". When a trigger supplies a format, this field is pre-selected but stays a normal, editable dropdown — the user can change it if the CTA guessed wrong.
- **Course**: pre-selected the same way when a trigger supplies a course slug (no current trigger does, but the field/context plumbing supports it).

Validation in `lib/validation.js` gains: `format`, if present, must be one of `formats[].slug`; absent is valid (same treatment as `city`).

### Context prefilling
- Header "Book a Free Demo" (desktop and mobile): `open({})` — no context, plain form, same as today's `/contact`.
- `/courses` format card CTA: `open({ format: format.slug })` for each of the three cards.
- Each `open()` call starts the modal fresh at idle with the given prefill — no leftover data from a previous time it was opened.

### Modal states
Mirrors `/contact`'s existing idle → submitting → success/error states. On success, the modal shows the confirmation message and two actions: "Send another enquiry" (resets to idle, same prefill context re-applied) and a close control (also available at any time via the header × button, Escape, or backdrop click).

### Accessibility
- The dialog has `role="dialog"` and `aria-modal="true"`, labelled by its heading.
- On open: focus moves to the dialog's heading (not the first field), so a screen reader announces what opened before the user lands in an input. The heading is programmatically focusable (`tabindex="-1"`) for this purpose.
- While open: Tab/Shift+Tab cycle only through elements inside the dialog (focus trap).
- Escape always closes the modal, discarding any input, no confirmation.
- Backdrop click closes the modal only while the form is untouched (pristine — no field edited yet). Once any field has been edited, backdrop clicks are ignored; Escape and the × close button remain the deliberate ways out, so an accidental click outside the dialog can't silently destroy typed data.
- On close (any method): focus returns to the element that triggered the open.
- `<body>` scroll is locked while the modal is open and restored on close.

### `/api/enquiry`
- Payload gains an optional `format` field, validated the same way as `course` but not required.
- The terminal log includes `format` alongside the existing fields, so a submission can be traced back to which CTA it came from (`format: null` when the generic trigger was used).

## Files
- `components/enquiry/EnquiryModalProvider.jsx` — new. Client component: holds open state + context, exposes `useEnquiryModal()`.
- `components/enquiry/EnquiryModal.jsx` — new. The dialog: focus trap, Escape/backdrop close, scroll lock, renders the shared form core.
- `components/enquiry/EnquiryTriggerButton.jsx` — new. Client leaf button for use inside Server Component pages; styled like `Button`, calls `open(context)` on click.
- `components/forms/EnquiryFormCore.jsx` — new. The field rendering + state machine extracted from the current `EnquiryForm.jsx`, parameterized by initial values (including prefilled `course`/`format`); used by both `/contact` and the modal.
- `components/forms/EnquiryForm.jsx` — simplified to a thin wrapper around `EnquiryFormCore` for `/contact`'s inline section (no dialog chrome).
- `lib/validation.js` — add optional `format` validation.
- `app/api/enquiry/route.js` — accept/validate/log `format`.
- `app/layout.js` — wrap `{children}` in `EnquiryModalProvider`; render `EnquiryModal`.
- `app/courses/page.jsx` — swap each format card's `Button` for `EnquiryTriggerButton` with that format's slug.
- `components/layout/Header.jsx` — wire both "Book a Free Demo" buttons to `useEnquiryModal().open({})`.
- `data/courses.js` — read from, not modified.

## Done when
- [ ] Clicking "Book a Free Demo" in the header (desktop) opens the modal with an empty, unprefilled form.
- [ ] Clicking "Book a Free Demo" in the mobile menu does the same, and also closes the mobile menu.
- [ ] Clicking "Enquire Now" / "Book a Group Session" / "Visit Our Academy" on `/courses` opens the modal with "Preferred format" already set to that card's format, still changeable.
- [ ] Submitting from the modal logs to the terminal with the correct `format` (or `null` for the generic trigger).
- [ ] `/contact`'s inline form also has the new "Preferred format" field and behaves identically to the modal's copy (same validation, same states).
- [ ] Opening the modal moves focus to the dialog's heading; Tab cycles only within it; closing (by any method) returns focus to whichever button opened it.
- [ ] Escape closes the modal at any time, including after editing fields, discarding the input.
- [ ] Backdrop click closes the modal before any field is edited, but is a no-op once a field has been edited — the modal stays open with the typed data intact.
- [ ] Clicking a same-page hash link (e.g. `/courses#personal-mentoring` while already on `/courses`) does not close an open modal.
- [ ] Background page cannot scroll while the modal is open, and can again once it's closed.
- [ ] Navigating to a different page while the modal is open closes it without error.
- [ ] Reopening the modal after a previous submission starts fresh at idle, not showing the old success state or stale field values.
- [ ] `POST /api/enquiry` still rejects invalid data the same way it does today, with `format` validated but not required.
