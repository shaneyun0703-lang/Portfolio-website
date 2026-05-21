type TldrProps = {
  summary: React.ReactNode;
  role: string;
  timeline: React.ReactNode;
  outcome: React.ReactNode;
  team: React.ReactNode;
  audience: React.ReactNode;
  accentColor: string;
  accentRgb: string;
};

export function TldrWithSwitcher({ summary, role, timeline, outcome, team, audience, accentColor, accentRgb }: TldrProps) {
  const boxStyle = {
    background: `rgba(${accentRgb},0.05)`,
    border: `1px solid rgba(${accentRgb},0.08)`,
  };
  const dividerStyle = { borderColor: `rgba(${accentRgb},0.08)` };

  return (
    <div className="relative">
      <div className="absolute -inset-4 opacity-[0.06] rounded-3xl" style={{ background: `radial-gradient(ellipse at 30% 50%, rgba(${accentRgb},1) 0%, transparent 60%)`, filter: "blur(30px)" }} />
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-md" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: `0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)` }}>

        {/* Header: TL;DR label + Role chip + Summary */}
        <div className="px-6 pt-5 pb-4">
          <div className="mb-2.5">
            <span className="font-mono text-[12px] tracking-[0.1em] uppercase font-semibold" style={{ color: accentColor }}>TL;DR</span>
          </div>
          <div className="lede text-[var(--ink)]">{summary}</div>
        </div>

        {/* Grid: Role+Timeline+Outcome | Team | Audience */}
        <div className="mx-4 mb-4 grid grid-cols-1 md:grid-cols-3 gap-2">

          {/* Role + Timeline + Outcome stacked */}
          <div className="rounded-xl overflow-hidden" style={boxStyle}>
            <div className="px-4 py-3 border-b" style={dividerStyle}>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase font-medium mb-1.5" style={{ color: accentColor }}>Role</div>
              <div className="lede text-[#ccc] text-[0.85rem]">{role}</div>
            </div>
            <div className="px-4 py-3 border-b" style={dividerStyle}>
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase font-medium mb-1.5" style={{ color: accentColor }}>Timeline</div>
              <div className="lede text-[#ccc] text-[0.85rem]">{timeline}</div>
            </div>
            <div className="px-4 py-3">
              <div className="font-mono text-[10px] tracking-[0.1em] uppercase font-medium mb-1.5" style={{ color: accentColor }}>Outcome</div>
              <div className="lede text-[#ccc] text-[0.85rem]">{outcome}</div>
            </div>
          </div>

          {/* Team */}
          <div className="rounded-xl px-4 py-3.5" style={boxStyle}>
            <div className="font-mono text-[10px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: accentColor }}>Team</div>
            <div className="lede text-[#ccc] text-[0.85rem]">{team}</div>
          </div>

          {/* Audience */}
          <div className="rounded-xl px-4 py-3.5" style={boxStyle}>
            <div className="font-mono text-[10px] tracking-[0.1em] uppercase font-medium mb-2" style={{ color: accentColor }}>Audience</div>
            <div className="lede text-[#ccc] text-[0.85rem]">{audience}</div>
          </div>

        </div>
      </div>
    </div>
  );
}
