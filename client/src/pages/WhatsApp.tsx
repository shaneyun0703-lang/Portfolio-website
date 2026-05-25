/**
 * WhatsApp · Status Ads — Objectives Expansion (Post-GA)
 *
 * Style notes for this file:
 * - Inherits the editorial design system from /search-ads (same fonts, grid,
 *   Section / Prose primitives).
 * - The .theme-whatsapp wrapper swaps --case-accent + --case-accent-soft so
 *   kicker / caption-label / TOC numbers / pull-quote rule / asides paint a
 *   restrained WhatsApp green instead of the indigo used by Search Ads.
 * - Length target: ~45% of Search Ads. Five sections + Reflections.
 * - Literacy directive: every ads/Meta-internal term is defined inline the
 *   first time it appears. If you find yourself writing a sentence that
 *   leans on more than one undefined term, break it up.
 * - Figures are placeholders for now; each <FigurePlaceholder> declares
 *   what it will eventually show in its caption.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Section, Prose, Aside } from "@/components/Section";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useScrolled } from "@/hooks/useScrolled";
import { TldrWithSwitcher } from "@/components/TldrSection";

// ─────────────────────────────────────────────────────────────────────────
// Local components — kept page-local because they are theme-tinted

function FigurePlaceholder({
  label,
  caption,
  aspect = 16 / 9,
}: {
  label: string;
  caption: string;
  aspect?: number;
}) {
  return (
    <figure className="my-10 md:my-14">
      <div
        className="w-full border border-dashed border-[var(--rule)] flex items-center justify-center text-center px-8"
        style={{
          aspectRatio: String(aspect),
          background: "var(--case-accent-soft)",
          borderRadius: 4,
        }}
      >
        <div>
          <div className="caption-label mb-2">Figure · placeholder</div>
          <div className="font-display text-[0.95rem] text-[var(--mid)] max-w-md mx-auto leading-snug">
            {label}
          </div>
        </div>
      </div>
      <figcaption className="caption mt-3">{caption}</figcaption>
    </figure>
  );
}

function StatStrip({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  // Adjust grid based on number of items so 3 doesn't look orphaned in a 4-col grid.
  const gridCols =
    items.length === 3
      ? "grid-cols-1 md:grid-cols-3"
      : items.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : "grid-cols-2 md:grid-cols-4";
  return (
    <div
      className={`my-10 grid ${gridCols} gap-px bg-[var(--rule)] border border-[var(--rule)] max-w-3xl`}
    >
      {items.map((it, i) => (
        <div key={i} className="bg-[var(--paper)] p-5 md:p-6">
          <div className="font-display font-medium text-[1.8rem] md:text-[2.4rem] leading-none tracking-[-0.02em] text-[var(--ink)]">
            {it.value}
          </div>
          <div className="font-display text-[0.78rem] text-[var(--mid)] mt-3 leading-snug max-w-[28ch]">
            {it.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ConsumerFlowFigure: structured three-step phone-frame illustration of
// what a viewer sees — Updates tab → a Status with an ad → a chat with the
// business. Built with CSS so it renders crisply at any zoom; will be
// replaced later with the exported deck slide. Caption clarifies that the
// images inside the phone frames are placeholders, not the live design.
function ConsumerFlowFigure() {
  return (
    <figure className="my-12 md:my-16">
      <span className="caption-label">Reference · What a Status ad looks like for the viewer</span>
      <div className="mt-4">
        <div
          className="overflow-hidden"
          style={{ width: 352, height: 760, borderRadius: 32 }}
        >
          <video
            src="/primer/wa-status-ad-full.mov"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto block"
            style={{ marginTop: 0 }}
          />
        </div>
      </div>
      <figcaption className="caption mt-6 max-w-2xl">
        A real WhatsApp Status ad as seen by the viewer — appearing
        between friends' posts, full-screen, marked sponsored.
      </figcaption>
    </figure>
  );
}

// WalkthroughStep: a single step in the §04 happy-path walk-through.
// Each step shows a real Meta Ads Manager screen on top, with the step
// number, surface label, plain-English title, and a short paragraph below.
// Designed so the page reads like a guided tour: the reader sees the
// product change first, then reads why it mattered.
function WalkthroughStep({
  n,
  where,
  title,
  body,
  src,
  alt,
}: {
  n: string;
  where: string;
  title: string;
  body: string;
  src: string;
  alt: string;
}) {
  return (
    <figure className="py-10 md:py-14 first:pt-2 [&:not(:last-child)]:border-b border-[var(--rule)]">
      <div
        className="rounded-[0.8rem] border border-[var(--rule)] overflow-hidden bg-white shadow-[0_2px_30px_rgba(15,23,42,0.06)]"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-auto block"
          loading="lazy"
        />
      </div>
      <figcaption className="mt-5 grid grid-cols-1 md:grid-cols-[14rem_1fr] gap-3 md:gap-10">
        <div className="flex items-baseline gap-3">
          <span
            className="font-mono text-[0.7rem]"
            style={{ color: "var(--case-accent)" }}
          >
            {n}
          </span>
          <span className="caption-label">{where}</span>
        </div>
        <div>
          <h3
            className="font-display font-medium text-[1.15rem] md:text-[1.25rem] leading-snug"
            style={{ color: "var(--ink)" }}
          >
            {title}
          </h3>
          <p
            className="font-display text-[0.95rem] mt-3 leading-relaxed max-w-2xl"
            style={{ color: "var(--mid)" }}
          >
            {body}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

function HierarchyFigure() {
  const [expanded, setExpanded] = useState<string | null>("02");
  const levels = [
    {
      n: "03",
      name: "Campaign",
      sub: "The top-level container for all ad activity.",
      cards: ["Campaign details", "Product catalog", "Budget strategy"],
      highlight: false,
      screenshot: "/primer/campaign-objective.png",
      screenshot2: "/primer/campaign.png",
      screenshotAlt: "The campaign objective selection — the advertiser picks their goal before entering the campaign screen.",
      screenshotAlt2: "The Campaign screen after the objective is selected.",
    },
    {
      n: "02",
      name: "Ad set",
      sub: "The rules every ad inside follows.",
      cards: ["Conversions", "Audience", "Placements", "Budget & schedule"],
      highlight: true,
      screenshot: "/primer/adset.png",
      screenshotAlt: "The Ad set screen — audience, placements, budget, and brand safety controls.",
    },
    {
      n: "01",
      name: "Ad",
      sub: "What people actually see.",
      cards: ["Media customization", "Ad link", "Preview"],
      highlight: false,
      screenshot: "/primer/ad.png",
      screenshotAlt: "The Ad screen — media, identity, and destination controls with a live preview.",
    },
  ];
  return (
    <figure className="my-10 md:my-12">
      <span className="caption-label">Reference · The shape of an ad inside Ads Manager</span>
      <div className="mt-4 max-w-3xl">
        {levels.map((lv, i) => {
          const isOpen = expanded === lv.n;
          return (
            <div key={lv.n} className="relative">
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : lv.n)}
                className="w-full text-left flex items-stretch border border-[var(--rule)] overflow-hidden transition-colors"
                style={{
                  background: lv.highlight
                    ? "var(--case-accent-soft)"
                    : "var(--paper)",
                  borderLeft: lv.highlight
                    ? "3px solid var(--case-accent)"
                    : "1px solid var(--rule)",
                  cursor: "pointer",
                }}
              >
                <div className="px-5 py-4 flex flex-col justify-center min-w-[140px] border-r border-[var(--rule)]">
                  <span
                    className="font-mono text-[0.65rem]"
                    style={{
                      color: lv.highlight
                        ? "var(--case-accent)"
                        : "var(--mid)",
                    }}
                  >
                    Level {lv.n}
                  </span>
                  <span className="font-display font-medium text-[1rem] mt-0.5 text-[var(--ink)]">
                    {lv.name}
                  </span>
                  <span className="font-display text-[0.78rem] text-[var(--mid)] mt-0.5">
                    {lv.sub}
                  </span>
                </div>
                <div className="flex-1 px-5 py-4 flex flex-wrap items-center gap-2">
                  {lv.cards.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center px-2.5 py-1 rounded-sm border font-display text-[0.78rem]"
                      style={{
                        borderColor: lv.highlight
                          ? "var(--case-accent)"
                          : "var(--rule)",
                        color: "var(--ink)",
                        background: "var(--paper)",
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="flex items-center px-4">
                  <span
                    className="font-mono text-[0.7rem] transition-transform"
                    style={{
                      color: "var(--mid)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                  >
                    ▼
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="border border-t-0 border-[var(--rule)] bg-[var(--paper)] p-4 space-y-4">
                  <div>
                    <img
                      src={lv.screenshot}
                      alt={lv.screenshotAlt}
                      className="w-full h-auto rounded-md border border-[var(--rule)] shadow-[0_2px_20px_rgba(15,23,42,0.06)]"
                      loading="lazy"
                    />
                    <p className="caption mt-3">{lv.screenshotAlt}</p>
                  </div>
                  {(lv as any).screenshot2 && (
                    <div>
                      <img
                        src={(lv as any).screenshot2}
                        alt={(lv as any).screenshotAlt2 || ""}
                        className="w-full h-auto rounded-md border border-[var(--rule)] shadow-[0_2px_20px_rgba(15,23,42,0.06)]"
                        loading="lazy"
                      />
                      <p className="caption mt-3">{(lv as any).screenshotAlt2}</p>
                    </div>
                  )}
                </div>
              )}
              {i < levels.length - 1 && (
                <div
                  className="mx-auto w-px h-4"
                  style={{ background: "var(--rule)" }}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
      <figcaption className="caption mt-4 max-w-2xl">
        Every Meta ad is built in three nested levels. Each level
        contains one or more screens of controls. Anything decided at
        one level applies to every level below it — click any row to
        see the real interface.
      </figcaption>
    </figure>
  );
}

// PrimerGlossary: a small "in plain English" panel that defines the
// five terms a non-ads reader will hit in §03 and §04. Used as a
// sidebar instead of one long paragraph.
function PrimerGlossary() {
  const terms = [
    {
      term: "Objective",
      def: "The goal a business picks for their campaign — sales, leads, awareness, etc. Meta has six core marketing objectives.",
    },
    {
      term: "Placement",
      def: "A surface where an ad can appear — like Instagram Stories or WhatsApp Status.",
    },
    {
      term: "Cards",
      def: "Grouped controls on each screen. The ad-set level has cards for audience, placements, budget, and brand safety.",
    },
  ];
  return (
    <aside
      className="my-10 md:my-12 border-l-2 pl-5 md:pl-6 max-w-2xl"
      style={{ borderColor: "var(--case-accent)" }}
    >
      <div className="caption-label mb-3">In plain English</div>
      <dl className="grid grid-cols-1 sm:grid-cols-[10rem_1fr] gap-x-6 gap-y-3">
        {terms.map((t) => (
          <div key={t.term} className="contents">
            <dt className="font-display font-medium text-[0.9rem] text-[var(--ink)]">
              {t.term}
            </dt>
            <dd className="font-display text-[0.85rem] text-[var(--mid)] leading-snug">
              {t.def}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

// TimelineFigure: a four-phase horizontal timeline of WAMO ads work.
// The third phase — Post-GA — is highlighted as "this case study".
// Each phase shows: month, name, one-line description, and a green dot
// (or hollow ring) on a horizontal rail. Replaces the §02 placeholder.
function TimelineFigure() {
  const phases = [
    {
      month: "June 2025",
      name: "Alpha",
      body: "~30 advertisers in 6 countries. Used to confirm the system held up.",
      mode: "past" as const,
    },
    {
      month: "September 2025",
      name: "General Availability",
      body: "Opened the placement to every advertiser globally. Two marketing objectives supported.",
      mode: "past" as const,
    },
    {
      month: "October 2025",
      name: "Post-launch expansion",
      body: "Three more marketing objectives and new creative formats added.",
      accent: "This case study covers the objectives expansion.",
      mode: "current" as const,
    },
    {
      month: "Late 2025",
      name: "Non-CTWA identity",
      body: "Unlocked WhatsApp ads for non-messaging advertisers.",
      mode: "future" as const,
    },
    {
      month: "—",
      name: "Future",
      body: "Further expansion is planned but not covered in this case study.",
      mode: "future" as const,
    },
  ];
  return (
    <figure className="my-12 md:my-16 max-w-5xl">
      <span className="caption-label">Reference · Where this case study sits</span>

      <div className="mt-6 relative">
        {/* Horizontal rail */}
        <div
          className="hidden md:block absolute top-[14px] left-0 right-0 h-px"
          style={{ background: "var(--rule)" }}
        />
        {/* Highlight segment under the current phase (3rd of 5) */}
        <div
          className="hidden md:block absolute top-[14px] h-px"
          style={{
            left: "40%",
            width: "20%",
            background: "var(--case-accent)",
          }}
        />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {phases.map((p, i) => {
            const isCurrent = p.mode === "current";
            const isFuture = p.mode === "future";
            return (
              <div key={i} className="relative pl-8 md:pl-0">
                {/* Marker */}
                <div
                  className="absolute left-0 top-1 md:relative md:left-auto md:top-0"
                  style={{ width: 28, height: 28 }}
                >
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      background: isCurrent
                        ? "var(--case-accent)"
                        : isFuture
                        ? "transparent"
                        : "var(--paper)",
                      border: isFuture
                        ? "1px dashed var(--rule)"
                        : isCurrent
                        ? "none"
                        : "1px solid var(--rule)",
                    }}
                  >
                    {isCurrent ? (
                      <span className="text-white font-mono text-[0.7rem]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    ) : (
                      <span
                        className="font-mono text-[0.7rem]"
                        style={{
                          color: isFuture ? "var(--mid)" : "var(--ink)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </div>
                {/* Card */}
                <div className="mt-3">
                  <div
                    className="font-mono uppercase tracking-[0.16em] text-[0.65rem]"
                    style={{
                      color: isCurrent
                        ? "var(--case-accent)"
                        : "var(--mid)",
                    }}
                  >
                    {p.month}
                  </div>
                  <div
                    className="font-display font-medium text-[1rem] mt-1"
                    style={{
                      color: isFuture ? "var(--mid)" : "var(--ink)",
                    }}
                  >
                    {p.name}
                  </div>
                  <p
                    className="font-display text-[0.85rem] leading-snug mt-1.5"
                    style={{ color: "var(--mid)", maxWidth: 230 }}
                  >
                    {p.body}
                    {(p as any).accent && (
                      <>
                        {" "}
                        <span style={{ color: "var(--case-accent)" }}>
                          {(p as any).accent}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <figcaption className="caption mt-8 max-w-2xl">
        The third phase, marked in green, is what this case study
        covers.
      </figcaption>
    </figure>
  );
}

// Tiny WhatsApp-glyph nod — drawn as inline SVG so it inherits currentColor.
function WhatsAppGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ display: "inline-block", verticalAlign: "-0.15em" }}
    >
      <path d="M16 4a12 12 0 0 0-10.4 18l-1.6 6 6.2-1.6A12 12 0 1 0 16 4Z" />
      <path d="M11.5 11c0 5 4.5 9.5 9.5 9.5l1.5-2-3-1.5-1.5 1.5c-1.5-.5-3-2-3.5-3.5l1.5-1.5-1.5-3-2 1.5Z" />
    </svg>
  );
}

// FlowCarousel: a swipeable carousel showing walkthrough steps for a
// single campaign objective. Each slide is a placeholder design card.
function FlowCarousel({
  objective,
  steps,
}: {
  objective: string;
  steps: { n: string; title: string; description: string; src?: string }[];
}) {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const currentStep = steps[current];
  return (
    <>
    <div className="my-8 xl:max-w-[calc(100%-17rem)]">
      <div className="flex items-center justify-between mb-4">
        <span className="caption-label">{objective} campaign flow</span>
        <span className="font-mono text-[0.7rem] text-[var(--mid)]">
          {current + 1} / {steps.length}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-lg border border-[var(--rule)]">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {steps.map((step) => (
            <div
              key={step.n}
              className="w-full shrink-0 bg-[var(--paper)]"
            >
              {step.src ? (
                <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => setOpen(true)}>
                  <img src={step.src} alt={step.title} className="w-full h-auto block" loading="lazy" />
                  <span className="expand-hint">CLICK TO ENLARGE</span>
                </div>
              ) : (
                <div
                  className="w-full flex items-center justify-center"
                  style={{
                    aspectRatio: "16/9",
                    background: "var(--case-accent-soft)",
                  }}
                >
                  <div className="text-center px-8">
                    <div className="caption-label mb-2">Placeholder · Step {step.n}</div>
                    <div className="font-display text-[0.95rem] text-[var(--mid)] max-w-md mx-auto leading-snug">
                      {step.title}
                    </div>
                  </div>
                </div>
              )}
              <div className="px-6 py-5">
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="font-mono text-[0.7rem]"
                    style={{ color: "var(--case-accent)" }}
                  >
                    {step.n}
                  </span>
                  <span className="font-display font-medium text-[1.05rem] text-[var(--ink)]">
                    {step.title}
                  </span>
                </div>
                <p className="font-display text-[0.9rem] text-[var(--mid)] leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          type="button"
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          className="font-mono text-[0.8rem] px-3 py-1.5 border border-[var(--rule)] rounded-sm disabled:opacity-30 hover:bg-[var(--tint)] transition-colors"
          style={{ color: "var(--ink)" }}
        >
          ←
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                background:
                  i === current ? "var(--case-accent)" : "var(--rule)",
              }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCurrent(Math.min(steps.length - 1, current + 1))}
          disabled={current === steps.length - 1}
          className="font-mono text-[0.8rem] px-3 py-1.5 border border-[var(--rule)] rounded-sm disabled:opacity-30 hover:bg-[var(--tint)] transition-colors"
          style={{ color: "var(--ink)" }}
        >
          →
        </button>
      </div>
    </div>
    {open && currentStep?.src && (
      <div className="fixed inset-0 z-50 bg-[oklch(0.10_0.01_60_/_0.94)] flex items-center justify-center p-4 md:p-10" onClick={() => setOpen(false)}>
        <button className="absolute top-5 right-5 text-paper font-display text-xs tracking-[0.18em] uppercase opacity-80 hover:opacity-100" onClick={() => setOpen(false)}>Close · Esc</button>
        <img src={currentStep.src} alt={currentStep.title} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
      </div>
    )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Local TOC — same visual as Search Ads but the section list is shorter.

const sections = [
  { id: "context", label: "Why this work mattered" },
  { id: "starting", label: "Scope" },
  { id: "primer", label: "A short primer" },
  { id: "constraint", label: "The design work" },
  { id: "other", label: "Outcome & what came next" },
];

function WaToc() {
  const [active, setActive] = useState<string>("context");
  const scrolled = useScrolled(40);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <nav
      className={`hidden xl:block fixed right-7 z-40 w-[272px] transition-all duration-500 ease-in-out ${scrolled ? "top-[calc(80px+1.75rem)]" : "top-[calc(72px+2.25rem)]"}`}
      aria-label="Section navigation"
    >
      <div className="rounded-2xl p-4 max-h-[calc(100vh-180px)] overflow-y-auto" style={{ background: "rgba(42,42,46,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        <div className="font-mono text-[13px] text-[var(--mid)] tracking-[0.1em] uppercase mb-3 font-medium">
          Sections
        </div>
        <ul className="space-y-0.5">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-active={active === s.id}
                className={`toc-link flex items-start gap-2.5 py-1 px-2.5 rounded-lg transition-all duration-200 ${
                  active === s.id
                    ? "text-[var(--ink)]"
                    : "hover:bg-[rgba(255,255,255,0.04)]"
                }`}
                style={active === s.id ? { background: "var(--case-accent-soft)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } : { border: "1px solid transparent" }}
              >
                <span className="toc-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display font-medium">{s.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────────────────

function PageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-[oklch(0.10_0.01_60_/_0.94)] flex items-center justify-center p-4 md:p-10" onClick={onClose}>
      <button className="absolute top-5 right-5 text-paper font-display text-xs tracking-[0.18em] uppercase opacity-80 hover:opacity-100" onClick={onClose}>Close · Esc</button>
      <img src={src} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
    </div>
  );
}

export default function WhatsApp() {
  useScrollToTop();
  const scrolled = useScrolled(40);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const expand = (src: string) => setLightboxSrc(src);
  return (
    <div className="theme-whatsapp min-h-screen bg-[var(--paper)]">
      <WaToc />

      {/* Nav — expands at top, compacts on scroll */}
      <nav className={`fixed z-50 transition-all duration-500 ease-in-out ${scrolled ? "top-4 left-4 right-7 rounded-2xl" : "top-0 left-0 right-0 border-b border-[#333]"}`} style={scrolled ? { background: "rgba(42,42,46,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)" } : { background: "#232326" }}>
        <div className={`px-7 flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? "py-3" : "py-6"}`}>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-mono text-[13px] tracking-[0.04em] uppercase text-[#ccc] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#444] hover:border-[#555] hover:bg-[rgba(255,255,255,0.04)]">
              ← All projects
            </Link>
            <div className={`w-px bg-[#444] transition-all duration-500 ${scrolled ? "h-5" : "h-6"}`} />
            <div>
              <div className={`font-display font-bold tracking-[-0.01em] text-[var(--ink)] transition-all duration-500 ease-in-out ${scrolled ? "text-[17px]" : "text-[20px]"}`}>{scrolled ? "Taking WhatsApp ads from launch to scale" : "WhatsApp Ads"}</div>
            </div>
          </div>
          <span className={`font-display font-bold tracking-[-0.02em] text-[var(--ink)] transition-all duration-500 ease-in-out ${scrolled ? "text-[17px]" : "text-[20px]"}`}>Shane Yun</span>
        </div>
      </nav>

      {/* ─────────────── HERO ─────────────── */}
      <section className="pt-28 pb-8 md:pt-32 md:pb-10">
        <div className="container">
          <div className="max-w-4xl">
            <span className="kicker inline-flex items-center gap-2">
              <WhatsAppGlyph /> Status Ads in WhatsApp
            </span>
            <h1 className="display-1 mt-4">
              Taking WhatsApp ads from launch to scale
            </h1>
          </div>

          {/* TLDR */}
          <div className="mt-10 md:mt-12 max-w-4xl">
            <TldrWithSwitcher
              accentColor="#4ade80"
              accentRgb="74,222,128"
              summary={<p><strong>I led the expansion of WhatsApp Status ads from 2 to 5 of Meta's 6 marketing objectives.</strong> WhatsApp ads shipped globally to 100% rollout, hitting all revenue and advertiser experience goals.</p>}
              role="Design lead"
              timeline={<span>H2 2025 · 3 months</span>}
              outcome={<span className="flex items-center gap-1.5"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{color:"var(--case-accent)",flexShrink:0}}><circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>100% global rollout</span>}
              team={<ul className="list-disc pl-3.5 space-y-1"><li>Me :)</li><li>Co-design lead</li><li>Product designer</li><li>Content designer</li><li>Product manager</li><li>Tech lead + 2 ENG</li></ul>}
              audience={<ul className="list-disc pl-3.5 space-y-0.5"><li>SMBs using WhatsApp Business</li><li>Global brands extending reach to WhatsApp</li></ul>}
            />
          </div>
        </div>
      </section>

      {/* ─────────────── §01 WHY THIS WORK MATTERED ─────────────── */}
      <Section
        id="context"
        number="01"
        kicker="Why this work mattered"
        title="Expanding WhatsApp's first ads to reach every type of advertiser."
        lede="In June 2025, ads ran inside WhatsApp for the first time. This case study covers what came next."
      >
        <Prose drop>
          <p>
            <strong>In June 2025, ads launched inside WhatsApp for
            the first time</strong> — covered in{" "}
            <a
              href="https://www.cnbc.com/2025/06/16/meta-whatsapp-ads.html"
              className="text-[var(--case-accent)] underline underline-offset-4 decoration-[var(--case-accent)]/40 hover:decoration-[var(--case-accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              CNBC
            </a>
            {" "}and{" "}
            <a
              href="https://techcrunch.com/2025/06/16/whatsapp-is-adding-ads-to-the-status-screen/"
              className="text-[var(--case-accent)] underline underline-offset-4 decoration-[var(--case-accent)]/40 hover:decoration-[var(--case-accent)]"
              target="_blank"
              rel="noopener noreferrer"
            >
              TechCrunch
            </a>
            . Ads launched on <strong>WhatsApp Status</strong> — the feed where you watch your friends' short posts, similar to Instagram Stories.
          </p>
        </Prose>

        <ConsumerFlowFigure />

        <Prose>
          <p>
            The June launch supported <strong>two of Meta's core six
            marketing objectives</strong> (Traffic and Engagement),
            which is the goal a business picks for their ad campaign.
            This case study covers <strong>extending WhatsApp Status
            ads to support five of the six</strong>, making WhatsApp
            ads available to almost every type of advertiser on Meta.
          </p>
        </Prose>
      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ─────────────── §02 SCOPE ─────────────── */}
      <Section
        id="starting"
        number="02"
        kicker="Scope"
        title="Where this case study sits."
        lede="This case study covers the expansion that followed the initial launch."
      >
        <Prose>
          <p>
            The project progressed through <strong>five
            phases</strong> — from a small alpha in Q2 2025 to a
            global launch in Q3, followed by the post-launch
            expansion in Q3–Q4.
          </p>
        </Prose>

        <TimelineFigure />

        <Prose>
          <p>
            I was active across Phase 2 and beyond.{" "}
            <strong>This case study focuses on the post-launch
            expansion</strong>, which had to clear design review by
            end of Q3 to give engineering enough runway to ship.
          </p>
        </Prose>
      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ─────────────── §03 ADS MANAGER PRIMER ─────────────── */}
      <Section
        id="primer"
        number="03"
        kicker="A short primer"
        title="One tool, three levels, millions of advertisers."
        lede="Every design decision in this case study happened inside one tool. Here's how it's structured."
      >
        <Prose>
          <p>
            <strong>Ads Manager</strong> is the tool millions of
            advertisers use to set up and run ads across all of
            Meta's platforms. This is the tool we are building into
            and the focus of this case study.
          </p>
          <p>
            Before building an ad, the advertiser picks
            an <em>objective</em> — the goal of their campaign, like
            sales, leads, or awareness. <strong>Meta has six core
            marketing objectives</strong>, and that choice determines
            which controls appear on every screen below. The screens
            shown here use a <strong>Sales campaign</strong> as the
            reference.
          </p>
        </Prose>

        <HierarchyFigure />

        <Prose>
          <p>
            These levels are nested — <strong>any decision made at
            a higher level cascades down</strong> to everything below
            it. The ad-set level is where the advertiser
            chooses <em>placements</em>, the surfaces where their ad
            can appear, like Instagram Stories or WhatsApp Status.{" "}
            <strong>Most of the design work in this case study
            starts here</strong> — where WhatsApp Status is selected
            as a placement.
          </p>
        </Prose>
      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ─────────────── §04 THE DESIGN WORK ─────────────── */}
      <Section
        id="constraint"
        number="04"
        kicker="The design work"
        title="Building the ad creation experience, one objective at a time."
        lede=""
      >
        <StatStrip
          items={[
            {
              value: "30+",
              label:
                "use cases aligned with product stakeholders before a single screen shipped",
            },
            {
              value: "6",
              label:
                "partner teams aligned end-to-end (PM, design, content, research, engineering, partner team)",
            },
            {
              value: "100+",
              label:
                "flows designed across happy-path and ineligible scenarios",
            },
          ]}
        />

        <Prose>
          <p>
            <strong>Scaling WhatsApp ads meant designing each objective independently</strong> — its own flow, its own constraints, and its own set of use cases to resolve.
          </p>
          <p>
            The Sales campaign flow (<strong>the highest-revenue objective</strong>) leads the section below, followed by ineligible states and how other objectives diverge from it, with Awareness as the example. One control runs through all of them: <strong>unknown age</strong>.
          </p>
        </Prose>

        <div className="my-8 max-w-2xl rounded-lg border border-[var(--case-accent)]/25 bg-[rgba(34,197,94,0.05)] px-5 py-4">
          <div className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[var(--case-accent)] mb-2">Key concept</div>
          <div className="font-display font-semibold text-[0.95rem] text-[var(--ink)] mb-1.5">
            Unknown age — a unique ads lever for WhatsApp
          </div>
          <p className="font-display text-[0.88rem] text-[var(--mid)] leading-relaxed">
            A critical control that allows WhatsApp ads to be performant by including users whose age is unknown. It appears <em>before</em> placement selection and had to work correctly across every objective.
          </p>
        </div>

        <FlowCarousel
          objective="Sales"
          steps={[
            {
              n: "01",
              title: "Selecting WhatsApp as a conversion location",
              description:
                "The advertiser selects WhatsApp as where they want sales to happen. This determines which controls appear in the rest of the flow.",
              src: "/primer/sales-01-conversion.png",
            },
            {
              n: "02",
              title: "Audience with unknown age on WhatsApp",
              description:
                "The audience card with unknown age on WhatsApp included. A banner confirms the audience has been updated to include people on WhatsApp whose age is unknown.",
              src: "/primer/sales-02-unknown-age.png",
            },
            {
              n: "03",
              title: "Unknown age tooltip on hover",
              description:
                "Hovering the unknown age control reveals a tooltip explaining what it means — if you include people on WhatsApp whose age is unknown, your ad must be suitable for all ages.",
              src: "/primer/sales-03-ua-hovered.png",
            },
            {
              n: "04",
              title: "Unknown age expanded with tooltip",
              description:
                "The unknown age input is expanded and the advertiser has hovered for more information about what including unknown-age users means for their campaign.",
              src: "/primer/sales-04-ua-expanded-tooltip.png",
            },
            {
              n: "05",
              title: "Placements with WhatsApp opted in",
              description:
                "The Placement card shows WhatsApp Status is added. Since this flow targets users already on WhatsApp, both the conversion location and the placement are WhatsApp. Placements in Sales campaigns are automated — advertisers are opted in by default with guidance explaining why.",
              src: "/primer/sales-05-placement.png",
            },
            {
              n: "06",
              title: "Ad creative with WhatsApp preview",
              description:
                "The ad creative level where advertisers can customize and preview how their WhatsApp Status ad will look. The live preview shows the ad as it would appear to a viewer.",
              src: "/primer/sales-06-ad-creative.png",
            },
          ]}
        />

        <div className="rule my-10" />

        {/* ── Sales deviation ── */}
        <div className="my-10">
          <h3 className="font-display font-medium text-[1.3rem] text-[var(--case-accent)] mb-3">
            When an input isn't compatible with WhatsApp.
          </h3>
          <Prose>
            <p>
              The flow above is the common path. Not every setup is compatible with WhatsApp — the example is shown below. <strong>30+ ineligible use cases had to be handled gracefully.</strong>
            </p>
          </Prose>
          <FlowCarousel
            objective="Sales · Ineligible state"
            steps={[
              {
                n: "01",
                title: "Product catalog enabled at campaign level",
                description:
                  "The advertiser enables a product catalog at the campaign level — an input that isn't compatible with WhatsApp Status ads.",
                src: "/primer/sales-dev-02-catalog.png",
              },
              {
                n: "02",
                title: "Conversion location limited to website and app",
                description:
                  "With catalog enabled, messaging destinations like WhatsApp are disabled. The conversion location is limited to website and app.",
                src: "/primer/sales-dev-01-conv.png",
              },
              {
                n: "03",
                title: "Unknown age removed",
                description:
                  "With catalog on, WhatsApp placements are no longer eligible. The unknown age control automatically disappears from the audience section.",
                src: "/primer/sales-dev-03-no-au.png",
              },
              {
                n: "04",
                title: "Placements — WhatsApp disabled",
                description:
                  "The placements card no longer includes WhatsApp Status. The system has automatically adjusted based on the catalog selection.",
                src: "/primer/sales-dev-04-placements.png",
              },
              {
                n: "05",
                title: "Placements expanded — no WhatsApp",
                description:
                  "Expanding the placements card confirms WhatsApp Status is not available for this ad configuration.",
                src: "/primer/sales-dev-05-placements-expanded.png",
              },
            ]}
          />
        </div>

        <div className="rule my-10" />

        {/* ── Awareness comparison ── */}
        <div className="my-10">
          <h3 className="font-display font-medium text-[1.3rem] text-[var(--case-accent)] mb-3">
            Each expanded objective brought a structurally different flow.
          </h3>
          <Prose>
            <p>
              The Awareness campaign type has no conversions card and different placement controls. These structural differences required a deep understanding of the product and the UX implications of each campaign type — and each came with its own set of ineligibility cases to resolve.
            </p>
          </Prose>
          <div className="xl:max-w-[calc(100%-17rem)] space-y-4 my-4">
            <div className="border border-[var(--rule)] rounded-lg overflow-hidden">
              <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => expand("/primer/awareness-conversion.png")}>
                <img src="/primer/awareness-conversion.png" alt="Awareness campaign — no conversions card" className="w-full h-auto block" loading="lazy" />
                <span className="expand-hint">CLICK TO ENLARGE</span>
              </div>
              <div className="p-4 border-t border-[var(--rule)]">
                <div className="caption-label mb-1 text-[var(--case-accent)]">No conversions card</div>
                <p className="font-display text-[0.8rem] text-[var(--mid)] leading-snug">Awareness campaigns don't produce sales — their objective is impression counts and awareness. No conversions card exists. The audience UX is also different from Sales.</p>
              </div>
            </div>
            <div className="border border-[var(--rule)] rounded-lg overflow-hidden">
              <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => expand("/primer/awareness-placements.png")}>
                <img src="/primer/awareness-placements.png" alt="Awareness campaign placements card" className="w-full h-auto block" loading="lazy" />
                <span className="expand-hint">CLICK TO ENLARGE</span>
              </div>
              <div className="p-4 border-t border-[var(--rule)]">
                <div className="caption-label mb-1 text-[var(--case-accent)]">Placements</div>
                <p className="font-display text-[0.8rem] text-[var(--mid)] leading-snug">The placements card UX differs from Sales — WhatsApp Status is available but the controls and guidance change.</p>
              </div>
            </div>
          </div>
        </div>

      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ─────────────── §05 OTHER CONTRIBUTIONS ─────────────── */}
      <Section
        id="other"
        number="05"
        kicker="Outcome and what came next"
        title="Launched globally, hitting all topline metric goals."
        lede="The objectives expansion shipped to 100% of advertisers on schedule."
      >
        <Prose>
          <p>
            <strong>The expansion launched successfully, hitting all
            topline metric goals</strong> across revenue and ad
            creation rates and advertiser experience. This project was also
            bundled with the creative format expansion below, which
            widened the scope of what WhatsApp ads could do — and
            the team continued sprinting into the next phase
            immediately after.
          </p>
        </Prose>
        <div className="my-6 max-w-3xl space-y-px bg-[var(--rule)] border border-[var(--rule)]">
          <div className="bg-[var(--paper)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="caption-label">Creative format expansion</span>
              <span
                className="font-mono text-[0.6rem] tracking-[0.15em] uppercase px-1.5 py-[1px] rounded-sm"
                style={{ color: "var(--case-accent)", border: "1px solid var(--case-accent)" }}
              >
                Part of this expansion
              </span>
            </div>
            <h4 className="font-display font-semibold text-[var(--ink)] mt-2 mb-2 text-[1.05rem] leading-snug">
              Gave advertisers the same creative flexibility on WhatsApp that they had everywhere else.
            </h4>
            <p className="font-display text-[0.92rem] text-[var(--mid)] leading-relaxed">
              Extended video support from 30 seconds to 90 seconds,
              requiring a new "Keep Watching" interaction pattern. Expanded
              the CTA library from a single option to the full set
              available across Meta's ad surfaces.
            </p>
          </div>
          <div className="bg-[var(--paper)] p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="caption-label">Non-CTWA Identity</span>
              <span
                className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-[var(--mid)] px-1.5 py-[1px] rounded-sm border border-[var(--rule)]"
              >
                After this expansion
              </span>
            </div>
            <h4 className="font-display font-semibold text-[var(--ink)] mt-2 mb-2 text-[1.05rem] leading-snug">
              Unlocked WhatsApp ads for an entirely new category of advertiser.
            </h4>
            <p className="font-display text-[0.92rem] text-[var(--mid)] leading-relaxed">
              Designed the identity selection system that let
              website-destination advertisers run WhatsApp Status ads
              for the first time. Created a three-tier framework for
              handling 13+ invalid identity scenarios, aligning four
              cross-functional teams.
            </p>
          </div>
        </div>
      </Section>

      <div className="pb-20" />
      {lightboxSrc && <PageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}
