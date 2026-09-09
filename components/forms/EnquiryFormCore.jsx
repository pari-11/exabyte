"use client";

import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { courses, formats } from "@/data/courses";
import { validateEnquiry, isValid } from "@/lib/validation";

function makeInitialValues({ course = "", format = "" } = {}) {
  return {
    fullName: "",
    email: "",
    mobile: "",
    city: "",
    course,
    format,
    message: "",
    consent: false,
  };
}

const fieldRefs = [
  "fullName",
  "email",
  "mobile",
  "city",
  "course",
  "format",
  "message",
  "consent",
];

export default function EnquiryFormCore({
  initialCourse = "",
  initialFormat = "",
  onDirtyChange,
}) {
  const [initialValues] = useState(() =>
    makeInitialValues({ course: initialCourse, format: initialFormat })
  );
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [formError, setFormError] = useState("");
  const inputRefs = useRef({});

  function handleChange(field, value) {
    const nextValues = { ...values, [field]: value };
    setValues(nextValues);
    onDirtyChange?.(true);

    if (touched[field]) {
      const nextErrors = validateEnquiry(nextValues);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateEnquiry(values);
    setErrors(validationErrors);
    setTouched(
      fieldRefs.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    if (!isValid(validationErrors)) {
      const firstInvalid = fieldRefs.find((field) => validationErrors[field]);
      inputRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("submitting");
    setFormError("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();

      if (!res.ok || !result.ok) {
        setErrors((prev) => ({ ...prev, ...result.errors }));
        setFormError(
          result.errors?.form || "Something went wrong — please try again."
        );
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setFormError("Something went wrong — please try again.");
      setStatus("error");
    }
  }

  function handleReset() {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setFormError("");
    setStatus("idle");
    onDirtyChange?.(false);
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-line bg-white p-6 text-center">
        <p className="font-heading text-lg font-semibold text-ink">
          Thanks — we&apos;ll get back to you soon.
        </p>
        <Button className="mt-6" onClick={handleReset}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const disabled = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field label="Full name" error={errors.fullName} htmlFor="fullName">
        <input
          id="fullName"
          ref={(el) => (inputRefs.current.fullName = el)}
          type="text"
          value={values.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.fullName)}
        />
      </Field>

      <Field label="Email" error={errors.email} htmlFor="email">
        <input
          id="email"
          ref={(el) => (inputRefs.current.email = el)}
          type="email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.email)}
        />
      </Field>

      <Field label="Mobile number" error={errors.mobile} htmlFor="mobile">
        <input
          id="mobile"
          ref={(el) => (inputRefs.current.mobile = el)}
          type="tel"
          value={values.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.mobile)}
        />
      </Field>

      <Field label="City (optional)" error={errors.city} htmlFor="city">
        <input
          id="city"
          ref={(el) => (inputRefs.current.city = el)}
          type="text"
          value={values.city}
          onChange={(e) => handleChange("city", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.city)}
        />
      </Field>

      <Field label="Course" error={errors.course} htmlFor="course">
        <select
          id="course"
          ref={(el) => (inputRefs.current.course = el)}
          value={values.course}
          onChange={(e) => handleChange("course", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.course)}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.slug} value={course.slug}>
              {course.name}
            </option>
          ))}
        </select>
      </Field>

      <Field
        label="Preferred format (optional)"
        error={errors.format}
        htmlFor="format"
      >
        <select
          id="format"
          ref={(el) => (inputRefs.current.format = el)}
          value={values.format}
          onChange={(e) => handleChange("format", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.format)}
        >
          <option value="">Any format</option>
          {formats.map((format) => (
            <option key={format.slug} value={format.slug}>
              {format.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message} htmlFor="message">
        <textarea
          id="message"
          ref={(el) => (inputRefs.current.message = el)}
          rows={5}
          value={values.message}
          onChange={(e) => handleChange("message", e.target.value)}
          disabled={disabled}
          className={inputClass(errors.message)}
        />
      </Field>

      <div>
        <label className="flex items-start gap-2 text-sm text-navy/80">
          <input
            id="consent"
            ref={(el) => (inputRefs.current.consent = el)}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => handleChange("consent", e.target.checked)}
            disabled={disabled}
            className="mt-1"
          />
          I agree to be contacted about this enquiry.
        </label>
        {errors.consent && (
          <p className="mt-1 text-sm text-red-600">{errors.consent}</p>
        )}
      </div>

      {status === "error" && formError && (
        <p className="text-sm text-red-600">{formError}</p>
      )}

      <Button type="submit" disabled={disabled} className="w-full sm:w-auto">
        {disabled ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}

function Field({ label, error, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 ${
    error ? "border-red-500" : "border-line"
  }`;
}
