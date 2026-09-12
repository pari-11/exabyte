import { courses } from "@/data/courses";
import { DEMO_TYPE, enquiryTypeSlugs, groupTypeOptions } from "./enquiryTypes";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const groupTypeValues = groupTypeOptions.map((option) => option.value);

export function normalizeMobile(mobile) {
  let digits = String(mobile ?? "").replace(/[\s-]/g, "");
  if (digits.startsWith("+91")) {
    digits = digits.slice(3);
  } else if (digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

export function coursesForType(type) {
  if (!type || type === DEMO_TYPE) return courses;
  return courses.filter((course) => course.offerings[type]?.status === "available");
}

function requireText(errors, data, field, label, { minLength } = {}) {
  const value = (data[field] ?? "").trim();
  if (!value) {
    errors[field] = `${label} is required.`;
  } else if (minLength && value.length < minLength) {
    errors[field] = `${label} must be at least ${minLength} characters.`;
  }
}

export function validateEnquiry(data) {
  const errors = {};
  const type = data.format ?? "";

  if (!type) {
    errors.format = "Please select an option.";
    return errors;
  }
  if (!enquiryTypeSlugs.includes(type)) {
    errors.format = "Please select a valid option.";
    return errors;
  }

  requireText(errors, data, "fullName", "Name", { minLength: 2 });

  const mobile = (data.mobile ?? "").trim();
  if (!mobile) {
    errors.mobile = "Mobile number is required.";
  } else if (!MOBILE_PATTERN.test(normalizeMobile(mobile))) {
    errors.mobile = "Enter a valid 10-digit mobile number.";
  }

  const email = (data.email ?? "").trim();
  if (!email) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (type === "community-learning") {
    requireText(errors, data, "organizationName", "Organization / society / school name", {
      minLength: 2,
    });

    const groupType = data.groupType ?? "";
    if (!groupType) {
      errors.groupType = "Please select a group type.";
    } else if (!groupTypeValues.includes(groupType)) {
      errors.groupType = "Please select a valid group type.";
    }

    const participants = String(data.participants ?? "").trim();
    if (!participants) {
      errors.participants = "Number of participants is required.";
    } else if (!/^\d+$/.test(participants) || Number(participants) < 1) {
      errors.participants = "Enter a valid number of participants.";
    }

    requireText(errors, data, "ageGroup", "Age group");
    requireText(errors, data, "city", "City");
    requireText(errors, data, "venueAddress", "Venue address");
  } else if (type === "academy-classroom") {
    requireText(errors, data, "studentAge", "Student age");

    const visitDate = (data.visitDate ?? "").trim();
    if (!visitDate) errors.visitDate = "Preferred visit date is required.";

    const visitTimeSlot = data.visitTimeSlot ?? "";
    if (!visitTimeSlot) errors.visitTimeSlot = "Preferred time is required.";
  } else if (type === "personal-mentoring") {
    requireText(errors, data, "studentAge", "Student age");
    requireText(errors, data, "city", "City");
  }
  // book-a-free-demo: no extra required fields beyond name/mobile/email/course/consent

  const course = data.course ?? "";
  const courseRequired = type !== "academy-classroom";
  if (courseRequired && !course) {
    errors.course = "Please select a course.";
  } else if (course && !coursesForType(type).some((c) => c.slug === course)) {
    errors.course = "Please select a valid course.";
  }

  const message = (data.message ?? "").trim();
  if (message.length > 1000) {
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
