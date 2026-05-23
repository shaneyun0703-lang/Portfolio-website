export default function Resume() {
  return (
    <>
      {/* Download bar — hidden when printing */}
      <div className="print:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#1c1c1e] border-b border-[#2a2a2a]">
        <span className="font-mono text-[12px] text-white tracking-[0.06em] uppercase font-semibold">Resume</span>
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
        <div id="resume-content" className="resume-page max-w-[816px] mx-auto bg-white text-[#1a1a1a] shadow-[0_2px_20px_rgba(0,0,0,0.15)]" style={{ minHeight: "1056px" }}>
        <div className="resume-content px-16 pt-12 pb-0">

          {/* Header */}
          <div className="flex justify-between items-end mb-0.5">
            <div>
              <h1 className="text-[2.2rem] font-black tracking-[-0.02em] leading-none" style={{ fontFamily: "'Syne', sans-serif" }}>SHANE YUN</h1>
              <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#666] mt-1 font-medium">Senior Product Designer</p>
            </div>
            <div className="text-right text-[0.72rem] text-[#666] leading-[1.6]">
              <div>shane.yun0703@gmail.com</div>
              <div>linkedin.com/in/shane-yun</div>
              <div className="font-bold text-[#1a1a1a]">shane-yun.vercel.app</div>
            </div>
          </div>

          {/* Experience header */}
          <div className="border-t-[2px] border-[#1a1a1a] mt-3 pt-2.5">
            <h2 className="text-[0.65rem] font-bold tracking-[0.25em] uppercase">Experience</h2>
          </div>

          {/* Meta */}
          <div className="mt-2.5">
            <div className="flex justify-between items-baseline">
              <h3 className="text-[1rem] font-bold">Meta</h3>
              <span className="text-[0.85rem] text-[#555] font-semibold">2021 – Present</span>
            </div>
            <p className="text-[0.72rem] text-[#555] mt-0.5 italic">Senior Product Designer · Core Ads Growth — AI-powered advertising products serving millions of businesses</p>
          </div>

          {/* Role 1 */}
          <div className="mt-2.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-[0.78rem] font-bold">Advertiser Verticals (eCommerce-focused)</h4>
              <span className="text-[0.72rem] text-[#555] font-semibold">2024 – Present</span>
            </div>
            <ul className="text-[0.72rem] leading-[1.55] mt-1 space-y-0.5">
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for Meta's <strong>unified ad campaign builder</strong> — merging fragmented catalog and static ad creation flows into a single AI-automated experience for eCommerce advertisers worldwide</span></li>
              <li className="flex gap-1.5 pl-3"><span className="shrink-0 text-[#aaa]">–</span><span>Redesigned the <strong>targeting and conversion setup</strong> — launched targeting to 50% of advertisers (1.6% increase in audience reach) and conversions to 100%, directly unblocking a cross-channel commerce launch worth <strong>$150M+ in annual revenue</strong></span></li>
              <li className="flex gap-1.5 pl-3"><span className="shrink-0 text-[#aaa]">–</span><span>Led design integrating <strong>product catalog media into the unified creative framework</strong> — enabling catalog advertisers to access the full AI-powered creative suite for the first time</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for <strong>AI-powered Search Ads</strong> (0→1) — shaped the end-to-end advertiser experience through 10+ concept explorations and a 3-phase research program with 14+ companies, securing leadership alignment for a 2027 alpha launch</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for <strong>WhatsApp Ads</strong> — scaled from 2 to 5 of Meta's 6 marketing objectives, drove cross-org alignment between WhatsApp and Ads leadership, shipped globally to <strong>28.8% eligibility rate</strong> (exceeding 27.6% target)</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led a team of 8 designers through a <strong>systematic usability audit</strong> of a high-revenue ad flow (40% of catalog ad revenue) — identified 64 issues, resolved 21 critical tasks on time, achieving the highest completion rate in the org</span></li>
            </ul>
          </div>

          {/* Role 2 */}
          <div className="h-px bg-[#e5e5e5] mt-3 mb-3" />
          <div>
            <div className="flex justify-between items-baseline">
              <h4 className="text-[0.78rem] font-bold">Advertiser Automation</h4>
              <span className="text-[0.72rem] text-[#555] font-semibold">2023 – 2024</span>
            </div>
            <ul className="text-[0.72rem] leading-[1.55] mt-1 space-y-0.5">
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Shaped the design direction for <strong>7 features within Meta's AI-automated ad product</strong> — drove <strong>32.8% adoption</strong> (exceeding the 26.9% goal), with value optimization generating ~$700K daily revenue at 30% week-over-week growth and cost controls reaching $2.5M daily revenue</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led a <strong>cross-org product redesign</strong> across 3 organizations and 8 teams — rethought the end-to-end advertiser journey from a fragmented multi-step process into a cohesive single view, devising a 3-phase migration strategy to safely transition ~4% of ad revenue ($850M yearly) across 10K advertisers</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Designed <strong>Audience Reporting</strong> from 0→1 — gave advertisers visibility into who their ads actually reach for the first time, across 5 surfaces with 50+ components. Adopted by 40K accounts (22% of daily revenue). Validated through usability research across 4 global regions</span></li>
            </ul>
          </div>

          {/* Role 3 */}
          <div className="h-px bg-[#e5e5e5] mt-3 mb-3" />
          <div>
            <div className="flex justify-between items-baseline">
              <h4 className="text-[0.78rem] font-bold">App Ads & Privacy-Preserving AI</h4>
              <span className="text-[0.72rem] text-[#555] font-semibold">2021 – 2023</span>
            </div>
            <ul className="text-[0.72rem] leading-[1.55] mt-1 space-y-0.5">
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Led design for Meta's <strong>privacy-preserving ad measurement system</strong> — redefined how advertisers track campaign performance without individual user data, driving ads to <strong>$6M daily revenue</strong> (record high) with a <strong>1.5% increase in conversions</strong></span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Redesigned the <strong>Apple privacy framework experience</strong> (SKAdNetwork) — reduced campaign creation time by 3.74%, resolved error patterns affecting 175K+ advertisers (<strong>$2.5M past-90-day revenue</strong>)</span></li>
              <li className="flex gap-1.5"><span className="shrink-0">•</span><span>Owned <strong>A/B Testing for automated campaigns</strong> end-to-end — led research, built 2 prototypes, launched to 100% with 130 monthly active advertisers. Also designed the <strong>App Setup Tool</strong> MVP, driving +4.5% app ads revenue</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom section */}
        <div className="resume-footer mt-5 border-t-[2px] border-[#1a1a1a] mx-16">
          <div className="py-5 flex gap-20">
            <div>
              <h2 className="text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-2">Education</h2>
              <h3 className="text-[0.82rem] font-bold">Cornell University</h3>
              <p className="text-[0.72rem] text-[#555]">B.A. Information Science (UX Concentration)</p>
            </div>
            <div>
              <h2 className="text-[0.65rem] font-bold tracking-[0.25em] uppercase mb-2">AI Tools</h2>
              <p className="text-[0.72rem] text-[#555]">Claude, Figma Make & MCP, Manus, Cursor</p>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
