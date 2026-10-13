import Link from "next/link";

const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3 font-body font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

const lift = "transition-all duration-150 hover:-translate-y-0.5";

const variants = {
  primary: `${lift} text-sm bg-primary text-white hover:bg-accent`,
  secondary: `${lift} text-sm bg-white text-primary border border-primary hover:bg-sky`,
  peach:
    "transition-colors duration-150 text-base bg-[#de7383] text-white hover:bg-[#e68593]",
};

export default function Button({
  href,
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
