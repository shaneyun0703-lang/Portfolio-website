import { Carousel, CarouselSlide } from "@/components/Carousel";
import { Link } from "wouter";
import { HierarchyDiagram } from "@/components/HierarchyDiagram";
import { LandscapeChart } from "@/components/LandscapeChart";
import { PartnerTeamsDiagram } from "@/components/PartnerTeamsDiagram";
import { RoundEvolution } from "@/components/RoundEvolution";
import { Section, Prose, PullQuote, Aside } from "@/components/Section";
import { TableOfContents } from "@/components/TableOfContents";
import { TldrWithSwitcher } from "@/components/TldrSection";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useScrolled } from "@/hooks/useScrolled";
import {
  figma,
  r2AltAdsetFlow,
  r2AltAdFlow,
  finalThemesScreens,
  statusQuoSlides,
} from "@/lib/figmaAssets";

// ── Status Quo Section ─────────────────────────────────────────
import { useState } from "react";

function StatusQuoSection({ slides }: { slides: CarouselSlide[] }) {
  const [idx, setIdx] = useState(0);
  const slide = slides[idx];
  return (
    <div className="my-6 xl:max-w-[calc(100%-17rem)]">
      <span className="caption-label mb-4 block">The status quo · Search ads in Meta Ads Manager today</span>
      <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4" style={{ alignItems: "start" }}>
        <div className="space-y-3">
          <div className="border border-[var(--rule)] p-3 bg-[var(--paper)] rounded-lg">
            <span className="caption-label text-[var(--primary)]">Definition</span>
            <h4 className="font-display text-[0.82rem] font-semibold mt-1 mb-1 text-[var(--ink)]">Placements card</h4>
            <p className="font-display text-[0.7rem] text-[var(--mid)] leading-snug">The screen where an advertiser picks which surfaces their ad runs on — Feed, Stories, Reels, search, etc.</p>
          </div>
          <div className="border border-[var(--rule)] p-3 bg-[var(--paper)] rounded-lg">
            <span className="caption-label text-[var(--primary)]">Definition</span>
            <h4 className="font-display text-[0.82rem] font-semibold mt-1 mb-1 text-[var(--ink)]">Placement controls</h4>
            <p className="font-display text-[0.7rem] text-[var(--mid)] leading-snug">The list inside the Placements card where each surface can be turned on or off. Search is currently just two checkboxes.</p>
          </div>
        </div>
        <div>
          <div className="border border-[var(--rule)] rounded-lg overflow-hidden">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <button
              type="button"
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={idx === 0}
              className="font-mono text-[0.8rem] px-3 py-1.5 border border-[var(--rule)] rounded-sm disabled:opacity-30 hover:bg-[var(--tint)] transition-colors text-[var(--ink)]"
            >
              ←
            </button>
            <span className="font-display text-[0.78rem] text-[var(--mid)] text-center flex-1 px-3 leading-snug">
              {typeof slide.step === "string" ? slide.step : slide.step}
            </span>
            <button
              type="button"
              onClick={() => setIdx(Math.min(slides.length - 1, idx + 1))}
              disabled={idx === slides.length - 1}
              className="font-mono text-[0.8rem] px-3 py-1.5 border border-[var(--rule)] rounded-sm disabled:opacity-30 hover:bg-[var(--tint)] transition-colors text-[var(--ink)]"
            >
              →
            </button>
          </div>
          <div className="flex justify-center gap-1.5 mt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                className="w-2 h-2 rounded-full transition-colors"
                style={{ background: i === idx ? "var(--primary)" : "var(--rule)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Carousel slide builders ─────────────────────────────────────

const statusQuoCarousel: CarouselSlide[] = [
  {
    src: statusQuoSlides[0],
    alt: "Meta Ads Manager — the collapsed Placements card on the ad-set screen.",
    step:
      "Step 01 — Today, Search ads live inside the Placements card on the ad-set screen, with no dedicated controls.",
  },
  {
    src: statusQuoSlides[1],
    alt: "Meta Ads Manager — Placement controls summary inside Placements.",
    step:
      "Step 02 — Expanding the card surfaces a Placement controls summary. Search results sits among a dozen other surfaces.",
  },
  {
    src: statusQuoSlides[2],
    alt: "Meta Ads Manager — the only existing search-ads control: a Facebook search results checkbox and an Instagram search results checkbox.",
    step:
      "Step 03 — The only thing an advertiser can do today is tick a Facebook search results checkbox and an Instagram search results checkbox. That is the entire user experience around Search ads.",
  },
];

const r1ConceptSlides: CarouselSlide[] = [
  {
    src: "/primer/r1-standalone-card.png",
    alt: "Concept A — a new standalone Search Tools card at the ad-set level.",
    step: (
      <>
        <strong>Concept A</strong> · Post-placement · A new standalone
        Search Tools card on the ad set.
      </>
    ),
  },
  {
    src: "/primer/r1-audience-card.png",
    alt: "Concept B — Search Themes nested inside the Audience card.",
    step: (
      <>
        <strong>Concept B</strong> · Pre-placement · Search Themes
        nested inside the Audience card.
      </>
    ),
  },
  {
    src: "/primer/r1-audience-suggestions.png",
    alt: "Concept B — Audience card with search theme suggestions.",
    step: (
      <>
        <strong>Concept B (continued)</strong> · The search theme
        suggestions within the Audience card.
      </>
    ),
  },
  {
    src: "/primer/r1-placements.png",
    alt: "Concept C — Search Themes nested inside the Placements card.",
    step: (
      <>
        <strong>Concept C</strong> · Intra-placement · Search Themes
        living inside the Placements card.
      </>
    ),
  },
  {
    src: "/primer/r1-placements-themes.png",
    alt: "Concept C — Search themes expanded within Placements.",
    step: (
      <>
        <strong>Concept C (continued)</strong> · The search themes
        controls expanded within the Placements card.
      </>
    ),
  },
  {
    src: "/primer/r1-ad-level.png",
    alt: "Concept D — Search Tools at the ad (creative) level.",
    step: (
      <>
        <strong>Concept D</strong> · Post-placement · Search Tools at
        the ad level — themes attach to each individual creative.
      </>
    ),
  },
];

// Round 2 ad-set flow — trimmed to six representative steps from the original sixteen.
// Source-flow indices preserved so the chosen frames map back to the full reel.
const r2AltAdsetTrimmed: ReadonlyArray<{ idx: number; step: string }> = [
  { idx: 2, step: "Ad set landing — the familiar set of cards (Audience, Placements, Schedule, Brand safety). Nothing search-specific yet." },
  { idx: 5, step: "Placements card, expanded — the existing list of surfaces, with a new Placement-specific tools section underneath." },
  { idx: 7, step: "Add Search Themes — plain-language input, helper text scoping the field to Search results only." },
  { idx: 8, step: "Themes entered — chips with a counter; limits are visible inline so advertisers see the ceiling without leaving setup." },
  { idx: 9, step: "Brand safety card — a read-only mirror of the account-wide Negative Keywords list, with a clear path out to the account-level editor." },
  { idx: 12, step: "Ad set saved — themes and negative keywords now cascade to every ad beneath this ad set automatically. The waterfall does the work." },
];

const r2AltAdsetSlides: CarouselSlide[] = [
  {
    src: "/primer/r2-adset-expanded.png",
    alt: "Ad set level — Search themes section expanded.",
    step: (<><strong>01</strong> · Search Themes section expanded within the Placements card.</>),
  },
  {
    src: "/primer/r2-adset-hover.png",
    alt: "Ad set level — hovering on a search theme.",
    step: (<><strong>02</strong> · Advertiser hovers on a theme to see details and suggestions.</>),
  },
  {
    src: "/primer/r2-adset-finished.png",
    alt: "Ad set level — Search themes configured.",
    step: (<><strong>03</strong> · Themes configured — applies to every ad in this ad set.</>),
  },
];

// Round 2 ad-level flow — trimmed to six representative steps from the original twenty-one.
// The labour cost is the whole point of this alternate, so the trim emphasises the repetition beat.
const r2AltAdTrimmed: ReadonlyArray<{ idx: number; step: string }> = [
  { idx: 2, step: "Ad set landing — same four cards as the other alternate. No Search Themes section here — in this version themes live one level down, on each ad." },
  { idx: 8, step: "Ad level — the creative editor opens. This is where this alternate diverges: a Search Themes section now sits on each ad." },
  { idx: 11, step: "Themes entered for ad 1 — chips and counter visible, scoped only to this creative." },
  { idx: 14, step: "Add ad 2 — the same advertiser builds a second creative under the same ad set." },
  { idx: 16, step: "Re-enter themes for ad 2 — themes do not inherit, so the advertiser types the same list again. This is the labour cost the alternate exposes." },
  { idx: 19, step: "Review screen — each ad carries its own theme list. Powerful for niche use cases, exhausting for everyday ones — which is what Round 2 was designed to make legible." },
];

const r2AltAdSlides: CarouselSlide[] = [
  {
    src: "/primer/r2-ad-hover.png",
    alt: "Ad level — Search themes section on the ad creative.",
    step: (<><strong>01</strong> · Search Themes section on each individual ad creative.</>),
  },
  {
    src: "/primer/r2-ad-inputted.png",
    alt: "Ad level — Search themes inputted per ad.",
    step: (<><strong>02</strong> · Themes entered for this ad — must be re-entered on every other ad in the set.</>),
  },
  {
    src: "/primer/r2-ad-completed.png",
    alt: "Ad level — Search themes completed.",
    step: (<><strong>03</strong> · Themes completed for this ad. Each ad carries its own list.</>),
  },
];

// §06 — Use Case 1.1 walkthrough (the final flow signed off for further investment)
const finalDesignSlides: CarouselSlide[] = [
  {
    src: "/primer/final-1.png",
    alt: "Final design — wireframe 1",
    step: (<><strong>01</strong> · Placements card with Search Themes entry point.</>),
  },
  {
    src: "/primer/final-2.png",
    alt: "Final design — wireframe 2",
    step: (<><strong>02</strong> · Search Themes expanded — adding themes as chips.</>),
  },
  {
    src: "/primer/final-3.png",
    alt: "Final design — wireframe 3",
    step: (<><strong>03</strong> · Themes populated with inline guidance.</>),
  },
  {
    src: "/primer/final-4.png",
    alt: "Final design — wireframe 4",
    step: (<><strong>04</strong> · Search Themes configured and summarized.</>),
  },
  {
    src: "/primer/final-5.png",
    alt: "Final design — wireframe 5",
    step: (<><strong>05</strong> · Brand Safety card — Negative Keywords summary.</>),
  },
  {
    src: "/primer/final-6.png",
    alt: "Final design — wireframe 6",
    step: (<><strong>06</strong> · Brand Safety Center — managing Negative Keywords at account level.</>),
  },
  {
    src: "/primer/final-7.png",
    alt: "Final design — wireframe 7",
    step: (<><strong>07</strong> · Negative Keywords editor with bulk upload.</>),
  },
];

export default function SearchAds() {
  useScrollToTop();
  const scrolled = useScrolled(40);
  return (
    <div className="theme-search min-h-screen">
      <TableOfContents />

      {/* Nav — expands at top, compacts on scroll */}
      <nav className={`fixed z-50 transition-all duration-500 ease-in-out ${scrolled ? "top-4 left-4 right-7 rounded-2xl" : "top-0 left-0 right-0 border-b border-[#333]"}`} style={scrolled ? { background: "rgba(42,42,46,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)" } : { background: "#232326" }}>
        <div className={`px-7 flex items-center justify-between transition-all duration-500 ease-in-out ${scrolled ? "py-3" : "py-6"}`}>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="font-mono text-[13px] tracking-[0.04em] uppercase text-[#ccc] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#444] hover:border-[#555] hover:bg-[rgba(255,255,255,0.04)]"
            >
              ← All projects
            </Link>
            <div className={`w-px bg-[#444] transition-all duration-500 ${scrolled ? "h-5" : "h-6"}`} />
            <div>
              <div className={`font-display font-bold tracking-[-0.01em] text-[var(--ink)] transition-all duration-500 ease-in-out ${scrolled ? "text-[17px]" : "text-[20px]"}`}>{scrolled ? "Making Meta a real search ads player" : "Search Ads"}</div>
            </div>
          </div>
          <span className={`font-display font-bold tracking-[-0.02em] text-[var(--ink)] transition-all duration-500 ease-in-out ${scrolled ? "text-[17px]" : "text-[20px]"}`}>Shane Yun</span>
        </div>
      </nav>

      {/* ─────────────── HERO ─────────────── */}
      <header className="relative pt-28 md:pt-32 pb-6 md:pb-8">
        <div className="container">
          <div className="max-w-4xl">
            <div className="kicker mb-4">Search Ads in Meta Ads Manager</div>
            <h1 className="display-1">
              Making Meta a real<br />search ads player
            </h1>
            <div className="flex items-center gap-2 mt-5 flex-wrap">
              <span className="font-display text-[12px] font-medium text-[var(--case-accent)] bg-[rgba(244,114,182,0.08)] border border-[rgba(244,114,182,0.18)] px-3.5 py-1 rounded-full">Design milestone aligned</span>
            </div>
          </div>

          {/* TLDR */}
          <div className="mt-10 md:mt-12 max-w-4xl">
            <TldrWithSwitcher
              accentColor="#f472b6"
              accentRgb="244,114,182"
              summary={<p><strong>I led the design of Search Themes and Negative Keywords</strong> — Meta's first search-specific tools in Ads Manager. Three research rounds with 14+ companies validated the direction and secured leadership alignment.</p>}
              role="Design lead"
              timeline={<span>H2 2025 · 3 months</span>}
              outcome={<><span className="block">Research validated</span><span className="block">Leadership aligned</span></>}
              team={<ul className="list-disc pl-3.5 space-y-1"><li>Me :)</li><li>Content designer</li><li>Product manager</li><li>UX researcher</li><li>Tech lead</li><li>4+ partner teams</li></ul>}
              audience={<span>US Retail, eCommerce, and CPG brands actively investing in search ads on other platforms</span>}
            />
          </div>
        </div>
      </header>

      {/* ─────────────── §1 WHY THIS CONCEPT — AI is reshaping search, and Meta needs to show up ─────────────── */}
      <Section
        id="context"
        number="01"
        kicker="The opportunity"
        title="Every AI company is betting on search. Meta's ad tools aren't ready."
        lede="Search advertising is a $283B category that Meta has barely touched. The audience is already there — the tooling isn't."
        className=""
      >
        {/* Beat 1: Industry push */}
        <Prose>
          <p>
            <strong>The search ads industry is accelerating.</strong>{" "}
            Google offers dedicated search products like search
            themes and negative keywords in Performance Max. OpenAI is testing ads inside
            ChatGPT. TikTok and Amazon are shipping
            search-plus-commerce experiences. Search advertising is
            a <strong>$283B category</strong> — and every major
            platform is racing to capture more of it.
          </p>
        </Prose>

        <figure className="my-10 md:my-12 max-w-xs">
          <span className="caption-label">Reference · A search ad on Google today</span>
          <div className="mt-3 rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
            <img
              src="/primer/real-search-ad.jpg"
              alt="A Google search results page showing sponsored product cards."
              className="w-full h-auto block"
            />
          </div>
          <figcaption className="caption mt-3 max-w-2xl">
            <strong>On Google, advertisers have full control</strong>
            {" "}— they decide what searches trigger their ad, what
            the ad looks like, and how much to spend on each click.
          </figcaption>
        </figure>

        {/* Beat 2: Meta's gap */}
        <Prose>
          <p>
            <strong>Meta has the audience but not the tools.</strong>{" "}
            People search on Facebook and Instagram{" "}
            <strong>tens of billions of times a month</strong> — but
            an advertiser's only search control today is a checkbox
            that turns search ads on or off. There's no way to
            specify which search queries to appear against, and no
            way to exclude the ones they want to avoid.
          </p>
        </Prose>

        <LandscapeChart />

        {/* Beat 3: Meta's investment */}
        <Prose>
          <p>
            <strong>As AI reshapes how people search, Meta is
            investing.</strong> Text-based prompting through Meta AI
            is growing rapidly across Facebook and Instagram. The
            advertising experience needs to keep pace — and that
            starts with giving advertisers the same foundational
            controls that every other search platform already offers.{" "}
            <strong>That is the gap this work set out to close.</strong>
          </p>
        </Prose>
      </Section>

      <div className="container"><div className="rule" /></div>

      {/* ─────────────── §2 HOW WE PICKED THE TWO FEATURES ─────────────── */}
      <Section
        id="starting"
        number="02"
        kicker="Scoping the features"
        title="Sixteen advertiser conversations narrowed a long wishlist down to two."
        lede="Sixteen advertiser conversations narrowed a long wishlist down to two features."
      >
        <Prose>
          <p>
            <strong>Before I joined, the team ran sixteen exploratory
            conversations</strong> with advertisers about what would
            have to be true for them to consider Meta a credible
            search platform and{" "}
            <strong>quickly shift budget from Google and other search
            platforms to Meta.</strong>
          </p>
          <p>
            Aside from ad performance and scale, the features that
            rose to the top sat at the intersection of three filters:
          </p>
        </Prose>
        <div className="my-6 max-w-2xl border border-[var(--rule)] rounded-lg overflow-hidden">
          {[
            { n: "01", text: "Validated by advertiser research as a top need" },
            { n: "02", text: "Aligned with Meta's existing investment in search" },
            { n: "03", text: "Feasible for engineering to build in the timeline" },
          ].map((f, i) => (
            <div key={f.n} className={`flex items-baseline gap-3 px-5 py-3 ${i > 0 ? "border-t border-[var(--rule)]" : ""}`}>
              <span className="font-mono text-[0.75rem] font-medium" style={{ color: "var(--primary)" }}>{f.n}</span>
              <span className="font-display text-[0.95rem] text-[var(--ink)]">{f.text}</span>
            </div>
          ))}
        </div>
        <Prose>
          <p>
            <strong>Search Themes</strong> and <strong>Negative
            Keywords</strong> were the only two features that scored
            on all three.
          </p>
        </Prose>

        <div className="my-10 max-w-4xl grid md:grid-cols-2 gap-5">
          <div className="border border-[var(--rule)] p-6 bg-[var(--tint)] rounded-lg">
            <span className="caption-label text-[var(--primary)]">Feature one</span>
            <h4 className="display-3 mt-2 mb-2 text-xl" style={{ color: "var(--case-accent)" }}>Search Themes</h4>
            <p className="prose-body text-[0.9rem]">
              An advertiser control — suggests to Meta which
              searches should trigger their ads.
            </p>
            <div className="mt-4 rounded-md overflow-hidden border border-[var(--rule)] bg-[var(--paper)] p-3" style={{ fontFamily: '-apple-system, sans-serif' }}>
              <div className="text-[0.6rem] uppercase tracking-[0.1em] text-[var(--mid)] mb-2">Example</div>
              <div className="flex flex-wrap gap-1.5">
                {["best running shoes", "marathon training gear", "trail runners 2025"].map((t) => (
                  <span key={t} className="px-2 py-1 rounded text-[0.7rem] bg-[rgba(244,114,182,0.1)] text-[var(--primary)] border border-[var(--primary)]/20">{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="border border-[var(--rule)] p-6 bg-[var(--tint)] rounded-lg">
            <span className="caption-label text-[#f87171]">Feature two</span>
            <h4 className="display-3 mt-2 mb-2 text-xl" style={{ color: "#f87171" }}>Negative Keywords</h4>
            <p className="prose-body text-[0.9rem]">
              A brand safety control — lets advertisers block
              searches their ad should never appear next to.
            </p>
            <div className="mt-4 rounded-md overflow-hidden border border-[var(--rule)] bg-[var(--paper)] p-3" style={{ fontFamily: '-apple-system, sans-serif' }}>
              <div className="text-[0.6rem] uppercase tracking-[0.1em] text-[var(--mid)] mb-2">Example</div>
              <div className="flex flex-wrap gap-1.5">
                {["violence", "weapons", "counterfeit"].map((t) => (
                  <span key={t} className="px-2 py-1 rounded text-[0.7rem] bg-[rgba(248,113,113,0.1)] text-[#f87171] border border-[#f87171]/20 line-through">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <div className="container"><div className="rule" /></div>

      {/* ─────────────── §3 HOW META ADS MANAGER IS STRUCTURED — neutral primer ─────────────── */}
      <Section
        id="primer"
        number="03"
        kicker="A short primer"
        title="The tool where all of this work lives"
        lede="Here's how Ads Manager is structured and why it matters for this work."
      >
        <Prose>
          <p>
            <strong>Both features were designed inside Ads
            Manager</strong> — the tool millions of advertisers use
            to build and manage ads across Meta's platforms. Ads
            Manager is structured in nested levels. Each level is a
            screen of controls, and <strong>decisions made at a
            higher level apply to everything below it.</strong>
          </p>
          <p>
            Where a new control lives in this hierarchy is itself a
            design decision — <strong>put it too high and advertisers
            lose granularity, put it too low and they repeat the same
            choice on every ad.</strong>
          </p>
        </Prose>

        <HierarchyDiagram />
      </Section>

      <div className="container"><div className="rule" /></div>

      {/* ─────────────── §4 THE STATUS QUO — the entire advertiser experience for search ads today ─────────────── */}
      <Section
        id="problem"
        number="04"
        kicker="The status quo"
        title="The entire advertiser experience for search ads today is one checkbox."
        lede="Here's what an advertiser sees today when setting up search ads on Meta."
      >
        <Prose>
          <p>
            <strong>This project focuses on Meta's Sales
            campaign</strong> — the most common campaign type for
            advertisers driving purchases. Below is what an
            advertiser sees today when configuring search within a
            Sales campaign.
          </p>
        </Prose>

        <StatusQuoSection slides={statusQuoCarousel} />

        <Prose>
          <p>
            <strong>What this means in practice</strong>: an advertiser
            who wants to spend on search inside Meta has no way to tell the system{" "}
            <em>which queries</em> they want their ad considered for, and
            no way to tell it which queries they refuse to appear
            next to. <strong>Both of those decisions are core to how
            every other search advertising platform works.</strong>
          </p>
        </Prose>

        {/* Comparison: Google PMax vs Meta Sales */}
        <div className="my-12 max-w-4xl">
          <span className="caption-label">For comparison · Search ads features</span>
          <h3 className="font-display text-[1.35rem] md:text-[1.5rem] font-medium mt-2 mb-6 text-[var(--ink)] leading-snug">
            What Google gives advertisers for search vs. what Meta
            offers today.
          </h3>
          <div className="grid md:grid-cols-2 gap-0 border border-[var(--rule)] rounded-lg overflow-hidden">
            <div className="p-6 border-b md:border-b-0 md:border-r border-[var(--rule)] bg-[var(--paper)]">
              <div className="caption-label mb-4 text-[var(--mid)]">
                Google Performance Max
              </div>
              <div className="space-y-4">
                <div>
                  <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Search themes</div>
                  <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug mt-0.5">Suggest which searches should trigger your ads</p>
                </div>
                <div>
                  <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Negative keywords</div>
                  <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug mt-0.5">Block unwanted searches — up to 10K per campaign</p>
                </div>
                <div>
                  <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Brand exclusions</div>
                  <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug mt-0.5">Prevent ads from appearing on competitor brand searches</p>
                </div>
                <div>
                  <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Search term reporting</div>
                  <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug mt-0.5">See which searches actually triggered your ads</p>
                </div>
              </div>
              <p className="caption mt-5 text-[var(--mid)]">
                Source: Google Ads Help · Performance Max, 2025.
              </p>
            </div>
            <div className="p-6 bg-[var(--tint)]">
              <div className="caption-label mb-4 text-[var(--mid)]">
                Meta Sales campaign
              </div>
              <div>
                <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Search on/off checkbox</div>
                <p className="font-display text-[0.75rem] text-[var(--mid)] leading-snug mt-0.5">Toggle whether ads appear in search results at all</p>
              </div>
              <p className="caption mt-5 text-[var(--mid)] italic">
                That's the entire search ads experience on Meta today.
              </p>
            </div>
          </div>
        </div>

      </Section>

      <div className="container"><div className="rule" /></div>

      {/* ─────────────── §5 PROCESS (renumbered from §6, with partnership beat folded in) ─────────────── */}
      <Section
        id="process"
        number="05"
        kicker="The iterative process"
        title="Three rounds, fourteen companies"
        lede="Each round answered a different question — narrowing options, then refining, then validating."
      >
        <Prose>
          <p>
            Given the importance of this project, <strong>we secured
            dedicated research investment</strong> to run three
            rounds of concept testing with real advertisers in a
            compressed timeline. For scope and clarity, <strong>this
            section follows the Search Themes journey</strong> —
            Negative Keywords followed its own path to the
            account-level Brand Safety Center.
          </p>
        </Prose>

        {/* ── Round 1 ── */}
        <div className="mt-12 mb-8 max-w-2xl">
          <span className="caption-label">Round 1</span>
          <h3 className="display-3 mt-2">
            Where should these features live?
          </h3>
        </div>

        <Prose>
          <p>
            We explored <strong>four entry points for Search
            Themes</strong> — each chosen by how close the feature
            sits in mental model to the search ads entry point, and
            whether it appears before, within, or after the
            Placements card in the flow.
          </p>
        </Prose>

        {/* Four-entry-point definition grid */}
        <div className="xl:max-w-[calc(100%-17rem)] grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--rule)] border border-[var(--rule)] mt-8 mb-8 rounded-lg overflow-hidden">
          {[
            {
              tag: "Concept A",
              entry: "Standalone card (ad set)",
              def: "A new standalone card on the ad set level dedicated to search. Post-placement.",
            },
            {
              tag: "Concept B",
              entry: "Inside Audience card",
              def: "Nested in the existing Audience card where advertisers set targeting. Pre-placement.",
            },
            {
              tag: "Concept C",
              entry: "Inside Placements card",
              def: "Nested in the existing Placements card where advertisers choose which surfaces ads run on. Intra-placement.",
            },
            {
              tag: "Concept D",
              entry: "Standalone card (ad level)",
              def: "A new standalone card at the ad level, where each individual creative is built. Post-placement.",
            },
          ].map((c) => (
            <div key={c.tag} className="bg-paper p-5">
              <span className="caption-label">{c.tag}</span>
              <div className="font-display font-semibold text-[var(--ink)] mt-1.5 mb-2">
                {c.entry}
              </div>
              <p className="caption text-[var(--mid)] leading-relaxed">
                {c.def}
              </p>
            </div>
          ))}
        </div>

        <Carousel
          slides={r1ConceptSlides}
          label="Round 1 · Four entry points"
          caption=""
          size="wide"
        />

        <div className="my-10 max-w-3xl border border-[var(--rule)] rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-[var(--tint)] border-b border-[var(--rule)]">
            <span className="font-display text-[1rem] font-semibold text-[var(--ink)]">What Round 1 narrowed</span>
          </div>
          <div className="divide-y divide-[var(--rule)]">
            <div className="px-6 py-4 flex gap-4">
              <span className="font-mono text-[1.1rem] text-[#f87171] shrink-0 leading-none mt-0.5">✕</span>
              <div>
                <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Concept A — Standalone card on the ad set</div>
                <p className="font-display text-[0.82rem] text-[var(--mid)] mt-1 leading-snug">Drew the most attention, but too prominent for a new feature competing with established controls.</p>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-4">
              <span className="font-mono text-[1.1rem] text-[#f87171] shrink-0 leading-none mt-0.5">✕</span>
              <div>
                <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Concept B — Within the Audience card</div>
                <p className="font-display text-[0.82rem] text-[var(--mid)] mt-1 leading-snug">Advertisers confused search themes with demographic targeting. Search ads are based on what someone searches, not who they are.</p>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-4">
              <span className="font-mono text-[1.1rem] text-[var(--primary)] shrink-0 leading-none mt-0.5">→</span>
              <div>
                <div className="font-display text-[0.9rem] font-semibold text-[var(--ink)]">Concepts C + D advanced to Round 2</div>
                <p className="font-display text-[0.82rem] text-[var(--mid)] mt-1 leading-snug">These resonated most closely with how advertisers perceive search themes and the use cases to customize this feature.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 mb-6 max-w-3xl border border-[var(--rule)] rounded-lg p-4">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-[var(--mid)]">Also in Round 1</span>
          <p className="font-display text-[0.82rem] text-[var(--ink)] mt-1.5 leading-snug opacity-80">
            Negative Keywords found its home in the account-level Brand Safety Center — advertisers saw it as a one-time list that protects every campaign.
          </p>
        </div>

        {/* ── Round 2 ── */}
        <div className="container my-12"><div className="rule" /></div>

        <div className="mb-8 max-w-2xl">
          <span className="caption-label">Round 2</span>
          <h3 className="display-3 mt-2">
            Ad set or ad level?
          </h3>
        </div>

        <Prose>
          <p>
            Two entry points remained. <strong>Round 2 tested whether
            Search Themes should live at the ad-set level or the ad
            level</strong> — a decision about granularity vs.
            efficiency. At the ad-set level, an advertiser sets
            themes once and every ad beneath inherits them. At the
            ad level, they can tailor themes per creative but have
            to repeat the work for each ad. We built two complete
            flows to compare.
          </p>
        </Prose>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="mb-1">
              <span className="font-display text-[1.1rem] font-bold text-[var(--ink)]">Ad set level</span>
              <p className="font-display text-[0.8rem] text-[var(--mid)] mt-1 leading-snug">Set once, inherited by every ad beneath it.</p>
            </div>
            <div className="[&_figure]:!my-2">
              <Carousel
                slides={r2AltAdsetSlides}
                label=""
                size="default"
              />
            </div>
          </div>
          <div>
            <div className="mb-1">
              <span className="font-display text-[1.1rem] font-bold text-[var(--ink)]">Ad level</span>
              <p className="font-display text-[0.8rem] text-[var(--mid)] mt-1 leading-snug">Attached to each individual ad — re-entered on every ad.</p>
            </div>
            <div className="[&_figure]:!my-2">
              <Carousel
                slides={r2AltAdSlides}
                label=""
                size="default"
              />
            </div>
          </div>
        </div>

        <Aside label="What Round 2 settled">
          <strong>Search Themes belong at the ad-set level.</strong>{" "}
          While some advertisers wanted per-ad granularity, the ad
          level is focused on how ads look — not which searches they
          appear in.
        </Aside>

        {/* ── Round 3 ── */}
        <div className="container my-12"><div className="rule" /></div>

        <div className="mb-8 max-w-2xl">
          <span className="caption-label">Round 3</span>
          <h3 className="display-3 mt-2">
            Usability, guidance, and partner alignment
          </h3>
        </div>

        <Prose>
          <p>
            <strong>With the entry point decided</strong>, Round 3
            shifted to refinement. We focused on <strong>whether
            advertisers could complete
            the flow without confusion</strong> — refining the
            guidance copy around "themes" terminology, and finalizing
            alignment with partner teams to ensure the design could
            land safely when shifting to implementation.
          </p>
        </Prose>

      </Section>

      <div className="container"><div className="rule" /></div>

      {/* ─────────────── §6 FINAL DESIGN ─────────────── */}
      <Section
        id="design"
        number="06"
        kicker="Where it landed"
        title="The final design."
        lede="Signed off by design and product leads across the Ads organisation, with aligned specs handed to four partner teams."
      >

        {/* Stat strip */}
        <div className="my-6 max-w-3xl border border-[var(--rule)] bg-[var(--paper)] rounded-lg overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-[var(--rule)] md:divide-y-0 md:divide-x">
            {[
              { num: "3", label: "research rounds" },
              { num: "14+", label: "advertiser accounts" },
              { num: "4", label: "partner-team surfaces" },
            ].map((s) => (
              <div key={s.label} className="p-4">
                <div className="font-display font-medium text-[var(--ink)] text-[1.4rem] leading-none">
                  {s.num}
                </div>
                <div className="caption-label mt-1.5 text-[var(--mid)]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Prose>
          <p>
            <strong>What started as a single checkbox evolved into a full search ads toolkit</strong> — two new advertiser controls designed to feel native within Ads Manager from day one. Three rounds of research with 14+ companies validated the direction, and the final system was signed off by design and product leads across four partner teams.
          </p>
        </Prose>

        <Carousel
          slides={finalDesignSlides}
          label="Final design walkthrough"
          caption=""
          size="wide"
        />

        {/* Entry points + specs */}
        <div className="my-6 xl:max-w-[calc(100%-17rem)]">
          <span className="caption-label mb-3 block">Entry points & specs</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)] rounded-lg overflow-hidden">
            <div className="bg-[var(--paper)] p-5">
              <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[var(--primary)]">Feature 01</span>
              <div className="font-display text-[1rem] font-bold text-[var(--ink)] mt-1 mb-3">Search Themes</div>
              <div className="space-y-1.5 text-[0.92rem]">
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Lives on</span><span className="text-[var(--mid)]">Placements card</span></div>
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Level</span><span className="text-[var(--mid)]">Ad set — one set per ad set</span></div>
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Cap</span><span className="text-[var(--mid)]">25 per ad set</span></div>
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Scope</span><span className="text-[var(--mid)]">When search results are on</span></div>
              </div>
            </div>
            <div className="bg-[var(--paper)] p-5">
              <span className="font-mono text-[0.6rem] tracking-[0.12em] uppercase text-[#f87171]">Feature 02</span>
              <div className="font-display text-[1rem] font-bold text-[var(--ink)] mt-1 mb-3">Negative Keywords</div>
              <div className="space-y-1.5 text-[0.92rem]">
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Lives on</span><span className="text-[var(--mid)]">Brand Safety Center</span></div>
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Level</span><span className="text-[var(--mid)]">Account — one list for all campaigns</span></div>
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Cap</span><span className="text-[var(--mid)]">Up to 10,000 per account</span></div>
                <div className="flex gap-2"><span className="font-semibold text-[var(--ink)] min-w-[5.5rem] shrink-0">Scope</span><span className="text-[var(--mid)]">All campaigns in the account</span></div>
              </div>
            </div>
          </div>
        </div>

      </Section>

      <div className="container"><div className="rule" /></div>

      {/* ─────────────── §7 WHERE THIS GOES NEXT ─────────────── */}
      <Section
        id="next"
        number="07"
        kicker="Where this goes next"
        title="From text queries to ads on AI"
        lede="Search on Meta is shifting from keyword results to AI-generated answers — and these controls are the infrastructure that makes ads work in that new world."
      >
        <Prose>
          <p>
            <strong>As Meta AI moves into search across Meta's family of apps, the way people discover products is fundamentally changing.</strong> Conversational results, AI summaries, and visual search are replacing traditional result pages — and each introduces new surfaces where ads need to appear naturally.
          </p>
          <p>
            The controls designed in this project — Search Themes and Negative Keywords — <strong>become the building blocks for that next generation of ad experiences.</strong> The targeting logic, the placement architecture, and the brand safety framework all extend directly into what comes next. Three open design questions define the next phase:
          </p>
        </Prose>

        {/* What this work opens up — across Meta's family of apps */}
        <div className="my-10 xl:max-w-[calc(100%-17rem)]">
          <span className="caption-label mb-6 block">What this work opens up · Across Meta's family of apps</span>

          <div className="flex flex-col md:flex-row gap-0 items-stretch">
            {/* Center visualization — Meta AI hub */}
            <div className="shrink-0 w-[260px] flex flex-col items-center justify-center relative py-6" style={{ background: "rgba(244,114,182,0.04)", borderRadius: "16px 0 0 16px", border: "1px solid rgba(244,114,182,0.1)", borderRight: "none" }}>
              {/* Meta AI logo */}
              {/* Meta AI logo */}
              <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 shadow-[0_4px_24px_rgba(0,132,255,0.3)]">
                <img src="/primer/Meta_AI_logo.png" alt="Meta AI" className="w-full h-full object-cover" />
              </div>
              <div className="font-display text-[1.1rem] font-bold text-[var(--ink)] mb-1">Meta AI</div>
              <div className="text-[0.75rem] text-[var(--mid)] text-center px-4 mb-5">Search ads powered by AI across Meta's family of apps</div>

              {/* App icons — clustered */}
              <div className="relative w-[140px] h-[50px]">
                <div className="absolute w-8 h-8 rounded-lg overflow-hidden shadow-lg" style={{ top: 2, left: 0, transform: "rotate(-6deg)" }}>
                  <img src="/primer/Facebook_f_logo_(2021).svg" alt="Facebook" className="w-full h-full object-cover" />
                </div>
                <div className="absolute w-8 h-8 rounded-lg overflow-hidden shadow-lg" style={{ top: 8, left: 24, transform: "rotate(3deg)", zIndex: 2 }}>
                  <img src="/primer/Instagram_logo_2022.svg" alt="Instagram" className="w-full h-full object-cover" />
                </div>
                <div className="absolute w-8 h-8 rounded-lg overflow-hidden shadow-lg" style={{ top: 0, left: 52, transform: "rotate(-2deg)", zIndex: 1 }}>
                  <img src="/primer/whatsapp-logo-green-background-vector-logo-icon_593183-658.avif" alt="WhatsApp" className="w-full h-full object-cover" />
                </div>
                <div className="absolute w-8 h-8 rounded-lg overflow-hidden shadow-lg" style={{ top: 10, left: 76, transform: "rotate(5deg)", zIndex: 3 }}>
                  <img src="/primer/Facebook_Messenger_logo_2020.svg" alt="Messenger" className="w-full h-full object-cover" />
                </div>
                <div className="absolute w-7 h-7 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center" style={{ top: 4, left: 106, transform: "rotate(-4deg)", zIndex: 2 }}>
                  <img src="/primer/Threads_(app)_logo.svg" alt="Threads" className="w-4 h-4 object-contain" />
                </div>
              </div>
            </div>

            {/* Connection + cards */}
            <div className="flex-1 flex flex-col gap-2">
              {[
                { num: "01", head: "AI placements", body: "Advertising opportunities expand into conversational results, AI summaries, and in-chat recommendations across every Meta app." },
                { num: "02", head: "Native ad formats", body: "New opportunities for ads that live within AI-composed responses — blending into the experience, not sitting beside it." },
                { num: "03", head: "Visual search", body: "As people search with images and camera input, advertising opportunities extend into entirely new modalities." },
              ].map((d, i) => (
                <div key={d.num} className="flex-1 flex items-center" style={{ borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.04)" : undefined }}>
                  {/* Connection line */}
                  <div className="w-8 shrink-0 flex items-center justify-center relative">
                    <div className="w-full h-px" style={{ background: "rgba(244,114,182,0.2)" }} />
                    <div className="absolute w-2 h-2 rounded-full" style={{ background: "rgba(244,114,182,0.4)", boxShadow: "0 0 8px rgba(244,114,182,0.3)" }} />
                  </div>
                  {/* Card */}
                  <div className="flex-1 px-5 py-4 rounded-r-lg backdrop-blur-sm" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderLeft: "2px solid rgba(244,114,182,0.2)", marginLeft: -1 }}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-mono text-[0.6rem] text-[var(--mid)] opacity-50">{d.num}</span>
                      <h4 className="font-display font-semibold text-[var(--ink)] text-[1rem]">{d.head}</h4>
                    </div>
                    <p className="text-[0.88rem] leading-[1.4] text-[var(--mid)]">{d.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div className="pb-20" />
    </div>
  );
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string | ReadonlyArray<string>;
}) {
  return (
    <div className="min-w-0">
      <dt className="caption-label mb-1.5 text-[var(--mid)]">{label}</dt>
      {Array.isArray(value) ? (
        <dd>
          <ul className="font-display text-[0.92rem] md:text-[0.95rem] font-medium text-[var(--ink)] leading-snug space-y-1 list-disc pl-4 marker:text-[var(--mid)]">
            {value.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </dd>
      ) : (
        <dd className="font-display text-[0.92rem] md:text-[0.95rem] font-medium text-[var(--ink)] leading-snug">
          {value}
        </dd>
      )}
    </div>
  );
}


