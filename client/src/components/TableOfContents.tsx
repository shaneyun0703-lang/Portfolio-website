import { useEffect, useState } from "react";
import { useScrolled } from "@/hooks/useScrolled";

const sections = [
  { id: "context", label: "The opportunity" },
  { id: "starting", label: "Scoping the features" },
  { id: "primer", label: "How Meta Ads Manager works" },
  { id: "problem", label: "The status quo" },
  { id: "process", label: "Three rounds of testing" },
  { id: "design", label: "Where it landed" },
  { id: "next", label: "Where this goes next" },
];

export function TableOfContents() {
  const [active, setActive] = useState<string>("context");
  const scrolled = useScrolled(40);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
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
      className={`hidden xl:block fixed right-7 z-40 w-[310px] transition-all duration-500 ease-in-out ${scrolled ? "top-[calc(80px+1.75rem)]" : "top-[calc(72px+2.25rem)]"}`}
      aria-label="Section navigation"
    >
      <div className="rounded-[10px] p-4 max-h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden" style={{ background: "rgba(28,28,32,0.62)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 8px 30px rgba(0,0,0,0.5)" }}>
        <div className="font-mono text-[13px] text-[var(--mid)] tracking-[0.1em] uppercase mb-3 font-medium">
          Sections
        </div>
        <ul className="space-y-0.5">
          {sections.map((s, i) => (
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
