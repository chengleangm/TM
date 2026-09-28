"use client";
import { useId, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
export function Carousel({
  children,
  label,
  previous,
  next,
}: {
  children: React.ReactNode;
  label: string;
  previous: string;
  next: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  function move(direction: number) {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).gap) || 24;
    el.scrollBy({
      left: direction * ((card?.offsetWidth || el.clientWidth) + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  return (
    <div className="carousel">
      <div
        className="carousel-track"
        role="region"
        aria-label={label}
        id={id}
        ref={ref}
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            event.target === event.currentTarget &&
            ["ArrowLeft", "ArrowRight"].includes(event.key)
          ) {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {children}
      </div>
      <div className="carousel-controls">
        <span aria-hidden="true" className="carousel-line" />
        <button
          aria-label={previous}
          aria-controls={id}
          onClick={() => move(-1)}
        >
          <ArrowLeft size={19} />
        </button>
        <button aria-label={next} aria-controls={id} onClick={() => move(1)}>
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
