import { useEffect, useRef, useState } from "react";

type Partner = {
  team: string;
  surface: string;
  needed: string;
  detail: string;
};

const partners: Partner[] = [
  {
    team: "Targeting",
    surface: "Audience card · ad set",
    needed:
      "Confirm Search Themes was not a duplicate or competing form of audience targeting.",
    detail:
      "Audiences are inferred user attributes; Search Themes are placement-specific signals tied to query intent. Different conceptual buckets — but only the Targeting team could confirm that, so every Round 1 stimulus had to clear their interpretation first.",
  },
  {
    team: "Brand Safety & Suitability",
    surface: "Brand safety card · ad set, plus the account-wide Brand Safety Center",
    needed:
      "Co-design where Negative Keywords lived for read access vs editing at scale.",
    detail:
      "Splitting the experience required their card to host a read-only mirror inside the ad set, while the editing surface lived in the global Brand Safety Center where their other safety controls already live. Two separate teams, one shared concept.",
  },
  {
    team: "Placements",
    surface: "Placements card · ad set",
    needed:
      "Carve out a net-new sub-section inside their card that the search work could own.",
    detail:
      "Their card was about to be redesigned. We co-designed a new Placement-specific tools section that any placement (Search, Reels, in-stream) could plug into in the future. Search Themes became the first feature to use it.",
  },
  {
    team: "Facebook Search",
    surface: "Consumer search results on Facebook",
    needed:
      "Alignment on what advertisers could and couldn't influence about how an ad appeared in their results.",
    detail:
      "The ads we were giving advertisers more control over rendered on a surface this team owned end to end. Every theme limit, every helper-text choice, had to fit how their team thought about the consumer experience.",
  },
  {
    team: "Instagram Search",
    surface: "Consumer search results on Instagram",
    needed:
      "Same as above — but with a different consumer mental model and a different research baseline.",
    detail:
      "Search on Instagram behaves and is used differently than search on Facebook. Two separate consumer-side teams meant two parallel alignment threads, not one.",
  },
  {
    team: "Information Architecture",
    surface: "Cross-card navigation patterns in Meta Ads Manager",
    needed:
      "Sign-off on adding a new sub-section pattern inside a card without inflating the surface globally.",
    detail:
      "Anything that touched card-level architecture had to be reviewed by the IA team to make sure we weren't setting precedent that other teams couldn't honour.",
  },
  {
    team: "Research",
    surface: "Cross-team UXR roadmap",
    needed:
      "Slot three rounds of moderated research into a shared roadmap, alongside other Core Ads workstreams.",
    detail:
      "Our researcher and I co-scoped each round with the broader UXR org so that participant pools, segments, and stimuli didn't conflict with parallel studies.",
  },
];

export function PartnerTeamsDiagram() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setRevealed(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${revealed ? "in" : ""} max-w-5xl mx-auto my-12`}
    >
      {/* Center node + ring of partner teams */}
      <div className="border border-[var(--rule)] bg-paper p-6 md:p-8">
        {/* Center node */}
        <div className="text-center mb-6 md:mb-8">
          <span className="caption-label">The concept</span>
          <h4 className="font-display font-semibold text-lg md:text-xl text-[var(--ink)] mt-1.5 leading-tight">
            Search Themes + Negative Keywords on the ad set
          </h4>
          <p className="caption text-[var(--mid)] mt-2 max-w-md mx-auto leading-snug">
            Two new controls. Seven partner teams whose surfaces, components,
            or research roadmaps the work had to fit through.
          </p>
        </div>

        {/* Connector rule */}
        <div className="flex justify-center mb-6">
          <div className="w-px h-6 bg-[var(--rule)]" />
        </div>

        {/* Partner-team grid — each item is a click-to-expand button */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)]">
          {partners.map((p, i) => {
            const isOpen = openIdx === i;
            return (
              <button
                key={p.team}
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className={`text-left bg-paper p-4 md:p-5 transition-colors ${
                  isOpen
                    ? "ring-1 ring-inset ring-[var(--primary)]"
                    : "hover:bg-[var(--paper-tint)]"
                }`}
                aria-expanded={isOpen}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <span className="font-display font-semibold text-[0.95rem] text-[var(--ink)]">
                    {p.team}
                  </span>
                  <span
                    className={`font-mono text-[10px] tracking-widest text-[var(--mid)] transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </div>
                <span className="caption text-[var(--mid)] block leading-snug mb-2">
                  {p.surface}
                </span>
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-[var(--rule)] space-y-2.5">
                    <div>
                      <div className="caption-label mb-0.5">What we needed</div>
                      <p className="font-serif text-[0.9rem] text-[var(--ink)] leading-snug">
                        {p.needed}
                      </p>
                    </div>
                    <div>
                      <div className="caption-label mb-0.5">In practice</div>
                      <p className="caption text-[var(--mid)] leading-relaxed">
                        {p.detail}
                      </p>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Helper text below */}
        <p className="caption text-[var(--mid)] text-center mt-5 leading-snug">
          Click any team to expand what they owned and what we needed from
          them.
        </p>
      </div>
    </div>
  );
}
