/**
 * CommerceAds.tsx — Two ways of building a Meta ad, in the same flow.
 *
 * v4.8.3 — pass-3 tightening per user feedback:
 *   • Meta-row: longer titles ("My role" / "The team" / "When this happened" /
 *     "Who this was for") and bulleted content where the value is a list.
 *   • New hero→§01 bridge paragraph (also added on Search Ads + WhatsApp).
 *   • §01 sales-campaign primer tightened to two sentences and given a
 *     one-line plain definition of "Sales."
 *   • §01 reframed: static and catalog-driven repositioned as two
 *     high-revenue-driving FLOWS (not "options"). Static-ad delta fixed —
 *     the differentiator is customisation (advertiser hand-picks specific
 *     media, e.g., a paid-celebrity creative) vs. automation (Meta picks
 *     from the catalog using its own data).
 *   • New StaticVsCatalogSchematic added up front in §01 to anchor the
 *     delta visually before the third paragraph; existing fork diagram
 *     kept at the end as the structural visual.
 *   • §03 cut to 3 paragraphs. Old ThreeFlowsFigure removed. Replaced
 *     with FeatureDecisionMatrix — the seven catalog-driven features
 *     and how each one was routed for alpha and GA. Real names per user
 *     direction ("to show the complexity of the work").
 *   • Number on page corrected: SEVEN power-user features (not eight),
 *     matching the Product Media Features section of the source doc.
 *
 * Vocabulary still public-safe: no PCA / PCA-U / WS2 / DA / SA / A+C
 * anywhere on the page.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Section, Prose, Aside } from "@/components/Section";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useScrolled } from "@/hooks/useScrolled";
import { TldrWithSwitcher } from "@/components/TldrSection";

// ─────────────────────────────────────────────────────────────────────────
// Local components
// ─────────────────────────────────────────────────────────────────────────

function AdsManagerCarousel() {
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  const slides = [
    { src: "/primer/campaign.png", label: "Campaign", caption: "The first screen — where the advertiser picks their goal (sales, leads, awareness) and sets the budget strategy." },
    { src: "/primer/adset.png", label: "Ad set", caption: "The second screen — where the advertiser defines who sees the ad, which placements it runs on, and how much to spend." },
    { src: "/primer/ad.png", label: "Ad", caption: "The third screen — where the advertiser builds the creative: the image, video, text, and destination people actually see." },
  ];
  return (
    <>
    <figure className="my-8 xl:max-w-[calc(100%-17rem)]">
      <span className="caption-label">Reference · What a sales campaign looks like inside Ads Manager</span>
      <div className="mt-3 relative overflow-hidden rounded-lg border border-[var(--rule)]">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.label} className="w-full shrink-0 bg-[var(--paper)]">
              <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => setOpen(true)}>
                <img
                  src={slide.src}
                  alt={slide.label}
                  className="w-full h-auto block"
                  loading="lazy"
                />
                <span className="expand-hint">CLICK TO ENLARGE</span>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-mono text-[0.7rem]" style={{ color: "var(--case-accent)" }}>
                    {String(current + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display font-medium text-[1rem] text-[var(--ink)]">
                    {slide.label}
                  </span>
                </div>
                <p className="font-display text-[0.85rem] text-[var(--mid)] leading-snug max-w-2xl">
                  {slide.caption}
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
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className="w-2 h-2 rounded-full transition-colors"
              style={{ background: i === current ? "var(--case-accent)" : "var(--rule)" }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => setCurrent(Math.min(slides.length - 1, current + 1))}
          disabled={current === slides.length - 1}
          className="font-mono text-[0.8rem] px-3 py-1.5 border border-[var(--rule)] rounded-sm disabled:opacity-30 hover:bg-[var(--tint)] transition-colors"
          style={{ color: "var(--ink)" }}
        >
          →
        </button>
      </div>
    </figure>
    {open && (
      <div className="fixed inset-0 z-50 bg-[oklch(0.10_0.01_60_/_0.94)] flex items-center justify-center p-4 md:p-10" onClick={() => setOpen(false)}>
        <button className="absolute top-5 right-5 text-paper font-display text-xs tracking-[0.18em] uppercase opacity-80 hover:opacity-100" onClick={() => setOpen(false)}>Close · Esc</button>
        <img src={slides[current].src} alt={slides[current].label} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
      </div>
    )}
    </>
  );
}

/**
 * SalesCampaignPrimer — tightened to two sentences and given a one-line
 * plain definition of "Sales."
 */
function SalesCampaignPrimer() {
  return (
    <div className="border border-[var(--rule)] bg-[var(--tint)] p-5 md:p-6 max-w-2xl my-8">
      <div className="caption-label mb-2 text-[var(--case-accent)]">
        A note on terms
      </div>
      <p className="font-display text-[0.9rem] text-[var(--ink)] leading-relaxed">
        A <strong>sales campaign</strong> on Meta is one whose goal is
        revenue — sending shoppers somewhere to buy, like a product page,
        a checkout cart, or an in-app purchase screen. Everything in this
        case study lives inside that one campaign type.
      </p>
    </div>
  );
}

/**
 * StaticVsCatalogSchematic — small UX-style schematic placed up front in
 * §01 to anchor the customisation-vs-automation delta visually before the
 * reader has to follow it through three paragraphs of prose.
 */
