import {
  FaProjectDiagram,
  FaUsers,
  FaBriefcase,
  FaCertificate,
  FaUserCircle,
} from "react-icons/fa";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "About | Exabyte Academy",
  description:
    "Learn about Exabyte Academy — a Pune-based institute teaching practical, project-based technology skills through Robotics, Artificial Intelligence, and Technical Writing.",
};

const reasons = [
  {
    icon: FaProjectDiagram,
    title: "Practical, project-based curriculum",
    description: "Students learn by building real projects, not by memorising theory.",
  },
  {
    icon: FaUsers,
    title: "Small batch sizes",
    description: "Every student gets individual attention and hands-on guidance.",
  },
  {
    icon: FaBriefcase,
    title: "Portfolio-driven learning",
    description: "Students leave with real, demonstrable work — not just certificates.",
  },
  {
    icon: FaCertificate,
    title: "Certification on completion",
    description: "Every course ends with a certificate recognising the skills built.",
  },
];

const founders = [
  {
    name: "Founder Name",
    role: "Co-Founder",
    bio: "Bio coming soon.",
  },
  {
    name: "Founder Name",
    role: "Co-Founder",
    bio: "Bio coming soon.",
  },
];

const mentors = [
  {
    name: "Mentor Name",
    role: "Mentor",
    bio: "Bio coming soon.",
  },
  {
    name: "Mentor Name",
    role: "Mentor",
    bio: "Bio coming soon.",
  },
  {
    name: "Mentor Name",
    role: "Mentor",
    bio: "Bio coming soon.",
  },
];

function TeamCard({ name, role, bio }) {
  return (
    <Card className="flex flex-col items-center text-center">
      <FaUserCircle size={64} className="text-navy/30" aria-hidden="true" />
      <h4 className="mt-4 font-heading text-base font-semibold text-ink">
        {name}
      </h4>
      <p className="mt-1 text-sm text-primary">{role}</p>
      <p className="mt-2 text-sm text-navy/70 italic">{bio}</p>
    </Card>
  );
}

export default function AboutPage() {
  return (
    <main>
      <Section
        background="none"
        className="bg-gradient-to-br from-primary to-accent text-white"
      >
        <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
          Who We Are
        </h1>
        <p className="mt-4 max-w-xl text-white/90">
          Exabyte Academy is a Pune-based institute teaching practical,
          project-based technology skills. We believe learning happens by
          building, not by memorising — our students work on real projects,
          assignments, and demonstrations.
        </p>
      </Section>

      <Section background="white">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Mission and Vision
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-heading text-lg font-semibold text-ink">
              Mission
            </h3>
            <p className="mt-2 text-sm text-navy/80">
              To make technology education engaging, practical, and
              accessible — building confidence through projects, developing
              problem-solving skills, encouraging innovation, and producing
              learners with real portfolios.
            </p>
          </Card>
          <Card>
            <h3 className="font-heading text-lg font-semibold text-ink">
              Vision
            </h3>
            <p className="mt-2 text-sm text-navy/80">
              To become a leading technology academy that bridges classroom
              education and industry expectations, partners with schools on
              labs, and builds a community where students turn ideas into
              working solutions.
            </p>
          </Card>
        </div>
      </Section>

      <Section background="sky">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Why Choose Exabyte Academy
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
          Our Team
        </h2>
        <p className="mt-2 text-sm text-navy/70 italic">
          Team profiles are placeholders and will be updated with real
          photos and bios soon.
        </p>

        <h3 className="mt-10 font-heading text-lg font-semibold text-ink">
          Founders
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {founders.map((person, i) => (
            <TeamCard key={i} {...person} />
          ))}
        </div>

        <h3 className="mt-10 font-heading text-lg font-semibold text-ink">
          Mentors
        </h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {mentors.map((person, i) => (
            <TeamCard key={i} {...person} />
          ))}
        </div>
      </Section>

      <Section
        background="none"
        className="bg-footer text-white text-center"
      >
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold">
          Want to know more before you decide?
        </h2>
        <p className="mt-3 text-white/90 max-w-xl mx-auto">
          Browse our courses or reach out and we&apos;ll walk you through
          how we teach.
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
