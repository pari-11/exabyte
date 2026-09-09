# Contact page and enquiry form

## Goal
Give prospective students and parents a way to see how to reach Exabyte Academy and to send a course enquiry directly from the site.

## Scope
In scope:
- A `/contact` page showing site contact details (phone, email, address) and an enquiry form.
- Client-side validation with inline, per-field error messages.
- An `/api/enquiry` route that re-validates the payload server-side and logs valid submissions to the terminal.
- Idle / submitting / success / error states for the form.

Out of scope:
- Sending email notifications.
- Persisting submissions to a database.
- CAPTCHA / spam protection.
- Editing or managing submitted enquiries.

## Behaviour

### Contact details
- Phone, email, and address are read from `data/site.js` (`site.phone`, `site.email`, `site.address`) — not hardcoded on the page.
- Phone renders as a `tel:` link, email as a `mailto:` link.

### Enquiry form fields
| Field | Type | Required | Validation |
|---|---|---|---|
| Full name | text | yes | non-empty after trimming; min 2 characters |
| Email | email | yes | non-empty; must match a standard email pattern |
| Mobile number | tel | yes | strip spaces and dashes; allow an optional leading `+91` or `0`; remainder must be exactly 10 digits starting with 6–9 |
| City | text | no | none |
| Course | dropdown | yes | must be one of the course slugs from `data/courses.js` (`courses[].slug`); dropdown options are `courses[].name`, populated at render time, not hardcoded; no course pre-selected — placeholder option "Select a course" is the default |
| Message | textarea | yes | non-empty after trimming; max 1000 characters |
| Consent checkbox | checkbox | yes | must be checked ("I agree to be contacted about this enquiry") |

Validation rules (including the mobile number and email patterns, required-field list, and course-slug check) are defined once in `lib/validation.js` and imported by both the form component and the API route — no duplicated rules.

### Client-side validation
- Validation runs on submit (not on every keystroke). After a field has been touched by a failed submit, that field re-validates live as the user edits it, so the error clears as soon as it's fixed.
- Each invalid field shows its error message directly beneath that field, not in an alert or toast.
- If any field is invalid, the form does not submit and focus moves to the first invalid field.

### Submission flow / form states
- **Idle**: default state, submit button reads "Send Enquiry" and is enabled.
- **Submitting**: triggered on valid submit. Submit button reads "Sending…" and is disabled; form fields are disabled to prevent double submission.
- **Success**: shown when `/api/enquiry` returns a success result. Form is replaced with a confirmation message (e.g. "Thanks — we'll get back to you soon.") and a "Send another enquiry" button. Clicking that button resets the form to idle with all fields cleared.
- **Error**: shown when `/api/enquiry` returns a failure result or the request fails (network error). Fields remain filled in as the user left them. A single error message appears above the submit button (e.g. "Something went wrong — please try again."); field-level errors from a server-side validation failure are also mapped back onto the relevant fields.

### `/api/enquiry` (POST)
- Accepts a JSON body with: `fullName`, `email`, `mobile`, `city`, `course` (slug), `message`, `consent`.
- Re-runs the same validation rules as the client, imported from `lib/validation.js` (required fields, email pattern, mobile pattern, course slug must exist in `data/courses.js`, consent must be `true`). City is optional.
- On validation failure: responds with an error result and a field → message map of what failed.
- On success: logs the submission (all fields plus a timestamp) to the terminal via `console.log`, then responds with a success result.
- Does not send email or write to a database (explicitly out of scope for this iteration).

## Files
- `app/contact/page.jsx` — contact page (details + form section)
- `components/forms/EnquiryForm.jsx` — the form component, including state handling
- `lib/validation.js` — shared validation rules, imported by the form component and the API route
- `app/api/enquiry/route.js` — API route handling POST and server-side validation
- `data/courses.js`, `data/site.js` — read from, not modified

## Done when
- [ ] Visiting `/contact` shows phone, email, and address matching `data/site.js`.
- [ ] The course dropdown lists exactly the courses in `data/courses.js`, with a "Select a course" placeholder as default.
- [ ] Submitting the form empty shows an inline error under every required field, and does not call the API.
- [ ] Fixing a single invalid field clears that field's error without needing to resubmit.
- [ ] An invalid email, a mobile number that doesn't match the pattern (e.g. wrong length or starting digit), and an unchecked consent box each show their own specific inline error.
- [ ] A mobile number entered as `+91 98765-43210` or `09876543210` is accepted as valid.
- [ ] Leaving city blank does not block submission.
- [ ] Submitting a valid form disables the fields and button, shows "Sending…", then shows the success confirmation with a "Send another enquiry" button.
- [ ] Clicking "Send another enquiry" resets the form to a blank, idle state.
- [ ] The terminal running the dev server logs the submitted data when a valid enquiry is sent.
- [ ] Stopping the API (or simulating a server error) shows the error state with the retry message, and the entered data is not lost.
- [ ] Sending a request to `/api/enquiry` directly with invalid data (e.g. via curl) returns a validation error response, not a 500 or a silent success.
