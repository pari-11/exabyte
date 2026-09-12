"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/data/site";
import { useEnquiryModal } from "@/components/enquiry/EnquiryModalProvider";
import { DEMO_TYPE } from "@/lib/enquiryTypes";

function isLinkActive(pathname, href) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { open } = useEnquiryModal();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-20">
        <Link
          href="/"
          className="flex flex-col leading-tight rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span className="font-heading text-xl font-semibold text-ink">
            {site.name}
          </span>
          <span className="text-xs text-navy/70">{site.tagline}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {site.navLinks.map((link) => {
            const active = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`inline-block rounded-sm font-body underline-offset-4 transition-transform duration-150 hover:-translate-y-0.5 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  active ? "underline decoration-2 text-primary" : "no-underline text-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <button
            type="button"
            onClick={() => open({ format: DEMO_TYPE })}
            className="rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Book a Free Demo
          </button>
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden inline-flex flex-col items-center justify-center gap-1.5 h-10 w-10 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${
              isMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-opacity ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink transition-transform ${
              isMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden w-full border-t border-line bg-white px-4 py-4 flex flex-col gap-4"
        >
          {site.navLinks.map((link) => {
            const active = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`inline-block self-start rounded-sm font-body underline-offset-4 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  active ? "underline decoration-2 text-primary" : "no-underline text-navy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(false);
              open({ format: DEMO_TYPE });
            }}
            className="rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Book a Free Demo
          </button>
        </div>
      )}
    </header>
  );
}
