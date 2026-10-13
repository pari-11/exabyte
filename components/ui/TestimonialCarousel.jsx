"use client";

import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Card from "@/components/ui/Card";

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-primary shadow-sm transition-colors hover:bg-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

export default function TestimonialCarousel({ items }) {
  const trackRef = useRef(null);

  // Arrows always work: past the last card they wrap to the first, and
  // before the first card they wrap to the last.
  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;

    if (direction > 0 && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction < 0 && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((testimonial, i) => (
          <Card
            key={i}
            className="w-72 sm:w-80 flex-shrink-0 snap-start flex flex-col"
          >
            <p className="text-sm text-navy/80 italic flex-1">
              &ldquo;{testimonial.quote}&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold text-ink">
              {testimonial.name}
            </p>
            <p className="text-xs text-navy/60">{testimonial.role}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          aria-label="Previous testimonials"
          onClick={() => scrollByCard(-1)}
          className={arrowClass}
        >
          <FaChevronLeft size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next testimonials"
          onClick={() => scrollByCard(1)}
          className={arrowClass}
        >
          <FaChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
