"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { validateEnquiry, isValid, coursesForType } from "@/lib/validation";
import {
  DEMO_TYPE,
  enquiryTypeOptions,
  groupTypeOptions,
  timeSlotOptions,
  learningDayOptions,
  visitTimeSlotOptions,
  visitorCountOptions,
  visitPurposeOptions,
} from "@/lib/enquiryTypes";

const SUBMIT_LABELS = {
  "personal-mentoring": "Send Enquiry",
  "community-learning": "Book Group Session",
  "academy-classroom": "Schedule Visit",
  [DEMO_TYPE]: "Book a Free Demo",
};

function fieldOrderForType(type) {
  const base = ["format"];
  if (type === "community-learning") {
    return [
      ...base,
      "fullName",
      "organizationName",
      "contactPerson",
      "mobile",
      "whatsapp",
      "email",
      "groupType",
      "participants",
      "ageGroup",
      "city",
      "venueAddress",
      "course",
      "startDate",
      "days",
      "timeSlot",
      "message",
      "consent",
    ];
  }
  if (type === "academy-classroom") {
    return [
      ...base,
      "fullName",
      "guardianName",
      "studentAge",
      "schoolName",
      "grade",
      "mobile",
      "whatsapp",
      "email",
      "course",
      "visitDate",
      "visitTimeSlot",
      "numberOfVisitors",
      "visitPurpose",
      "message",
      "consent",
    ];
  }
  if (type === DEMO_TYPE) {
    return [
      ...base,
      "fullName",
      "guardianName",
      "studentAge",
      "mobile",
      "whatsapp",
      "email",
      "course",
      "city",
      "message",
      "consent",
    ];
  }
  // personal-mentoring (default)
  return [
    ...base,
    "fullName",
    "guardianName",
    "studentAge",
    "schoolName",
    "grade",
    "mobile",
    "whatsapp",
    "email",
    "course",
    "days",
    "timeSlot",
    "city",
    "locality",
    "message",
    "consent",
  ];
}

function makeInitialValues({ course = "", format = "" } = {}) {
  return {
    format: format || enquiryTypeOptions[0].slug,
    fullName: "",
    guardianName: "",
    studentAge: "",
    schoolName: "",
    grade: "",
    organizationName: "",
    contactPerson: "",
    mobile: "",
    whatsapp: "",
    email: "",
    groupType: "",
    participants: "",
    ageGroup: "",
    city: "",
    locality: "",
    venueAddress: "",
    course,
    days: [],
    timeSlot: "",
    startDate: "",
    visitDate: "",
    visitTimeSlot: "",
    numberOfVisitors: "",
    visitPurpose: [],
    message: "",
    consent: false,
  };
}

