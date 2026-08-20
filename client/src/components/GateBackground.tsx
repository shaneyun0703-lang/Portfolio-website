import { useEffect, useRef } from "react";

export type GatePattern = "constellation" | "starfield" | "ripple" | "network" | "flow" | "depth" | "lattice" | "web" | "ink" | "aura" | "mesh" | "spectrum" | "plexus" | "silk" | "contour" | "beam" | "gradient" | "circuit" | "cases" | "wind";
export type GateBackdrop = "plain" | "grid" | "siteGrid" | "bloom" | "bloomMono" | "aurora" | "auroraMono";

export const GATE_PATTERNS: GatePattern[] = ["constellation", "starfield", "ripple", "network", "flow", "depth", "lattice", "web", "ink", "aura", "mesh", "spectrum", "plexus", "silk", "contour", "beam", "gradient", "circuit", "cases", "wind"];
export const GATE_BACKDROPS: GateBackdrop[] = ["plain", "grid", "siteGrid", "bloom", "bloomMono", "aurora", "auroraMono"];

export const PATTERN_LABELS: Record<GatePattern, string> = {
  constellation: "Constellation",
  starfield: "Starfield",
  ripple: "Ripple",
  network: "Network",
  flow: "Flow",
  depth: "Depth",
  lattice: "Lattice",
  web: "Web",
  ink: "Ink",
  aura: "Aura",
  mesh: "Mesh",
  spectrum: "Spectrum",
  plexus: "Plexus",
  silk: "Silk",
  contour: "Contour",
  beam: "Beam",
  gradient: "Gradient",
  circuit: "Circuit",
  cases: "Case studies",
  wind: "Wind",
};
export const BACKDROP_LABELS: Record<GateBackdrop, string> = {
  plain: "Plain",
  grid: "Grid",
  siteGrid: "Grid (site)",
  bloom: "Bloom",
  bloomMono: "Bloom mono",
  aurora: "Aurora",
  auroraMono: "Aurora mono",
};

const ACCENTS = ["249,160,74", "106,238,154", "163,186,255"]; // commerce / whatsapp / search

/**
 * Animated gate background. Two axes: a foreground `pattern` drawn over a
 * `backdrop`, both on a single canvas. Base color stays #1c1c1e (from parent).
 */
