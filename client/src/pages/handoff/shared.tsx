/**
 * HANDOFF PREVIEWS — shared data, chrome and reveal choreography.
 *
 * PREVIEW ONLY. Not imported by the live landing (/) or the production gate.
 *
 * Content is reconciled against LandingV3.tsx (the live landing) rather than the
 * comps, which carried placeholder years, statuses and a "Resume PDF" link.
 */
import { Fragment, memo, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactElement, ReactNode } from "react";
import { Link } from "wouter";
import { GateBackground } from "@/components/GateBackground";
import "@/styles/handoff.css";

/* ---------------------------------------------------------------- content -- */

export const ME = {
  name: "Shane Yun",
  role: "Senior Product Designer",
  org: "Meta",
  location: "Bay Area",
  email: "shane.yun0703@gmail.com",
  linkedin: "https://www.linkedin.com/in/shane-yun",
  statement: "Designing to translate business ambition into growth.",
};

export type Work = {
  n: string;
  href: string;
  cat: string;
  title: string;
  blurb: string;
  role: string;
  status: string;
  timeline: string;
  accent: string;
  /** Three facts that survive being read at a glance — for the `proof` panel. */
  metrics: { v: string; k: string }[];
  /** Screenshot flow, most representative first. Each frame carries its own
   *  `aspect` because the pair mixes a landscape builder screen with a portrait
   *  phone — one shape for both would letterbox whichever it did not suit.
   *  `video` renders a looping clip instead of an image. */
  shots: {
    src: string; alt: string; cap: string;
    aspect?: number;   // portrait phone shots carry their own shape
    video?: boolean;   // render a looping clip instead of an image
    bare?: boolean;    // already cropped to its content — no browser chrome
  }[];
};

/* Order, titles, accents and outcomes mirror the live landing cards. */
export const WORK: Work[] = [
  {
    n: "01",
    href: "/commerce-ads",
    cat: "Meta · Commerce Ads",
    title: "Unifying Meta's split eCommerce ad builder",
    blurb: "Re-designed how brands pick and tailor the photos and videos in Meta's unified flagship shopping ad builder.",
    role: "Design Lead",
    status: "Shipped beta · 150K brands",
    timeline: "H1 2026",
    accent: "#0ee9d6",
    metrics: [
      { v: "150K", k: "brands in beta" },
      { v: "2 \u2192 1", k: "builders merged" },
      { v: "H1 2026", k: "shipped" },
    ],
    shots: [
      { src: "/primer/commerce-media-crop.png", alt: "Every media type added in the unified builder", cap: "All media", bare: true },
      { src: "/primer/commerce-in-feed.jpeg", alt: "The Nike commerce ad a shopper sees in feed", cap: "In feed", aspect: 0.46 },
      { src: "/primer/commerce-hero.png", alt: "Unified ad creation flow", cap: "Unified flow" },
    ],
  },
  {
    n: "02",
    href: "/search-ads",
    cat: "Meta · Search Ads",
    title: "Making Meta a real search ads player",
    blurb: "Designed Meta's first search ads experience, from a single checkbox to the controls ads will need in AI search.",
    role: "Design Lead",
    status: "E2E design concept",
    timeline: "H2 2025",
    accent: "#ff63cc",
    metrics: [
      { v: "3", k: "research rounds" },
      { v: "14+", k: "companies" },
      { v: "E2E", k: "design concept" },
    ],
    shots: [
      { src: "/primer/final-2.png", alt: "Search themes final design", cap: "Search themes" },
      { src: "/primer/Meta search ad.png", alt: "A sponsored result in Meta search", cap: "In search", aspect: 0.46 },
      { src: "/primer/final-3.png", alt: "Search themes detail", cap: "Theme detail" },
      { src: "/primer/final-4.png", alt: "Search ads campaign setup", cap: "Campaign setup" },
    ],
  },
  {
    n: "03",
    href: "/whatsapp",
    cat: "Meta · WhatsApp Ads",
    title: "Taking WhatsApp ads from launch to scale",
    blurb: "Expanded ads on WhatsApp from two kinds of ad campaigns to five, opening it to nearly every business on Meta.",
    role: "Design Lead",
    status: "Shipped globally",
    timeline: "H2 2025",
    accent: "#1eff8a",
    metrics: [
      { v: "Global", k: "rollout" },
      { v: "Launch \u2192 scale", k: "in one half" },
      { v: "H2 2025", k: "shipped" },
    ],
    shots: [
      { src: "/primer/sales-05-placement.png", alt: "WhatsApp placement selection", cap: "Placement" },
      /* A composed diagram, not a raw capture: it carries its own device frame,
         label and field, so it takes the bare treatment rather than the glass
         phone case — a case around it would be a frame around a frame. */
      { src: "/primer/wa-status-diagram.png", alt: "Diagram of an ad running in WhatsApp Status", cap: "In Status", bare: true },
      { src: "/primer/sales-06-ad-creative.png", alt: "WhatsApp Status ad creative", cap: "Ad creative" },
      { src: "/primer/sales-01-conversion.png", alt: "Conversion location setup", cap: "Conversion" },
    ],
  },
];

