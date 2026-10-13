import { FaCheckCircle } from "react-icons/fa";
import Section from "@/components/ui/Section";
import Card from "@/components/ui/Card";
import SectionDivider from "@/components/ui/SectionDivider";
import { kits, kitAudience } from "@/data/kits";

export const metadata = {
  title: "Aurolynx Robotics & STEM Learning Kits | Exabyte Academy",
  description:
    "Aurolynx — robotics and STEM learning kits that turn scientific concepts into hands-on experiences. Coming soon from Exabyte Academy.",
};

export default function AurolynxPage() {
  return (
    <main>
      <Section
        background="none"
        className="aurolynx-hero overflow-hidden text-white"
      >
        <div className="relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
            Aurolynx — Robotics &amp; STEM Learning Kits
          </h1>
          <p className="mt-4 max-w-xl text-white/90">
            Turning scientific concepts into hands-on experiences. Make science
            tangible with practical learning kits that help students discover
            electricity, magnetism, electronics and mechanics through
            experiments and real-world activities.
          </p>
        </div>
      </Section>

      <Section background="white">
        <p className="text-sm font-medium uppercase text-rose">
          Explore. Experiment. Innovate.
        </p>
        <h2 className="mt-1 font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Our Learning Kits
        </h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {kits.map((kit) => (
            <Card
              key={kit.slug}
              className={`h-full flex flex-col border-peach-line ${
                kit.highlights ? "sm:col-span-2" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-heading text-sm font-semibold text-peach-deep">
                  {kit.number}
                </span>
                <span className="rounded-full bg-peach-soft px-3 py-1 text-xs font-semibold text-peach-deep">
                  Coming soon
                </span>
              </div>
              <h3 className="mt-3 font-heading text-xl font-semibold text-ink">
                {kit.name}
              </h3>
              <p className="mt-2 text-sm text-navy/80">{kit.description}</p>
              {kit.highlights && (
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {kit.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-navy/80"
                    >
                      <FaCheckCircle
                        size={14}
                        className="shrink-0 text-peach"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </Section>

      <SectionDivider variant="aurolynx" />

      <Section background="none" className="bg-peach-soft">
        <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-ink">
          Learn by doing. Build by exploring.
        </h2>
        <p className="mt-3 max-w-2xl text-navy/80">
          Build curiosity, logical thinking, problem-solving and
          creativity — one experiment at a time.
        </p>
        <p className="mt-6 text-sm font-medium uppercase text-rose">
          For {kitAudience.join(" · ")}
        </p>
      </Section>
    </main>
  );
}
