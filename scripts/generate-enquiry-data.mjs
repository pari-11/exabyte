// Writes public/enquiry-data.json from the same data files the form uses, so
// public/enquiry.php validates and labels enquiries without a second copy of
// the course/option lists. Runs automatically before `npm run build`.
import { mkdirSync, writeFileSync } from "node:fs";
import { courses } from "../data/courses.js";
import { site } from "../data/site.js";
import {
  DEMO_TYPE,
  enquiryTypeOptions,
  groupTypeOptions,
  timeSlotOptions,
  learningDayOptions,
  visitTimeSlotOptions,
  visitorCountOptions,
  visitPurposeOptions,
} from "../lib/enquiryTypes.js";

const data = {
  siteName: site.name,
  siteEmail: site.email,
  demoType: DEMO_TYPE,
  types: enquiryTypeOptions,
  courses: courses.map((course) => ({
    slug: course.slug,
    name: course.name,
    availableFor: Object.entries(course.offerings)
      .filter(([, offering]) => offering.status === "available")
      .map(([type]) => type),
  })),
  options: {
    groupType: groupTypeOptions,
    timeSlot: timeSlotOptions,
    days: learningDayOptions,
    visitTimeSlot: visitTimeSlotOptions,
    numberOfVisitors: visitorCountOptions,
    visitPurpose: visitPurposeOptions,
  },
};

mkdirSync("public", { recursive: true });
writeFileSync("public/enquiry-data.json", JSON.stringify(data, null, 2));
console.log("Wrote public/enquiry-data.json");
