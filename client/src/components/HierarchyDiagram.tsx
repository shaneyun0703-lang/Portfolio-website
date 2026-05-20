import { useState } from "react";

/**
 * Meta Ads Manager structure explainer — chip-based rows with
 * expandable screenshots, matching the WhatsApp case study style.
 */
export function HierarchyDiagram() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const levels = [
    {
      n: "04",
      name: "Account",
      sub: "Global settings for the entire business.",
      cards: ["Brand safety", "Billing", "Domain verification"],
      highlight: false,
      screenshot: "/primer/account-level.png",
      screenshotAlt: "The Account level — where advertisers configure global settings.",
    },
    {
      n: "03",
      name: "Campaign",
      sub: "The objective for a chunk of spend.",
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
      sub: "Who sees the ad and where it appears.",
      cards: ["Conversions", "Audience", "Placements", "Budget & schedule"],
      highlight: false,
      screenshot: "/primer/adset.png",
      screenshotAlt: "The Ad set screen — audience, placements, budget, and conversion controls.",
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
    <div className="my-10 md:my-12">
      <span className="caption-label">Reference · The shape of an ad inside Ads Manager</span>
      <div className="mt-4 max-w-3xl">
        {levels.map((lv, i) => {
          const isOpen = expanded === lv.n;
          return (
            <div key={lv.n} className="relative">
              <button
                type="button"
                onClick={() => lv.screenshot ? setExpanded(isOpen ? null : lv.n) : undefined}
                className="w-full text-left flex items-stretch border border-[var(--rule)] overflow-hidden transition-colors"
                style={{
                  background: lv.highlight
                    ? "var(--case-accent-soft)"
                    : "var(--paper)",
                  borderLeft: lv.highlight
                    ? "3px solid var(--case-accent)"
                    : "1px solid var(--rule)",
                  cursor: lv.screenshot ? "pointer" : "default",
                }}
              >
                <div className="px-5 py-4 flex flex-col justify-center min-w-[140px] border-r border-[var(--rule)]">
                  <span
                    className="font-mono text-[0.65rem]"
                    style={{ color: "var(--primary)" }}
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
                {lv.screenshot && (
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
                )}
              </button>
              {isOpen && lv.screenshot && (
                <div className="border border-t-0 border-[var(--rule)] bg-[var(--paper)] p-4 space-y-4">
                  <div>
                    <img
                      src={lv.screenshot}
                      alt={lv.screenshotAlt || ""}
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
        Every Meta ad is built in nested levels. Each level contains
        one or more screens of controls. Anything decided at one
        level applies to every level below it — click any row to see
        the real interface.
      </figcaption>
    </div>
  );
}
