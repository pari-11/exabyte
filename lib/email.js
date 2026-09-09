import { Resend } from "resend";
import { courses, formats } from "@/data/courses";
import { site } from "@/data/site";

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ENQUIRY_RECIPIENT_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !recipient || !from) {
    return null;
  }

  return { apiKey, recipient, from };
}

function getCourseName(slug) {
  return courses.find((c) => c.slug === slug)?.name ?? "Not specified";
}

function getFormatName(slug) {
  return formats.find((f) => f.slug === slug)?.name ?? null;
}

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]
  );
}

export async function sendEnquiryNotification(data) {
  const config = getEmailConfig();
  if (!config) {
    throw new Error(
      "Email is not configured: missing RESEND_API_KEY, ENQUIRY_RECIPIENT_EMAIL, or RESEND_FROM_EMAIL."
    );
  }

  const resend = new Resend(config.apiKey);
  const courseName = getCourseName(data.course);
  const formatName = getFormatName(data.format);

  const html = `
    <h2>New enquiry from ${escapeHtml(data.fullName)}</h2>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Mobile:</strong> ${escapeHtml(data.mobile)}</p>
    <p><strong>City:</strong> ${escapeHtml(data.city || "Not provided")}</p>
    <p><strong>Course:</strong> ${escapeHtml(courseName)}</p>
    <p><strong>Preferred format:</strong> ${escapeHtml(formatName ?? "Any format")}</p>
    <p><strong>Message:</strong><br />${escapeHtml(data.message).replace(/\n/g, "<br />")}</p>
    <p><strong>Consent to be contacted:</strong> ${data.consent ? "Yes" : "No"}</p>
    <p style="color:#666;font-size:12px;">Submitted at ${new Date().toISOString()}</p>
  `;

  const { error } = await resend.emails.send({
    from: config.from,
    to: config.recipient,
    replyTo: data.email,
    subject: `New enquiry — ${data.fullName}`,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send enquiry notification email.");
  }
}

export async function sendEnquiryConfirmation(data) {
  const config = getEmailConfig();
  if (!config) {
    throw new Error(
      "Email is not configured: missing RESEND_API_KEY, ENQUIRY_RECIPIENT_EMAIL, or RESEND_FROM_EMAIL."
    );
  }

  const resend = new Resend(config.apiKey);
  const courseName = getCourseName(data.course);
  const formatName = getFormatName(data.format);

  const html = `
    <h2>Thanks for reaching out, ${escapeHtml(data.fullName)}!</h2>
    <p>
      We've received your enquiry about <strong>${escapeHtml(courseName)}</strong>${
    formatName ? ` (${escapeHtml(formatName)})` : ""
  } and will get back to you soon.
    </p>
    <p>If anything above doesn't look right, just reply to this email and let us know.</p>
    <p>— ${escapeHtml(site.name)}</p>
  `;

  const { error } = await resend.emails.send({
    from: config.from,
    to: data.email,
    replyTo: site.email,
    subject: `We've received your enquiry — ${site.name}`,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send enquiry confirmation email.");
  }
}
