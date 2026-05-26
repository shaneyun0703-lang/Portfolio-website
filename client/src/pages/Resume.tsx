export default function Resume() {
  return (
    <>
      {/* Download bar — hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1c1c1e] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="font-mono text-[12px] tracking-[0.04em] uppercase px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
            style={{ background: "rgba(255,255,255,0.06)", color: "#ccc", border: "1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#ccc"; }}
          >
            ← Portfolio
          </a>
          <span className="font-mono text-[15px] text-white tracking-[0.06em] uppercase font-semibold">Resume</span>
        </div>
        <button
          onClick={() => { const prev = document.title; document.title = "Shane Yun - Resume"; window.print(); document.title = prev; }}
          className="font-mono text-[12px] tracking-[0.04em] uppercase px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer font-semibold"
          style={{ background: "rgba(255,255,255,0.92)", color: "#111", border: "1px solid rgba(255,255,255,0.9)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#fff"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.92)"; }}
        >
          Download PDF
        </button>
      </div>
      <div className="resume-outer min-h-screen bg-[#e8e8e8] pt-20 pb-10 print:p-0" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <div id="resume-content" className="resume-page max-w-[816px] mx-auto bg-white text-[#1a1a1a] shadow-[0_2px_20px_rgba(0,0,0,0.15)] flex flex-col" style={{ minHeight: "1056px" }}>
        <div className="resume-content px-16 pt-12 pb-0 flex-1">

          {/* Header */}
          <div className="flex justify-between items-end mb-0.5">
            <div>
              <h1 className="text-[2.2rem] font-black tracking-[-0.02em] leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>SHANE YUN</h1>
              <p className="text-[0.72rem] font-medium tracking-[0.14em] uppercase text-[#666] mt-1">Senior Product Designer</p>
            </div>
            <div className="text-right text-[0.72rem] text-[#666] leading-[1.6]">
              <div><a href="https://shane-yun.vercel.app" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1a1a1a] hover:text-[#444] transition-colors">shane-yun.vercel.app</a></div>
              <div><a href="mailto:shane.yun0703@gmail.com" className="hover:text-[#1a1a1a] transition-colors">shane.yun0703@gmail.com</a></div>
              <div><a href="https://linkedin.com/in/shane-yun" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a1a1a] transition-colors">linkedin.com/in/shane-yun</a></div>
            </div>
          </div>

          {/* Experience header */}
          <div className="border-t-[2px] border-[#1a1a1a] mt-3 pt-5">
            <h2 className="text-[0.8rem] font-bold tracking-[0.22em] uppercase">Experience</h2>
          </div>

          {/* Meta */}
          <div className="mt-2.5">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[0.9rem] font-bold">Meta</h3>
              <span className="text-[0.85rem] text-[#555] font-semibold">2021 – Present</span>
            </div>
            <p className="text-[0.72rem] text-[#555] mt-0 italic">Senior Product Designer, Core Ads Growth org — AI-powered advertising products serving millions of businesses</p>
          </div>

          {/* Role 1 */}
          <div className="mt-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-[0.78rem] font-bold">Advertiser Verticals Team | eCommerce</h4>
              <span className="text-[0.72rem] text-[#555] font-semibold">2024 – Present</span>
            </div>
            <ul className="text-[0.72rem] leading-[1.65] mt-1 space-y-1">
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for Meta's <strong>unified Sales campaign creation experience</strong> — bringing product catalog-driven and manual creative ad flows into a single end-to-end advertiser journey across 50%+ of Meta's total revenue</span></li>
              <li className="flex gap-1.5 pl-3"><span className="shrink-0 text-[#aaa]">–</span><span>Redesigned the <strong>targeting and conversion setup</strong> to bring both ad flows to parity — launched to 100%, growing audience reach by 1.6% and enabling a <strong>$150M+ annual revenue commerce ads launch</strong></span></li>
              <li className="flex gap-1.5 pl-3"><span className="shrink-0 text-[#aaa]">–</span><span>Designed the <strong>ad creative experience</strong> — enabling product catalog and manual creative advertisers to share the same creative suite for the first time, now in scaled alpha with <strong>100K brands worldwide</strong></span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Defined Meta's <strong>Search AI Ads</strong> experience end-to-end — through 10+ concept explorations and a 3-phase research program with 14+ companies, securing leadership alignment for an alpha launch</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led the scaling of <strong>WhatsApp Ads</strong> from 2 to 5 of Meta's 6 marketing objectives — including WhatsApp's first website-destination ads — reaching a 100% global launch</span></li>
            </ul>
          </div>

          {/* Role 2 */}
          <div className="border-t border-[#e5e5e5] mt-4 mb-4" />
          <div>
            <div className="flex justify-between items-baseline">
              <h4 className="text-[0.78rem] font-bold">Advertiser Automation Team</h4>
              <span className="text-[0.72rem] text-[#555] font-semibold">2023 – 2024</span>
            </div>
            <ul className="text-[0.72rem] leading-[1.65] mt-1 space-y-1">
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for 7 growth features within <strong>Advantage+ Shopping Campaigns</strong> (Meta's fastest-growing AI ads product, $10B ARR in year one) — driving $3M+ in daily revenue and reaching 32.8% of commerce advertisers</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Defined the design vision for <strong>Advantage+ Catalog Ads</strong>, Meta's AI-automated product catalog ads — aligning 3 orgs and 8 teams toward a unified creation experience spanning $850M in yearly ad spend across 12K advertisers</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Designed <strong>Audience Segment Reporting</strong> — giving Advantage+ Shopping Campaign advertisers their first-ever view into who their ads reach, across 5 surfaces and 50+ components, adopted by 40K accounts (22% of A+SC daily revenue)</span></li>
            </ul>
          </div>

          {/* Role 3 */}
          <div className="border-t border-[#e5e5e5] mt-4 mb-4" />
          <div>
            <div className="flex justify-between items-baseline">
              <h4 className="text-[0.78rem] font-bold">App Ads & Privacy-Preserving AI Team</h4>
              <span className="text-[0.72rem] text-[#555] font-semibold">2021 – 2023</span>
            </div>
            <ul className="text-[0.72rem] leading-[1.65] mt-1 space-y-1">
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for Meta's <strong>privacy-preserving app ads system</strong> — a net-new solution enabling app advertisers to continue running campaigns after Apple's iOS privacy changes, launched to 100% across 5 campaign types, reaching a record <strong>$6M daily revenue</strong> and a <strong>9.5% increase in conversions</strong> for app-focused advertisers</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Improved <strong>app campaign setup</strong> for Apple's privacy framework — resolved error states across 175K+ campaign creation attempts, reducing setup time by 3.74% ($2.5M in quarterly advertiser revenue)</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Owned <strong>A/B Testing for automated app campaigns</strong> end-to-end — led research, built 2 prototypes, launched to 100% with 130 brands, and designed the <strong>App Setup Tool</strong> MVP, unblocking 761 apps and driving <strong>+4.5% app ads revenue</strong></span></li>
            </ul>
          </div>

        </div>

        {/* Bottom section */}
        <div className="resume-footer mt-auto mx-16 pb-10 border-t border-[#1a1a1a]">
          <div className="py-5 flex gap-20">
            <div>
              <h2 className="text-[0.8rem] font-bold tracking-[0.22em] uppercase mb-2">Education</h2>
              <h3 className="text-[0.82rem] font-bold">Cornell University</h3>
              <p className="text-[0.72rem] text-[#555]">B.A. Information Science (<strong>UX concentration</strong>) | <strong>3.8 GPA</strong></p>
            </div>
            <div>
              <h2 className="text-[0.8rem] font-bold tracking-[0.22em] uppercase mb-2">AI & Design Tools</h2>
              <p className="text-[0.72rem] text-[#555]">Claude, Figma Make & MCP, Manus, Cursor</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
