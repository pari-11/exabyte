const backgrounds = {
  white: "bg-white",
  sky: "bg-sky",
  mist: "bg-mist",
};

export default function Section({
  background = "white",
  className = "",
  children,
  ...props
}) {
  const bgClass = backgrounds[background] ?? "";

  return (
    <section className={`${bgClass} ${className}`} {...props}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        {children}
      </div>
    </section>
  );
}
