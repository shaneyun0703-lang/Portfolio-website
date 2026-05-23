import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

type CaseStudyCard = {
  href: string;
  org: string;
  title: string;
  lede: string;
  role: string;
  timeline: string;
  outcome: string;
  badge2?: string;
  accent: string;
  accentRgb: string;
  heroSrc: string;
  heroAlt: string;
  index: number;
};

type CardStyle = "balanced";

const casesData = [
  {
    href: "/commerce-ads",
    org: "Meta · Commerce Ads",
    title: "Unifying Meta's split eCommerce ad builder",
    lede: "Unifying how eCommerce advertisers build ads on Meta",
    role: "Design Lead", timeline: "H1 2026",
    outcome: "Scaled alpha (100K brands)",
    accent: "#0ee9d6", accentRgb: "14,233,214",
    heroSrc: "/primer/commerce-hero.png", heroAlt: "Unified ad creation flow",
  },
  {
    href: "/whatsapp",
    org: "Meta · WhatsApp Ads",
    title: "Taking WhatsApp ads from launch to scale",
    lede: "Making WhatsApp ads available to nearly every advertiser",
    role: "Design Lead", timeline: "H2 2025",
    outcome: "Shipped globally",
    accent: "#1eff8a", accentRgb: "30,255,138",
    heroSrc: "/primer/sales-06-ad-creative.png", heroAlt: "WhatsApp Status ad creative",
  },
  {
    href: "/search-ads",
    org: "Meta · Search Ads",
    title: "Making Meta a real search ads player",
    lede: "Meta's first tools for search-driven advertising",
    role: "Design Lead", timeline: "H2 2025",
    outcome: "Design milestone aligned", badge2: "Research complete",
    accent: "#a3baff", accentRgb: "110,142,255",
    heroSrc: "/primer/final-2.png", heroAlt: "Search Themes final design",
  },
];

const cases: CaseStudyCard[] = casesData.map((c, i) => ({ ...c, index: i }));

const OFFSETS = [0, 28, 12];
const ROTS = [-1.5, 0.8, -0.5];

