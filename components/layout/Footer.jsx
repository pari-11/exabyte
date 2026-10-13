"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { site } from "@/data/site";

const socialIcons = {
  Facebook: FaFacebookF,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedinIn,
  WhatsApp: FaWhatsapp,
};

export default function Footer() {
  const year = new Date().getFullYear();
  const pathname = usePathname();
  const exploreLinks = pathname.startsWith("/aurolynx")
    ? site.footerLinks.explore.filter((link) => link.label !== "Book a Free Demo")
    : site.footerLinks.explore;

  return (
    <footer className="footer-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 font-heading text-lg font-semibold text-sky"
          >
            E
          </div>
          <div>
            <p className="font-heading text-xl font-semibold">{site.name}</p>
            <p className="mt-1 text-sm text-sky/80">Stay Connected</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-sky">
              Explore
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-footer hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-semibold uppercase tracking-wide text-sky">
              <Link
                href="/contact"
                className="rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-footer hover:text-accent"
              >
                Contact Us
              </Link>
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-white/90">
              {site.footerPhones.map((phone) => (
                <li key={phone}>{phone}</li>
              ))}
              <li>{site.email}</li>
            </ul>
            <div className="mt-5 flex items-center gap-4">
              {site.socialLinks.map((link) => {
                const Icon = socialIcons[link.label];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-sky rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-footer hover:text-accent"
                  >
                    {Icon && <Icon size={20} />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/20 pt-6">
          <p className="text-sm text-white/70">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