export default function EnquiryFormCore({
  initialCourse = "",
  initialFormat = "",
  initialValues = null,
  onValuesChange,
  onTypeChange,
}) {
  // The defaults a Reset click restores — based on how the form was
  // opened, not on any in-progress draft.
  const [defaultValues] = useState(() =>
    makeInitialValues({ course: initialCourse, format: initialFormat })
  );
  const [values, setValues] = useState(() => initialValues || defaultValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [formError, setFormError] = useState("");
  const inputRefs = useRef({});

  useEffect(() => {
    onTypeChange?.(values.format);
    // Only report the type itself, not every value change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.format]);

  function commitChange(nextValues, field) {
    setValues(nextValues);
    onValuesChange?.(nextValues);
    if (touched[field]) {
      const nextErrors = validateEnquiry(nextValues);
      setErrors((prev) => ({ ...prev, [field]: nextErrors[field] }));
    }
  }

  function handleChange(field, value) {
    commitChange({ ...values, [field]: value }, field);
  }

  function handleTypeChange(nextType) {
    // Each type shows a different set of fields, so switching mid-fill
    // starts that section fresh rather than carrying over stale values.
    setValues(makeInitialValues({ format: nextType }));
    setErrors({});
    setTouched({});
    onValuesChange?.(makeInitialValues({ format: nextType }));
  }

  function handleCheckboxGroupToggle(field, value, checked) {
    const current = values[field] || [];
    const next = checked
      ? [...current, value]
      : current.filter((v) => v !== value);
    commitChange({ ...values, [field]: next }, field);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fieldOrder = fieldOrderForType(values.format);
    const validationErrors = validateEnquiry(values);
    setErrors(validationErrors);
    setTouched(
      fieldOrder.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    if (!isValid(validationErrors)) {
      const firstInvalid = fieldOrder.find((field) => validationErrors[field]);
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
      onValuesChange?.(null);
    } catch {
      setFormError("Something went wrong — please try again.");
      setStatus("error");
    }
  }

  function handleReset() {
    setValues(defaultValues);
    setErrors({});
    setTouched({});
    setFormError("");
    setStatus("idle");
    onValuesChange?.(defaultValues);
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
  const type = values.format;
  const availableCourses = coursesForType(type);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <Field label="I'm looking for" error={errors.format} htmlFor="format">
        <select
          id="format"
          ref={(el) => (inputRefs.current.format = el)}
          value={values.format}
          onChange={(e) => handleTypeChange(e.target.value)}
          disabled={disabled}
          className={inputClass(errors.format)}
        >
          {enquiryTypeOptions.map((option) => (
            <option key={option.slug} value={option.slug}>
              {option.name}
            </option>
          ))}
        </select>
      </Field>

      {type === "community-learning" ? (
        <>
          <SectionHeading>Organizer Information</SectionHeading>
          <Field label="Organizer name" error={errors.fullName} htmlFor="fullName">
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
          <Field
            label="Organization / society / school name"
            error={errors.organizationName}
            htmlFor="organizationName"
          >
            <input
              id="organizationName"
              ref={(el) => (inputRefs.current.organizationName = el)}
              type="text"
              value={values.organizationName}
              onChange={(e) => handleChange("organizationName", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.organizationName)}
            />
          </Field>
          <Field
            label="Contact person (optional)"
            error={errors.contactPerson}
            htmlFor="contactPerson"
          >
            <input
              id="contactPerson"
              ref={(el) => (inputRefs.current.contactPerson = el)}
              type="text"
              value={values.contactPerson}
              onChange={(e) => handleChange("contactPerson", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.contactPerson)}
            />
          </Field>

          <SectionHeading>Contact Details</SectionHeading>
          {contactFields()}

          <SectionHeading>Group Details</SectionHeading>
          <Field label="Type of group" error={errors.groupType} htmlFor="groupType">
            <select
              id="groupType"
              ref={(el) => (inputRefs.current.groupType = el)}
              value={values.groupType}
              onChange={(e) => handleChange("groupType", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.groupType)}
            >
              <option value="">Select a group type</option>
              {groupTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label="Number of participants"
            error={errors.participants}
            htmlFor="participants"
          >
            <input
              id="participants"
              ref={(el) => (inputRefs.current.participants = el)}
              type="number"
              min="1"
              value={values.participants}
              onChange={(e) => handleChange("participants", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.participants)}
            />
          </Field>
          <Field label="Age group" error={errors.ageGroup} htmlFor="ageGroup">
            <input
              id="ageGroup"
              ref={(el) => (inputRefs.current.ageGroup = el)}
              type="text"
              placeholder="e.g. 8–14 years"
              value={values.ageGroup}
              onChange={(e) => handleChange("ageGroup", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.ageGroup)}
            />
          </Field>
          <Field label="City" error={errors.city} htmlFor="city">
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
          <Field
            label="Venue address"
            error={errors.venueAddress}
            htmlFor="venueAddress"
          >
            <input
              id="venueAddress"
              ref={(el) => (inputRefs.current.venueAddress = el)}
              type="text"
              value={values.venueAddress}
              onChange={(e) => handleChange("venueAddress", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.venueAddress)}
            />
          </Field>

          <SectionHeading>Course Selection</SectionHeading>
          <Field
            label="Interested course"
            error={errors.course}
            htmlFor="course"
          >
            <select
              id="course"
              ref={(el) => (inputRefs.current.course = el)}
              value={values.course}
              onChange={(e) => handleChange("course", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.course)}
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.name}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Preferred start date (optional)"
            error={errors.startDate}
            htmlFor="startDate"
          >
            <input
              id="startDate"
              ref={(el) => (inputRefs.current.startDate = el)}
              type="date"
              value={values.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.startDate)}
            />
          </Field>

          <CheckboxGroup
            label="Preferred learning days (optional)"
            options={learningDayOptions}
            values={values.days}
            onToggle={(value, checked) =>
              handleCheckboxGroupToggle("days", value, checked)
            }
            disabled={disabled}
          />
          <RadioGroup
            label="Preferred time slot (optional)"
            name="timeSlot"
            options={timeSlotOptions}
            value={values.timeSlot}
            onChange={(value) => handleChange("timeSlot", value)}
            disabled={disabled}
          />

          <Field
            label="Special requirements (optional)"
            error={errors.message}
            htmlFor="message"
          >
            <textarea
              id="message"
              ref={(el) => (inputRefs.current.message = el)}
              rows={4}
              placeholder="e.g. Robotics kits required, indoor classroom, project demonstration, certificates"
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.message)}
            />
          </Field>
        </>
      ) : type === "academy-classroom" ? (
        <>
          <SectionHeading>Visitor Information</SectionHeading>
          <Field label="Visitor name" error={errors.fullName} htmlFor="fullName">
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
          <Field
            label="Parent/guardian name (if applicable)"
            error={errors.guardianName}
            htmlFor="guardianName"
          >
            <input
              id="guardianName"
              ref={(el) => (inputRefs.current.guardianName = el)}
              type="text"
              value={values.guardianName}
              onChange={(e) => handleChange("guardianName", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.guardianName)}
            />
          </Field>
          <Field label="Student age" error={errors.studentAge} htmlFor="studentAge">
            <input
              id="studentAge"
              ref={(el) => (inputRefs.current.studentAge = el)}
              type="number"
              min="1"
              value={values.studentAge}
              onChange={(e) => handleChange("studentAge", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.studentAge)}
            />
          </Field>
          <Field
            label="School / college (optional)"
            error={errors.schoolName}
            htmlFor="schoolName"
          >
            <input
              id="schoolName"
              ref={(el) => (inputRefs.current.schoolName = el)}
              type="text"
              value={values.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.schoolName)}
            />
          </Field>
          <Field label="Grade / year (optional)" error={errors.grade} htmlFor="grade">
            <input
              id="grade"
              ref={(el) => (inputRefs.current.grade = el)}
              type="text"
              value={values.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.grade)}
            />
          </Field>

          <SectionHeading>Contact Details</SectionHeading>
          {contactFields()}

          <Field
            label="Interested course (optional)"
            error={errors.course}
            htmlFor="course"
          >
            <select
              id="course"
              ref={(el) => (inputRefs.current.course = el)}
              value={values.course}
              onChange={(e) => handleChange("course", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.course)}
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.name}
                  {course.isOnline ? " (Online)" : ""}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="Preferred visit date"
            error={errors.visitDate}
            htmlFor="visitDate"
          >
            <input
              id="visitDate"
              ref={(el) => (inputRefs.current.visitDate = el)}
              type="date"
              value={values.visitDate}
              onChange={(e) => handleChange("visitDate", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.visitDate)}
            />
          </Field>

          <RadioGroup
            label="Preferred time"
            name="visitTimeSlot"
            options={visitTimeSlotOptions}
            value={values.visitTimeSlot}
            onChange={(value) => handleChange("visitTimeSlot", value)}
            disabled={disabled}
            error={errors.visitTimeSlot}
          />

          <RadioGroup
            label="Number of visitors (optional)"
            name="numberOfVisitors"
            options={visitorCountOptions}
            value={values.numberOfVisitors}
            onChange={(value) => handleChange("numberOfVisitors", value)}
            disabled={disabled}
          />

          <CheckboxGroup
            label="What would you like during your visit? (optional)"
            options={visitPurposeOptions}
            values={values.visitPurpose}
            onToggle={(value, checked) =>
              handleCheckboxGroupToggle("visitPurpose", value, checked)
            }
            disabled={disabled}
          />

          <Field
            label="Additional questions (optional)"
            error={errors.message}
            htmlFor="message"
          >
            <textarea
              id="message"
              ref={(el) => (inputRefs.current.message = el)}
              rows={4}
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.message)}
            />
          </Field>
        </>
      ) : type === DEMO_TYPE ? (
        <>
          <Field label="Student name" error={errors.fullName} htmlFor="fullName">
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
          <Field
            label="Parent/guardian name (if applicable)"
            error={errors.guardianName}
            htmlFor="guardianName"
          >
            <input
              id="guardianName"
              ref={(el) => (inputRefs.current.guardianName = el)}
              type="text"
              value={values.guardianName}
              onChange={(e) => handleChange("guardianName", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.guardianName)}
            />
          </Field>
          <Field
            label="Student age (optional)"
            error={errors.studentAge}
            htmlFor="studentAge"
          >
            <input
              id="studentAge"
              ref={(el) => (inputRefs.current.studentAge = el)}
              type="number"
              min="1"
              value={values.studentAge}
              onChange={(e) => handleChange("studentAge", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.studentAge)}
            />
          </Field>

          {contactFields()}

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
              {availableCourses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.name}
                </option>
              ))}
            </select>
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

          <Field
            label="What would you like to know more about? (optional)"
            error={errors.message}
            htmlFor="message"
          >
            <textarea
              id="message"
              ref={(el) => (inputRefs.current.message = el)}
              rows={4}
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.message)}
            />
          </Field>
        </>
      ) : type === "personal-mentoring" ? (
        <>
          <SectionHeading>Student Information</SectionHeading>
          <Field label="Student name" error={errors.fullName} htmlFor="fullName">
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
          <Field
            label="Parent/guardian name (if applicable)"
            error={errors.guardianName}
            htmlFor="guardianName"
          >
            <input
              id="guardianName"
              ref={(el) => (inputRefs.current.guardianName = el)}
              type="text"
              value={values.guardianName}
              onChange={(e) => handleChange("guardianName", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.guardianName)}
            />
          </Field>
          <Field label="Student age" error={errors.studentAge} htmlFor="studentAge">
            <input
              id="studentAge"
              ref={(el) => (inputRefs.current.studentAge = el)}
              type="number"
              min="1"
              value={values.studentAge}
              onChange={(e) => handleChange("studentAge", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.studentAge)}
            />
          </Field>
          <Field
            label="School / college name (optional)"
            error={errors.schoolName}
            htmlFor="schoolName"
          >
            <input
              id="schoolName"
              ref={(el) => (inputRefs.current.schoolName = el)}
              type="text"
              value={values.schoolName}
              onChange={(e) => handleChange("schoolName", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.schoolName)}
            />
          </Field>
          <Field
            label="Grade / year of study (optional)"
            error={errors.grade}
            htmlFor="grade"
          >
            <input
              id="grade"
              ref={(el) => (inputRefs.current.grade = el)}
              type="text"
              value={values.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.grade)}
            />
          </Field>

          <SectionHeading>Contact Details</SectionHeading>
          {contactFields()}

          <SectionHeading>Course Selection</SectionHeading>
          <Field
            label="Which course are you interested in?"
            error={errors.course}
            htmlFor="course"
          >
            <select
              id="course"
              ref={(el) => (inputRefs.current.course = el)}
              value={values.course}
              onChange={(e) => handleChange("course", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.course)}
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.name}
                  {course.isOnline ? " (Online)" : ""}
                </option>
              ))}
            </select>
          </Field>

          <CheckboxGroup
            label="Preferred learning days (optional)"
            options={learningDayOptions}
            values={values.days}
            onToggle={(value, checked) =>
              handleCheckboxGroupToggle("days", value, checked)
            }
            disabled={disabled}
          />
          <RadioGroup
            label="Preferred time slot (optional)"
            name="timeSlot"
            options={timeSlotOptions}
            value={values.timeSlot}
            onChange={(value) => handleChange("timeSlot", value)}
            disabled={disabled}
          />

          <SectionHeading>Location</SectionHeading>
          <Field label="City" error={errors.city} htmlFor="city">
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
          <Field
            label="Area / locality (optional)"
            error={errors.locality}
            htmlFor="locality"
          >
            <input
              id="locality"
              ref={(el) => (inputRefs.current.locality = el)}
              type="text"
              value={values.locality}
              onChange={(e) => handleChange("locality", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.locality)}
            />
          </Field>

          <Field
            label="What would you like to learn or achieve? (optional)"
            error={errors.message}
            htmlFor="message"
          >
            <textarea
              id="message"
              ref={(el) => (inputRefs.current.message = el)}
              rows={4}
              value={values.message}
              onChange={(e) => handleChange("message", e.target.value)}
              disabled={disabled}
              className={inputClass(errors.message)}
            />
          </Field>
        </>
      ) : null}

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

      <div className="flex flex-col sm:flex-row gap-3">
        <Button type="submit" disabled={disabled} className="w-full sm:w-auto">
          {disabled ? "Sending…" : SUBMIT_LABELS[type]}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={handleReset}
          className="w-full sm:w-auto"
        >
          Reset Form
        </Button>
      </div>
    </form>
  );

  function contactFields() {
    return (
      <>
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
        <Field
          label="WhatsApp number (optional)"
          error={errors.whatsapp}
          htmlFor="whatsapp"
        >
          <input
            id="whatsapp"
            ref={(el) => (inputRefs.current.whatsapp = el)}
            type="tel"
            value={values.whatsapp}
            onChange={(e) => handleChange("whatsapp", e.target.value)}
            disabled={disabled}
            className={inputClass(errors.whatsapp)}
          />
        </Field>
        <Field label="Email address" error={errors.email} htmlFor="email">
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
      </>
    );
  }
}

function SectionHeading({ children }) {
  return (
    <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary border-t border-line pt-4 first:border-t-0 first:pt-0">
      {children}
    </h3>
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

function CheckboxGroup({ label, options, values, onToggle, disabled }) {
  return (
    <div>
      <p className="block text-sm font-medium text-ink">{label}</p>
      <div className="mt-2 flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 text-sm text-navy/80"
          >
            <input
              type="checkbox"
              checked={values.includes(option.value)}
              onChange={(e) => onToggle(option.value, e.target.checked)}
              disabled={disabled}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function RadioGroup({ label, name, options, value, onChange, disabled, error }) {
  return (
    <div>
      <p className="block text-sm font-medium text-ink">{label}</p>
      <div className="mt-2 flex flex-wrap gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 text-sm text-navy/80"
          >
            <input
              type="radio"
              name={name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              disabled={disabled}
            />
            {option.label}
          </label>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(error) {
  return `w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 ${
    error ? "border-red-500" : "border-line"
  }`;
}
