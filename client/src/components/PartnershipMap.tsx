import { useEffect, useRef, useState } from "react";

type Partner = {
  team: string;
  surface: string;
  myAsk: string;
  status: "Aligned, no overlap" | "Co-design" | "Partner-led, I consulted" | "Component alignment";
  detail: string;
};

const partners: Partner[] = [
  {
    team: "Targeting",
    surface: "Audience card (ad set)",
    myAsk:
      "Confirm that Search Themes were not a duplicate or competing form of audience targeting.",
    status: "Aligned, no overlap",
    detail:
      "Their POV: Audiences are inferred user attributes; Search Themes are placement-specific signals tied to query intent. They sit in different conceptual buckets. We aligned that Search Themes would not interfere with the Audience product roadmap.",
  },
  {
    team: "Brand Safety & Suitability",
    surface: "Brand Safety card (ad set) · Brand Safety Center (account)",
    myAsk:
      "Co-design where Negative Keywords lived for read access (in-flow) versus where they could be edited at scale (account-wide).",
    status: "Co-design",
    detail:
      "We split the Negative Keywords experience. A read-only mirror inside the Brand Safety card at the ad set, so advertisers could see what was applied without leaving setup. The editing surface lives in the global Brand Safety Center, where their other safety controls already live.",
  },
  {
    team: "Placements",
    surface: "Placements card (ad set)",
    myAsk:
      "Carve out a net-new “Placement-specific tools” section inside their card that I could own.",
    status: "Co-design",
    detail:
      "Their Placements card was about to be redesigned. I partnered with their PD to introduce a new sub-section concept that any placement (Search, Reels, in-stream) could plug into in the future. Search Themes became the first feature to use it.",
  },
  {
    team: "Geodesic (Design System)",
    surface: "Component library",
    myAsk:
      "Validate that the Search Themes input pattern, chip behaviour, and limits indicators met system standards.",
    status: "Component alignment",
    detail:
      "Two office-hours sessions to align on the input chip component, the empty-state pattern, and the count-meter (e.g. “12 of 50 themes”). Outcome: no new components needed; we composed existing ones.",
  },
];

export function PartnershipMap() {
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
    <div ref={ref} className={`reveal ${revealed ? "in" : ""} max-w-5xl mx-auto my-16 md:my-24`}>
      <div className="grid md:grid-cols-2 gap-px bg-[var(--rule)] border border-[var(--rule)]">
        {partners.map((p, i) => (
          <div
            key={p.team}
            className="bg-paper p-6 md:p-8"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="flex items-baseline justify-between mb-4 gap-3">
              <span className="font-display font-semibold text-lg text-[var(--ink)]">
                {p.team}
              </span>
              <span className="font-mono text-[0.7rem] text-[var(--mid)] tracking-wide whitespace-nowrap">
                0{i + 1} / 04
              </span>
            </div>
            <div className="caption-label">Their surface</div>
            <div className="font-display text-sm text-[var(--ink)] mt-1 mb-4">
              {p.surface}
            </div>
            <div className="caption-label">My ask</div>
            <div className="font-serif text-base text-[var(--ink)] mt-1 mb-4 leading-relaxed">
              {p.myAsk}
            </div>
            <div className="caption-label">Outcome</div>
            <div className="font-display text-sm font-medium text-[var(--primary)] mt-1 mb-3">
              {p.status}
            </div>
            <div className="caption text-[var(--mid)] leading-relaxed">
              {p.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
