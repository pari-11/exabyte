import { courses } from "@/data/courses";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;

export function normalizeMobile(mobile) {
  let digits = String(mobile ?? "").replace(/[\s-]/g, "");
  if (digits.startsWith("+91")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

export function validateEnquiry(data) {
  const errors = {};

  const fullName = (data.fullName ?? "").trim();
  if (!fullName) {
    errors.fullName = "Full name is required.";
  } else if (fullName.length < 2) {
    errors.fullName = "Full name must be at least 2 characters.";
  }

  const email = (data.email ?? "").trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  const mobile = (data.mobile ?? "").trim();
  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!MOBILE_PATTERN.test(normalizeMobile(mobile))) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  const course = data.course ?? "";
  if (!course) {
    errors.course = "Please select a course.";
  } else if (!courses.some((c) => c.slug === course)) {
    errors.course = "Please select a valid course.";
  }

  const message = (data.message ?? "").trim();
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length > 1000) {
    errors.message = "Message must be 1000 characters or fewer.";
  }

  if (!data.consent) {
    errors.consent = "Please agree to be contacted about this enquiry.";
  }

  return errors;
}

export function isValid(errors) {
  return Object.keys(errors).length === 0;
}
