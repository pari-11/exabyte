import Link from "next/link";

const base =
  "inline-flex items-center justify-center rounded-md px-6 py-3 font-body text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2";

const variants = {
  primary: "bg-primary text-white hover:bg-accent",
  secondary: "bg-white text-primary border border-primary hover:bg-sky",
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
