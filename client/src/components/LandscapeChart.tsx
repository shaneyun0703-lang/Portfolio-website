import { useEffect, useRef, useState } from "react";

/**
 * LandscapeChart — a small editorial visual for §01.
 *
 * No Meta-internal forecast data. All numbers are publicly sourced:
 *   • Search advertising = the largest single category of digital advertising,
 *     ~$102.9B in the US in 2024, ~40% of the US digital ad market.
 *     Source: IAB / PwC Internet Advertising Revenue Report, full year 2024.
 *   • Google holds the majority of global search.
 *     Source: Statista, Jan 2025 — ~80% global, ~93% on mobile.
 *   • OpenAI began testing ads inside ChatGPT in late 2025; rolled out an
 *     AI-native browser (Atlas) in October 2025.
 *
 * The visual is intentionally simple: two bars (Google vs. everyone else)
 * over a small set of contextual data points.
 */
export function LandscapeChart() {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
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
    <figure
      ref={ref}
      className={`reveal ${revealed ? "in" : ""} my-12 max-w-4xl`}
    >
      <div className="border border-[var(--rule)] bg-[var(--paper)] p-6 md:p-8">
        <div className="caption-label mb-2 text-[var(--mid)]">
          The search-advertising landscape today
        </div>
        <h3 className="font-display text-[1.35rem] md:text-[1.5rem] font-medium text-[var(--ink)] leading-snug max-w-2xl">
          Search is the single largest category of digital advertising —
          and one company has been collecting almost all of it.
        </h3>

        <div className="mt-8 grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-end">
          {/* The two-bar comparison */}
          <div>
            <div className="space-y-5">
              <BarRow
                label="Google"
                share={80}
                note="~80% of global search; ~93% on mobile"
              />
              <BarRow
                label="Everyone else"
                share={20}
                muted
                note="Bing, Amazon, TikTok, ChatGPT, Perplexity — combined"
              />
            </div>
            <p className="caption mt-5 text-[var(--mid)] leading-snug">
              Sources: IAB / PwC Internet Advertising Revenue Report 2024;
              Statista, January 2025.
            </p>
          </div>

          {/* The headline stat panel */}
          <div className="md:border-l md:border-[var(--rule)] md:pl-10 min-w-[14rem]">
            <div className="font-display text-[2.4rem] md:text-[2.85rem] font-medium text-[var(--ink)] leading-none tracking-tight">
              ~40%
            </div>
            <p className="font-serif text-[0.95rem] leading-[1.55] text-[var(--ink)] mt-3 max-w-[16rem]">
              Search advertising&apos;s share of the entire US digital ad
              market in 2024. Bigger than display, video and social
              individually.
            </p>
            <div className="caption mt-3 text-[var(--mid)]">
              IAB / PwC, 2024
            </div>
          </div>
        </div>
      </div>

      <figcaption className="caption mt-3 text-[var(--mid)] max-w-3xl">
        Public data only. Internal Meta forecasts and verticals are
        intentionally omitted on this public page.
      </figcaption>
    </figure>
  );
}

function BarRow({
  label,
  share,
  note,
  muted,
}: {
  label: string;
  share: number;
  note: string;
  muted?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="caption-label text-[var(--ink)]">{label}</span>
        <span className="font-mono text-xs text-[var(--mid)]">~{share}%</span>
      </div>
      <div className="relative h-3 w-full bg-[var(--tint)] overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 transition-[width] duration-700 ease-out ${
            muted ? "bg-[var(--mid)]/30" : "bg-[var(--primary)]"
          }`}
          style={{ width: `${share}%` }}
        />
      </div>
      <p className="caption mt-1.5 text-[var(--mid)] leading-snug">{note}</p>
    </div>
  );
}
