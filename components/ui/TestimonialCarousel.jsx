"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Card from "@/components/ui/Card";

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-primary shadow-sm transition-colors hover:bg-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-40 disabled:hover:bg-white";

export default function TestimonialCarousel({ items }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={updateArrows}
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
          disabled={!canPrev}
          className={arrowClass}
        >
          <FaChevronLeft size={14} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Next testimonials"
          onClick={() => scrollByCard(1)}
          disabled={!canNext}
          className={arrowClass}
        >
          <FaChevronRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
