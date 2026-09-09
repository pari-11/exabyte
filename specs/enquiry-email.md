# Enquiry email delivery

## Goal
When someone submits the enquiry form, the academy actually receives it by email (nobody reads a production terminal), and the visitor gets a short confirmation that it went through.

## Scope
In scope:
- Sending an enquiry notification email to the academy via Resend when `/api/enquiry` receives a valid submission.
- Sending a short confirmation email to the visitor's submitted address.
- `RESEND_API_KEY`, the academy recipient address, and the "from" address all coming from environment variables — never hardcoded or committed.
- `.env.local` git-ignored (already covered by the existing `.env*` rule); a tracked `.env.example` listing the required variables with placeholder values.

Out of scope:
- A database or any durable storage of submissions.
- An admin dashboard for viewing past enquiries.
- SMS/WhatsApp notifications.
- Custom-designed email templates — plain, readable HTML only.
- Retry queues, delivery-status webhooks, or bounce handling.

## Design decisions

**What does the visitor see if the email fails?**
The academy notification email is the only record of the enquiry that exists once the request ends (see "Persistence" below) — if it fails to send, the enquiry is genuinely lost, not just "delayed." So that send is awaited before responding, and if it fails, `/api/enquiry` returns the same kind of error response it already returns for validation failures. This reuses the enquiry form's existing error state (`components/forms/EnquiryFormCore.jsx` already shows "Something went wrong — please try again." and preserves the visitor's entered data on any non-`ok` response) — no new UI is needed. The alternative — always responding with success once the data is merely valid — was rejected because it's exactly the "tell them it worked when we've lost their message" outcome the feature exists to avoid.

The visitor confirmation email is treated differently: by the time it's attempted, the academy already has the enquiry (the notification email succeeded), so a failed confirmation email is a missed nicety, not lost data. Its failure is logged server-side but never surfaces to the visitor and never changes the API response.

**Is the enquiry stored anywhere before the email attempt?**
No — this is explicitly out of scope (no database, per the constraints). The existing `console.log` of the full submission stays in place as a debugging aid (visible in the hosting platform's function logs), but it is not a reliable record: most platforms rotate or cap log retention, and nobody is watching it in real time. The accepted risk: if Resend accepts the academy email but it's later lost on the receiving side (spam filter, deleted, etc.), there is no fallback copy anywhere. Adding real persistence (even a minimal one) would close this gap, but that's a separate, larger feature — flagged here, not built.

**What do the emails contain, and what's the reply-to?**
- **Academy notification** — subject identifies it as a new enquiry; body lists all submitted fields in readable form (full name, email, mobile, city, course and preferred format shown by name, not slug, message, consent, submitted-at timestamp). `reply-to` is set to the visitor's submitted email address, so hitting reply in the inbox goes straight to them.
- **Visitor confirmation** — short, reassuring, restates their name and which course/format they asked about so they know it was understood correctly. `reply-to` is set to the academy's own contact address (`site.email` from `data/site.js`), so if the visitor replies to say more, it reaches the academy inbox rather than a noreply address.
- Both are simple inline-styled HTML (a heading and a few paragraphs) — no template system.

**Does sending block the API response?**
The academy notification send is awaited — the response can't honestly say "received" until we know it actually went out. This does add the email API's latency (typically well under a second, occasionally more) to the form's "Sending…" state, which is the tradeoff: a slightly slower success response in exchange for that response being true.

The visitor confirmation send does **not** block the response. It's scheduled with Next's `after()` (`next/server`) so it runs once the response has already been sent to the browser — the visitor sees success as soon as the academy has the enquiry, without waiting on a second, non-critical email.

## Behaviour

### Environment / setup
- `RESEND_API_KEY` — Resend API key.
- `ENQUIRY_RECIPIENT_EMAIL` — academy inbox that receives notifications (differs between testing and production).
- `RESEND_FROM_EMAIL` — the verified "from" address. For now (no verified domain yet), this is Resend's sandbox address `onboarding@resend.dev`. **Known limitation**: on Resend's free tier without a verified domain, sandbox mode can only deliver to the email address on the Resend account itself — so in practice, until a domain is verified, the visitor confirmation email will fail for any visitor address other than that one account email, while the academy notification (sent to `ENQUIRY_RECIPIENT_EMAIL`, presumably that same account email during testing) will work. This isn't special-cased in code — it's a real Resend account limitation the confirmation email's best-effort failure handling already covers gracefully; it resolves itself once a domain is verified.
- Any of these missing or empty is treated exactly like Resend rejecting the send: the academy email "fails," and the visitor sees the same error state as any other send failure. This keeps local/dev behavior honest with production instead of silently degrading to console-log-only, which could mask a real misconfiguration after deploy.

### `/api/enquiry` request flow
1. Parse and validate the body exactly as today (`lib/validation.js`, unchanged).
2. On validation failure: same response as today (400, field errors).
3. On validation success: keep the existing `console.log` of the full submission, then attempt the academy notification email (awaited).
   - Success: schedule the visitor confirmation email via `after()`, then respond `{ ok: true }` (unchanged shape).
   - Failure (send error, or required env var missing): respond `{ ok: false, errors: { form: "..." } }` with a non-2xx status, the same shape the client already knows how to render as its generic error message.
4. The visitor confirmation email's outcome (success or failure) is only ever logged server-side; it never affects what's already been sent to the client.

## Files
- `lib/email.js` — new. Resend client setup; `sendEnquiryNotification(data)` and `sendEnquiryConfirmation(data)`, each building its own simple HTML body and reply-to.
- `app/api/enquiry/route.js` — call the notification send (awaited) after validation, gate the response on it, and schedule the confirmation send via `after()` on success.
- `.env.example` — new. Lists `RESEND_API_KEY`, `ENQUIRY_RECIPIENT_EMAIL`, `RESEND_FROM_EMAIL` with placeholder values and a one-line comment on the sandbox limitation.
- `.gitignore` — add `!.env.example` immediately after the existing `.env*` line, so the example file is trackable despite the broad `.env*` ignore already in place.
- `package.json` / `package-lock.json` — add the `resend` dependency.
- No client-side changes — `EnquiryFormCore`'s existing error handling already covers the new failure path.

## Done when
- [ ] A valid submission results in the academy inbox (`ENQUIRY_RECIPIENT_EMAIL`) receiving an email with all submitted fields, course/format shown by name.
- [ ] Replying to that academy email goes to the visitor's submitted address.
- [ ] The visitor's inbox receives a short confirmation naming their course/format choice (verifiable using the Resend account's own email as the test recipient, per the sandbox limitation above).
- [ ] Replying to the confirmation email goes to the academy's contact address.
- [ ] If the academy email send fails (e.g. temporarily invalid `RESEND_API_KEY`), the form shows its existing error state, the visitor's entered data isn't cleared, and no success is reported.
- [ ] If only the confirmation email fails (academy email succeeded), the visitor still sees success — the API response isn't affected.
- [ ] Removing/blanking `RESEND_API_KEY` or `ENQUIRY_RECIPIENT_EMAIL` locally reproduces the same error state as a live send failure, not a silent console-only fallback.
- [ ] `.env.local` (with real values) is never staged by `git add .` / never appears in `git status` as trackable.
- [ ] `.env.example` is tracked in git and contains only placeholder values, no real keys.
- [ ] The visitor-facing response time reflects only the academy email's send time — confirmation email latency is never added to it (verify by comparing response time with confirmation sending artificially slowed or failing).
