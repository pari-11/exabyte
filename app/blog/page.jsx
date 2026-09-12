import Section from "@/components/ui/Section";

export const metadata = {
  title: "Blog | Exabyte Academy",
  description: "Exabyte Academy's blog — articles are coming soon.",
};

export default function BlogPage() {
  return (
    <main>
      <Section
        background="none"
        className="hero-gradient overflow-hidden text-white"
      >
        <div className="relative z-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-semibold max-w-2xl">
            Blog
          </h1>
          <p className="mt-4 max-w-xl text-white/90">
            We&apos;re working on our first posts. Check back soon for
            articles on Robotics, AI, and Technical Writing.
          </p>
        </div>
      </Section>
    </main>
  );
}