function StaticVsCatalogSchematic() {
  return (
    <figure className="my-10 max-w-4xl">
      <span className="caption-label">
        Reference · What the 2 flows produce as ads
      </span>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
        {/* Static — advertiser hand-picks the media */}
        <div className="bg-[var(--paper)] p-5 md:p-6">
          <div className="caption-label mb-3 text-[var(--case-accent)]">
            Static ad flow
          </div>
          <div className="aspect-[4/5] border border-[var(--rule)] bg-[var(--tint)] flex flex-col items-center justify-center p-6 mb-3">
            <div className="w-24 h-32 border border-[var(--rule)] bg-[var(--paper)] mb-3 flex items-center justify-center">
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[var(--mid)]">
                One image,
                <br />
                video, or
                <br />
                carousel
              </div>
            </div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)]">
              ↑ hand-picked by the advertiser
            </div>
          </div>
          <p className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">
            <strong>Customisation.</strong> The advertiser hand-picks the
            exact media, often a piece of paid creative they've invested
            heavily in — a celebrity-led video, a styled photo shoot, a
            seasonal campaign film.
          </p>
        </div>

        {/* Catalog-driven — Meta picks from the feed */}
        <div className="bg-[var(--paper)] p-5 md:p-6">
          <div className="caption-label mb-3 text-[var(--case-accent)]">
            Catalog-driven ad flow
          </div>
          <div className="aspect-[4/5] border border-[var(--rule)] bg-[var(--tint)] flex flex-col items-center justify-center p-6 mb-3">
            <div className="grid grid-cols-2 gap-1 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-11 h-14 border border-[var(--rule)] bg-[var(--paper)]"
                />
              ))}
            </div>
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)] text-center">
              ↑ feed of products,
              <br />
              Meta picks per shopper
            </div>
          </div>
          <p className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">
            <strong>Automation.</strong> The advertiser hands over a
            structured feed of products. Meta picks which products to
            show each shopper using its own data — different shoppers see
            different products from the same feed.
          </p>
        </div>
      </div>

      <figcaption className="caption mt-5 max-w-2xl">
        Both paths produce a finished ad, but they get there in opposite
        ways: hand-picked vs. assembled-on-the-fly.
      </figcaption>
    </figure>
  );
}

/**
 * TwoSetupPathsFigure — kept from pass-2. Anchors the structural fact
 * that the two flows live in the same campaign setup but diverge on the
 * second screen. Lands at the end of §01.
 */
