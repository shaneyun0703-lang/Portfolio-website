import { useState } from "react";

/**
 * ClickableImage — wraps an image to make it clickable.
 * Clicking opens a full-screen overlay with the image at full size.
 */
export function ClickableImage({
  src,
  alt,
  className,
  style,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  loading?: "lazy" | "eager";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`${className || ""} cursor-pointer hover:opacity-90 transition-opacity`}
        style={style}
        loading={loading}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-2xl font-mono transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