export function GateBackground({
  pattern,
  backdrop,
  // Additive, defaults to the gate's existing behaviour. The handoff landing
  // previews pass `false` so the shapes drift on their own without the cursor
  // pulling at them.
  interactive = true,
}: {
  pattern: GatePattern;
  backdrop: GateBackdrop;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pointer = { x: -9999, y: -9999, active: false };

    let initPattern = () => {};
    let drawPattern = (_dt: number) => {};
    let initBackdrop = () => {};
    let drawBackdrop = (_dt: number) => {};

    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initBackdrop();
      initPattern();
    };

    const onMove = (e: PointerEvent) => { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; };
    const onLeave = () => { pointer.active = false; };

    const drawGrid = (major: number, minor: number) => {
      ctx.lineWidth = 1;
      if (minor > 0) {
        ctx.strokeStyle = `rgba(255,255,255,${minor})`;
        for (let x = Math.round((w / 2) % 24) + 0.5; x < w; x += 24) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        for (let y = Math.round((h / 2) % 24) + 0.5; y < h; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      }
      ctx.strokeStyle = `rgba(255,255,255,${major})`;
      for (let x = Math.round((w / 2) % 120) + 0.5; x < w; x += 120) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = Math.round((h / 2) % 120) + 0.5; y < h; y += 120) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    };

    // Fade dots/links out near the center so the name + card stay readable (0 at center → 1 outside).
    const clearZone = (x: number, y: number) => {
      const nx = (x - w / 2) / 400, ny = (y - h / 2) / 320;
      const d = Math.sqrt(nx * nx + ny * ny);
      return Math.max(0, Math.min(1, (d - 0.5) / 0.5));
    };

    // Soft positional blend of the three project accents (commerce / search / whatsapp), each
    // pinned to a screen region — returns an "r,g,b" string. Used by the accent-tinted pattern.
    const TINT_ANCHORS = [
      { x: 0.20, y: 0.22, c: [249, 160, 74] },  // commerce — warm gold, top-left
      { x: 0.84, y: 0.28, c: [163, 186, 255] }, // search — blue, top-right
      { x: 0.52, y: 0.86, c: [106, 238, 154] }, // whatsapp — green, bottom
    ];
    const tint = (x: number, y: number, mix = 0.5) => {
      const fx = x / w, fy = y / h;
      let wsum = 0, r = 0, g = 0, b = 0;
      for (const a of TINT_ANCHORS) {
        const dx = fx - a.x, dy = fy - a.y;
        const wgt = 1 / (dx * dx + dy * dy + 0.04);
        wsum += wgt; r += a.c[0] * wgt; g += a.c[1] * wgt; b += a.c[2] * wgt;
      }
      // mix toward white: 0.5 = soft whisper, ~0.1 = bold saturated accent
      const wr = 255 * mix + (r / wsum) * (1 - mix), wg = 255 * mix + (g / wsum) * (1 - mix), wb = 255 * mix + (b / wsum) * (1 - mix);
      return `${Math.round(wr)},${Math.round(wg)},${Math.round(wb)}`;
    };

    // ───────────── backdrops ─────────────
    if (backdrop === "grid") {
      drawBackdrop = () => drawGrid(0.022, 0); // majors only — no minor moiré
    } else if (backdrop === "siteGrid") {
      drawBackdrop = () => drawGrid(0.051, 0.018);
    } else if (backdrop === "bloom" || backdrop === "bloomMono") {
      const mono = backdrop === "bloomMono";
      const cols = mono ? ["255,255,255", "255,255,255"] : [ACCENTS[0], ACCENTS[2]];
      const peak = mono ? 0.04 : 0.05;
      let t = 0;
      drawBackdrop = (dt) => {
        t += dt;
        const breathe = 0.9 + 0.1 * Math.sin(t * 0.0005);
        const spots = [
          { x: w * 0.32, y: h * 0.26, c: cols[0] },
          { x: w * 0.72, y: h * 0.74, c: cols[1] },
        ];
        for (const s of spots) {
          const r = Math.max(w, h) * 0.42 * breathe;
          const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
          g.addColorStop(0, `rgba(${s.c},${peak})`);
          g.addColorStop(1, `rgba(${s.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, 6.2832); ctx.fill();
        }
      };
    } else if (backdrop === "aurora" || backdrop === "auroraMono") {
      const mono = backdrop === "auroraMono";
      const cols = mono ? ["255,255,255", "255,255,255", "255,255,255"] : ACCENTS;
      const peak = mono ? 0.028 : 0.075;
      type B = { x: number; y: number; r: number; c: string; phase: number; vx: number; vy: number };
      let blobs: B[] = [];
      initBackdrop = () => {
        blobs = cols.map((c, i) => ({
          x: w * (0.3 + 0.2 * i), y: h * (0.4 + 0.12 * (i % 2 ? 1 : -1)),
          r: Math.max(w, h) * 0.5, c, phase: Math.random() * 6.2832,
          vx: (Math.random() - 0.5) * 0.09, vy: (Math.random() - 0.5) * 0.09,
        }));
      };
      drawBackdrop = (dt) => {
        const f = dt / 16.67;
        ctx.globalCompositeOperation = "lighter";
        for (const b of blobs) {
          b.phase += 0.0004 * dt;
          b.x += b.vx * f; b.y += b.vy * f;
          if (b.x < w * 0.12 || b.x > w * 0.88) b.vx *= -1;
          if (b.y < h * 0.12 || b.y > h * 0.88) b.vy *= -1;
          const r = b.r * (0.9 + 0.1 * Math.sin(b.phase));
          const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
          g.addColorStop(0, `rgba(${b.c},${peak})`);
          g.addColorStop(1, `rgba(${b.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 6.2832); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      };
    }

    // ───────────── patterns ─────────────
    if (pattern === "constellation") {
      // Each node remembers its "home" (its place in a real constellation) and a
      // drift velocity. On load the nodes sit at home with the true constellation
      // lines drawn; after a hold they drift apart (morph 0→1) and the abstract
      // proximity web fades in — the constellations "disfigure". Pointer-reactive.
      type N = { x: number; y: number; hx: number; hy: number; vx: number; vy: number; tw: number; tws: number; member: boolean };
      let nodes: N[] = [];
      let realEdges: [number, number][] = [];
      let tAccum = 0;
      const HOLD = 3400;   // hold the recognizable shapes long enough to register
      const MORPH = 2800;  // then disfigure into the drifting web

      // Five constellations, each drawn in its canonical, upright, most-recognizable orientation.
      // Star coords in a local 0..1 box (x right, y down), edge index pairs, and where to place +
      // how big to draw them (cx/cy = screen fraction, s = scale of min(w,h)).
      const TEMPLATES: { stars: number[][]; edges: number[][]; cx: number; cy: number; s: number }[] = [
        { // Lyra — Vega (0) atop a small triangle (0,1,2), parallelogram hanging below (2,3,4,5)
          stars: [[0.30, 0.05], [0.16, 0.18], [0.40, 0.24], [0.60, 0.42], [0.50, 0.72], [0.28, 0.56]],
          edges: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 5], [5, 2]],
          cx: 0.17, cy: 0.24, s: 0.30,
        },
        { // Corona Borealis — the Northern Crown: a symmetric arc opening upward, Alphecca (3) at the base
          stars: [[0.05, 0.15], [0.14, 0.40], [0.28, 0.58], [0.50, 0.66], [0.72, 0.58], [0.86, 0.40], [0.95, 0.15]],
          edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
          cx: 0.50, cy: 0.14, s: 0.24,
        },
        { // Cygnus — the Northern Cross, upright: vertical spine Deneb-Sadr-Albireo (0-1-2) + crossbar (3-1-4)
          stars: [[0.50, 0.05], [0.50, 0.45], [0.50, 0.95], [0.14, 0.54], [0.86, 0.38]],
          edges: [[0, 1], [1, 2], [1, 3], [1, 4]],
          cx: 0.82, cy: 0.22, s: 0.30,
        },
        { // Ursa Major — the Big Dipper: trapezoid bowl (0-1-2-3) + handle arcing out with the Mizar bend (3-4-5-6)
          // 0 Dubhe, 1 Merak (pointer stars), 2 Phecda, 3 Megrez (handle joint), 4 Alioth, 5 Mizar, 6 Alkaid
          stars: [[0.02, 0.16], [0.06, 0.54], [0.29, 0.62], [0.30, 0.28], [0.52, 0.30], [0.74, 0.43], [0.96, 0.62]],
          edges: [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]],
          cx: 0.20, cy: 0.80, s: 0.30,
        },
        { // Scorpius — the fish-hook: head/claws (0-1-2) curving down the body, hooking back at the stinger (7-8)
          stars: [[0.30, 0.06], [0.22, 0.18], [0.24, 0.32], [0.32, 0.48], [0.44, 0.62], [0.58, 0.72], [0.72, 0.76], [0.84, 0.70], [0.80, 0.58]],
          edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
          cx: 0.80, cy: 0.78, s: 0.34,
        },
      ];

      // Fade nodes/links out where the name + card sit (centered clear zone).
      const vis = (x: number, y: number) => {
        const nx = (x - w / 2) / 360, ny = (y - h / 2) / 300;
        const d = Math.sqrt(nx * nx + ny * ny); // 0 at center, 1 at zone edge
        return Math.max(0, Math.min(1, (d - 0.6) / 0.4));
      };
      initPattern = () => {
        tAccum = 0;
        nodes = [];
        realEdges = [];
        const sMin = Math.min(w, h);
        for (const tpl of TEMPLATES) {
          const base = nodes.length;
          const px = tpl.cx * w, py = tpl.cy * h, scale = sMin * tpl.s;
          for (const [lx, ly] of tpl.stars) {
            const hx = px + (lx - 0.5) * scale;
            const hy = py + (ly - 0.5) * scale;
            nodes.push({
              x: hx, y: hy, hx, hy,
              vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
              tw: Math.random() * 6.2832, tws: 0.015 + Math.random() * 0.03, member: true,
            });
          }
          for (const [a, b] of tpl.edges) realEdges.push([base + a, base + b]);
        }
        // Ambient filler stars so the disfigured web stays evenly populated.
        const target = Math.min(62, Math.round((w * h) / 26000));
        const filler = Math.max(0, target - nodes.length);
        for (let k = 0; k < filler; k++) {
          const x = Math.random() * w, y = Math.random() * h;
          nodes.push({
            x, y, hx: x, hy: y,
            vx: (Math.random() - 0.5) * 0.22, vy: (Math.random() - 0.5) * 0.22,
            tw: Math.random() * 6.2832, tws: 0.015 + Math.random() * 0.03, member: false,
          });
        }
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        tAccum += dt;
        const morph = Math.max(0, Math.min(1, (tAccum - HOLD) / MORPH)); // 0 = true shapes, 1 = fully drifted
        const pop = Math.pow(Math.max(0, 1 - tAccum / HOLD), 1.4); // 1 at open → 0 by end of hold: opening saliency

        // Motion ramps in with the morph so the shapes hold, then come apart.
        for (const n of nodes) {
          n.x += n.vx * f * morph; n.y += n.vy * f * morph;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
          n.x = Math.max(0, Math.min(w, n.x)); n.y = Math.max(0, Math.min(h, n.y));
        }
        ctx.lineWidth = 1;

        // True constellation lines — extra bold the instant the page opens (pop), easing over the
        // hold, then fading out entirely as the shapes disfigure.
        if (morph < 1) {
          const ra = 1 - morph;
          ctx.lineWidth = 1 + pop * 0.9;
          for (const [i, j] of realEdges) {
            const ni = nodes[i], nj = nodes[j];
            const m = Math.min(vis(ni.x, ni.y), vis(nj.x, nj.y));
            if (m <= 0) continue;
            ctx.strokeStyle = `rgba(255,255,255,${(0.5 + 0.45 * pop) * ra * m})`;
            ctx.beginPath(); ctx.moveTo(ni.x, ni.y); ctx.lineTo(nj.x, nj.y); ctx.stroke();
          }
          ctx.lineWidth = 1;
        }

        // Abstract proximity web — fades in as the shapes break apart.
        const maxD = 178, maxD2 = maxD * maxD; // longer reach → more links per dot
        const deg = new Array(nodes.length).fill(0); // track connections to drop stray dots
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const m = Math.min(vis(nodes[i].x, nodes[i].y), vis(nodes[j].x, nodes[j].y));
              if (m <= 0) continue;
              const a = (1 - Math.sqrt(d2) / maxD) * 0.36 * m * morph;
              if (a > 0.002) {
                ctx.strokeStyle = `rgba(255,255,255,${a})`;
                ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
              }
              deg[i]++; deg[j]++;
            }
          }
        }
        // Pointer-reactive: link nearby stars to the cursor and nudge them toward it.
        if (pointer.active) {
          const cD = 200, cD2 = cD * cD;
          for (const n of nodes) {
            const dx = n.x - pointer.x, dy = n.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < cD2) {
              const a = (1 - Math.sqrt(d2) / cD) * 0.3 * vis(n.x, n.y) * morph;
              if (a > 0) {
                ctx.strokeStyle = `rgba(255,255,255,${a})`;
                ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke();
              }
              n.vx += (pointer.x - n.x) * 0.000018 * f; n.vy += (pointer.y - n.y) * 0.000018 * f;
            }
          }
        }
        for (let k = 0; k < nodes.length; k++) {
          const n = nodes[k];
          n.tw += n.tws * f; // keep twinkle phase advancing even when hidden
          const m = vis(n.x, n.y);
          if (m <= 0) continue;
          if (!n.member && deg[k] === 0) continue; // members anchor the shapes; cull only stray filler
          const base = Math.sin(n.tw) * 0.5 + 0.5;
          const sparkle = Math.pow(base, 1.7); // sharper peaks → more salient twinkle
          // Member stars read brighter/larger while the shapes are held, easing back as it disfigures.
          const hold = n.member ? (1 - morph) : 0;
          const sal = n.member ? pop : 0; // opening saliency, members only
          // sparkle halo — larger + brighter at the opening, easing to the subtle end state
          const gr = 3.2 + hold * 1.0 + sal * 2.4;
          const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, gr);
          g.addColorStop(0, `rgba(255,255,255,${(0.4 + 0.25 * hold + 0.5 * sal) * sparkle * m})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(n.x, n.y, gr, 0, 6.2832); ctx.fill();
          // core dot, twinkling
          ctx.fillStyle = `rgba(255,255,255,${(0.42 + 0.6 * sparkle + 0.3 * hold + 0.35 * sal) * m})`;
          ctx.beginPath(); ctx.arc(n.x, n.y, 1.0 + hold * 0.5 + sal * 0.9, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "starfield") {
      type S = { x: number; y: number; z: number; tw: number };
      let stars: S[] = [];
      initPattern = () => {
        stars = Array.from({ length: 170 }, () => ({
          x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.7 + 0.3, tw: Math.random() * 6.2832,
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        const ox = pointer.active ? pointer.x / w - 0.5 : 0;
        const oy = pointer.active ? pointer.y / h - 0.5 : 0;
        for (const s of stars) {
          s.y += s.z * 0.14 * f;
          if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
          s.tw += 0.02 * f;
          const a = (0.22 + 0.5 * (Math.sin(s.tw) * 0.5 + 0.5)) * s.z * 0.55;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(s.x - ox * 44 * s.z, s.y - oy * 44 * s.z, s.z * 1.15, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "ripple") {
      const SP = 42;
      let t = 0;
      drawPattern = (dt) => {
        t += dt;
        const cx = w / 2, cy = h / 2;
        for (let x = (w / 2) % SP; x < w; x += SP) {
          for (let y = (h / 2) % SP; y < h; y += SP) {
            const dist = Math.hypot(x - cx, y - cy);
            const wave = Math.sin(dist * 0.025 - t * 0.0026);
            let a = 0.05 + 0.11 * (wave * 0.5 + 0.5);
            let r = 0.9 + 0.7 * (wave * 0.5 + 0.5);
            if (pointer.active) {
              const pd = Math.hypot(x - pointer.x, y - pointer.y);
              if (pd < 150) { const k = 1 - pd / 150; a += k * 0.3; r += k * 1.3; }
            }
            ctx.fillStyle = `rgba(255,255,255,${a})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
          }
        }
      };
    } else if (pattern === "network") {
      // Elegant particle web: free-floating dots that link when near, with gentle cursor attraction.
      type P = { x: number; y: number; vx: number; vy: number; tw: number; tws: number };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(74, Math.round((w * h) / 24000));
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
          tw: Math.random() * 6.2832, tws: 0.008 + Math.random() * 0.02,
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        for (const p of ps) {
          if (pointer.active) {
            const dx = pointer.x - p.x, dy = pointer.y - p.y, d2 = dx * dx + dy * dy;
            if (d2 < 210 * 210) { p.vx += dx * 0.0000165 * f; p.vy += dy * 0.0000165 * f; }
          }
          p.vx *= 0.994; p.vy *= 0.994;
          p.x += p.vx * f; p.y += p.vy * f; p.tw += p.tws * f;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
        }
        const maxD = 158, maxD2 = maxD * maxD;
        ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y));
              if (cz <= 0) continue;
              const a = (1 - Math.sqrt(d2) / maxD) * 0.15 * cz;
              if (a > 0.002) { ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        if (pointer.active) {
          const cD = 190, cD2 = cD * cD;
          for (const p of ps) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < cD2) {
              const a = (1 - Math.sqrt(d2) / cD) * 0.2 * clearZone(p.x, p.y);
              if (a > 0) { ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pointer.x, pointer.y); ctx.stroke(); }
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          ctx.fillStyle = `rgba(255,255,255,${0.42 * tw * cz})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.2, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "flow") {
      // Dots streaming along a smooth invisible flow field; links form and dissolve as they move.
      type P = { x: number; y: number; vx: number; vy: number };
      let ps: P[] = [];
      let t = 0;
      const field = (x: number, y: number) =>
        (Math.sin(x * 0.0015 + t * 0.00016) + Math.cos(y * 0.0018 - t * 0.0002) + Math.sin((x + y) * 0.0010 + t * 0.00025)) * 2.0;
      initPattern = () => {
        const n = Math.min(96, Math.round((w * h) / 17000));
        ps = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: 0, vy: 0 }));
      };
      drawPattern = (dt) => {
        t += dt; const f = dt / 16.67;
        for (const p of ps) {
          const ang = field(p.x, p.y), sp = 0.42;
          p.vx += (Math.cos(ang) * sp - p.vx) * 0.05 * f;
          p.vy += (Math.sin(ang) * sp - p.vy) * 0.05 * f;
          p.x += p.vx * f; p.y += p.vy * f;
          if (p.x < -8 || p.x > w + 8 || p.y < -8 || p.y > h + 8) { p.x = Math.random() * w; p.y = Math.random() * h; p.vx = 0; p.vy = 0; }
        }
        const maxD = 122, maxD2 = maxD * maxD;
        ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y));
              if (cz <= 0) continue;
              const a = (1 - Math.sqrt(d2) / maxD) * 0.12 * cz;
              if (a > 0.002) { ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          ctx.fillStyle = `rgba(255,255,255,${0.32 * cz})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.0, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "depth") {
      // Volumetric layered network: dots carry a depth (z); nearer ones are bigger/brighter with more
      // parallax, and links only form between similar depths — reads as a 3D web.
      type P = { x: number; y: number; z: number; vx: number; vy: number; tw: number; tws: number };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(82, Math.round((w * h) / 21000));
        ps = Array.from({ length: n }, () => {
          const z = 0.3 + Math.random() * 0.7;
          return {
            x: Math.random() * w, y: Math.random() * h, z,
            vx: (Math.random() - 0.5) * 0.14 * z, vy: (Math.random() - 0.5) * 0.14 * z,
            tw: Math.random() * 6.2832, tws: 0.006 + Math.random() * 0.02,
          };
        });
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        const ox = pointer.active ? pointer.x / w - 0.5 : 0;
        const oy = pointer.active ? pointer.y / h - 0.5 : 0;
        for (const p of ps) {
          p.x += p.vx * f; p.y += p.vy * f; p.tw += p.tws * f;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
        }
        const sx = (p: P) => p.x - ox * 72 * p.z, sy = (p: P) => p.y - oy * 72 * p.z;
        const maxD = 150, maxD2 = maxD * maxD;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            if (Math.abs(ps[i].z - ps[j].z) > 0.34) continue; // link within a depth layer
            const xi = sx(ps[i]), yi = sy(ps[i]), xj = sx(ps[j]), yj = sy(ps[j]);
            const dx = xi - xj, dy = yi - yj, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y));
              if (cz <= 0) continue;
              const z = (ps[i].z + ps[j].z) / 2;
              const a = (1 - Math.sqrt(d2) / maxD) * 0.17 * z * cz;
              if (a > 0.002) { ctx.lineWidth = 0.5 + z * 0.8; ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(xi, yi); ctx.lineTo(xj, yj); ctx.stroke(); }
            }
          }
        }
        ctx.lineWidth = 1;
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          const a = (0.14 + 0.36 * p.z) * tw * cz;
          const px = sx(p), py = sy(p), r = 0.7 + p.z * 1.8;
          const g = ctx.createRadialGradient(px, py, 0, px, py, r * 2.4);
          g.addColorStop(0, `rgba(255,255,255,${a})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(px, py, r * 2.4, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(px, py, Math.max(0.5, r * 0.5), 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "lattice") {
      // Dots softly anchored to a breathing grid, linking to their grid neighbors — architectural + clean.
      type P = { hx: number; hy: number; x: number; y: number; ph: number; tw: number; tws: number };
      let ps: P[] = [];
      let cols = 0, rows = 0, t = 0;
      initPattern = () => {
        const gap = Math.max(96, Math.min(w, h) / 8);
        cols = Math.ceil(w / gap) + 1; rows = Math.ceil(h / gap) + 1;
        const offx = (w - (cols - 1) * gap) / 2, offy = (h - (rows - 1) * gap) / 2;
        ps = [];
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const hx = offx + c * gap, hy = offy + r * gap;
            ps.push({ hx, hy, x: hx, y: hy, ph: Math.random() * 6.2832, tw: Math.random() * 6.2832, tws: 0.008 + Math.random() * 0.016 });
          }
        }
      };
      drawPattern = (dt) => {
        t += dt;
        const amp = Math.max(w, h) * 0.013;
        for (const p of ps) {
          p.x = p.hx + Math.cos(t * 0.0004 + p.ph) * amp;
          p.y = p.hy + Math.sin(t * 0.0005 + p.ph * 1.3) * amp;
          p.tw += p.tws;
        }
        const idx = (c: number, r: number) => r * cols + c;
        ctx.lineWidth = 1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const p = ps[idx(c, r)];
            if (c + 1 < cols) {
              const q = ps[idx(c + 1, r)];
              const cz = Math.min(clearZone(p.x, p.y), clearZone(q.x, q.y));
              if (cz > 0) { ctx.strokeStyle = `rgba(255,255,255,${0.07 * cz})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
            }
            if (r + 1 < rows) {
              const q = ps[idx(c, r + 1)];
              const cz = Math.min(clearZone(p.x, p.y), clearZone(q.x, q.y));
              if (cz > 0) { ctx.strokeStyle = `rgba(255,255,255,${0.07 * cz})`; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          ctx.fillStyle = `rgba(255,255,255,${0.32 * tw * cz})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.1, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "web") {
      // The mouse is a live node in the web: it links to nearby dots AND energizes those dots'
      // links to the rest of the web, so moving the cursor lights up chains of connected lines.
      // Baseline stays very quiet until the cursor comes through.
      type P = { x: number; y: number; vx: number; vy: number; tw: number; tws: number; act: number };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(80, Math.round((w * h) / 22000));
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
          tw: Math.random() * 6.2832, tws: 0.008 + Math.random() * 0.02, act: 0,
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        const R = 230, R2 = R * R;
        for (const p of ps) {
          p.x += p.vx * f; p.y += p.vy * f; p.tw += p.tws * f;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
          // activation: how strongly the cursor is touching this dot (0..1), eased for a trailing glow
          let target = 0;
          if (pointer.active) { const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy; if (d2 < R2) target = 1 - Math.sqrt(d2) / R; }
          p.act += (target - p.act) * Math.min(1, 0.11 * f);
        }
        // proximity web — dim baseline, brightening where a cursor-active dot connects onward
        const maxD = 152, maxD2 = maxD * maxD;
        ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y));
              if (cz <= 0) continue;
              const prox = 1 - Math.sqrt(d2) / maxD;
              const energy = Math.max(ps[i].act, ps[j].act); // the cursor lights up connected chains
              const a = prox * (0.15 + 0.26 * energy) * cz; // more present baseline, gentler cursor lift
              if (a > 0.003) { ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        // cursor's own links into the web + its glowing node
        if (pointer.active) {
          for (const p of ps) {
            if (p.act > 0.01) {
              const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
              ctx.strokeStyle = `rgba(255,255,255,${p.act * 0.3 * cz})`;
              ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(p.x, p.y); ctx.stroke();
            }
          }
          const cz = clearZone(pointer.x, pointer.y);
          if (cz > 0) {
            const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 6);
            g.addColorStop(0, `rgba(255,255,255,${0.32 * cz})`);
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(pointer.x, pointer.y, 6, 0, 6.2832); ctx.fill();
          }
        }
        // dots — present at rest, only a gentle swell where the cursor is active
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          const a = (0.42 + 0.26 * p.act) * tw * cz;
          const r = 1.2 + p.act * 0.6;
          if (p.act > 0.05) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
            g.addColorStop(0, `rgba(255,255,255,${0.3 * p.act * cz})`);
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, r * 3, 0, 6.2832); ctx.fill();
          }
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "ink") {
      // Minimal / editorial: fewer, larger dots, long hairline links, lots of negative space. The
      // cursor still joins the web and lifts the chains it touches — but everything stays restrained.
      type P = { x: number; y: number; vx: number; vy: number; tw: number; tws: number; act: number };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(46, Math.round((w * h) / 40000)); // sparse
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
          tw: Math.random() * 6.2832, tws: 0.006 + Math.random() * 0.014, act: 0,
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        const R = 240, R2 = R * R;
        for (const p of ps) {
          p.x += p.vx * f; p.y += p.vy * f; p.tw += p.tws * f;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
          let target = 0;
          if (pointer.active) { const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy; if (d2 < R2) target = 1 - Math.sqrt(d2) / R; }
          p.act += (target - p.act) * Math.min(1, 0.1 * f);
        }
        const maxD = 210, maxD2 = maxD * maxD; // long reach for the sparse field
        ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y));
              if (cz <= 0) continue;
              const prox = 1 - Math.sqrt(d2) / maxD;
              const energy = Math.max(ps[i].act, ps[j].act);
              const a = prox * (0.13 + 0.24 * energy) * cz;
              if (a > 0.003) { ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        if (pointer.active) {
          for (const p of ps) {
            if (p.act > 0.01) {
              const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
              ctx.strokeStyle = `rgba(255,255,255,${p.act * 0.26 * cz})`;
              ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(p.x, p.y); ctx.stroke();
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          const a = (0.5 + 0.24 * p.act) * tw * cz;
          const r = 1.7 + p.act * 0.7; // larger, calmer dots
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.4);
          g.addColorStop(0, `rgba(255,255,255,${a * 0.5})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.4, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.6, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "aura") {
      // Accent-tinted network: same connecting web, but dots + links pick up a soft hue from their
      // screen region (commerce gold / search blue / whatsapp green) — a branded, premium whisper.
      type P = { x: number; y: number; vx: number; vy: number; tw: number; tws: number; act: number; col: string };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(76, Math.round((w * h) / 23000));
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
          tw: Math.random() * 6.2832, tws: 0.008 + Math.random() * 0.02, act: 0, col: "255,255,255",
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        const R = 220, R2 = R * R;
        for (const p of ps) {
          p.x += p.vx * f; p.y += p.vy * f; p.tw += p.tws * f;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
          p.col = tint(p.x, p.y);
          let target = 0;
          if (pointer.active) { const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy; if (d2 < R2) target = 1 - Math.sqrt(d2) / R; }
          p.act += (target - p.act) * Math.min(1, 0.11 * f);
        }
        const maxD = 150, maxD2 = maxD * maxD;
        ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y));
              if (cz <= 0) continue;
              const prox = 1 - Math.sqrt(d2) / maxD;
              const energy = Math.max(ps[i].act, ps[j].act);
              const a = prox * (0.15 + 0.26 * energy) * cz;
              if (a > 0.003) { ctx.strokeStyle = `rgba(${ps[i].col},${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        if (pointer.active) {
          for (const p of ps) {
            if (p.act > 0.01) {
              const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
              ctx.strokeStyle = `rgba(${p.col},${p.act * 0.3 * cz})`;
              ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(p.x, p.y); ctx.stroke();
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          const a = (0.42 + 0.26 * p.act) * tw * cz;
          const r = 1.2 + p.act * 0.6;
          if (p.act > 0.05) {
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
            g.addColorStop(0, `rgba(${p.col},${0.32 * p.act * cz})`);
            g.addColorStop(1, `rgba(${p.col},0)`);
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.6, 0, 6.2832); ctx.fill();
          }
          ctx.fillStyle = `rgba(${p.col},${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "mesh") {
      // THREE MAJOR abstract geometric shapes (one larger + two slightly smaller), each a distinct
      // non-circular FORM filled with specks, floating around the page and morphing. A tight cursor
      // lens gently warps whatever it passes over.
      type Cl = { cx: number; cy: number; vx: number; vy: number; maxD: number };
      type P = { clu: number; hox: number; hoy: number; amp: number; ph: number; w1: number; w2: number; tw: number; tws: number; act: number; x: number; y: number; sx: number; sy: number };
      let cls: Cl[] = [];
      let ps: P[] = [];
      let mt = 0;
      initPattern = () => {
        mt = 0;
        // Three MAJOR complex shapes: one larger, two slightly smaller. diam = diameter / screen width.
        const shapes = [
          { x: 0.27, y: 0.38, diam: 0.54, k: 33, form: "blade" }, // large leaf (left)
          { x: 0.78, y: 0.40, diam: 0.42, k: 27, form: "arc" },   // large crescent band (right)
        ];
        cls = shapes.map((s) => {
          const cr = s.diam * w * 0.5;
          const md = s.form === "arc" ? cr * 0.72 : s.form === "bolt" ? cr * 0.78 : cr * 0.74; // longer reach → fewer nodes culled
          return { cx: s.x * w, cy: s.y * h, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, maxD: md };
        });
        ps = [];
        for (let ci = 0; ci < cls.length; ci++) {
          const s = shapes[ci];
          const cr = s.diam * w * 0.5; // radius in px
          for (let k = 0; k < s.k; k++) {
            let hox = 0, hoy = 0;
            if (s.form === "arc") {
              const a = -2.1 + 4.2 * Math.random();            // random angle across the sweep
              const dd = cr * (0.5 + 0.5 * Math.random());     // random radius → fills the crescent band
              hox = Math.cos(a) * dd; hoy = Math.sin(a) * dd;
            } else if (s.form === "bolt") {
              const t = Math.random();
              const center = Math.sin(t * Math.PI * 3) * cr * 0.45; // wavy lightning centerline
              hox = (t * 2 - 1) * cr * 1.15;
              hoy = (t * 2 - 1) * cr * 0.3 + center + (Math.random() - 0.5) * cr * 0.45; // fill the ribbon thickness
            } else { // blade: filled elongated leaf
              const tt = Math.random() * 2 - 1;                // random along length
              const prof = Math.max(0.14, Math.cos(tt * 1.4)); // fat middle, pointed ends
              /* 0.95, down from 1.5. At 1.5 the leaf reached 0.675w while the
                 arc starts at 0.57w, so the two always overlapped by ~0.105w and
                 the leaf ran ~0.135w off the left edge — at every screen size,
                 since both scale off width. They read as one sprawl rather than
                 two shapes. At 0.95 the leaf spans 0.01w–0.53w and clears the
                 arc with a gap. Diameter is untouched, so it stays the large
                 form; it is simply less elongated. */
              hox = tt * cr * 0.95;
              hoy = (Math.random() * 2 - 1) * cr * 0.6 * prof; // fill within the leaf thickness
            }
            ps.push({
              clu: ci,
              hox, hoy,
              amp: cr * (0.06 + 0.05 * Math.random()),
              ph: Math.random() * 6.2832,
              w1: 0.25 + Math.random() * 0.3, w2: 0.22 + Math.random() * 0.3,
              tw: Math.random() * 6.2832, tws: 0.005 + Math.random() * 0.012,
              act: 0, x: 0, y: 0, sx: 0, sy: 0,
            });
          }
        }
      };
      drawPattern = (dt) => {
        const f = dt / 16.67; mt += dt * 0.001;
        const R = 280, R2 = R * R;      // soft brightening reach
        const DR = 160, DR2 = DR * DR;  // distortion "blast radius"
        // shapes float freely around the page, bounded to a margin
        const mx = w * 0.1, my = h * 0.1;
        for (const cl of cls) {
          cl.cx += cl.vx * f; cl.cy += cl.vy * f;
          if (cl.cx < mx || cl.cx > w - mx) cl.vx *= -1;
          if (cl.cy < my || cl.cy > h - my) cl.vy *= -1;
          cl.cx = Math.max(mx, Math.min(w - mx, cl.cx)); cl.cy = Math.max(my, Math.min(h - my, cl.cy));
        }
        for (const p of ps) {
          const cl = cls[p.clu];
          p.x = cl.cx + p.hox + Math.cos(mt * p.w1 + p.ph) * p.amp;       // wobble → the shape morphs
          p.y = cl.cy + p.hoy + Math.sin(mt * p.w2 + p.ph * 1.3) * p.amp;
          p.tw += p.tws * f;
          p.sx = p.x; p.sy = p.y;
          let target = 0;
          if (pointer.active) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < R2) target = 1 - Math.sqrt(d2) / R;
            if (d2 < DR2 && d2 > 0.01) { // tight lens push
              const dist = Math.sqrt(d2), k = 1 - dist / DR, push = k * k * 22;
              p.sx = p.x + (dx / dist) * push; p.sy = p.y + (dy / dist) * push;
            }
          }
          p.act += (target - p.act) * Math.min(1, 0.1 * f);
        }
        ctx.lineWidth = 1;
        const deg = new Array(ps.length).fill(0); // track connections → cull stray specks
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            if (ps[i].clu !== ps[j].clu) continue; // connect only within the same shape
            const maxD = cls[ps[i].clu].maxD, maxD2 = maxD * maxD; // reach scales with the shape's size
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y)); if (cz <= 0) continue;
              const prox = 1 - Math.sqrt(d2) / maxD;
              const energy = Math.max(ps[i].act, ps[j].act);
              const a = prox * (0.17 + 0.3 * energy) * cz;
              if (a > 0.004) { deg[i]++; deg[j]++; ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(ps[i].sx, ps[i].sy); ctx.lineTo(ps[j].sx, ps[j].sy); ctx.stroke(); }
            }
          }
        }
        if (pointer.active) {
          for (let k = 0; k < ps.length; k++) { const p = ps[k]; if (deg[k] === 0 || p.act <= 0.01) continue; const cz = clearZone(p.x, p.y); if (cz <= 0) continue; ctx.strokeStyle = `rgba(255,255,255,${p.act * 0.22 * cz})`; ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(p.sx, p.sy); ctx.stroke(); }
        }
        for (let k = 0; k < ps.length; k++) {
          const p = ps[k];
          if (deg[k] === 0) continue; // no connections → don't draw a lone speck
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.64 + 0.36 * Math.sin(p.tw);
          const a = (0.52 + 0.3 * p.act) * tw * cz;
          const r = 1.8 + p.act * 0.9;
          const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, r * 2.7);
          g.addColorStop(0, `rgba(255,255,255,${0.38 * a})`);
          g.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 2.7, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(p.sx, p.sy, r * 0.55, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "cases") {
      // THREE CASE-STUDY CONSTELLATIONS: one filled shape per project, each in its accent, placed
      // asymmetrically with real negative space. Crisp (no twinkle), thin accent lines, quiet glow.
      type Cl = { cx: number; cy: number; vx: number; vy: number; maxD: number; col: string; form: string; cr: number };
      type P = { clu: number; hox: number; hoy: number; amp: number; ph: number; w1: number; w2: number; life: number; ls: number; pres: number; x: number; y: number; sx: number; sy: number };
      let cls: Cl[] = [];
      let ps: P[] = [];
      let mt = 0;
      const genOffset = (form: string, cr: number) => {
        if (form === "arc") { const a = -2.1 + 4.2 * Math.random(), dd = cr * (0.5 + 0.5 * Math.random()); return { hox: Math.cos(a) * dd, hoy: Math.sin(a) * dd }; }
        if (form === "bolt") { const t = Math.random(), c = Math.sin(t * Math.PI * 3) * cr * 0.45; return { hox: (t * 2 - 1) * cr * 1.15, hoy: (t * 2 - 1) * cr * 0.3 + c + (Math.random() - 0.5) * cr * 0.45 }; }
        const tt = Math.random() * 2 - 1, prof = Math.max(0.14, Math.cos(tt * 1.4)); return { hox: tt * cr * 1.5, hoy: (Math.random() * 2 - 1) * cr * 0.6 * prof };
      };
      initPattern = () => {
        mt = 0;
        // Commerce (gold) dominant lower-left; WhatsApp (green) + Search (blue), upper-right. Larger.
        const shapes = [
          { x: 0.28, y: 0.64, diam: 0.42, k: 30, form: "blade", col: "249,160,74" },
          { x: 0.80, y: 0.24, diam: 0.22, k: 18, form: "arc", col: "106,238,154" },
          { x: 0.84, y: 0.54, diam: 0.20, k: 16, form: "bolt", col: "163,186,255" },
        ];
        cls = shapes.map((s) => {
          const cr = s.diam * w * 0.5;
          const md = s.form === "arc" ? cr * 0.6 : s.form === "bolt" ? cr * 0.64 : cr * 0.62;
          return { cx: s.x * w, cy: s.y * h, vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14, maxD: md, col: s.col, form: s.form, cr };
        });
        ps = [];
        for (let ci = 0; ci < cls.length; ci++) {
          const s = shapes[ci], cr = cls[ci].cr;
          for (let k = 0; k < s.k; k++) {
            const o = genOffset(s.form, cr);
            ps.push({ clu: ci, hox: o.hox, hoy: o.hoy, amp: cr * (0.05 + 0.04 * Math.random()), ph: Math.random() * 6.2832, w1: 0.2 + Math.random() * 0.22, w2: 0.18 + Math.random() * 0.22, life: Math.random(), ls: 0.06 + 0.08 * Math.random(), pres: 0, x: 0, y: 0, sx: 0, sy: 0 });
          }
        }
      };
      drawPattern = (dt) => {
        const f = dt / 16.67; mt += dt * 0.001;
        const DR = 150, DR2 = DR * DR;
        const mx = w * 0.08, my = h * 0.08;
        for (const cl of cls) {
          cl.cx += cl.vx * f; cl.cy += cl.vy * f;
          if (cl.cx < mx || cl.cx > w - mx) cl.vx *= -1;
          if (cl.cy < my || cl.cy > h - my) cl.vy *= -1;
          cl.cx = Math.max(mx, Math.min(w - mx, cl.cx)); cl.cy = Math.max(my, Math.min(h - my, cl.cy));
        }
        for (const p of ps) {
          const cl = cls[p.clu];
          p.life += p.ls * dt * 0.001;
          if (p.life >= 1) { p.life -= 1; const o = genOffset(cl.form, cl.cr); p.hox = o.hox; p.hoy = o.hoy; p.ph = Math.random() * 6.2832; } // respawn elsewhere in the shape
          p.pres = Math.sin(Math.max(0, Math.min(1, p.life)) * Math.PI); // fade in → out
          p.x = cl.cx + p.hox + Math.cos(mt * p.w1 + p.ph) * p.amp;
          p.y = cl.cy + p.hoy + Math.sin(mt * p.w2 + p.ph * 1.3) * p.amp;
          p.sx = p.x; p.sy = p.y;
          if (pointer.active) {
            const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy;
            if (d2 < DR2 && d2 > 0.01) { const dist = Math.sqrt(d2), k = 1 - dist / DR, push = k * k * 18; p.sx = p.x + (dx / dist) * push; p.sy = p.y + (dy / dist) * push; }
          }
        }
        ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            if (ps[i].clu !== ps[j].clu) continue;
            const cl = cls[ps[i].clu];
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < cl.maxD * cl.maxD) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y)); if (cz <= 0) continue;
              const a = (1 - Math.sqrt(d2) / cl.maxD) * 0.16 * cz * Math.min(ps[i].pres, ps[j].pres);
              if (a > 0.004) { ctx.strokeStyle = `rgba(${cl.col},${a})`; ctx.beginPath(); ctx.moveTo(ps[i].sx, ps[i].sy); ctx.lineTo(ps[j].sx, ps[j].sy); ctx.stroke(); }
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const cl = cls[p.clu];
          const a = 0.62 * cz * p.pres;
          if (a < 0.004) continue;
          const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, 3.4);
          g.addColorStop(0, `rgba(${cl.col},${0.28 * a})`); g.addColorStop(1, `rgba(${cl.col},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.sx, p.sy, 3.4, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(${cl.col},${a})`; ctx.beginPath(); ctx.arc(p.sx, p.sy, 1.4, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "wind") {
      // 3D wireframe geometric solids (cube / tetra / octa / prism) slowly floating in from the LEFT,
      // rotating in 3D and drifting out the right, then respawning as a new random solid. Same
      // glow-vertex + edge aesthetic, monochrome, with depth-shaded brightness.
      type Solid = { verts: number[][]; edges: number[][] };
      const R3 = 2.0944; // 120°
      const SOLIDS: Solid[] = [
        { verts: [[-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]],
          edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]] }, // cube
        { verts: [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
          edges: [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]] }, // tetrahedron
        { verts: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
          edges: [[0, 2], [0, 3], [0, 4], [0, 5], [1, 2], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5], [3, 4], [3, 5]] }, // octahedron
        { verts: [[Math.cos(0), Math.sin(0), 1], [Math.cos(R3), Math.sin(R3), 1], [Math.cos(2 * R3), Math.sin(2 * R3), 1], [Math.cos(0), Math.sin(0), -1], [Math.cos(R3), Math.sin(R3), -1], [Math.cos(2 * R3), Math.sin(2 * R3), -1]],
          edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3], [0, 3], [1, 4], [2, 5]] }, // triangular prism
      ];
      type Sh = { cx: number; cy: number; cr: number; vx: number; ax: number; ay: number; vax: number; vay: number; ph: number; sway: number; solid: Solid };
      let shs: Sh[] = [];
      let wt = 0;
      const spawn = (sh: Sh, initial: boolean) => {
        sh.cr = Math.min(w, h) * (0.06 + Math.random() * 0.06);
        sh.solid = SOLIDS[Math.floor(Math.random() * SOLIDS.length)];
        sh.cx = initial ? Math.random() * w : -sh.cr * 2 - 20;
        sh.cy = h * (0.12 + 0.76 * Math.random());
        sh.vx = 0.12 + Math.random() * 0.18;                 // MUCH slower drift — slowly floating
        sh.ax = Math.random() * 6.2832; sh.ay = Math.random() * 6.2832;
        sh.vax = (Math.random() - 0.5) * 0.006; sh.vay = (Math.random() - 0.5) * 0.006;
        sh.ph = Math.random() * 6.2832; sh.sway = sh.cr * (0.15 + 0.35 * Math.random());
      };
      initPattern = () => {
        wt = 0;
        const N = Math.min(6, Math.max(3, Math.round(w / 420)));
        shs = [];
        for (let i = 0; i < N; i++) { const sh = {} as Sh; spawn(sh, true); shs.push(sh); }
      };
      drawPattern = (dt) => {
        const f = dt / 16.67; wt += dt * 0.001;
        ctx.lineWidth = 1;
        const FOV = 4.0;
        for (const sh of shs) {
          sh.cx += sh.vx * f; sh.ax += sh.vax * f; sh.ay += sh.vay * f;
          if (sh.cx - sh.cr * 2 > w + 40) spawn(sh, false);
          const cy = sh.cy + Math.sin(wt * 0.4 + sh.ph) * sh.sway;
          const cax = Math.cos(sh.ax), sax = Math.sin(sh.ax), cay = Math.cos(sh.ay), say = Math.sin(sh.ay);
          const pts = sh.solid.verts.map((v) => {
            const x = v[0], y = v[1], z = v[2];
            const x1 = x * cay + z * say, z1 = -x * say + z * cay;
            const y2 = y * cax - z1 * sax, z2 = y * sax + z1 * cax;
            const persp = FOV / (FOV - z2);
            return { x: sh.cx + x1 * sh.cr * persp, y: cy + y2 * sh.cr * persp, d: z2 };
          });
          for (const e of sh.solid.edges) {
            const a0 = pts[e[0]], b0 = pts[e[1]];
            const cz = Math.min(clearZone(a0.x, a0.y), clearZone(b0.x, b0.y)); if (cz <= 0) continue;
            const depth = 0.5 + 0.22 * (a0.d + b0.d); // nearer edges brighter
            ctx.strokeStyle = `rgba(255,255,255,${0.2 * cz * Math.max(0.25, depth)})`;
            ctx.beginPath(); ctx.moveTo(a0.x, a0.y); ctx.lineTo(b0.x, b0.y); ctx.stroke();
          }
          for (const pt of pts) {
            const cz = clearZone(pt.x, pt.y); if (cz <= 0) continue;
            const br = Math.max(0, 0.6 * cz * (0.5 + 0.3 * pt.d));
            const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 3.2);
            g.addColorStop(0, `rgba(255,255,255,${0.3 * br})`); g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pt.x, pt.y, 3.2, 0, 6.2832); ctx.fill();
            ctx.fillStyle = `rgba(255,255,255,${br})`; ctx.beginPath(); ctx.arc(pt.x, pt.y, 1.4, 0, 6.2832); ctx.fill();
          }
        }
      };
    } else if (pattern === "spectrum") {
      // BOLD COLOR: dots + links glow in commerce gold / search blue / whatsapp green by region,
      // additively blended so overlaps bloom. Unmistakably colorful, still calm.
      type P = { x: number; y: number; vx: number; vy: number; tw: number; tws: number; act: number; col: string };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(46, Math.round((w * h) / 40000));
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
          tw: Math.random() * 6.2832, tws: 0.006 + Math.random() * 0.014, act: 0, col: "255,255,255",
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67; const R = 220, R2 = R * R;
        for (const p of ps) {
          p.x += p.vx * f; p.y += p.vy * f; p.tw += p.tws * f;
          if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
          p.col = tint(p.x, p.y, 0.32); // refined accent — colored, not garish
          let target = 0; if (pointer.active) { const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy; if (d2 < R2) target = 1 - Math.sqrt(d2) / R; }
          p.act += (target - p.act) * Math.min(1, 0.11 * f);
        }
        const maxD = Math.max(w, h) * 0.2, maxD2 = maxD * maxD; ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y)); if (cz <= 0) continue;
              const prox = 1 - Math.sqrt(d2) / maxD;
              const energy = Math.max(ps[i].act, ps[j].act);
              const a = prox * (0.16 + 0.24 * energy) * cz;
              if (a > 0.004) { ctx.strokeStyle = `rgba(${ps[i].col},${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        if (pointer.active) {
          for (const p of ps) { if (p.act > 0.01) { const cz = clearZone(p.x, p.y); if (cz <= 0) continue; ctx.strokeStyle = `rgba(${p.col},${p.act * 0.3 * cz})`; ctx.beginPath(); ctx.moveTo(pointer.x, pointer.y); ctx.lineTo(p.x, p.y); ctx.stroke(); } }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(p.tw);
          const a = (0.4 + 0.3 * p.act) * tw * cz;
          const r = 1.5 + p.act * 0.8;
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.6);
          g.addColorStop(0, `rgba(${p.col},${0.4 * a})`);
          g.addColorStop(1, `rgba(${p.col},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, r * 2.6, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(${p.col},${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.62, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "plexus") {
      // DENSE + FINE: many small dots woven by short links — a tight techy mesh kept quiet with low
      // alpha. Reads as texture rather than individual stars.
      type P = { x: number; y: number; vx: number; vy: number; act: number };
      let ps: P[] = [];
      initPattern = () => {
        const n = Math.min(84, Math.round((w * h) / 17000));
        ps = Array.from({ length: n }, () => ({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16, act: 0,
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67; const R = 170, R2 = R * R;
        for (const p of ps) {
          p.x += p.vx * f; p.y += p.vy * f;
          if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
          p.x = Math.max(0, Math.min(w, p.x)); p.y = Math.max(0, Math.min(h, p.y));
          let target = 0; if (pointer.active) { const dx = p.x - pointer.x, dy = p.y - pointer.y, d2 = dx * dx + dy * dy; if (d2 < R2) target = 1 - Math.sqrt(d2) / R; }
          p.act += (target - p.act) * Math.min(1, 0.12 * f);
        }
        const maxD = 108, maxD2 = maxD * maxD; ctx.lineWidth = 1;
        for (let i = 0; i < ps.length; i++) {
          for (let j = i + 1; j < ps.length; j++) {
            const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d2 = dx * dx + dy * dy;
            if (d2 < maxD2) {
              const cz = Math.min(clearZone(ps[i].x, ps[i].y), clearZone(ps[j].x, ps[j].y)); if (cz <= 0) continue;
              const prox = 1 - Math.sqrt(d2) / maxD;
              const energy = Math.max(ps[i].act, ps[j].act);
              const a = prox * (0.09 + 0.4 * energy) * cz;
              if (a > 0.004) { ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke(); }
            }
          }
        }
        for (const p of ps) {
          const cz = clearZone(p.x, p.y); if (cz <= 0) continue;
          const a = (0.3 + 0.4 * p.act) * cz;
          ctx.fillStyle = `rgba(255,255,255,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, 0.9 + p.act * 0.6, 0, 6.2832); ctx.fill();
        }
      };
    } else if (pattern === "silk") {
      // COLOR FIELD: large soft accent blobs drift and breathe behind heavy softness — a premium,
      // silky gradient hero (Linear / Stripe energy). No dots at all.
      type B = { x: number; y: number; r: number; c: string; ph: number; vx: number; vy: number };
      let blobs: B[] = [];
      const cols = [ACCENTS[0], ACCENTS[2], ACCENTS[1], ACCENTS[2]]; // gold, blue, green, blue
      initPattern = () => {
        blobs = cols.map((c, i) => ({
          x: w * (0.22 + 0.2 * i), y: h * (0.42 + 0.16 * (i % 2 ? 1 : -1)),
          r: Math.max(w, h) * (0.42 + 0.08 * (i % 2)), c, ph: (i / cols.length) * 6.2832,
          vx: (i % 2 ? 1 : -1) * 0.07, vy: (i % 3 ? -1 : 1) * 0.06,
        }));
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        ctx.globalCompositeOperation = "lighter";
        for (const b of blobs) {
          b.ph += 0.0004 * dt;
          b.x += b.vx * f; b.y += b.vy * f;
          if (b.x < w * 0.12 || b.x > w * 0.88) b.vx *= -1;
          if (b.y < h * 0.12 || b.y > h * 0.88) b.vy *= -1;
          const r = b.r * (0.9 + 0.1 * Math.sin(b.ph));
          const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, r);
          g.addColorStop(0, `rgba(${b.c},0.1)`);
          g.addColorStop(0.5, `rgba(${b.c},0.04)`);
          g.addColorStop(1, `rgba(${b.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, 6.2832); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      };
    } else if (pattern === "contour") {
      // LINE-ART: animated topographic contour lines undulate across the page and bend toward the
      // cursor. Editorial, distinctive, monochrome.
      let t = 0;
      const ROWS = 22;
      drawPattern = (dt) => {
        t += dt;
        ctx.lineWidth = 1;
        const gap = h / ROWS;
        for (let li = -1; li <= ROWS + 1; li++) {
          const yBase = li * gap;
          const vf = Math.min(1, Math.abs(yBase - h / 2) / (h * 0.24)); // fade lines behind the name
          const alpha = 0.065 * (0.18 + 0.82 * vf);
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          for (let x = 0; x <= w; x += 8) {
            const n = Math.sin(x * 0.006 + t * 0.0006 + li * 0.5)
              + 0.5 * Math.sin(x * 0.013 - t * 0.0004 + li * 0.9)
              + 0.3 * Math.sin(x * 0.02 + t * 0.0009);
            let y = yBase + n * gap * 0.6;
            if (pointer.active) {
              const dx = x - pointer.x, dy = yBase - pointer.y, d2 = dx * dx + dy * dy, R = 210;
              if (d2 < R * R) { const k = 1 - Math.sqrt(d2) / R; y -= k * k * 42; }
            }
            if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      };
    } else if (pattern === "beam") {
      // LIGHT REVEAL: a dark field of faint dots; a soft light (the cursor, or a slow auto-drift)
      // sweeps across and illuminates the grid it passes over. Dramatic, minimal, interactive.
      let t = 0;
      const SP = 34;
      drawPattern = (dt) => {
        t += dt;
        const lx = pointer.active ? pointer.x : w * (0.5 + 0.34 * Math.sin(t * 0.0004));
        const ly = pointer.active ? pointer.y : h * (0.5 + 0.3 * Math.cos(t * 0.00031));
        const R = 270, R2 = R * R;
        const halo = ctx.createRadialGradient(lx, ly, 0, lx, ly, R);
        halo.addColorStop(0, "rgba(163,186,255,0.07)");
        halo.addColorStop(1, "rgba(163,186,255,0)");
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(lx, ly, R, 0, 6.2832); ctx.fill();
        for (let x = (w / 2) % SP; x < w; x += SP) {
          for (let y = (h / 2) % SP; y < h; y += SP) {
            const dx = x - lx, dy = y - ly, d2 = dx * dx + dy * dy;
            let a = 0.04, r = 0.8;
            if (d2 < R2) { const k = 1 - Math.sqrt(d2) / R; a += k * 0.5; r += k * 1.2; }
            a *= 0.28 + 0.72 * clearZone(x, y); // keep the center calm behind the card
            ctx.fillStyle = `rgba(255,255,255,${a})`;
            ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
          }
        }
      };
    } else if (pattern === "gradient") {
      // PREMIUM COLOR: an animated mesh-gradient — soft color points orbit and blend via screen, over
      // a fine film-grain overlay that keeps it looking expensive rather than cute.
      type Pt = { bx: number; by: number; ax: number; ay: number; sx: number; sy: number; ph: number; c: string };
      const palette = [ACCENTS[0], ACCENTS[2], ACCENTS[1], "132,120,255", "255,150,96"];
      let pts: Pt[] = [];
      let grain: HTMLCanvasElement | null = null;
      let t = 0;
      initPattern = () => {
        pts = palette.map((c, i) => ({
          bx: 0.5 + 0.3 * Math.cos((i / palette.length) * 6.2832),
          by: 0.5 + 0.3 * Math.sin((i / palette.length) * 6.2832),
          ax: 0.14 + 0.06 * (i % 3), ay: 0.12 + 0.05 * (i % 2),
          sx: 0.00006 + 0.00003 * i, sy: 0.00008 + 0.00002 * i, ph: i * 1.3, c,
        }));
        grain = document.createElement("canvas");
        grain.width = grain.height = 140;
        const gx = grain.getContext("2d");
        if (gx) {
          const id = gx.createImageData(140, 140);
          for (let k = 0; k < id.data.length; k += 4) {
            const v = 110 + Math.floor(Math.random() * 145);
            id.data[k] = id.data[k + 1] = id.data[k + 2] = v; id.data[k + 3] = 255;
          }
          gx.putImageData(id, 0, 0);
        }
      };
      drawPattern = (dt) => {
        t += dt;
        ctx.globalCompositeOperation = "screen";
        for (const p of pts) {
          const cx = (p.bx + p.ax * Math.sin(t * p.sx + p.ph)) * w;
          const cy = (p.by + p.ay * Math.cos(t * p.sy + p.ph * 1.3)) * h;
          const r = Math.max(w, h) * 0.55;
          const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
          g.addColorStop(0, `rgba(${p.c},0.22)`);
          g.addColorStop(0.5, `rgba(${p.c},0.08)`);
          g.addColorStop(1, `rgba(${p.c},0)`);
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.2832); ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
        if (grain) {
          ctx.save();
          ctx.globalAlpha = 0.05;
          const jx = -Math.floor(Math.random() * 140), jy = -Math.floor(Math.random() * 140);
          for (let x = jx; x < w; x += 140) for (let y = jy; y < h; y += 140) ctx.drawImage(grain, x, y);
          ctx.restore();
        }
      };
    } else if (pattern === "circuit") {
      // MESH, ALIVE: a stable nearest-neighbor node graph (the look you liked) with soft signal
      // pulses that travel along the connections. Structured + clean, but it breathes.
      type N = { hx: number; hy: number; x: number; y: number; ph: number; tw: number; tws: number };
      type E = { a: number; b: number };
      type Pulse = { e: number; t: number; sp: number };
      let ns: N[] = [], es: E[] = [], pulses: Pulse[] = [], spawn = 0;
      initPattern = () => {
        const n = Math.min(30, Math.max(16, Math.round((w * h) / 48000)));
        ns = Array.from({ length: n }, () => {
          const hx = Math.random() * w, hy = Math.random() * h;
          return { hx, hy, x: hx, y: hy, ph: Math.random() * 6.2832, tw: Math.random() * 6.2832, tws: 0.005 + Math.random() * 0.01 };
        });
        const seen = new Set<string>();
        es = [];
        for (let i = 0; i < ns.length; i++) {
          const near = ns.map((q, j) => ({ j, d: (ns[i].hx - q.hx) ** 2 + (ns[i].hy - q.hy) ** 2 })).filter((o) => o.j !== i).sort((a, b) => a.d - b.d);
          for (let k = 0; k < 2 && k < near.length; k++) {
            const j = near[k].j, key = i < j ? `${i}_${j}` : `${j}_${i}`;
            if (!seen.has(key)) { seen.add(key); es.push({ a: i, b: j }); }
          }
        }
        pulses = []; spawn = 0;
      };
      drawPattern = (dt) => {
        const f = dt / 16.67;
        for (const nd of ns) { nd.ph += 0.0003 * dt; nd.x = nd.hx + Math.cos(nd.ph) * 10; nd.y = nd.hy + Math.sin(nd.ph * 1.2) * 10; nd.tw += nd.tws * f; }
        ctx.lineWidth = 1;
        for (const e of es) {
          const na = ns[e.a], nb = ns[e.b];
          const cz = Math.min(clearZone(na.x, na.y), clearZone(nb.x, nb.y)); if (cz <= 0) continue;
          ctx.strokeStyle = `rgba(255,255,255,${0.09 * cz})`;
          ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
        }
        spawn += dt;
        if (spawn > 420 && pulses.length < 10 && es.length) { spawn = 0; pulses.push({ e: Math.floor(Math.random() * es.length), t: 0, sp: 0.008 + Math.random() * 0.006 }); }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const pu = pulses[i]; pu.t += pu.sp * f;
          if (pu.t >= 1) { pulses.splice(i, 1); continue; }
          const e = es[pu.e]; if (!e) { pulses.splice(i, 1); continue; }
          const na = ns[e.a], nb = ns[e.b];
          const px = na.x + (nb.x - na.x) * pu.t, py = na.y + (nb.y - na.y) * pu.t;
          const cz = clearZone(px, py); if (cz <= 0) continue;
          const g = ctx.createRadialGradient(px, py, 0, px, py, 9);
          g.addColorStop(0, `rgba(163,186,255,${0.5 * cz})`);
          g.addColorStop(1, "rgba(163,186,255,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, 9, 0, 6.2832); ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${0.9 * cz})`;
          ctx.beginPath(); ctx.arc(px, py, 1.6, 0, 6.2832); ctx.fill();
        }
        for (const nd of ns) {
          const cz = clearZone(nd.x, nd.y); if (cz <= 0) continue;
          const tw = 0.6 + 0.4 * Math.sin(nd.tw);
          ctx.fillStyle = `rgba(255,255,255,${0.5 * tw * cz})`;
          ctx.beginPath(); ctx.arc(nd.x, nd.y, 1.7, 0, 6.2832); ctx.fill();
        }
      };
    }

    resize();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerleave", onLeave);
    }

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      ctx.clearRect(0, 0, w, h);
      drawBackdrop(dt);
      drawPattern(dt);
      raf = requestAnimationFrame(loop);
    };
    if (reduce) { ctx.clearRect(0, 0, w, h); drawBackdrop(16); drawPattern(16); }
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [pattern, backdrop, interactive]);

  return <canvas ref={canvasRef} className="absolute inset-0" />;
}
