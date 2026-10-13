const variants = {
  default: "hero-gradient",
  aurolynx: "aurolynx-hero",
};

export default function SectionDivider({ variant = "default" }) {
  return (
    <div
      aria-hidden="true"
      className={`${variants[variant]} h-[1.5cm] w-full`}
    />
  );
}
