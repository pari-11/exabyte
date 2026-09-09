import Link from "next/link";
import { FaRobot, FaBrain, FaPen, FaCheckCircle, FaUsers, FaChalkboardTeacher } from "react-icons/fa";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { courses, formats } from "@/data/courses";

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
        className="bg-gradient-to-br from-primary to-accent text-white"
      >
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
      </Section>

      <Section background="white">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Our Courses
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {courses.map((course) => {
            const Icon = courseIcons[course.icon];
            return (
              <Link key={course.slug} href="/courses">
                <Card className="h-full transition-shadow hover:shadow-md">
                  {Icon && (
                    <Icon size={28} className="text-primary" aria-hidden="true" />
                  )}
                  <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                    {course.name}
                  </h3>
                  <p className="mt-2 text-sm text-navy/80">
                    {course.description}
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 flex justify-center">
          <Button href="/courses">View All Courses</Button>
        </div>
      </Section>

      <Section background="sky">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Why Choose Us
        </h2>
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
      </Section>

      <Section background="white">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Choose Your Learning Format
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {formats.map((format) => (
            <Link key={format.slug} href={`/courses#${format.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <h3 className="font-heading text-lg font-semibold text-ink">
                  {format.name}
                </h3>
                <p className="mt-1 text-sm text-primary">{format.tagline}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        background="none"
        className="bg-footer text-white text-center"
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
