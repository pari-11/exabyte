import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Robotics Summer Camp | Exabyte Academy",
  description:
    "Exabyte Academy's Robotics Summer Camp — details coming soon.",
};

export default function RoboticsSummerCampPage() {
  return (
    <main>
      <Section
        background="none"
        className="hero-gradient overflow-hidden text-white"
      >
        <div className="relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
            Robotics Summer Camp
          </h1>
          <p className="mt-4 max-w-xl text-white/90">
            Details about this year&apos;s Robotics Summer Camp are coming
            soon. Check back shortly, or get in touch to be notified when
            registrations open.
          </p>
          <div className="mt-8">
            <Button href="/contact" variant="secondary">
              Notify Me
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}
