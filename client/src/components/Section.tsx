import { ReactNode, useEffect, useRef, useState } from "react";

export function Section({
  id,
  kicker,
  number,
  title,
  lede,
  children,
  className = "",
}: {
  id: string;
  kicker?: string;
  number?: string;
  title: string;
  lede?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`py-16 md:py-20 scroll-mt-16 border-t border-[var(--rule)] ${className}`}>
      <div className="container">
        <SectionHeader kicker={kicker} number={number} title={title} lede={lede} />
        {children}
      </div>
    </section>
  );
}

export function SectionHeader({
  kicker,
  number,
  title,
  lede,
}: {
  kicker?: string;
  number?: string;
  title: string;
  lede?: string;
}) {
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
    <div ref={ref} className={`reveal ${revealed ? "in" : ""} max-w-3xl mb-10 md:mb-14`}>
      <div className="flex items-baseline gap-4 mb-4">
        {number && (
          <span className="font-mono text-xs text-[var(--case-accent)]">
            § {number}
          </span>
        )}
        {kicker && <span className="kicker">{kicker}</span>}
      </div>
      <h2 className="display-2">{title}</h2>
      {lede && <p className="lede mt-6">{lede}</p>}
    </div>
  );
}

export function Prose({ children, drop }: { children: ReactNode; drop?: boolean }) {
  return (
    <div className={`prose-body max-w-2xl ${drop ? "[&>p:first-child]:dropcap" : ""}`}>
      {children}
    </div>
  );
}

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <div className="my-12 md:my-16 max-w-2xl">
      <blockquote className="pullquote">{children}</blockquote>
      {attribution && (
        <div className="caption mt-4 pl-8 text-[var(--mid)]">— {attribution}</div>
      )}
    </div>
  );
}

export function Aside({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside className="max-w-2xl my-10 rounded-lg p-5 border border-[rgba(110,142,255,0.15)] bg-[rgba(110,142,255,0.06)]">
      <div className="caption-label mb-2">{label}</div>
      <div className="prose-body">{children}</div>
    </aside>
  );
}