function TwoSetupPathsFigure() {
  return (
    <figure className="my-12 md:my-16 max-w-4xl">
      <span className="caption-label">
        Reference · The fork inside Meta's sales campaign — and what each flow produces
      </span>

      <div className="mt-5 border border-[var(--rule)] bg-[var(--paper)] p-6 md:p-8">
        {/* Shared starting screen */}
        <div className="flex justify-center">
          <div className="border border-[var(--rule)] bg-[var(--tint)] px-5 py-3 max-w-xs text-center">
            <div className="caption-label text-[var(--mid)]">
              Same starting screen
            </div>
            <div className="font-display text-[0.9rem] text-[var(--ink)] mt-1 leading-snug">
              Pick the campaign goal:{" "}
              <span className="text-[var(--case-accent)]">Sales</span>
            </div>
          </div>
        </div>

        {/* Vertical line down to the fork */}
        <div className="flex justify-center my-4">
          <div className="w-px h-8 bg-[var(--rule)]" />
        </div>

        <div className="flex justify-center">
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)]">
            ↓ Two diverging setup paths ↓
          </div>
        </div>

        {/* Two panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mt-6">
          {[
            {
              label: "Static ad flow",
              tagline:
                "The advertiser hand-picks the exact media — one image, video, or carousel.",
              produces:
                "Customisation. Every shopper sees the same ad creative the advertiser designed.",
              audience:
                "Every kind of sales advertiser, from a single-location restaurant to a global brand running a paid-celebrity campaign.",
              anchor: "Default since Meta ads began.",
            },
            {
              label: "Catalog-driven ad flow",
              tagline:
                "The advertiser hands Meta a product feed; Meta picks each shopper's products on the fly.",
              produces:
                "Automation. Different shoppers see different products from the same feed.",
              audience:
                "Online retailers with a lot of products — fashion sites, marketplaces, anywhere inventory changes daily.",
              anchor: "Added around 2016.",
            },
          ].map((path) => (
            <div
              key={path.label}
              className="border border-[var(--rule)] bg-[var(--tint)] p-5 md:p-6"
            >
              <div className="caption-label mb-2 text-[var(--case-accent)]">
                {path.label}
              </div>
              <p className="font-display text-[0.9rem] text-[var(--ink)] leading-snug mb-3">
                {path.tagline}
              </p>
              <p className="font-display text-[0.85rem] text-[var(--case-accent)] leading-snug mb-3 font-medium">
                {path.produces}
              </p>
              <p className="font-display text-[0.85rem] text-[var(--mid)] leading-snug mb-4">
                {path.audience}
              </p>
              <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)] border-t border-[var(--rule)] pt-3">
                {path.anchor}
              </div>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="caption mt-5 max-w-2xl">
        Same starting screen, two diverging setup paths. The split has
        existed inside Meta's sales-campaign flow since 2016.
      </figcaption>
    </figure>
  );
}

/**
 * ProblemStatementTable — three rows, ordered: Cost 01 = performance
 * loss (split budget); Cost 02 = maintenance overhead; Cost 03 = setup
 * friction.
 */
function ProblemStatementTable() {
  const rows = [
    {
      n: "01",
      title: "Performance loss",
      body: "Advertisers who want strengths from both flows end up running two parallel campaigns and splitting their budget. Meta's optimisation works best on consolidated spend — fragments leave performance on the table.",
    },
    {
      n: "02",
      title: "Maintenance overhead",
      body: "Two campaigns, two ops workflows, two sets of QA, two reporting destinations. Every change has to be made twice. The cost is invisible until something diverges.",
    },
    {
      n: "03",
      title: "Setup friction",
      body: "The right flow isn't obvious upfront. Advertisers spend real time picking, and many pick wrong — only to discover the gap weeks into a live campaign.",
    },
  ];
  return (
    <div className="my-10 max-w-4xl border border-[var(--rule)] bg-[var(--paper)]">
      {rows.map((r, i) => (
        <div
          key={r.n}
          className={`grid grid-cols-12 gap-6 p-5 md:p-6 ${
            i > 0 ? "border-t border-[var(--rule)]" : ""
          }`}
        >
          <div className="col-span-12 md:col-span-3">
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--case-accent)] mb-1">
              Cost · {r.n}
            </div>
            <div className="font-display font-semibold text-[var(--ink)] text-[1.05rem] leading-snug">
              {r.title}
            </div>
          </div>
          <p className="col-span-12 md:col-span-9 font-display text-[0.95rem] text-[var(--mid)] leading-relaxed">
            {r.body}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * FeatureDecisionMatrix — new in pass-3. Replaces the lo-fi
 * ThreeFlowsFigure. Shows the seven catalog-driven features, each
 * with its alpha plan and GA destination. Real feature names per user
 * direction ("to show the complexity of the work"). Five distinct
 * "fates" colour-coded.
 */
function FeatureDecisionMatrix() {
  type Fate =
    | "Keep in accordion"
    | "Move to PAC 2.0"
    | "Move to formats modal"
    | "Move to A+C enhancements"
    | "Deprecate"
    | "Pending alignment";

  const fateColor: Record<Fate, string> = {
    "Keep in accordion": "var(--case-accent)",
    "Move to PAC 2.0": "var(--ink)",
    "Move to formats modal": "var(--ink)",
    "Move to A+C enhancements": "var(--ink)",
    Deprecate: "var(--mid)",
    "Pending alignment": "var(--mid)",
  };

  const rows: { feature: string; alpha: Fate; ga: Fate }[] = [
    { feature: "Dynamic media", alpha: "Keep in accordion", ga: "Pending alignment" },
    { feature: "Creative options", alpha: "Keep in accordion", ga: "Pending alignment" },
    { feature: "Frame overlay", alpha: "Keep in accordion", ga: "Move to PAC 2.0" },
    { feature: "Text fields", alpha: "Keep in accordion", ga: "Move to PAC 2.0" },
    { feature: "Product-in-feed", alpha: "Move to formats modal", ga: "Move to formats modal" },
    { feature: "Map card", alpha: "Deprecate", ga: "Deprecate" },
    { feature: "Profile card", alpha: "Move to formats modal", ga: "Move to formats modal" },
  ];

  return (
    <figure className="my-12 md:my-16 max-w-5xl">
      <span className="caption-label">
        Reference · Seven catalog features, each with its own decision
      </span>

      {/* Header */}
      <div className="mt-5 border border-[var(--rule)]">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-[var(--tint)] border-b border-[var(--rule)]">
          <div className="col-span-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)]">
            Feature
          </div>
          <div className="col-span-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)]">
            Plan for the alpha
          </div>
          <div className="col-span-4 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)]">
            Plan for general availability
          </div>
        </div>

        {rows.map((r, i) => (
          <div
            key={r.feature}
            className={`grid grid-cols-12 gap-4 px-5 py-3.5 ${
              i > 0 ? "border-t border-[var(--rule)]" : ""
            } ${i % 2 === 1 ? "bg-[var(--tint)]" : "bg-[var(--paper)]"}`}
          >
            <div className="col-span-4 font-display text-[0.95rem] text-[var(--ink)] leading-snug">
              {r.feature}
            </div>
            <div
              className="col-span-4 font-display text-[0.9rem] leading-snug"
              style={{ color: fateColor[r.alpha] }}
            >
              {r.alpha}
            </div>
            <div
              className="col-span-4 font-display text-[0.9rem] leading-snug"
              style={{ color: fateColor[r.ga] }}
            >
              {r.ga}
            </div>
          </div>
        ))}
      </div>

      <figcaption className="caption mt-5 max-w-2xl">
        Seven features, four possible homes (the unified accordion, a
        general-purpose creative modal, a format-specific modal, or
        deprecation), and a separate plan for now versus later. Each row
        was its own design decision, signed off across two product orgs.
      </figcaption>
    </figure>
  );
}

function ThreeToOneVisual() {
  const flows = [
    { n: "01", label: "Single image format", description: "One image or video. The simplest ad creative — one piece of media, one message.", count: "4 features", src: "/primer/format-single.png" },
    { n: "02", label: "Carousel format", description: "A swipeable row of product cards, each with its own image and link.", count: "6 features", src: "/primer/format-carousel.png" },
    { n: "03", label: "Collection format", description: "A hero image above a product grid. Tapping opens a full-screen browsing experience.", count: "4 features", src: "/primer/format-collection.png" },
  ];
  return (
    <figure className="my-10 xl:max-w-[calc(100%-17rem)]">
      <span className="caption-label">Reference · What this case study covers</span>

      <div className="mt-5 border border-[var(--rule)] bg-[var(--paper)] p-6 md:p-8">
        <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)] mb-4">
          Before · Catalog-driven creative features split across 3 formats
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {flows.map((f) => (
            <div key={f.n} className="border border-[var(--rule)] bg-[var(--tint)] rounded-lg overflow-hidden">
              <div className="border-b border-[var(--rule)]">
                <img src={(f as any).src} alt={f.label} className="w-full h-auto block" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-[0.65rem]" style={{ color: "var(--case-accent)" }}>{f.n}</span>
                  <span className="font-display font-medium text-[0.9rem] text-[var(--ink)]">{f.label}</span>
                </div>
                <p className="font-display text-[0.8rem] text-[var(--mid)] leading-snug">{f.description}</p>
                <div className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-[var(--case-accent)]">{(f as any).count}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center my-6">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-6 bg-[var(--rule)]" />
            <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--case-accent)]">
              ↓ unified into ↓
            </div>
            <div className="w-px h-6 bg-[var(--rule)]" />
          </div>
        </div>

        <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--mid)] mb-4">
          After · One surface, no format selection needed
        </div>
        <div className="border border-[var(--case-accent)] rounded-lg overflow-hidden">
          <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => expand("/primer/unified-after.png")}>
            <img src="/primer/unified-after.png" alt="The unified ad creative card with all media types in one surface" className="w-full h-auto block" loading="lazy" />
            <span className="expand-hint">CLICK TO ENLARGE</span>
          </div>
          <div className="bg-[var(--paper)] px-6 py-5 border-t border-[var(--case-accent)]">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-mono text-[0.7rem] mt-0.5" style={{ color: "var(--case-accent)" }}>•</span>
                <span className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">Three ad creative cards unified into one — formats are now automated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[0.7rem] mt-0.5" style={{ color: "var(--case-accent)" }}>•</span>
                <span className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">Static ad and catalog-driven ad media can be selected in one card</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono text-[0.7rem] mt-0.5" style={{ color: "var(--case-accent)" }}>•</span>
                <span className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">Seven catalog features in a collapsible <em>product media accordion</em></span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </figure>
  );
}

