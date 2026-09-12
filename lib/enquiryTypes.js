import { formats } from "@/data/courses";

export const DEMO_TYPE = "book-a-free-demo";

export const enquiryTypeOptions = [
  ...formats.map((format) => ({ slug: format.slug, name: format.name })),
  { slug: DEMO_TYPE, name: "Book a Free Demo" },
];

export const enquiryTypeSlugs = enquiryTypeOptions.map((type) => type.slug);

export const groupTypeOptions = [
  { value: "apartment-society", label: "Apartment Society" },
  { value: "school", label: "School" },
  { value: "club", label: "Club" },
  { value: "friends-group", label: "Friends Group" },
  { value: "other", label: "Other" },
];

export const timeSlotOptions = [
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
];

export const learningDayOptions = [
  { value: "weekdays", label: "Weekdays" },
  { value: "weekends", label: "Weekends" },
];

export const visitTimeSlotOptions = [
  { value: "10am-12pm", label: "10:00 AM – 12:00 PM" },
  { value: "12pm-2pm", label: "12:00 PM – 2:00 PM" },
  { value: "2pm-4pm", label: "2:00 PM – 4:00 PM" },
  { value: "4pm-6pm", label: "4:00 PM – 6:00 PM" },
];

export const visitorCountOptions = [
  { value: "student-only", label: "Student Only" },
  { value: "student-plus-1", label: "Student + 1 Parent" },
  { value: "student-plus-2", label: "Student + 2 Parents/Guardians" },
  { value: "other", label: "Other" },
];

export const visitPurposeOptions = [
  { value: "academy-tour", label: "Academy Tour" },
  { value: "robotics-lab-demo", label: "Robotics Lab Demonstration" },
  { value: "course-counseling", label: "Course Counseling" },
  { value: "fee-discussion", label: "Fee Discussion" },
  { value: "trial-session-info", label: "Trial Session Information" },
];
