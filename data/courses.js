export const formats = [
  {
    slug: "personal-mentoring",
    name: "Personal Mentoring",
    tagline: "One-to-one, at your doorstep",
    description: "One-to-one sessions at the student's home",
    ctaLabel: "Enquire Now",
  },
  {
    slug: "community-learning",
    name: "Community Learning",
    tagline: "Learn together, in small groups",
    description: "Small groups — societies, schools, friend groups",
    ctaLabel: "Book a Group Session",
  },
  {
    slug: "academy-classroom",
    name: "Academy Classroom",
    tagline: "At the academy, with full lab access",
    description: "At the academy, with lab access",
    ctaLabel: "Visit Our Academy",
  },
];

export const courses = [
  {
    slug: "robotics",
    name: "Robotics",
    description: "Electronics, Arduino, sensors, motors, building real robots",
    icon: "robotics",
    isOnline: false,
    offerings: {
      "personal-mentoring": {
        status: "available",
        fee: 12000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
      },
      "community-learning": {
        status: "available",
        fee: 5000,
        feeUnit: "per-student",
        duration: { hours: 24, weeks: 6 },
      },
      "academy-classroom": {
        status: "available",
        fee: 8000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
      },
    },
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    description: "Machine learning, computer vision, AI tools, hands-on projects",
    icon: "ai",
    isOnline: false,
    offerings: {
      "personal-mentoring": {
        status: "available",
        fee: 8000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
      },
      "community-learning": {
        status: "available",
        fee: 5000,
        feeUnit: "per-student",
        duration: { hours: 24, weeks: 6 },
      },
      "academy-classroom": {
        status: "available",
        fee: 8000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
      },
    },
  },
  {
    slug: "technical-writing",
    name: "Technical Writing",
    description: "Documentation, style guides, technical communication",
    icon: "writing",
    isOnline: true,
    offerings: {
      "personal-mentoring": {
        status: "available",
        fee: 15000,
        feeUnit: "flat",
        duration: { hours: 25, weeks: 5 },
      },
      "community-learning": {
        status: "unavailable",
        message: "Currently available only as Personal Mentoring",
      },
      "academy-classroom": {
        status: "unavailable",
        message: "Currently available only as Personal Mentoring",
      },
    },
  },
];