function CollapsibleFeatureList() {
  const [open, setOpen] = useState(false);
  const features = [
    { name: "Dynamic media", def: "Optimizes which product images or videos to show each viewer. Applies to all formats. One of the highest-revenue features.", format: "All formats" },
    { name: "Frame overlay", def: "Adds a visual border or label around product images — like 'Sale' or 'Free shipping'. Applies to single image and carousel.", format: "Single image, Carousel" },
    { name: "Creative options", def: "Controls whether the media is a single product image or a slideshow video of product images. Carousel only.", format: "Carousel" },
    { name: "Text fields", def: "Headline, primary text, and description — pulled from the catalog or overridden by the advertiser. Applies to all formats.", format: "All formats" },
    { name: "Product in feed", def: "Lets the advertiser feature specific products from their catalog in a collection ad.", format: "Collection" },
    { name: "Profile card", def: "An end card showing the business's profile information at the end of a carousel.", format: "Carousel" },
    { name: "Map card", def: "An end card showing a map to the nearest store location. Deprecated in the unified flow.", format: "Carousel" },
  ];
  return (
    <div className="my-6 max-w-3xl border border-[var(--rule)]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-[var(--tint)] transition-colors"
        style={{ cursor: "pointer" }}
      >
        <div>
          <span className="font-display font-medium text-[0.95rem] text-[var(--ink)]">
            7 catalog-driven features
          </span>
          <span className="font-display text-[0.85rem] text-[var(--mid)] ml-2">
            — each needed a design decision
          </span>
        </div>
        <span
          className="font-mono text-[0.7rem] text-[var(--mid)] transition-transform"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▼
        </span>
      </button>
      {open && (
        <div className="border-t border-[var(--rule)]">
          {features.map((f, i) => (
            <div
              key={f.name}
              className={`px-5 py-3 flex gap-4 ${i > 0 ? "border-t border-[var(--rule)]" : ""}`}
            >
              <div className="min-w-[140px] shrink-0">
                <span className="font-display font-medium text-[0.9rem] text-[var(--ink)]">
                  {f.name}
                </span>
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-[var(--mid)] mt-0.5">
                  {(f as any).format}
                </div>
              </div>
              <span className="font-display text-[0.85rem] text-[var(--mid)] leading-snug">
                {f.def}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * StatBannerStripe — kept from pass-2. Numbers as the visualization at
 * 5rem in case-accent.
 */
function StatBannerStripe() {
  const stats = [
    { num: "2", label: "Product orgs" },
    { num: "3", label: "Time zones" },
    { num: "4", label: "Lead sign-offs" },
    { num: "1", label: "Unified flow" },
  ];
  return (
    <div className="my-10 md:my-12 max-w-3xl border-y border-[var(--rule)] py-6 md:py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-start">
            <div
              className="font-display font-medium leading-none tracking-[-0.04em]"
              style={{
                color: "var(--case-accent)",
                fontSize: "3rem",
              }}
            >
              {s.num}
            </div>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--mid)] mt-3 leading-snug">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * FigurePlaceholder — kept from pass-2 for §04 walkthrough.
 */
function FigurePlaceholder({
  n,
  caption,
}: {
  n: string;
  caption: string;
}) {
  return (
    <figure className="my-10">
      <div className="aspect-[16/10] w-full max-w-3xl border border-dashed border-[var(--rule)] bg-[var(--tint)] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[var(--mid)] mb-2">
            Frame {n}
          </div>
          <div className="font-display text-[0.9rem] text-[var(--mid)] max-w-md">
            Figma export pending — swap in here.
          </div>
        </div>
      </div>
      <figcaption className="caption mt-3 max-w-2xl">{caption}</figcaption>
    </figure>
  );
}

/**
 * DerisksRow — kept from pass-2.
 */
function DerisksRow({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="my-8 max-w-5xl border-t border-[var(--rule)]">
      {items.map((d, i) => (
        <div
          key={i}
          className="grid grid-cols-12 gap-6 py-5 md:py-6 border-b border-[var(--rule)]"
        >
          <div className="col-span-12 md:col-span-1">
            <div className="font-mono text-[1.4rem] text-[var(--case-accent)] leading-none">
              {String(i + 1).padStart(2, "0")}
            </div>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="font-display font-semibold text-[var(--ink)] text-[1rem] leading-snug">
              {d.title}
            </div>
          </div>
          <p className="col-span-12 md:col-span-7 font-display text-[0.92rem] text-[var(--mid)] leading-relaxed">
            {d.body}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// TOC
// ─────────────────────────────────────────────────────────────────────────

const commerceSections = [
  { id: "fork", label: "The fork" },
  { id: "cost", label: "The cost of two separate flows" },
  { id: "unify", label: "What we built" },
  { id: "walkthrough", label: "The design work" },
  { id: "alignment", label: "Research & launch" },
];

function CommerceToc() {
  const [active, setActive] = useState<string>("primer");
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
    commerceSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return (
    <nav
      className={`hidden xl:block fixed right-7 z-40 w-[310px] transition-all duration-500 ease-in-out ${scrolled ? "top-[calc(80px+1.75rem)]" : "top-[calc(72px+2.25rem)]"}`}
      aria-label="Section navigation"
    >
      <div className="rounded-2xl p-4 max-h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden" style={{ background: "rgba(42,42,46,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        <div className="font-mono text-[13px] text-[var(--mid)] tracking-[0.1em] uppercase mb-3 font-medium">
          Sections
        </div>
        <ul className="space-y-0.5">
          {commerceSections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                data-active={active === s.id}
                className={`toc-link flex items-baseline gap-2.5 py-1.5 px-2.5 rounded-lg transition-all duration-200 ${
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
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function CommerceAds() {
  useScrollToTop();
  const scrolled = useScrolled(40);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const expand = (src: string) => setLightboxSrc(src);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="theme-commerce min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <CommerceToc />

      {/* Nav — expands at top, compacts on scroll */}
      <nav className={`fixed z-50 transition-all duration-500 ease-in-out ${scrolled ? "top-4 left-4 right-7 rounded-2xl" : "top-0 left-0 right-0 border-b border-[#333]"}`} style={scrolled ? { background: "rgba(42,42,46,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)" } : { background: "#232326" }}>
        <div className={`px-7 flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? "py-3" : "py-6"}`}>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-mono text-[13px] tracking-[0.04em] uppercase text-[#ccc] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#444] hover:border-[#555] hover:bg-[rgba(255,255,255,0.04)]">
              ← All projects
            </Link>
            <div className={`w-px bg-[#444] transition-all duration-500 ${scrolled ? "h-5" : "h-6"}`} />
            <div>
              <div className={`font-display font-bold tracking-[-0.01em] text-[var(--ink)] transition-all duration-500 ease-in-out ${scrolled ? "text-[17px]" : "text-[20px]"}`}>{scrolled ? "Unifying Meta's split eCommerce ad builder" : "Commerce Ads"}</div>
            </div>
          </div>
          <span className={`font-display font-bold tracking-[-0.02em] text-[var(--ink)] transition-all duration-500 ease-in-out ${scrolled ? "text-[17px]" : "text-[20px]"}`}>Shane Yun</span>
        </div>
      </nav>

      {/* ─────────────── Hero ─────────────── */}
      <section className="container pt-28 pb-8 md:pt-32 md:pb-10">
        <div className="max-w-4xl">
          <span className="kicker">Commerce ads on Meta</span>
          <h1 className="display-1 mt-4">
            Unifying Meta's split<br />eCommerce ad builder
          </h1>
        </div>

        {/* TLDR */}
        <div className="mt-10 md:mt-12 max-w-4xl">
          <TldrWithSwitcher
            accentColor="#0ee9d6"
            accentRgb="14,233,214"
            summary={<p><strong>I led design of the product media section inside Meta's new unified eCommerce ad builder</strong> — integrating 7 product catalog features from 3 separate legacy flows. This new ads flow shipped to a scaled alpha with 100K brands.</p>}
            role="Design lead"
            timeline={<span>H1 2026 · 3 months</span>}
            outcome={<span className="flex items-center gap-1.5"><svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{color:"var(--case-accent)",flexShrink:0}}><circle cx="6.5" cy="6.5" r="6" stroke="currentColor" strokeWidth="1.2"/><path d="M4 6.5l2 2 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>Scaled alpha · 100K brands</span>}
            team={<ul className="list-disc pl-3.5 space-y-1"><li>Me :)</li><li>2 design teams<span className="block text-[0.72rem] text-white/60 mt-0.5 leading-snug">2 managers, 1 director, 3 ICs</span></li><li>Content designer</li><li>Product manager</li><li>UX researcher</li><li>Tech lead</li></ul>}
            audience={<span>High spend eCommerce, Retail, and CPG advertisers</span>}
          />
        </div>
      </section>

      {/* ═════════════════════════════════════════════════════════════════
          §01 — The fork: two ways of building a sales ad on Meta
          ═════════════════════════════════════════════════════════════════ */}
      <Section
        id="fork"
        number="01"
        kicker="The fork"
        title="Two marketing setups that drive most of Meta's ad revenue."
        lede="Since Meta's ads driving sales began, advertisers have had two separate ways to build a sales ad — one built for customisation, the other for scale and automation."
      >
        <Prose>
          <p>
            Businesses create and manage their ads on Meta through a
            tool called <em>Ads Manager</em>. When an advertiser's goal
            is to drive sales — sending shoppers to a product page, a
            checkout, or a purchase screen — they build what Meta calls
            a <em>sales campaign</em>. This case study lives entirely
            inside that campaign type.
          </p>
        </Prose>

        <AdsManagerCarousel />

        <Prose>
          <p>
            When a business sets up a sales ad on Meta, two flows
            are available — together accounting for 50%+ of Meta's total revenue:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-[var(--ink)] mt-5">
            <li><strong>Static ad flow:</strong> the advertiser hand-picks the exact media they want shown</li>
            <li><strong>Catalog-driven ad flow</strong> (added in 2016)<strong>:</strong> the advertiser connects a product feed (catalog) and lets Meta pick which products to show each shopper automatically</li>
          </ol>
        </Prose>

        <figure className="my-10 xl:max-w-[calc(100%-17rem)]">
          <span className="caption-label">Reference · Two setup flows, two different ads</span>

          <div className="mt-5 border border-[var(--rule)] bg-[var(--paper)] p-6 md:p-8">
            {/* Shared start */}
            <div className="flex justify-center">
              <div className="border border-[var(--rule)] bg-[var(--tint)] px-5 py-3 max-w-xs text-center">
                <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--mid)]">Same starting screen</div>
                <div className="font-display text-[0.9rem] text-[var(--ink)] mt-1">Campaign goal: <span style={{ color: "var(--case-accent)" }}>Sales</span></div>
              </div>
            </div>

            <div className="flex justify-center my-4">
              <div className="w-px h-6 bg-[var(--rule)]" />
            </div>

            <div className="flex justify-center mb-4">
              <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--mid)]">↓ Two diverging paths ↓</div>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Static */}
              <div className="flex flex-col gap-4">
                <div className="border border-[var(--rule)] bg-[var(--tint)] p-5">
                  <div className="caption-label mb-2 text-[var(--case-accent)]">Static ad flow</div>
                  <p className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">
                    <strong>Customisation.</strong> The advertiser hand-picks the exact media — a photo, video, or carousel they've designed themselves.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="font-mono text-[0.6rem] text-[var(--mid)]">↓ example ad ↓</div>
                </div>
                <div className="mx-auto max-w-[220px] rounded-xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.15)]">
                  <img src="/primer/static-ad.png" alt="A static ad — hand-picked creative by the advertiser" className="w-full h-auto block" loading="lazy" />
                </div>
              </div>

              {/* Catalog */}
              <div className="flex flex-col gap-4">
                <div className="border border-[var(--rule)] bg-[var(--tint)] p-5">
                  <div className="caption-label mb-2 text-[var(--case-accent)]">Catalog-driven ad flow</div>
                  <p className="font-display text-[0.85rem] text-[var(--ink)] leading-snug">
                    <strong>Scale and automation.</strong> The advertiser connects a product feed. Meta picks which products to show each shopper automatically.
                  </p>
                </div>
                <div className="flex justify-center">
                  <div className="font-mono text-[0.6rem] text-[var(--mid)]">↓ example ad ↓</div>
                </div>
                <div className="mx-auto max-w-[220px] rounded-xl overflow-hidden shadow-[0_2px_20px_rgba(0,0,0,0.15)]">
                  <img src="/primer/dynamic-ad.png" alt="A catalog-driven ad — products assembled automatically by Meta" className="w-full h-auto block" loading="lazy" />
                </div>
              </div>
            </div>
          </div>

          <figcaption className="caption mt-4 max-w-2xl">
            Same campaign goal, two diverging paths — and two different ad styles. The ads shown are examples; many creative variations are possible within each flow.
          </figcaption>
        </figure>

        <Prose>
          <p>
            Both flows live inside the same sales-campaign type —{" "}
            <strong>but the moment an advertiser picks one over the
            other, everything diverges.</strong>
          </p>
        </Prose>
      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          §02 — Why the fork costs money
          ═════════════════════════════════════════════════════════════════ */}
      <Section
        id="cost"
        number="02"
        kicker="The cost of two separate flows"
        title="When the choice was clean, the fork worked. It isn't clean anymore."
        lede="The fork made sense ten years ago — when those two flows served two clearly different kinds of advertisers. Today, the largest online businesses want pieces of both."
      >
        <Prose>
          <p>
            For a long time, <strong>the fork mapped cleanly</strong>.
            A local restaurant picked the static flow. A major
            retailer with thousands of SKUs picked the catalog-driven
            flow. Picking the right one was obvious, and most
            advertisers only ever ran one of the two.
          </p>
          <p>
            <strong>That isn't how online retail works in 2026.</strong>{" "}
            The largest online businesses on Meta — fashion, beauty,
            marketplaces — want pieces of both. They want the catalog-driven flow's
            ability to show every shopper the products most likely to
            convert them, <em>and</em> they want the static flow's level
            of control over what the ad looks like, sounds like, and
            says.
          </p>
          <p><strong>The cost shows up in three places.</strong></p>
        </Prose>

        <ProblemStatementTable />
      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          §03 — What we built
          ═════════════════════════════════════════════════════════════════ */}
      <Section
        id="unify"
        number="03"
        kicker="What we built"
        title="A unified flow — and the creative features that had to come with it."
        lede="After three years of planning and stakeholder alignment, the initiative moved into execution in late 2025."
      >
        <Prose>
          <p>
            <strong>This unification is one of the largest structural
            changes to Meta's ad creation experience</strong> —
            touching every sales advertiser on the platform across
            two product orgs. It has been in progress for{" "}
            <strong>over three years</strong>, moving through early
            strategy, cross-org alignment, and migration planning
            before entering execution in late 2025.
          </p>
          <p>
            This case study covers one piece of that execution:
            the <em>product media</em> section, where advertisers
            control what their ads look like — and where the
            catalog-driven features that drive{" "}
            <strong>45% of catalog ads revenue</strong> needed a new
            home.
          </p>
        </Prose>

        <figure className="my-8 xl:max-w-[calc(100%-17rem)]">
          <span className="caption-label">Reference · The Ad level in Ads Manager</span>
          <div className="mt-3 border border-[var(--rule)] rounded-lg overflow-hidden">
            <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => expand("/primer/ad-setup-card.png")}>
              <img src="/primer/ad-setup-card.png" alt="The Ad level in Ads Manager showing the Ad setup card with format picker and ad preview" className="w-full h-auto block" loading="lazy" />
              <span className="expand-hint">CLICK TO ENLARGE</span>
            </div>
          </div>
          <figcaption className="caption mt-3 max-w-2xl">
            The Ad setup card at the Ad level in Ads Manager.
          </figcaption>
        </figure>

        <Prose>
          <p>
            The format picker lives in this card. Later in the flow,
            the advertiser reaches the <em>ad creative card</em> —
            where they control what their ad actually looks like.
            What appears in that card depends entirely on the format
            selected here. <strong>Each of the three formats produces a
            different creative editing experience.</strong>
          </p>
        </Prose>

        <ThreeToOneVisual />
      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          §04 — The product-media surface, in six frames
          ═════════════════════════════════════════════════════════════════ */}
      <Section
        id="walkthrough"
        number="04"
        kicker="The design work"
        title="Every detail was a decision."
        lede="From the position of the section itself to the order of individual features inside it — every detail was deliberately designed, backed by usage data, and aligned across product, engineering, and data science."
      >
        <div className="my-10 max-w-3xl border border-[var(--rule)] bg-[var(--tint)]">
          <div className="px-6 pt-5 pb-2">
            <span className="caption-label text-[var(--case-accent)]">Three design decisions</span>
            <p className="font-display text-[0.95rem] text-[var(--ink)] mt-2">The design work moved through three dimensions:</p>
          </div>
          <div className="px-6 pb-5">
            {[
              { n: "01", text: "Where the product media section lives inside the new ad creative card" },
              { n: "02", text: "How it behaves by default" },
              { n: "03", text: "How the seven features are organized within it" },
            ].map((d, i) => (
              <div key={d.n} className={`flex items-baseline gap-3 py-3 ${i > 0 ? "border-t border-[var(--rule)]" : ""}`}>
                <span className="font-mono text-[0.75rem] font-medium" style={{ color: "var(--case-accent)" }}>{d.n}</span>
                <span className="font-display text-[0.95rem] text-[var(--ink)]">{d.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Decision 01: Position & sequencing ── */}
        <div className="my-10">
          <span className="caption-label"><span style={{ color: "var(--case-accent)" }}>01</span> · Where product media lives in the new ad creative card</span>
          <Prose>
            <p>
              Given its usage rate, <strong>product media takes the
              first or second position</strong> in the media sequence
              — depending on which the advertiser adds first. We
              explored alternatives like bundling similar media types
              and dynamic sequencing, but <strong>landed on a simple,
              predictable order.</strong>
            </p>
          </Prose>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)] max-w-3xl my-6 rounded-lg overflow-hidden">
            <div className="bg-[var(--paper)]">
              <img src="/primer/pmedia-first.png" alt="Product media added first in the sequence" className="w-full h-auto block" loading="lazy" />
              <div className="p-4">
                <div className="caption-label mb-1 text-[var(--case-accent)]">If product media is added first</div>
              </div>
            </div>
            <div className="bg-[var(--paper)]">
              <img src="/primer/pmedia-second.png" alt="Product media added second in the sequence" className="w-full h-auto block" loading="lazy" />
              <div className="p-4">
                <div className="caption-label mb-1 text-[var(--case-accent)]">If product media is added second</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Default state ── */}
        <div className="my-10">
          <span className="caption-label"><span style={{ color: "var(--case-accent)" }}>02</span> · Default collapsed</span>
          <Prose>
            <p>
              <strong>The accordion defaults to collapsed.</strong>{" "}
              Catalog media is an automated feature with advanced
              capabilities — keeping it expanded would clutter the
              workspace for every advertiser, including those who
              don't use a catalog. Catalog-powered advertisers know
              to look for it when they need it.
            </p>
          </Prose>
          <div className="my-6 xl:max-w-[calc(100%-17rem)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left column — collapsed + expanded nested stacked */}
              <div className="space-y-4">
                <div className="border border-[var(--rule)] rounded-lg overflow-hidden">
                  <img src="/primer/accordion-collapsed.png" alt="Accordion collapsed" className="w-full h-auto block" loading="lazy" />
                  <div className="p-4 border-t border-[var(--rule)]">
                    <div className="caption-label mb-1 text-[var(--case-accent)]">Collapsed</div>
                    <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug">Default state — reduces real estate.</p>
                  </div>
                </div>
                <div className="border border-[var(--rule)] rounded-lg overflow-hidden">
                  <img src="/primer/accordion-expanded-nested.png" alt="Accordion expanded with nesting" className="w-full h-auto block" loading="lazy" />
                  <div className="p-4 border-t border-[var(--rule)]">
                    <div className="caption-label mb-1 text-[var(--case-accent)]">Expanded with nesting</div>
                    <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug">Highest usage features salient, rest nested.</p>
                  </div>
                </div>
              </div>
              {/* Right column — fully expanded */}
              <div className="border border-[var(--rule)] rounded-lg overflow-hidden">
                <img src="/primer/accordion-fully-expanded.png" alt="Accordion fully expanded" className="w-full h-auto block" loading="lazy" />
                <div className="p-4 border-t border-[var(--rule)]">
                  <div className="caption-label mb-1 text-[var(--case-accent)]">Fully expanded</div>
                  <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug">All seven features visible and configurable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature ordering ── */}
        <div className="my-10">
          <span className="caption-label"><span style={{ color: "var(--case-accent)" }}>03</span> · Feature ordering inside the accordion</span>
          <Prose>
            <p>
              Each of the seven features had its own usage rate,
              revenue impact, and stakeholders. <strong>I led the
              effort to assess every feature</strong> — pulling data
              with data science, evaluating dependencies with
              engineering, and aligning across two product orgs.
            </p>
            <p>
              <strong>Every feature needed a verdict</strong>: retain
              in the accordion, migrate to another surface, or
              deprecate — each signed off by design leadership and
              engineering. We opted for a conservative in-line
              approach for the alpha, with plans to further simplify.
            </p>
          </Prose>
          <figure className="my-8 xl:max-w-[calc(100%-17rem)]">
            <span className="caption-label">Reference · Seven features, one destination</span>
            <div className="mt-4 border border-[var(--rule)] rounded-lg bg-[var(--paper)] p-6 md:p-8">
              {/* Feature bubbles */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {["Dynamic media", "Creative options", "Frame overlay", "Text inputs", "Product in feed", "Profile card", "Map card"].map((f) => (
                  <span
                    key={f}
                    className="px-3 py-1.5 rounded-full border border-[var(--case-accent)]/40 font-display text-[0.75rem] text-[var(--ink)] bg-[var(--tint)]"
                  >
                    {f}
                  </span>
                ))}
              </div>
              {/* Converging arrows */}
              <div className="flex justify-center my-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex gap-6">
                    <div className="w-px h-4 bg-[var(--rule)] rotate-[20deg]" />
                    <div className="w-px h-4 bg-[var(--rule)] rotate-[10deg]" />
                    <div className="w-px h-5 bg-[var(--rule)]" />
                    <div className="w-px h-4 bg-[var(--rule)] rotate-[-10deg]" />
                    <div className="w-px h-4 bg-[var(--rule)] rotate-[-20deg]" />
                  </div>
                  <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--case-accent)]">
                    ↓ converge into ↓
                  </div>
                </div>
              </div>
              {/* Accordion image */}
              <div className="max-w-sm mx-auto border border-[var(--rule)] rounded-lg overflow-hidden">
                <img src="/primer/accordion-fully-expanded.png" alt="The finalized product media accordion with all seven features" className="w-full h-auto block" loading="lazy" />
              </div>
            </div>
          </figure>

          <figure className="my-8 xl:max-w-[calc(100%-17rem)]">
            <span className="caption-label">All up wireframe · Seven features, one destination</span>
            <div className="mt-4 border border-[var(--rule)] rounded-lg overflow-hidden">
              <div className="figure-frame !rounded-none !border-0 cursor-zoom-in" onClick={() => expand("/primer/ProductMediaFinal.png")}>
                <img src="/primer/ProductMediaFinal.png" alt="All up wireframe — seven catalog features unified in the product media accordion" className="w-full h-auto block" loading="lazy" />
                <span className="expand-hint">CLICK TO ENLARGE</span>
              </div>
            </div>
          </figure>
        </div>

      </Section>

      <div className="container">
        <div className="rule" />
      </div>

      {/* ═════════════════════════════════════════════════════════════════
          §05 — What it took across the room
          ═════════════════════════════════════════════════════════════════ */}
      <Section
        id="alignment"
        number="05"
        kicker="Research, alignment, and launch"
        title="Validated with advertisers, aligned across orgs, shipped to 100K."
      >
        <StatBannerStripe />

        <Prose>
          <p>
            Much of the work beyond Figma was coordination — cross-pillar sessions where we walked the full flow together, named every ambiguous ownership call, and resolved each one before it could block engineering. The output was a shared decision log that became the reference document for implementation.
          </p>
          <p>
            UX research across the full unified flow validated the direction with no flagged risk for this section. <strong>The alpha shipped to ~100,000 advertisers.</strong> We're tracking revenue regression, ad creation rates, and product media usage as the baseline heading into beta.
          </p>
        </Prose>
      </Section>

      <div className="pb-20" />
      {lightboxSrc && (
        <div className="fixed inset-0 z-50 bg-[oklch(0.10_0.01_60_/_0.94)] flex items-center justify-center p-4 md:p-10" onClick={() => setLightboxSrc(null)}>
          <button className="absolute top-5 right-5 text-paper font-display text-xs tracking-[0.18em] uppercase opacity-80 hover:opacity-100" onClick={() => setLightboxSrc(null)}>Close · Esc</button>
          <img src={lightboxSrc} className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
