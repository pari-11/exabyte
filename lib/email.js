import { Resend } from "resend";
import { courses } from "@/data/courses";
import { site } from "@/data/site";
import {
  DEMO_TYPE,
  enquiryTypeOptions,
  groupTypeOptions,
  timeSlotOptions,
  learningDayOptions,
  visitTimeSlotOptions,
  visitorCountOptions,
  visitPurposeOptions,
} from "./enquiryTypes";

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.ENQUIRY_RECIPIENT_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !recipient || !from) {
    return null;
  }

  return { apiKey, recipient, from };
}

function getTypeName(slug) {
  return enquiryTypeOptions.find((t) => t.slug === slug)?.name ?? "Not specified";
}

function getCourseName(slug) {
  return courses.find((c) => c.slug === slug)?.name ?? null;
}

function labelFromOptions(options, value) {
  return options.find((o) => o.value === value)?.label ?? value;
}

function labelsFromOptions(options, values) {
  if (!Array.isArray(values) || values.length === 0) return null;
  return values.map((v) => labelFromOptions(options, v)).join(", ");
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

// Builds the ordered list of {label, value} rows relevant to the
// submitted enquiry type — mirrors the field sets in EnquiryFormCore.
function buildSummaryRows(data) {
  const type = data.format;
  const rows = [];
  const add = (label, value) => {
    if (value === null || value === undefined || value === "") return;
    rows.push({ label, value });
  };

  add("Enquiry type", getTypeName(type));

  if (type === "community-learning") {
    add("Organizer name", data.fullName);
    add("Organization / society / school", data.organizationName);
    add("Contact person", data.contactPerson);
  } else {
    add(type === "academy-classroom" ? "Visitor name" : "Student name", data.fullName);
    add("Parent/guardian name", data.guardianName);
  }

  add("Mobile", data.mobile);
  add("WhatsApp", data.whatsapp);
  add("Email", data.email);

  if (type === "community-learning") {
    add("Group type", labelFromOptions(groupTypeOptions, data.groupType));
    add("Number of participants", data.participants);
    add("Age group", data.ageGroup);
    add("City", data.city);
    add("Venue address", data.venueAddress);
  } else if (type === "academy-classroom") {
    add("Student age", data.studentAge);
    add("School / college", data.schoolName);
    add("Grade / year", data.grade);
  } else {
    add("Student age", data.studentAge);
    add("School / college name", data.schoolName);
    add("Grade / year of study", data.grade);
    add("City", data.city);
    add("Area / locality", data.locality);
  }

  add("Interested course", getCourseName(data.course));

  if (type === "personal-mentoring" || type === "community-learning") {
    add("Preferred learning days", labelsFromOptions(learningDayOptions, data.days));
    add("Preferred time slot", labelFromOptions(timeSlotOptions, data.timeSlot));
  }

  if (type === "community-learning") {
    add("Preferred start date", data.startDate);
  }

  if (type === "academy-classroom") {
    add("Preferred visit date", data.visitDate);
    add("Preferred time", labelFromOptions(visitTimeSlotOptions, data.visitTimeSlot));
    add("Number of visitors", labelFromOptions(visitorCountOptions, data.numberOfVisitors));
    add(
      "Interested in",
      labelsFromOptions(visitPurposeOptions, data.visitPurpose)
    );
  }

  add("Message", data.message);

  return rows;
}

export async function sendEnquiryNotification(data) {
  const config = getEmailConfig();
  if (!config) {
    throw new Error(
      "Email is not configured: missing RESEND_API_KEY, ENQUIRY_RECIPIENT_EMAIL, or RESEND_FROM_EMAIL."
    );
  }

  const resend = new Resend(config.apiKey);
  const rows = buildSummaryRows(data);

  const html = `
    <h2>New enquiry from ${escapeHtml(data.fullName)}</h2>
    ${rows
      .map(
        (row) =>
          `<p><strong>${escapeHtml(row.label)}:</strong> ${escapeHtml(row.value).replace(/\n/g, "<br />")}</p>`
      )
      .join("\n")}
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
  const typeName = getTypeName(data.format);
  const courseName = getCourseName(data.course);
  const isDemo = data.format === DEMO_TYPE;

  const html = `
    <h2>Thanks for reaching out, ${escapeHtml(data.fullName)}!</h2>
    <p>
      We've received your ${escapeHtml(isDemo ? "demo request" : "enquiry")}
      ${courseName ? ` for <strong>${escapeHtml(courseName)}</strong>` : ""}
      (${escapeHtml(typeName)}) and will get back to you soon.
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
