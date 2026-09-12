import Link from "next/link";
import { FaRobot, FaBrain, FaPen, FaCheckCircle, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";
import { courses, formats } from "@/data/courses";
import { testimonials } from "@/data/testimonials";

const courseIcons = {
  robotics: FaRobot,
  ai: FaBrain,
  writing: FaPen,
};

const reasons = [
  {
    icon: FaChalkboardTeacher,
    title: "Experienced mentors",
    description: "Learn from instructors who've worked in the field, not just taught it.",
  },
  {
    icon: FaUsers,
    title: "Small group sizes",
    description: "Every student gets real attention, whether learning solo or in a group.",
  },
  {
    icon: FaCheckCircle,
    title: "Proven curriculum",
    description: "Structured, project-based courses that build real, demonstrable skills.",
  },
];

const whyCourseHighlights = [
  {
    icon: FaRobot,
    title: "Robotics",
    description:
      "Students learn electronics, mechanics, Arduino programming, sensors, and automation by building real robots — turning ideas into working projects.",
  },
  {
    icon: FaBrain,
    title: "Artificial Intelligence",
    description:
      "Students explore machine learning, computer vision, and modern AI tools, discovering how AI powers today's world in an engaging, age-appropriate way.",
  },
  {
    icon: FaPen,
    title: "Technical Writing",
    description:
      "Students learn to organize ideas, write clear documentation, and communicate technical information effectively using industry-standard practices.",
  },
];

export const metadata = {
  title: "Exabyte Academy | Learn. Build. Innovate.",
  description:
    "Exabyte Academy helps students build strong foundations in Robotics, Artificial Intelligence, and Technical Writing through personal mentoring, community learning, and academy classroom formats.",
};

export default function Home() {
  return (
    <main>
      <Section
        background="none"
        className="hero-gradient overflow-hidden text-white"
      >
        <div className="relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
            Turn curiosity into real-world skills
          </h1>
          <p className="mt-4 max-w-xl text-white/90">
            Exabyte Academy helps students build strong foundations in
            Robotics, Artificial Intelligence, and Technical Writing —
            taught the way that fits them best.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button href="/courses" variant="secondary">
              Explore Courses
            </Button>
            <Button href="/contact" variant="secondary">
              Book a Free Demo
            </Button>
          </div>
        </div>
      </Section>

      <Section background="white">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Our Courses
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = courseIcons[course.icon];
            return (
              <Card key={course.slug} className="h-full flex flex-col">
                {Icon && (
                  <Icon size={28} className="text-primary" aria-hidden="true" />
                )}
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                  {course.name}
                </h3>
                <p className="mt-2 text-sm text-navy/80 flex-1">
                  {course.description}
                </p>
                <Link
                  href="/courses"
                  className="sweep-link mt-4 inline-flex items-center text-sm font-medium rounded-sm transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Know More →
                </Link>
              </Card>
            );
          })}
        </div>
      </Section>

      <SectionDivider />

      <Section background="sky">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Why Exabyte Academy?
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-navy/80">
          We believe the best way to learn technology is by building it. Our
          practical, project-based approach encourages students to explore,
          experiment, and solve real-world problems while developing
          creativity, logical thinking, and confidence.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <Card key={reason.title}>
                <Icon size={28} className="text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm text-navy/80">
                  {reason.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {whyCourseHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title}>
                <Icon size={28} className="text-primary" aria-hidden="true" />
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-navy/80">{item.description}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      <SectionDivider />

      <Section background="white">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Find The Right Learning Plan
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {formats.map((format) => (
            <Card
              key={format.slug}
              className="h-full flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md"
            >
              <img
                src={format.image}
                alt={format.name}
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {format.name}
                </h3>
                <p className="mt-1 text-sm text-primary flex-1">
                  {format.tagline}
                </p>
                <Link
                  href={`/courses#${format.slug}`}
                  className="sweep-link mt-4 inline-flex items-center text-sm font-medium rounded-sm transition-transform duration-150 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Learn More →
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <SectionDivider />

      <Section background="sky">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Testimonials
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-navy/80">
          Hear from families who&apos;ve been part of the Exabyte Academy
          journey.
        </p>
        <div className="mt-10 overflow-hidden">
          <div className="testimonial-track flex w-max gap-6">
            {[...testimonials, ...testimonials].map((testimonial, i) => (
              <Card
                key={i}
                className="w-72 sm:w-80 flex-shrink-0 flex flex-col"
              >
                <p className="text-sm text-navy/80 italic flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-ink">
                  {testimonial.name}
                </p>
                <p className="text-xs text-navy/60">{testimonial.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      <Section
        background="none"
        className="footer-gradient text-white text-center"
      >
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold">
          Ready to see what your child could build?
        </h2>
        <p className="mt-3 text-white/90 max-w-xl mx-auto">
          Book a free demo session or browse our courses to find the right
          fit.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/courses" variant="secondary">
            Explore Courses
          </Button>
          <Button href="/contact" variant="secondary">
            Book a Free Demo
          </Button>
        </div>
      </Section>
    </main>
  );
}