function GlassLaptop({ src, alt, accent, scale = 1 }: { src: string; alt: string; accent: string; scale?: number }) {
  const w = `${85 * scale}%`;
  return (
    <div className="mx-auto flex flex-col items-center group-hover:scale-[1.02] transition-transform duration-500" style={{ width: w }}>
      <div className="w-full rounded-t-[10px] p-[4px] overflow-hidden backdrop-blur-sm"
        style={{ background: `linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04), ${accent}18)`, border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none" }}>
        <div className="rounded-t-[7px] overflow-hidden bg-black/40">
          <div className="flex items-center gap-[4px] px-2 py-[4px]" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="w-[5px] h-[5px] rounded-full" style={{ background: `${accent}55` }} />
            <div className="w-[5px] h-[5px] rounded-full bg-white/10" />
            <div className="w-[5px] h-[5px] rounded-full bg-white/10" />
          </div>
          <img src={src} alt={alt} className="w-full h-auto block" loading="lazy" />
        </div>
      </div>
      <div className="w-[106%] h-[5px] rounded-[3px]"
        style={{ background: `linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.1), ${accent}20, rgba(255,255,255,0.1), rgba(255,255,255,0.03))`, borderTop: "1px solid rgba(255,255,255,0.08)" }} />
      <div className="w-[70%] h-[2px] rounded-full opacity-50 mt-[1px]"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
    </div>
  );
}

function Tags({ c }: { c: CaseStudyCard }) {
  return (
    <div className="absolute top-3 right-3 z-20 flex gap-1.5 items-center flex-wrap justify-end">
      {c.badge2 && (
        <span className="font-mono text-[10px] tracking-[0.03em] uppercase px-2.5 py-1 rounded-full backdrop-blur-md"
          style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.7)" }}>
          {c.badge2}
        </span>
      )}
      <span className="font-mono text-[10px] tracking-[0.03em] uppercase px-2.5 py-1 rounded-full backdrop-blur-md"
        style={{ border: `1px solid rgba(${c.accentRgb},0.3)`, background: `rgba(${c.accentRgb},0.1)`, color: `rgba(${c.accentRgb},0.95)` }}>
        {c.outcome}
      </span>
    </div>
  );
}

function CardBalanced({ c }: { c: CaseStudyCard }) {
  return (
    <Link href={c.href}
      className="group flex-1 min-w-0 flex flex-col rounded-xl overflow-hidden transition-all duration-500 ease-out hover:!rotate-0 hover:!translate-y-[-6px]"
      style={{ marginTop: OFFSETS[c.index], transform: `rotate(${ROTS[c.index]}deg)`, background: "rgba(255,255,255,0.03)", border: `1px solid rgba(${c.accentRgb},0.12)`, boxShadow: `0 4px 28px rgba(0,0,0,0.35), 0 0 20px rgba(${c.accentRgb},0.04)` }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.5), 0 0 50px rgba(${c.accentRgb},0.1)`; el.style.borderColor = `rgba(${c.accentRgb},0.28)`; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = `0 4px 28px rgba(0,0,0,0.35), 0 0 20px rgba(${c.accentRgb},0.04)`; el.style.borderColor = `rgba(${c.accentRgb},0.12)`; }}>
      <div className="h-[220px] xl:h-[300px] 2xl:h-[380px] relative overflow-hidden flex items-center justify-center"
        style={{ background: `linear-gradient(180deg, rgba(${c.accentRgb},0.28) 0%, rgba(${c.accentRgb},0.04) 100%)` }}>
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[130%] h-[85%] opacity-[0.28]"
          style={{ background: `radial-gradient(ellipse, rgba(${c.accentRgb},1) 0%, transparent 60%)`, filter: "blur(36px)" }} />
        <Tags c={c} />
        <span className="absolute top-3 left-4 z-20 font-mono text-[11px] text-white/20 tracking-[0.04em]">{String(c.index + 1).padStart(2, "0")}</span>
        <div className="relative z-10 pt-14 pb-3 w-full px-3"><GlassLaptop src={c.heroSrc} alt={c.heroAlt} accent={c.accent} /></div>
      </div>
      <div className="shrink-0 px-4 py-3.5" style={{ borderTop: `1px solid rgba(${c.accentRgb},0.2)`, background: `rgba(${c.accentRgb},0.03)` }}>
        <p className="font-mono text-[10px] tracking-[0.06em] uppercase mb-1.5" style={{ color: `rgba(${c.accentRgb},0.8)` }}>{c.org}</p>
        <h2 className="font-display text-[1.05rem] font-bold leading-[1.2] tracking-[-0.015em] text-white/95">{c.title}</h2>
      </div>
    </Link>
  );
}

function Background() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-[30%] -right-[15%] w-[900px] h-[900px] rounded-full opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #f5c842 0%, transparent 70%)" }} />
      <div className="absolute -bottom-[25%] -left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, #6e8eff 0%, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, var(--paper) 75%)" }} />
    </div>
  );
}

function EmailButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText("shane.yun0703@gmail.com"); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="group/link flex items-center gap-2.5 w-fit cursor-pointer">
      <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#333] bg-[#1a1a1a] group-hover/link:border-[#555] group-hover/link:bg-[#222] transition-all duration-200">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:stroke-white transition-colors duration-200"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
      </span>
      <span className={`font-display text-[15px] font-medium transition-colors duration-200 ${copied ? "text-white" : "text-[#ccc] group-hover/link:text-white"}`}>
        {copied ? "Copied!" : "Email"}
      </span>
    </button>
  );
}

const HERO_PRE = "Empowering advertisers to build ";
const HERO_HL = "ads that perform";
const HERO_FULL = HERO_PRE + HERO_HL;
const H1_CLASS = "font-display text-[clamp(2.2rem,3.8vw,3.8rem)] font-bold leading-[1.35] tracking-[-0.04em] text-[var(--ink)]";

type Phase = "typing" | "highlighting" | "settling" | "done";

export default function Landing() {
  const alreadySeen = typeof window !== "undefined" && !!sessionStorage.getItem("intro-seen");
  const [phase, setPhase] = useState<Phase>(alreadySeen ? "done" : "typing");
  const [typed, setTyped]   = useState(alreadySeen ? HERO_FULL : "");
  const [showCursor, setShowCursor] = useState(!alreadySeen);

  useEffect(() => {
    if (alreadySeen) return;
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(HERO_FULL.slice(0, i));
      if (i === HERO_FULL.length) {
        clearInterval(id);
        // cursor lingers, then fades
        setTimeout(() => setShowCursor(false), 400);
        // switch to highlight phase (text snaps to 2-line + selection sweep begins)
        setTimeout(() => setPhase("highlighting"), 600);
        // text slides up into position
        setTimeout(() => setPhase("settling"), 600 + 1600);
        // layout complete
        setTimeout(() => {
          sessionStorage.setItem("intro-seen", "1");
          setPhase("done");
        }, 600 + 1600 + 700);
      }
    }, 62);
    return () => clearInterval(id);
  }, []);

  // shared horizontal padding to keep intro text aligned with final h1
  const hPad = "px-6 lg:pl-6 lg:pr-7";

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden relative" style={{ background: "var(--paper)" }}>
      <Background />

      <div className="lg:flex lg:h-screen lg:overflow-hidden">

        {/* ── SIDEBAR — always present ── */}
        <aside className="lg:w-[220px] xl:w-[260px] 2xl:w-[280px] shrink-0 lg:h-full flex flex-col justify-between p-6 pt-10 lg:p-5 lg:pt-10 xl:p-6 xl:pt-14 2xl:p-8 2xl:pt-20 relative z-10">
          <div>
            <span className="font-display text-[2rem] font-extrabold leading-none tracking-[-0.02em] text-[var(--ink)]">Shane Yun</span>
            <div className="mt-4 flex flex-col gap-1">
              <span className="font-display text-[1rem] font-semibold text-[var(--ink)] leading-tight">Product Designer</span>
              <span className="font-mono text-[11px] text-[var(--mid)] tracking-[0.06em] uppercase">Meta · Bay Area</span>
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <EmailButton />
              <a href="https://www.linkedin.com/in/shane-yun" target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2.5 w-fit">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#333] bg-[#1a1a1a] group-hover/link:border-[#555] group-hover/link:bg-[#222] transition-all duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#999" className="group-hover/link:fill-white transition-colors duration-200"><path d="M20.47 2H3.53A1.45 1.45 0 0 0 2 3.38v17.24A1.45 1.45 0 0 0 3.53 22h16.94A1.45 1.45 0 0 0 22 20.62V3.38A1.45 1.45 0 0 0 20.47 2ZM8.09 18.74h-3v-9h3ZM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12ZM18.91 18.74h-3v-4.26c0-1.08-.43-1.82-1.44-1.82a1.43 1.43 0 0 0-1.35.95 1.72 1.72 0 0 0-.08.65v4.48h-3v-9h2.9v1.3a2.88 2.88 0 0 1 2.62-1.45c1.88 0 3.35 1.23 3.35 3.87Z"/></svg>
                </span>
                <span className="font-display text-[15px] font-medium text-[#ccc] group-hover/link:text-white transition-colors duration-200">LinkedIn</span>
              </a>
              <a href="/resume" target="_blank" rel="noopener noreferrer" className="group/link flex items-center gap-2.5 w-fit">
                <span className="flex items-center justify-center w-8 h-8 rounded-full border border-[#333] bg-[#1a1a1a] group-hover/link:border-[#555] group-hover/link:bg-[#222] transition-all duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:stroke-white transition-colors duration-200"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>
                </span>
                <span className="font-display text-[15px] font-medium text-[#ccc] group-hover/link:text-white transition-colors duration-200">Resume</span>
              </a>
            </div>
            <span className="font-mono text-[9px] text-[#444] tracking-[0.06em] uppercase">© 2026 Shane Yun</span>
          </div>
        </aside>

        {/* ── RIGHT COLUMN ── */}
        <div className={`flex-1 flex flex-col relative ${hPad} py-6 lg:py-[36px] xl:py-[56px] 2xl:py-[72px] z-10`}>

          {/* ── INTRO: centered, animated text ── */}
          <AnimatePresence>
            {(phase === "typing" || phase === "highlighting") && (
              <motion.div
                key="intro"
                className={`absolute inset-0 flex items-center ${hPad} z-20`}
                exit={{
                  opacity: 0,
                  y: -110,
                  transition: { duration: 0.75, ease: [0.4, 0, 0.2, 1] },
                }}
              >
                <h1 className={H1_CLASS}>
                  {phase === "typing" ? (
                    typed.length <= HERO_PRE.trimEnd().length ? (
                      /* Still on first line */
                      <>
                        {typed}
                        {showCursor && (
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.6 }}>|</motion.span>
                        )}
                      </>
                    ) : (
                      /* Second line started — lock structure so no jump on highlight */
                      <>
                        Empowering advertisers to build<br />
                        <span className="inline-block px-5 py-2 rounded-2xl">
                          {typed.slice(HERO_PRE.length)}
                          {showCursor && (
                            <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, repeatType: "mirror", duration: 0.6 }}>|</motion.span>
                          )}
                        </span>
                      </>
                    )
                  ) : (
                    /* Highlighting phase — accent gradient sweeps in left → right */
                    <>
                      Empowering advertisers to build<br />
                      <span className="relative inline-block px-5 py-2 rounded-2xl">
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-2xl"
                          style={{
                            background: "linear-gradient(135deg, rgba(110,142,255,0.18) 0%, rgba(110,142,255,0.07) 100%)",
                            border: "1px solid rgba(110,142,255,0.3)",
                            boxShadow: "0 0 28px rgba(110,142,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                          }}
                          initial={{ clipPath: "inset(0 100% 0 0 round 1rem)" }}
                          animate={{ clipPath: "inset(0 0% 0 0 round 1rem)" }}
                          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                        />
                        <span className="relative z-10">ads that perform</span>
                      </span>
                    </>
                  )}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── MAIN CONTENT: text settles at top, cards appear ── */}
          {(phase === "settling" || phase === "done") && (
            <div className="flex flex-col flex-1 min-h-0">
              <motion.h1
                className={`${H1_CLASS} shrink-0`}
                initial={alreadySeen ? false : { opacity: 0, y: 48 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              >
                Empowering advertisers to build<br />
                <span
                  className="inline-block px-5 py-2 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, rgba(110,142,255,0.18) 0%, rgba(110,142,255,0.07) 100%)",
                    border: "1px solid rgba(110,142,255,0.3)",
                    boxShadow: "0 0 28px rgba(110,142,255,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
                  }}
                >ads that perform</span>
              </motion.h1>

              <motion.div
                initial={alreadySeen ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.38, duration: 0.5 }}
                className="mt-8 lg:mt-10 xl:mt-12 2xl:mt-14 mb-3 lg:mb-4 xl:mb-6 shrink-0"
              >
                <span className="font-mono text-[13px] text-[#bbb] tracking-[0.06em] uppercase">Projects in the past year I designed</span>
              </motion.div>

              <motion.div
                initial={alreadySeen ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.65, ease: "easeOut" }}
                className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 lg:max-h-[360px] xl:max-h-[440px] 2xl:max-h-[540px] lg:items-start"
              >
                {cases.map(c => <CardBalanced key={c.href} c={c} />)}
              </motion.div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
