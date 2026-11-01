import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { useScrolled } from "@/hooks/useScrolled";
import { allProjectsHref } from "@/pages/handoff/shared";

/* Case study header, shared by all three case studies.

   The vertical bar sits exactly on the content's left edge (the edge the
   kicker and headline start on), and "← All projects" hangs in the margin to
   its left, right-aligned against the bar. The edge is measured from the
   page's headline, so it tracks every breakpoint and every page's hero markup
   without duplicating the container's maths here.

   When the margin is too narrow for the full label, it shortens to
   "← Projects", then to the arrow alone; when even that will not fit, the row falls back to plain flow.

   Scrolled, the bar floats as a card. Its insets match the contents panel
   (28px, `right-7`), and its corner radius matches the panel's 10px. */

const INSET_SCROLLED = 28; // left-7 / right-7, same as the contents panel
const MIN_PAD = 12;        // smallest gap between the card edge and the link
const GAP = 14;            // link → bar, and bar → title
const ARROW_W = 14;

type Mode = "full" | "short" | "arrow" | "flow";

export function CaseNav({ category, title }: { category: string; title: string }) {
  const scrolled = useScrolled(40);
  const measureRef = useRef<HTMLSpanElement>(null);
  const shortRef = useRef<HTMLSpanElement>(null);
  const [edge, setEdge] = useState<number | null>(null);
  const [labelW, setLabelW] = useState(0);
  const [shortW, setShortW] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const h1 = document.querySelector("h1");
      if (h1) setEdge(h1.getBoundingClientRect().left);
      if (measureRef.current) setLabelW(measureRef.current.offsetWidth);
      if (shortRef.current) setShortW(shortRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Use the nav's *target* left, not its live one, so the bar does not chase
  // the 500ms inset transition — both animate together on the same curve.
  // Scrolled, the card's 1px border also shifts its content box.
  const navLeft = scrolled ? INSET_SCROLLED + 1 : 0;
  const barX = edge === null ? null : edge - navLeft;
  // The label is chosen from the tighter, scrolled geometry so it never
  // changes mid-scroll; only the card around it moves.
  const room = edge === null ? null : edge - (INSET_SCROLLED + 1);
  let mode: Mode = "flow";
  if (room !== null && labelW > 0) {
    if (room >= MIN_PAD + labelW + GAP) mode = "full";
    else if (room >= MIN_PAD + shortW + GAP) mode = "short";
    else if (room >= MIN_PAD + ARROW_W + GAP) mode = "arrow";
  }
  const aligned = mode !== "flow";

  const link = (
    <Link
      href={allProjectsHref()}
      aria-label="All projects"
      title="All projects"
      className="case-nav-link group inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] uppercase text-[#a8a8ae] hover:text-[#ececf0] transition-colors whitespace-nowrap relative -top-px"
    >
      {/* Optical centring: mono caps sit ~1px below the line box's centre, and
          the arrow a further ~1px, so both are lifted to centre on the bar. */}
      <span className="relative -top-px inline-block transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
      {mode === "short" ? <span>Projects</span> : mode !== "arrow" && <span>All projects</span>}
    </Link>
  );

  const ease = "transition-all duration-500 ease-in-out";

  return (
    <nav
      className={`fixed z-50 ${ease} ${scrolled ? "top-4 left-7 right-7 rounded-[10px]" : "top-0 left-0 right-0 border-b border-[#2f2f33]"}`}
      style={scrolled
        ? { background: "rgba(28,28,32,0.62)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }
        : { background: "#1e1e22" }}
    >
      {/* Off-screen copy of the full link, measured to decide which mode fits. */}
      <span
        ref={measureRef}
        aria-hidden
        className="absolute invisible pointer-events-none inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] uppercase whitespace-nowrap"
      >
        <span>←</span><span>All projects</span>
      </span>
      <span
        ref={shortRef}
        aria-hidden
        className="absolute invisible pointer-events-none inline-flex items-center gap-1.5 font-mono text-[12px] tracking-[0.08em] uppercase whitespace-nowrap"
      >
        <span>←</span><span>Projects</span>
      </span>

      <div className={`relative flex items-center ${ease} ${scrolled ? "py-3" : "py-6"} ${aligned ? "" : "px-7 gap-[14px]"}`}>
        {aligned ? (
          <>
            {/* Hangs in the margin, right edge GAP px short of the bar. */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${ease}`} style={{ right: `calc(100% - ${barX! - GAP}px)` }}>
              {link}
            </div>
            <div className={`w-px bg-[#444] shrink-0 ${ease} ${scrolled ? "h-5" : "h-6"}`} style={{ marginLeft: barX!, transitionProperty: "margin-left, height" }} />
          </>
        ) : (
          <>
            {link}
            <div className={`w-px bg-[#444] shrink-0 ${ease} ${scrolled ? "h-5" : "h-6"}`} />
          </>
        )}
        <div
          className={`font-display font-bold tracking-[-0.01em] text-[var(--ink)] whitespace-nowrap overflow-hidden text-ellipsis pr-7 ${ease} ${scrolled ? "text-[17px]" : "text-[20px]"}`}
          style={aligned ? { marginLeft: GAP } : undefined}
        >
          {scrolled ? title : category}
        </div>
      </div>
    </nav>
  );
}