/* ------------------------------------------------------------- transitions -- */

/* The first four treat the page as one object. The last three split it: the
   identity and the index arrive by different means, so the composition reads as
   two parts meeting rather than one thing fading up. */
export type Reveal =
  | "focus" | "aperture" | "sweep" | "deal"
  | "counter" | "unfold" | "settle" | "type";
export const REVEALS: Reveal[] = [
  "focus", "aperture", "sweep", "deal",
  "counter", "unfold", "settle", "type",
];

export const REVEAL_NOTES: Record<Reveal, string> = {
  focus: "Focus pull · ~850ms · the whole composition resolves out of soft focus as one",
  aperture: "Aperture · ~1.1s · the work panel opens from its centre, then the name lands",
  sweep: "Raking light · ~1.2s · a light bar crosses and content lights up in its wake",
  deal: "Deal · ~1.1s · panel settles, then rows drop in with a slight overshoot",
  counter: "Counterpoint · ~1.1s · the name descends, the index rises, they meet in the middle",
  unfold: "Unfold · ~1.2s · the name resolves in place while the index opens from its centre line",
  settle: "Settle · ~1.2s · the work lands first and the name settles onto it after",
  type: "Typed · ~3.5s · the page arrives whole, then the role line is typed in above it",
};

type Step = {
  delay: number;
  duration: number;
  y?: number;      // px translate
  scale?: number;  // start scale
  blur?: number;   // px start blur
  rot?: number;    // deg start rotation
  clip?: boolean;  // open from the centre (aperture)
};

/**
 * Per-transition choreography. Both layouts share one timing language.
 *
 * Reveals run on CSS transitions rather than a JS animation loop: a
 * requestAnimationFrame-driven library leaves the page stuck at its `initial`
 * state if the tab is backgrounded during the unlock, which is exactly the
 * moment this page animates. CSS keeps it self-healing.
 */
