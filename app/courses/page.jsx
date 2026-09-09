import { FaRobot, FaBrain, FaPen } from "react-icons/fa";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EnquiryTriggerButton from "@/components/enquiry/EnquiryTriggerButton";
import { courses, formats } from "@/data/courses";

const courseIcons = {
  robotics: FaRobot,
  ai: FaBrain,
  writing: FaPen,
};

function formatFee(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export const metadata = {
  title: "Courses | Exabyte Academy",
  description:
    "Explore Robotics, Artificial Intelligence, and Technical Writing courses at Exabyte Academy, available as Personal Mentoring, Community Learning, and Academy Classroom sessions.",
};

export default function CoursesPage() {
  return (
    <main>
      <Section
        background="none"
        className="bg-gradient-to-br from-primary to-accent text-white"
      >
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
          Courses built to turn curiosity into real skills
        </h1>
        <p className="mt-4 max-w-xl text-white/90">
          From hands-on robotics to practical AI and technical writing, find
          the course and the learning format that fits your child best.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <EnquiryTriggerButton variant="secondary">
            Book a Free Demo
          </EnquiryTriggerButton>
          <Button href="/contact" variant="secondary">
            Talk to Us
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
              <Card key={course.slug}>
                {Icon && (
                  <Icon size={28} className="text-primary" aria-hidden="true" />
                )}
                <h3 className="mt-4 font-heading text-lg font-semibold text-ink">
                  {course.name}
                </h3>
                <p className="mt-2 text-sm text-navy/80">
                  {course.description}
                </p>
                {course.isOnline && (
                  <p className="mt-3 text-xs font-medium text-primary">
                    Available online
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      </Section>

      <Section background="sky">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Choose Your Learning Format
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {formats.map((format) => (
            <Card key={format.slug} id={format.slug} className="flex flex-col">
              <h3 className="font-heading text-lg font-semibold text-ink">
                {format.name}
              </h3>
              <p className="mt-1 text-sm text-primary">{format.tagline}</p>
              <p className="mt-2 text-sm text-navy/80">
                {format.description}
              </p>

              <ul className="mt-5 flex flex-col gap-4 flex-1">
                {courses.map((course) => {
                  const offering = course.offerings[format.slug];
                  return (
                    <li
                      key={course.slug}
                      className="border-t border-line pt-3 first:border-t-0 first:pt-0"
                    >
                      <p className="text-sm font-medium text-ink">
                        {course.name}
                      </p>
                      {offering.status === "available" ? (
                        <p className="mt-1 text-sm text-navy/80">
                          {formatFee(offering.fee)}
                          {offering.feeUnit === "per-student" &&
                            " per student"}
                          {" · "}
                          {offering.duration.hours} hours over{" "}
                          {offering.duration.weeks} weeks
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-navy/60 italic">
                          {offering.message}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>

              <EnquiryTriggerButton format={format.slug} className="mt-6 w-full">
                {format.ctaLabel}
              </EnquiryTriggerButton>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        background="none"
        className="bg-footer text-white text-center"
      >
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold">
          Ready to start your child&apos;s learning journey?
        </h2>
        <p className="mt-3 text-white/90 max-w-xl mx-auto">
          Get in touch and we&apos;ll help you pick the right course and
          format.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <EnquiryTriggerButton variant="secondary">
            Book a Free Demo
          </EnquiryTriggerButton>
          <Button href="/contact" variant="secondary">
            Talk to Us
          </Button>
        </div>
      </Section>
    </main>
  );
}
