"use client";

import { useCallback, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Card from "@/components/ui/Card";

const arrowClass =
  "flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-primary shadow-sm transition-colors hover:bg-sky focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

const GAP = 24;

// The list is rendered three times back-to-back and the view always sits in
// the middle copy. Whenever scrolling settles in the first or last copy, the
// position is silently moved by exactly one copy's width. The copies are
// identical, so nothing visibly changes and the strip never reaches an end.
export default function TestimonialCarousel({ items }) {
  const trackRef = useRef(null);
  const timerRef = useRef(null);
  const copies = [0, 1, 2];

  const copyWidth = useCallback(() => {
    const el = trackRef.current;
    const first = el?.children[0];
    const next = el?.children[items.length];
    return first && next ? next.offsetLeft - first.offsetLeft : 0;
  }, [items.length]);

  // Jump without animation or snapping, then restore both.
  const jumpTo = useCallback((left) => {
    const el = trackRef.current;
    if (!el) return;
    el.style.scrollBehavior = "auto";
    el.style.scrollSnapType = "none";
    el.scrollLeft = left;
    el.style.scrollBehavior = "";
    el.style.scrollSnapType = "";
  }, []);

  const recenter = useCallback(() => {
    const el = trackRef.current;
    const width = copyWidth();
    if (!el || !width) return;
    if (el.scrollLeft < width * 0.5) jumpTo(el.scrollLeft + width);
    else if (el.scrollLeft > width * 1.5) jumpTo(el.scrollLeft - width);
  }, [copyWidth, jumpTo]);

  useEffect(() => {
    jumpTo(copyWidth());
    const onResize = () => jumpTo(copyWidth());
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timerRef.current);
    };
  }, [copyWidth, jumpTo]);

  // Recenter only once scrolling has been idle, so an in-flight smooth scroll
  // or swipe is never interrupted.
  function handleScroll() {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(recenter, 120);
  }

  function scrollByCard(direction) {
    const el = trackRef.current;
    if (!el) return;
    recenter();
    const card = el.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + GAP : el.clientWidth;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {copies.map((copy) =>
          items.map((testimonial, i) => (
            <Card
              key={`${copy}-${i}`}
              aria-hidden={copy === 1 ? undefined : true}
              className="w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] flex-shrink-0 snap-start flex flex-col"
            >
              <p className="text-sm text-navy/80 italic flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-semibold text-ink">
                {testimonial.name}
              </p>
              <p className="text-xs text-navy/60">{testimonial.role}</p>
            </Card>
          ))
        )}
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