export function useChoreography(kind: Reveal) {
  const reduced = usePrefersReducedMotion();

  return useMemo(() => {
    const SCHEDULE: Record<Reveal, Record<string, Step>> = {
      /* FOCUS PULL — no stagger to speak of. Everything sits soft and slightly
         oversized, then a single lens settles. Reads as arrival, not assembly. */
      focus: {
        bg:    { delay: 0.00, duration: 1.10, scale: 1.02, blur: 8 },
        badge: { delay: 0.28, duration: 0.45, y: -8 },
        mast:  { delay: 0.10, duration: 0.85, scale: 1.035, blur: 14 },
        meta:  { delay: 0.18, duration: 0.80, scale: 1.02, blur: 10 },
        head:  { delay: 0.16, duration: 0.85, scale: 1.028, blur: 12 },
        row0:  { delay: 0.22, duration: 0.75, blur: 8 },
        row1:  { delay: 0.26, duration: 0.75, blur: 8 },
        row2:  { delay: 0.30, duration: 0.75, blur: 8 },
        pane:  { delay: 0.34, duration: 0.75, blur: 8 },
        foot:  { delay: 0.45, duration: 0.6 },
      },

      /* APERTURE — the glass card from the gate widens into the work panel,
         then the identity lands above it. The lock opening into the dossier. */
      aperture: {
        bg:    { delay: 0.00, duration: 0.9 },
        badge: { delay: 0.18, duration: 0.45, y: -8 },
        head:  { delay: 0.12, duration: 0.85, clip: true },
        mast:  { delay: 0.42, duration: 0.6, y: 10 },
        meta:  { delay: 0.56, duration: 0.5, y: 6 },
        row0:  { delay: 0.58, duration: 0.45, y: 8 },
        row1:  { delay: 0.66, duration: 0.45, y: 8 },
        row2:  { delay: 0.74, duration: 0.45, y: 8 },
        pane:  { delay: 0.84, duration: 0.5, y: 8 },
        foot:  { delay: 0.95, duration: 0.5 },
      },

      /* RAKING LIGHT — a bar of light crosses the screen and content lights up
         behind it. Delays track horizontal position, so it reads as one pass. */
      sweep: {
        bg:    { delay: 0.05, duration: 0.7 },
        badge: { delay: 0.55, duration: 0.4, y: -8 },
        head:  { delay: 0.36, duration: 0.35 },
        row0:  { delay: 0.42, duration: 0.35 },
        row1:  { delay: 0.46, duration: 0.35 },
        row2:  { delay: 0.50, duration: 0.35 },
        pane:  { delay: 0.56, duration: 0.4 },
        mast:  { delay: 0.44, duration: 0.4 },
        meta:  { delay: 0.66, duration: 0.4 },
        foot:  { delay: 0.78, duration: 0.4 },
      },

      /* DEAL — the panel settles first, then rows are dealt onto it with a
         small overshoot and a degree of rotation. Physical and confident. */
      deal: {
        bg:    { delay: 0.00, duration: 0.8 },
        badge: { delay: 0.2, duration: 0.45, y: -8 },
        mast:  { delay: 0.10, duration: 0.6, y: 16 },
        meta:  { delay: 0.26, duration: 0.5, y: 10 },
        head:  { delay: 0.28, duration: 0.55, y: 20, scale: 0.985 },
        row0:  { delay: 0.48, duration: 0.55, y: 34, rot: 0.7 },
        row1:  { delay: 0.58, duration: 0.55, y: 34, rot: -0.5 },
        row2:  { delay: 0.68, duration: 0.55, y: 34, rot: 0.6 },
        pane:  { delay: 0.80, duration: 0.55, y: 22 },
        foot:  { delay: 0.92, duration: 0.5 },
      },

      /* COUNTERPOINT — the identity comes down from above while the index comes
         up from below. Opposed directions, so the two halves close on the gap
         between them instead of travelling together. */
      counter: {
        bg:    { delay: 0.00, duration: 0.9 },
        badge: { delay: 0.30, duration: 0.45, y: -8 },
        mast:  { delay: 0.06, duration: 0.72, y: -30 },
        meta:  { delay: 0.14, duration: 0.62, y: -20 },
        head:  { delay: 0.30, duration: 0.58, y: 24 },
        row0:  { delay: 0.36, duration: 0.52, y: 28 },
        row1:  { delay: 0.42, duration: 0.52, y: 28 },
        row2:  { delay: 0.48, duration: 0.52, y: 28 },
        pane:  { delay: 0.54, duration: 0.5, y: 20 },
        foot:  { delay: 0.64, duration: 0.5 },
      },

      /* UNFOLD — the name never moves; it just resolves where it already is.
         All the motion belongs to the index, which opens from its centre line
         and then deals its rows. Stillness above, mechanism below. */
      unfold: {
        bg:    { delay: 0.00, duration: 1.0, scale: 1.02 },
        badge: { delay: 0.26, duration: 0.45, y: -8 },
        mast:  { delay: 0.05, duration: 0.9, blur: 12 },
        meta:  { delay: 0.13, duration: 0.8, blur: 8 },
        head:  { delay: 0.28, duration: 0.7, clip: true },
        row0:  { delay: 0.44, duration: 0.5, y: 14, scale: 0.985 },
        row1:  { delay: 0.50, duration: 0.5, y: 14, scale: 0.985 },
        row2:  { delay: 0.56, duration: 0.5, y: 14, scale: 0.985 },
        pane:  { delay: 0.62, duration: 0.5, y: 10 },
        foot:  { delay: 0.72, duration: 0.5 },
      },

      /* SETTLE — reverses the usual order. The work is already there when the
         page opens and the name arrives last, settling onto it out of focus.
         Reads as the portfolio first and the person second. */
      settle: {
        bg:    { delay: 0.00, duration: 0.8 },
        head:  { delay: 0.04, duration: 0.5, y: 18 },
        row0:  { delay: 0.10, duration: 0.46, y: 22 },
        row1:  { delay: 0.16, duration: 0.46, y: 22 },
        row2:  { delay: 0.22, duration: 0.46, y: 22 },
        pane:  { delay: 0.28, duration: 0.46, y: 14 },
        mast:  { delay: 0.44, duration: 0.85, blur: 16, scale: 1.03 },
        meta:  { delay: 0.58, duration: 0.6, blur: 8 },
        badge: { delay: 0.60, duration: 0.45, y: -8 },
        foot:  { delay: 0.74, duration: 0.5 },
      },

      /* TYPED — the identity is written on rather than revealed. Its two blocks
         are handed to the page instantly and the letters do the work themselves
         (see .hx-typed), so `mast` and `meta` only need to stop hiding them.
         The index waits for the writing to finish. */
      /* The whole composition arrives first — name, then the index opening on
         aperture's terms from its centre line — and only once it has settled is
         the role line typed in above it. The empty line holds its place with a
         waiting caret, so nothing moves when the writing starts. */
      type: {
        bg:    { delay: 0.00, duration: 0.9 },
        mast:  { delay: 0.10, duration: 0.85, blur: 14, scale: 1.025 },
        meta:  { delay: 0.20, duration: 0.45 },
        head:  { delay: 0.30, duration: 0.85, clip: true },
        row0:  { delay: 0.50, duration: 0.45, y: 8 },
        row1:  { delay: 0.58, duration: 0.45, y: 8 },
        row2:  { delay: 0.66, duration: 0.45, y: 8 },
        pane:  { delay: 0.76, duration: 0.5, y: 8 },
        badge: { delay: 0.95, duration: 0.45, y: -8 },
        foot:  { delay: 1.05, duration: 0.5 },
      },
    };

    const table = SCHEDULE[kind] ?? SCHEDULE.focus;
    const step = (name: string): Step => table[name] ?? { delay: 0.2, duration: 0.45 };
    const delayOf = (name: string) => step(name).delay;

    return { kind, step, delayOf, reduced, hasSweep: kind === "sweep" };
  }, [kind, reduced]);
}

