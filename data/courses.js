export const formats = [
  {
    slug: "personal-mentoring",
    name: "Personal Mentoring",
    tagline: "Learn One-on-One with an Expert",
    description:
      "Enjoy a completely personalized learning experience at your doorstep with dedicated instructor attention. Ideal for students who want customized guidance, faster progress, and flexible scheduling.",
    ctaLabel: "Enquire Now",
    image: "/images/formats/personal-mentoring.svg",
  },
  {
    slug: "community-learning",
    name: "Community Learning",
    tagline: "Learn Together. Grow Together.",
    description:
      "Perfect for apartment societies, schools, clubs, or groups of friends who enjoy learning in a collaborative environment.",
    ctaLabel: "Book a Group Session",
    image: "/images/formats/community-learning.svg",
  },
  {
    slug: "academy-classroom",
    name: "Academy Classroom",
    tagline: "Learn at Exabyte Academy",
    description:
      "Experience structured classroom learning with access to our robotics lab, experienced mentors, modern equipment, and an engaging learning environment.",
    ctaLabel: "Visit Our Academy",
    image: "/images/formats/academy-classroom.svg",
  },
];

export const courses = [
  {
    slug: "robotics",
    name: "Robotics",
    emoji: "🤖",
    description: "Electronics, Arduino, sensors, motors, building real robots",
    longDescription:
      "Students develop a real understanding of electronic components and how robots actually function, building the skills and knowledge to design and build working prototypes of their own.",
    icon: "robotics",
    isOnline: false,
    syllabus: "/syllabus/robotics-syllabus.pdf",
    offerings: {
      "personal-mentoring": {
        status: "available",
        fee: 12000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
        bullets: [
          "Individual mentoring",
          "Hands-on practical sessions",
          "Build real robotics projects",
        ],
      },
      "community-learning": {
        status: "available",
        fee: 5000,
        feeUnit: "per-student",
        duration: { hours: 24, weeks: 6 },
        bullets: [
          "Small group learning",
          "Team-based projects",
          "Interactive classroom activities",
        ],
      },
      "academy-classroom": {
        status: "available",
        fee: 8000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
        bullets: [
          "Hands-on robotics lab",
          "Practical experiments",
          "Guided project work",
        ],
      },
    },
  },
  {
    slug: "artificial-intelligence",
    name: "Artificial Intelligence",
    emoji: "🧠",
    description: "Machine learning, computer vision, AI tools, hands-on projects",
    longDescription:
      "Students learn to use Python to harness AI, training models and working with real datasets to understand machine learning and modern AI tools — and how to use them ethically and sustainably, as an assistant that empowers rather than replaces.",
    icon: "ai",
    isOnline: false,
    syllabus: "/syllabus/artificial-intelligence-syllabus.pdf",
    offerings: {
      "personal-mentoring": {
        status: "available",
        fee: 8000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
        bullets: [
          "One-to-one AI coaching",
          "Interactive projects",
          "Practical learning approach",
        ],
      },
      "community-learning": {
        status: "available",
        fee: 5000,
        feeUnit: "per-student",
        duration: { hours: 24, weeks: 6 },
        bullets: [
          "Learn with friends",
          "AI activities and projects",
          "Fun collaborative sessions",
        ],
      },
      "academy-classroom": {
        status: "available",
        fee: 8000,
        feeUnit: "flat",
        duration: { hours: 24, weeks: 6 },
        bullets: [
          "Classroom AI learning",
          "Interactive demonstrations",
          "Real-world AI activities",
        ],
      },
    },
  },
  {
    slug: "technical-writing",
    name: "Technical Writing",
    emoji: "📝",
    description: "Documentation, style guides, technical communication",
    longDescription:
      "Students build a knack for writing clearly about any domain, however unfamiliar — identifying what matters, structuring real documentation, and mastering industry style guides — and leave with a portfolio of published work.",
    icon: "writing",
    isOnline: true,
    syllabus: "/syllabus/technical-writing-syllabus.pdf",
    offerings: {
      "personal-mentoring": {
        status: "available",
        fee: 15000,
        feeUnit: "flat",
        duration: { hours: 25, weeks: 5 },
        bullets: [
          "Live online instructor-led sessions",
          "Real documentation assignments",
          "Portfolio development",
        ],
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
