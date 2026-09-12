"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import EnquiryFormCore from "@/components/forms/EnquiryFormCore";
import { DEMO_TYPE, enquiryTypeOptions } from "@/lib/enquiryTypes";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const DEFAULT_TYPE = enquiryTypeOptions[0].slug;

const MODAL_COPY = {
  "personal-mentoring": {
    heading: "Personal Mentoring Enquiry",
    description:
      "One-to-one sessions at your doorstep. Tell us about the student and we'll follow up.",
  },
  "community-learning": {
    heading: "Book a Group Session",
    description:
      "For apartment societies, schools, clubs, or groups of friends learning together.",
  },
  "academy-classroom": {
    heading: "Schedule an Academy Visit",
    description:
      "Would you like to visit Exabyte Academy, explore our robotics lab, meet our mentors, and understand our learning environment? Book your visit below.",
  },
  [DEMO_TYPE]: {
    heading: "Book a Free Demo",
    description:
      "Tell us a bit about the student and we'll set up a free demo session.",
  },
};

export default function EnquiryModal({ isOpen, context, triggerEl, onClose }) {
  const dialogRef = useRef(null);
  const headingRef = useRef(null);
  const [activeType, setActiveType] = useState(context.format || DEFAULT_TYPE);
  // The dialog wrapper (this component) stays mounted across opens/closes —
  // only its own render output toggles to null — so the opening pathname
  // is tracked in a ref, while the in-progress draft is state (it persists
  // on purpose: closing the form, by any means, keeps what was typed so
  // the same or another trigger button can pick up where it left off).
  const pathname = usePathname();
  const openPathnameRef = useRef(pathname);
  const [draft, setDraft] = useState(null);
  const [wasOpen, setWasOpen] = useState(isOpen);

  // Reset activeType during render (not in an effect) when the modal
  // transitions to open, so the heading/description are correct on the
  // very first paint instead of flashing the previous selection.
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      const nextType = draft?.format || context.format || DEFAULT_TYPE;
      if (activeType !== nextType) setActiveType(nextType);
    }
  }

  useEffect(() => {
    if (isOpen) {
      openPathnameRef.current = pathname;
    }
    // Only re-run when the modal opens/closes, not on every pathname change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && pathname !== openPathnameRef.current) {
      onClose();
    }
  }, [pathname, isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      headingRef.current?.focus();
    } else if (triggerEl && typeof triggerEl.focus === "function") {
      triggerEl.focus();
    }
  }, [isOpen, triggerEl]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleBackdropClick(e) {
    if (e.target !== e.currentTarget) return;
    onClose();
  }

  const copy = MODAL_COPY[activeType] || MODAL_COPY[DEFAULT_TYPE];

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 px-4 py-8"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enquiry-modal-heading"
        className="relative w-full max-w-lg max-h-full overflow-y-auto rounded-xl bg-white p-6 shadow-lg"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-navy/60 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ×
          </span>
        </button>

        <h2
          id="enquiry-modal-heading"
          ref={headingRef}
          tabIndex={-1}
          className="font-heading text-xl font-semibold text-ink focus:outline-none"
        >
          {copy.heading}
        </h2>
        <p className="mt-1 text-sm text-navy/80">{copy.description}</p>

        <div className="mt-6">
          <EnquiryFormCore
            initialCourse={context.course || ""}
            initialFormat={context.format || ""}
            initialValues={draft}
            onValuesChange={setDraft}
            onTypeChange={setActiveType}
          />
        </div>
      </div>
    </div>
  );
}
