# WhatsApp Click-to-Chat — Spec

## Goal
Let visitors message us on WhatsApp directly, using the `wa.me` click-to-chat link (Option 1 — no API, no backend). Two entry points:

1. A WhatsApp icon next to the existing social media icons (footer).
2. A "Message" box on the Contact Us page, next to/below the Phone box.

Both link to the same WhatsApp number and pre-filled message.

## Link details
- Number: `9075942631` → assumed Indian number, formatted for wa.me as `919075942631` (country code `91` + number, no `+`, no spaces/dashes, per wa.me requirements).
- Pre-filled message: `Hi, I would like to enquire about...`
- URL: `https://wa.me/919075942631?text=Hi%2C%20I%20would%20like%20to%20enquire%20about...`
- Opens in a new tab (`target="_blank" rel="noopener noreferrer"`), same as other external links in the footer.

## Change 1 — Footer social icons
File: `components/layout/Footer.jsx`, data: `data/site.js`

- Add to `data/site.js` → `socialLinks` array:
  ```js
  { label: "WhatsApp", href: "https://wa.me/919075942631?text=Hi%2C%20I%20would%20like%20to%20enquire%20about..." }
  ```
- In `Footer.jsx`:
  - Import `FaWhatsapp` from `react-icons/fa` (already installed, no new dependency).
  - Add `WhatsApp: FaWhatsapp` to the `socialIcons` map.
- No change needed to the render loop — it already maps `site.socialLinks` generically, so the icon appears automatically alongside Facebook/Instagram/LinkedIn using the same styling (`text-sky`, hover `text-accent`, size 20).
- Placement: added as the last entry in `socialLinks`, so it appears after LinkedIn. (Flag if a different order/position is wanted.)

## Change 2 — Contact page "Message" box
File: `app/contact/page.jsx`

- Add a new `Card` below the existing Phone card, following the identical structure:
  ```jsx
  <Card className="flex items-start gap-3">
    <FaWhatsapp size={18} className="text-primary mt-1" aria-hidden="true" />
    <div>
      <p className="text-xs font-medium text-navy/60">Message</p>
      <a
        href="https://wa.me/919075942631?text=Hi%2C%20I%20would%20like%20to%20enquire%20about..."
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-ink hover:text-primary"
      >
        Chat on WhatsApp
      </a>
    </div>
  </Card>
  ```
- Import `FaWhatsapp` from `react-icons/fa` in this file.
- Sits in the same `flex flex-col gap-4` column as Phone/Email/Address, directly after Phone.

## Out of scope
- No backend, webhook, or chatbot (that's Option 2 — WhatsApp Business API — not being pursued here).
- No new npm dependency (`react-icons` already has `FaWhatsapp`).

## Open questions for approval
1. Confirm the number `9075942631` is Indian (+91) — used to build the wa.me link.
2. Confirm the exact wording of the pre-filled message: `"Hi, I would like to enquire about..."`.
3. Confirm footer icon order (WhatsApp last, after LinkedIn) is fine.
4. Confirm the Contact page link text ("Chat on WhatsApp") and label ("Message") are what you want.
