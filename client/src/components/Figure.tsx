import { useEffect, useRef, useState } from "react";

type FigureProps = {
  src: string;
  alt: string;
  caption?: string;
  label?: string;          // e.g. "Round 1 · Concept B"
  size?: "wide" | "full" | "default" | "tall";
  bg?: "paper" | "tint";   // background tint behind image
  fit?: "contain" | "cover";
};

export function Figure({
  src,
  alt,
  caption,
  label,
  size = "default",
  bg = "paper",
  fit = "contain",
}: FigureProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  const sizeClass = {
    default: "max-w-3xl",
    wide: "max-w-5xl",
    full: "max-w-none",
    tall: "max-w-md",
  }[size];

  const bgClass = bg === "tint" ? "bg-[var(--tint)]" : "bg-paper";

  return (
    <>
      <figure
        ref={ref}
        className={`reveal ${revealed ? "in" : ""} ${sizeClass} mx-auto my-12 md:my-20`}
      >
        <div
          className={`figure-frame ${bgClass} cursor-zoom-in`}
          onClick={() => setOpen(true)}
        >
          <div className="aspect-auto p-2 md:p-4">
            <img
              src={src}
              alt={alt}
              loading="lazy"
              className={`w-full h-auto block ${
                fit === "cover" ? "object-cover" : "object-contain"
              }`}
            />
          </div>
          <span className="expand-hint">CLICK TO EXPAND</span>
        </div>
        {(label || caption) && (
          <figcaption className="mt-4 max-w-2xl">
            {label && (
              <span className="caption-label block mb-1">{label}</span>
            )}
            {caption && <span className="caption">{caption}</span>}
          </figcaption>
        )}
      </figure>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-[oklch(0.10_0.01_60_/_0.94)] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-200"
          onClick={() => setOpen(false)}
        >
          <button
            className="absolute top-5 right-5 text-paper font-display text-xs tracking-[0.18em] uppercase opacity-80 hover:opacity-100"
            onClick={() => setOpen(false)}
          >
            Close · Esc
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          />
          {caption && (
            <div className="absolute bottom-5 left-5 right-5 text-center text-paper/80 caption">
              {caption}
            </div>
          )}
        </div>
      )}
    </>
  );
}
