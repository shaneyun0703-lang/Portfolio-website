/**
 * RoundEvolution — three-round summary with sections, concise text.
 */

const rounds = [
  {
    id: "01",
    question: "Where should it live?",
    n: "5 companies",
    tested: "Four entry points for Search Themes — each at a different position in the flow.",
    learned: [
      "Standalone card — too prominent",
      "Audience card — confused with targeting",
      "Placements + ad level advanced",
    ],
    open: "Two candidates remaining for Round 2.",
  },
  {
    id: "02",
    question: "Ad set or ad level?",
    n: "4 companies",
    tested: "Both surviving entry points — advertisers walked each flow back-to-back.",
    learned: [
      "Ad set level won — set once, inherited",
      "Ad level too repetitive for everyday use",
    ],
    open: "Entry point decided. Finalize all design details before Round 3.",
  },
  {
    id: "03",
    question: "Does it work?",
    n: "5 companies",
    tested: "The settled flow with copy variants — different labels, helper text, and examples.",
    learned: [
      "Flow completable without confusion",
      "Tighter labels resolved terminology issues",
      "Aligned with 4 partner teams",
    ],
    open: "Design ready for engineering handoff.",
  },
];

export function RoundEvolution() {
  return (
    <div className="max-w-4xl my-10">
      <div className="grid md:grid-cols-3 gap-px bg-[var(--rule)] border border-[var(--rule)] rounded-lg overflow-hidden">
        {rounds.map((r) => (
          <div key={r.id} className="bg-paper p-5 md:p-6 flex flex-col">
            <div className="flex items-baseline justify-between mb-2">
              <span className="font-mono text-[10px] tracking-[0.15em] text-[var(--primary)] uppercase">
                Round {r.id}
              </span>
              <span className="font-mono text-[10px] text-[var(--mid)]">
                {r.n}
              </span>
            </div>

            <h4 className="font-display font-semibold text-[1rem] text-[var(--ink)] leading-snug mb-3">
              {r.question}
            </h4>

            <div className="h-px bg-[var(--rule)] mb-3" />

            <div className="caption-label mb-1">Tested</div>
            <p className="font-display text-[0.8rem] text-[var(--mid)] leading-snug mb-3">
              {r.tested}
            </p>

            <div className="caption-label mb-1">Learned</div>
            <ul className="space-y-1 mb-3">
              {r.learned.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[var(--primary)] mt-0.5 text-[0.55rem]">•</span>
                  <span className="font-display text-[0.8rem] text-[var(--ink)] leading-snug">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-3 border-t border-[var(--rule)]">
              <div className="caption-label mb-1">What's next</div>
              <p className="font-display text-[0.8rem] text-[var(--primary)] font-medium leading-snug">
                {r.open}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
