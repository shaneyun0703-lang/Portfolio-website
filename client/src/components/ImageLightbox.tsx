import { useCallback, useEffect, useState } from "react";

/**
 * Global image lightbox — listens for clicks on any <img> inside
 * case study pages and opens a full-screen overlay.
 *
 * If the clicked image is inside a carousel or gallery (sibling imgs),
 * the lightbox allows clicking through all images in that group.
 */
export function ImageLightbox() {
  const [images, setImages] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const img = (e.target as HTMLElement).closest("img") as HTMLImageElement | null;
      if (!img) return;
      if (img.naturalWidth < 100 || img.naturalHeight < 100) return;
      if (img.closest("[data-no-lightbox]")) return;
      if (img.closest("video")) return;
      const inCaseStudy = img.closest("section, figure, [class*='theme-']");
      if (!inCaseStudy) return;

      // Find sibling images in the same container (carousel, grid, etc.)
      const container = img.closest("[class*='carousel'], [class*='flex'], [class*='grid'], figure")
        || img.parentElement;
      const siblingImgs = container
        ? Array.from(container.querySelectorAll("img")).filter(
            (i) => (i as HTMLImageElement).naturalWidth >= 100
          )
        : [img];

      const srcs = siblingImgs.map((i) => (i as HTMLImageElement).src);
      const clickedIdx = srcs.indexOf(img.src);

      if (srcs.length > 1) {
        setImages(srcs);
        setIdx(clickedIdx >= 0 ? clickedIdx : 0);
      } else {
        setImages([img.src]);
        setIdx(0);
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const close = useCallback(() => { setImages([]); setIdx(0); }, []);
  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(images.length - 1, i + 1)), [images.length]);

  useEffect(() => {
    if (images.length === 0) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, close, prev, next]);

  if (images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/92 flex items-center justify-center p-6 md:p-12 backdrop-blur-sm"
      onClick={close}
    >
      <img
        src={images[idx]}
        alt=""
        className="max-w-full max-h-full object-contain rounded-md shadow-[0_0_60px_rgba(0,0,0,0.5)]"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={idx === 0}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-2xl font-mono transition-colors disabled:opacity-20"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={idx === images.length - 1}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-2xl font-mono transition-colors disabled:opacity-20"
          >
            →
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3">
            <span className="font-mono text-[11px] text-white/40">
              {idx + 1} / {images.length}
            </span>
            <div className="flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                  className="w-1.5 h-1.5 rounded-full transition-colors"
                  style={{ background: i === idx ? "white" : "rgba(255,255,255,0.25)" }}
                />
              ))}
            </div>
          </div>
        </>
      )}

      <button
        type="button"
        onClick={close}
        className="absolute top-5 right-6 text-white/50 hover:text-white text-xl font-mono transition-colors"
      >
        ✕
      </button>

      {images.length <= 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] text-white/30 uppercase tracking-[0.1em]">
          Click anywhere to close
        </div>
      )}
    </div>
  );
}