export type Choreography = ReturnType<typeof useChoreography>;

/**
 * Flips the root into its played state one tick after mount, which is what
 * starts every `.hx-rev` transition. setTimeout (not rAF) so a backgrounded tab
 * still resolves.
 */
export function usePlay() {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setPlay(true), 30);
    return () => clearTimeout(id);
  }, []);
  return play;
}

/* ---------------------------------------------------------------- typing --- */

/**
 * A real typewriter: returns how many characters have been committed so far.
 * The text is genuinely absent until its letter is typed, rather than sitting
 * there at zero opacity — which is the difference between reading as written
 * and reading as faded up.
 */
export function useTypewriter(len: number, startMs: number, stepMs: number, on: boolean) {
  const [n, setN] = useState(on ? 0 : len);
  useEffect(() => {
    if (!on) { setN(len); return; }
    setN(0);
    /* Progress comes off the wall clock, not off a tick count. A hidden tab has
       its timers clamped to once a second, and a counted typewriter would take
       fifty seconds to write a line it should write in one — the same trap the
       reveals avoid by staying on CSS. Here the count simply jumps to wherever
       the clock says it should be. `settle` guarantees the text lands. */
    const from = performance.now() + startMs;
    const id = window.setInterval(() => {
      const elapsed = performance.now() - from;
      if (elapsed < 0) return;
      const k = Math.floor(elapsed / stepMs);
      if (k >= len) { window.clearInterval(id); setN(len); return; }
      setN(k);
    }, Math.min(stepMs, 30));
    const settle = window.setTimeout(
      () => { window.clearInterval(id); setN(len); },
      startMs + len * stepMs + 400,
    );
    return () => { clearInterval(id); clearTimeout(settle); };
  }, [len, startMs, stepMs, on]);
  return n;
}

/** A styled run of the typed line. Empty spans still render so that
 *  :first-child / :last-child stay pinned to the same two elements. */
export type Part = { text: string; className?: string; span?: boolean };

/**
 * Every character is its own element with a stable key, so each one mounts
 * once, runs its ease-in to completion, and is never re-created by a later
 * keystroke. Wrapping only the newest letter instead looks correct but is not:
 * the next render collapses it back into plain text and cuts its animation off
 * partway, which is what makes a slowly typed line stutter.
 */
