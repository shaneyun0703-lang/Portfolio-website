type TldrProps = {
  summary: React.ReactNode;
  columns: { label: string; content: React.ReactNode }[];
  accentColor: string;
  accentRgb: string;
};

export function TldrWithSwitcher({ summary, columns, accentColor, accentRgb }: TldrProps) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 opacity-[0.06] rounded-3xl" style={{ background: `radial-gradient(ellipse at 30% 50%, rgba(${accentRgb},1) 0%, transparent 60%)`, filter: "blur(30px)" }} />
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-md" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
        <div className="px-6 py-5">
          <span className="font-mono text-[12px] tracking-[0.1em] uppercase font-semibold" style={{ color: accentColor }}>TL;DR</span>
          <div className="lede text-[var(--ink)] mt-2">{summary}</div>
        </div>
        <div className="mx-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
          {columns.map((col) => (
            <div key={col.label} className="rounded-xl px-4 py-3.5 backdrop-blur-sm" style={{ background: `rgba(${accentRgb},0.05)`, border: `1px solid rgba(${accentRgb},0.08)` }}>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: accentColor }}>{col.label}</div>
              <div className="lede text-[#ccc] text-[0.85rem]">{col.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
