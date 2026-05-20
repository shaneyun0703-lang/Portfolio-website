import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export type CarouselSlide = {
  src: string;
  alt: string;
  /** Optional sub-label shown beneath the slide and in the lightbox. Accepts ReactNode so it can include bold prefixes etc. */
  step?: ReactNode;
};

type CarouselProps = {
  slides: CarouselSlide[];
  /** Top label, e.g. "Round 2 · Alt Adset Flow" */
  label?: string;
  /** One-line summary used as a caption under the figure */
  caption?: string;
  /** How wide the inline preview is */
  size?: "default" | "wide" | "full";
};

export function Carousel({
  slides,
  label,
  caption,
  size = "wide",
}: CarouselProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const sizeClass = {
    default: "max-w-3xl",
    wide: "max-w-5xl",
    full: "max-w-none",
  }[size];

  // Reveal-on-scroll
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-50px" },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length],
  );

  // Keyboard nav (works both in preview and lightbox)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  const current = slides[index];
  const counter = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

  return (
    <>
      <figure
        ref={ref}
        className={`reveal ${revealed ? "in" : ""} ${sizeClass} my-12 md:my-20`}
      >
        {/* Top toolbar with label and counter */}
        <div className="flex items-baseline justify-between mb-3 pl-1 pr-1">
          {label ? (
            <span className="caption-label">{label}</span>
          ) : (
            <span />
          )}
          <span className="font-mono text-[11px] tracking-widest text-ink/50">
            {counter}
          </span>
        </div>

        <div
          className="figure-frame bg-paper relative cursor-pointer"
          onClick={() => (slides.length > 1 ? next() : setOpen(true))}
          role={slides.length > 1 ? "button" : undefined}
          aria-label={slides.length > 1 ? "Next slide" : undefined}
        >
          <div className="p-2 md:p-4">
            <img
              src={current.src}
              alt={current.alt}
              loading="lazy"
              className="w-full h-auto block object-contain"
            />
          </div>
          <button
            type="button"
            className="expand-hint cursor-zoom-in"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            aria-label="Enlarge image"
          >
            CLICK TO ENLARGE
          </button>
        </div>

        {/* Inline prev/next + step label */}
        <div className="flex items-center justify-between gap-3 mt-3 pl-1 pr-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="carousel-btn"
            aria-label="Previous"
            disabled={slides.length < 2}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M12.5 4l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="caption text-center flex-1 min-w-0">
            {current.step ?? current.alt}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="carousel-btn"
            aria-label="Next"
            disabled={slides.length < 2}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M7.5 4l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {caption && (
          <figcaption className="mt-5 max-w-2xl">
            <span className="caption">{caption}</span>
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-[oklch(0.10_0.01_60_/_0.96)] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 text-paper">
            <div className="flex items-baseline gap-3">
              {label && (
                <span className="caption-label !text-paper/70">{label}</span>
              )}
              <span className="font-mono text-[11px] tracking-widest text-paper/50">
                {counter}
              </span>
            </div>
            <button
              className="font-display text-xs tracking-[0.18em] uppercase text-paper/80 hover:text-paper"
              onClick={() => setOpen(false)}
            >
              Close · Esc
            </button>
          </div>

          {/* Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="lightbox-arrow left-3 md:left-6"
            aria-label="Previous"
            disabled={slides.length < 2}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path
                d="M14 4l-7 7 7 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <img
            src={current.src}
            alt={current.alt}
            className="max-w-full max-h-[85vh] object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="lightbox-arrow right-3 md:right-6"
            aria-label="Next"
            disabled={slides.length < 2}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path
                d="M8 4l7 7-7 7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Caption / step */}
          {current.step && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 max-w-2xl text-center text-paper/85 caption px-6">
              {current.step}
            </div>
          )}
        </div>
      )}
    </>
  );
}