function Inked({ text, from }: { text: string; from: number }) {
  return (
    <>
      {Array.from(text).map((c, i) =>
        c === " "
          ? <Fragment key={from + i}> </Fragment>
          : <span key={from + i} className="hx-ink">{c}</span>,
      )}
    </>
  );
}

export function Slice({ parts, n, ink }: { parts: Part[]; n: number; ink?: boolean }) {
  let used = 0;
  return (
    <>
      {parts.map((p, i) => {
        const start = used;
        const take = Math.max(0, Math.min(p.text.length, n - used));
        used += p.text.length;
        const t = p.text.slice(0, take);
        const body = ink ? <Inked text={t} from={start} /> : t;

        return p.span || p.className
          ? <span key={i} className={p.className}>{body}</span>
          : <Fragment key={i}>{body}</Fragment>;
      })}
    </>
  );
}

/** One revealed beat. `name` selects its slot in the active choreography. */
export function Rev({
  name, ch, className, style, children,
}: {
  name: string; ch: Choreography; className?: string;
  style?: CSSProperties; children?: ReactNode;
}) {
  const s = ch.step(name);
  return (
    <div
      className={`hx-rev${className ? ` ${className}` : ""}`}
      data-clip={s.clip ? "1" : undefined}
      data-ease={ch.kind}
      style={{
        ["--d" as string]: `${s.delay}s`,
        ["--dur" as string]: `${s.duration}s`,
        ["--y" as string]: `${s.y ?? 0}px`,
        ["--sc" as string]: `${s.scale ?? 1}`,
        ["--bl" as string]: `${s.blur ?? 0}px`,
        ["--rot" as string]: `${s.rot ?? 0}deg`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** The raking light bar. Renders only for the `sweep` transition. */
export function SweepBar({ ch }: { ch: Choreography }) {
  if (!ch.hasSweep || ch.reduced) return null;
  return <div className="hx-sweepbar" aria-hidden />;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener?.("change", on);
    return () => mq.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/**
 * "Access granted" is temporal: it shows only on the load that follows an
 * unlock, holds ~2.2s, then fades for good.
 *
 * The comps never dismissed it — the badge carried `animation: ... both`, and a
 * filled animation beats a plain `opacity: 0` rule in the cascade, so the timer
 * fired into a no-op. Here the fade is driven by state, not a competing rule.
 */
export const UNLOCK_FLAG = "hx-just-unlocked";

/* ------------------------------------------------------- case-study skin -- */
/* PREVIEW ONLY. The three case studies each need the same three things to join
   the flow — read the flag, paint the field, know the way back — so they live
   here once rather than being restated on every page. */

/** The skin is the default now that the Manifest landing is the front door —
 *  a case study reached from it should not change language on arrival. It was
 *  opt-in via `?skin=manifest` while the landing was a preview; that URL still
 *  works, and `?skin=off` returns the page to its pre-Manifest appearance
 *  without touching the code. */
export function readManifestSkin(): "manifest" | undefined {
  if (typeof window === "undefined") return "manifest";
  return new URLSearchParams(window.location.search).get("skin") === "off"
    ? undefined : "manifest";
}

/** "← All projects" goes home. The landing is `/` now, so this no longer has to
 *  carry a flag to keep the skin alive across the chain. */
export function allProjectsHref() {
  return "/";
}

/** The Manifest field, behind the page's own content. */
export function ManifestField() {
  return (
    <div className="ms-bg" aria-hidden="true">
      <GateMesh />
      <div className="ms-vig" />
    </div>
  );
}

export function useAccessBadge(delay: number) {
  const [state, setState] = useState<"hidden" | "in" | "out">("hidden");

  useEffect(() => {
    const url = new URLSearchParams(window.location.search);
    const forced = url.get("unlocked") === "1";
    const flagged = sessionStorage.getItem(UNLOCK_FLAG) === "1";
    if (!forced && !flagged) return;
    sessionStorage.removeItem(UNLOCK_FLAG); // once per unlock, not once per page view

    const show = window.setTimeout(() => setState("in"), delay * 1000);
    const hide = window.setTimeout(() => setState("out"), delay * 1000 + 2200);
    const done = window.setTimeout(() => setState("hidden"), delay * 1000 + 2900);
    return () => { clearTimeout(show); clearTimeout(hide); clearTimeout(done); };
  }, [delay]);

  return state;
}

export function AccessBadge({ state }: { state: "hidden" | "in" | "out" }) {
  if (state === "hidden") return null;
  return (
    <div
      className="hx-status"
      style={{
        opacity: state === "in" ? 1 : 0,
        transform: state === "in" ? "translate(-50%, 0) scale(1)" : "translate(-50%, -14px) scale(0.96)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <i />
      Access granted
    </div>
  );
}

/* ------------------------------------------------------------------- mesh -- */

/**
 * The password gate's own animated node-web, dimmed.
 * Reusing GateBackground keeps the unlock and the landing in one visual world.
 * `interactive={false}` drops the cursor lens: the shapes keep drifting and
 * morphing, but nothing magnets toward the pointer while you read the work.
 */
/* Memoised: it owns an animating canvas, and the typed intro re-renders its
   parent on every keystroke. Without this the mesh tears itself down and
   rebuilds ~50 times during the intro and the whole page crawls. */
export const GateMesh = memo(function GateMesh() {
  return (
    <div className="hx-live">
      <GateBackground pattern="mesh" backdrop="plain" interactive={false} />
    </div>
  );
});

/* --------------------------------------------------------------- scramble -- */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>*·";

/**
 * Resolves `text` out of random glyphs.
 * `run` fires it once (the decrypt transition); `hover` re-fires it on pointer
 * enter (row status codes, as in the comps).
 */
export function Scramble({
  text, className, style, run, runDelay = 0, hover, speed = 26,
}: {
  text: string; className?: string; style?: CSSProperties;
  run?: boolean; runDelay?: number; hover?: boolean; speed?: number;
}) {
  const [out, setOut] = useState(run ? "" : text);
  const timer = useRef<number | null>(null);
  const settle = useRef<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const stop = () => {
    if (timer.current) { clearInterval(timer.current); timer.current = null; }
    if (settle.current) { clearTimeout(settle.current); settle.current = null; }
  };

  /**
   * Progress is measured against the wall clock, not tick count. Browsers clamp
   * timers in backgrounded tabs, and a frame-counted scramble would sit there
   * garbled for as long as the tab stayed hidden. `settle` is a hard backstop:
   * whatever happens to the timer, the real text always lands.
   */
  const start = () => {
    stop();
    const per = speed * 1.5;                  // ms per revealed character
    const began = performance.now();
    timer.current = window.setInterval(() => {
      const revealed = Math.floor((performance.now() - began) / per);
      if (revealed >= text.length) { stop(); setOut(text); return; }
      let s = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        s += c === " " || i < revealed ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
    }, speed);
    settle.current = window.setTimeout(() => { stop(); setOut(text); }, text.length * per + 400);
  };

  useEffect(() => {
    if (!run) return;
    if (reduced) { setOut(text); return; }
    const id = window.setTimeout(start, runDelay * 1000);
    return () => { clearTimeout(id); stop(); };
  }, [run, runDelay, text, reduced]);

  useEffect(() => { if (hover === undefined) return; if (hover && !reduced) start(); else { stop(); setOut(text); } }, [hover]);
  useEffect(() => stop, []);

  return <span className={className} style={style}>{out || " "}</span>;
}

/* --------------------------------------------------------------- contacts -- */

const ICONS: Record<string, ReactElement> = {
  Email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.47 2H3.53A1.45 1.45 0 0 0 2 3.38v17.24A1.45 1.45 0 0 0 3.53 22h16.94A1.45 1.45 0 0 0 22 20.62V3.38A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM18.91 18.74h-3v-4.26c0-1.08-.43-1.82-1.44-1.82a1.43 1.43 0 0 0-1.35.95 1.72 1.72 0 0 0-.08.65v4.48h-3v-9h2.9v1.3a2.88 2.88 0 0 1 2.62-1.45c1.88 0 3.35 1.23 3.35 3.87Z" />
    </svg>
  ),
  Resume: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
    </svg>
  ),
};

/**
 * Contact rail. Icons are always visible rather than expanding on hover, so the
 * pills keep a stable width and read as one consistent set of buttons.
 */
export function ContactPills() {
  const [copied, setCopied] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`hx-pill${copied ? " is-copied" : ""}`}
        onClick={() => { navigator.clipboard?.writeText(ME.email); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      >
        <span className="hx-pill-ico">{ICONS.Email}</span>
        <span className="hx-pill-t">{copied ? "Copied" : "Email"}</span>
      </button>
      <a className="hx-pill" href={ME.linkedin} target="_blank" rel="noopener noreferrer">
        <span className="hx-pill-ico">{ICONS.LinkedIn}</span><span className="hx-pill-t">LinkedIn</span>
      </a>
      <a className="hx-pill" href="/resume" target="_blank" rel="noopener noreferrer">
        <span className="hx-pill-ico">{ICONS.Resume}</span><span className="hx-pill-t">Resume</span>
      </a>
    </>
  );
}

/* ----------------------------------------------------------- work preview -- */

/**
 * An overlapping stack of real case-study screenshots.
 * Each frame is height-constrained and the image is `contain`, so the whole
 * screen is visible rather than cropped.
 */
export function ShotStack({ w, variant = "row" }: { w: Work; variant?: "row" | "captions" | "solo" }) {
  const shots = variant === "solo" ? w.shots.slice(0, 2) : w.shots;
  return (
    <div className={`hx-stack hx-stack--${variant}`}>
      <div className="hx-stack-in">
      {shots.map((shot, i) => (
        <figure
          className={`hx-shot${shot.aspect ? " is-phone" : ""}${shot.bare ? " is-bare" : ""}`}
          key={shot.src}
          style={shot.aspect ? { ["--ar" as string]: shot.aspect } : undefined}
        >
          {/* Phone frames and already-cropped shots carry no browser chrome. */}
          {!shot.aspect && !shot.bare && (
            <div className="hx-shot-bar">
              <span className="hx-shot-dot" style={i === 0 ? { background: w.accent, opacity: 0.8 } : undefined} />
              <span className="hx-shot-dot" /><span className="hx-shot-dot" />
              <span className="hx-shot-tl" />
            </div>
          )}
          {shot.video
            ? <video src={shot.src} autoPlay loop muted playsInline preload="auto" aria-label={shot.alt} />
            /* Solo frames size themselves from the loaded image, so a lazy one
               is zero-wide until it loads — and a zero-wide image never counts
               as visible, so it never loads. Six images; fetch them upfront. */
            : <img src={shot.src} alt={shot.alt} loading={variant === "solo" ? "eager" : "lazy"} />}
          {variant === "captions" && <figcaption className="hx-shot-cap">{shot.cap}</figcaption>}
        </figure>
      ))}
      </div>
    </div>
  );
}

/** The facts, sized to be read rather than admired. */
export function Metrics({ w, open, inline }: { w: Work; open: boolean; inline?: boolean }) {
  return (
    <div className={`hx-metrics${inline ? " is-inline" : ""}`} style={{ ["--acc" as string]: w.accent }}>
      {w.metrics.map((m) => (
        <div key={m.k}>
          <Scramble className="hx-metric-v" text={m.v} hover={open} />
          <span className="hx-metric-k">{m.k}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- preview bar -- */

/* The sibling-direction and unlock-flow links are gone with the Access
   exploration; what remains is the transition picker and a replay. */
export function DevBar({ kind, onKind }: { kind: Reveal; onKind: (k: Reveal) => void }) {
  return (
    <div className="hx-dev">
      <span className="hx-dev-lbl">Preview</span>
      <span className="hx-dev-sep" />
      {REVEALS.map((r) => (
        <button key={r} data-on={kind === r ? "1" : "0"} onClick={() => onKind(r)}>{r}</button>
      ))}
      <span className="hx-dev-sep" />
      <button onClick={() => window.location.reload()}>Replay</button>
    </div>
  );
}

/** Reads ?t= and keeps it in the URL so a reload replays the same transition. */
export function useRevealParam(): [Reveal, (k: Reveal) => void] {
  const read = (): Reveal => {
    const t = new URLSearchParams(window.location.search).get("t");
    /* Typed is the intro now — arriving with no ?t= should write the identity
       on, not fade it up. The others stay one click away on the dev bar. */
    return (REVEALS as string[]).includes(t ?? "") ? (t as Reveal) : "type";
  };
  const [kind, setKind] = useState<Reveal>(read);
  const set = (k: Reveal) => {
    const url = new URL(window.location.href);
    url.searchParams.set("t", k);
    window.history.replaceState({}, "", url);
    setKind(k);
    window.location.reload(); // replay from the top so the choreography is visible
  };
  return [kind, set];
}
