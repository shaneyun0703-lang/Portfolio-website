import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GateBackground, type GatePattern } from "./GateBackground";
import { GateWebGL } from "./GateWebGL";
import { GateField } from "./GateField";
import { GateSheet } from "./GateSheet";
import { GateTunnel } from "./GateTunnel";

const SITE_PASSWORD = "openSesame";
const STORAGE_KEY = "portfolio_auth";

const DISCLAIMER_PREFIX = "Request access via ";
const DISCLAIMER_EMAIL = "shane.yun0703@gmail.com";
const DISCLAIMER_FULL = DISCLAIMER_PREFIX + DISCLAIMER_EMAIL;

// Wholesome single-glyph emoji pool — no faces/hands/racy/flags. Rendered grayscale (black & white).
const EMOJI_POOL = [
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵","🐔","🐧","🐦","🦆","🦉","🦄","🐝","🐢","🐠","🐬","🐳","🦋","🐞","🐙","🦀","🐌",
  "🍎","🍊","🍋","🍉","🍓","🍒","🍍","🥝","🥥","🍅","🥕","🌽","🍄","🍞","🧀","🍕","🍔","🌮","🍩","🍪","🎂","🍰","🍦","🍫","🍿","🥐",
  "🌵","🌲","🌳","🌴","🌱","🌿","🍀","🍁","🌷","🌸","🌹","🌻","🌼","🌙","⭐","🌟","⚡","🔥","🌈","☀️","⛄","🌊",
  "⚽","🏀","🏈","⚾","🎾","🎱","🎸","🎹","🎺","🎻","🥁","🎨","🚀","✈️","🚗","🚲","⛵","🎈","🎁","🔔","💡","📷","🔭","🧭","⏰","🔑","🧩","🎲","🪁",
];
const randomEmoji = () => EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];

// `onUnlock` is additive and optional — used only by the handoff preview chain
// (/handoff/unlock) so it can animate the gate out before handing off. Existing
// callers pass nothing and behave exactly as before.
export function PasswordGate({ children, preview = false, onUnlock }: { children: React.ReactNode; preview?: boolean; onUnlock?: () => void }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");        // the real password
  const [emojis, setEmojis] = useState<string[]>([]);  // one stable random emoji per typed char
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Intro choreography: stars bloom → card wipes in → placeholder + disclaimer type out.
  const [introStarted, setIntroStarted] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [placeholder, setPlaceholder] = useState("");
  const [enterLabel] = useState("enter"); // lowercase, shows immediately (not typed out)
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const reduce = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setIntroStarted(true); setShowCard(true);
      setPlaceholder("Enter password"); setTyped(DISCLAIMER_FULL);
      return;
    }
    let cancelled = false;
    const ids: number[] = [];
    const wait = (ms: number) => new Promise<void>((res) => { ids.push(window.setTimeout(res, ms)); });
    const type = (full: string, setter: (s: string) => void, speed: number) =>
      new Promise<void>((res) => {
        let i = 0;
        const id = window.setInterval(() => {
          if (cancelled) { window.clearInterval(id); return; }
          i += 1; setter(full.slice(0, i));
          if (i >= full.length) { window.clearInterval(id); res(); }
        }, speed);
        ids.push(id);
      });
    (async () => {
      /* Timings are half what they were. The old sequence held the card back
         1.7s and did not finish typing the placeholder until ~3.5s, which meant
         the first seconds of the page were an empty black screen with nothing
         to act on — intentional to anyone waiting for it, broken to anyone who
         is not. The order of the beats is unchanged; only the waiting is. */
      await wait(120); if (cancelled) return; setIntroStarted(true);   // shapes bloom in
      await wait(700); if (cancelled) return; setShowCard(true);        // card wipes in
      await wait(350); if (cancelled) return;
      await type("Enter password", setPlaceholder, 72); if (cancelled) return;
      await wait(450);
      await type(DISCLAIMER_FULL, setTyped, 70);
    })();
    return () => { cancelled = true; ids.forEach((id) => { window.clearTimeout(id); window.clearInterval(id); }); };
  }, []);

  useEffect(() => {
    if (!preview && localStorage.getItem(STORAGE_KEY) === "true") {
      setAuthenticated(true);
    }
  }, [preview]);

  // Reset reveal (and hide the eye toggle) once the field is emptied.
  useEffect(() => { if (password.length === 0 && showPassword) setShowPassword(false); }, [password, showPassword]);

  // We drive the input value ourselves (emoji mask), so keep the caret pinned to the end
  // and the view scrolled to follow the latest character when it overflows the field.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    if (document.activeElement === el) {
      const len = (showPassword ? password : emojis.join("")).length;
      try { el.setSelectionRange(len, len); } catch { /* noop */ }
    }
    el.scrollLeft = el.scrollWidth;
  }, [password, emojis, showPassword]);

  // Capture keystrokes directly so each real character maps to a masked emoji.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.metaKey || e.ctrlKey || e.altKey) return; // submit / shortcuts pass through
    if (e.key === "Backspace") {
      e.preventDefault();
      setPassword((p) => p.slice(0, -1));
      setEmojis((a) => a.slice(0, -1));
      setError(false);
      return;
    }
    if (e.key.length === 1) {
      e.preventDefault();
      const ch = e.key;
      setPassword((p) => p + ch);
      setEmojis((a) => [...a, randomEmoji()]);
      setError(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!text) return;
    const chars = Array.from(text);
    setPassword((p) => p + chars.join(""));
    setEmojis((a) => [...a, ...chars.map(() => randomEmoji())]);
    setError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      setError(false);
      onUnlock?.();
    } else {
      setError(true);
    }
  };

  if (authenticated && !preview) return <>{children}</>;

  // Only restyle for the emoji mask once something is typed — leaves the placeholder untouched.
  const masked = !showPassword && password.length > 0;
  const hasText = password.length > 0; // container only tints green once something is typed
  // Iteration toggle: ?edges=bright renders the constellations ABOVE the edge vignette so only the
  // grid fades at the outer edges — the stars/web stay full-brightness to the corners.
  // Prod ships bright edges (vignette below the canvas), so default to bright; ?edges=off to disable.
  const brightEdges = typeof window === "undefined" || new URLSearchParams(window.location.search).get("edges") !== "off";
  // No grid by default (matches the live gate). ?grid=on brings it back for comparison.
  const showGrid = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("grid") === "on";
  // Iteration picker: ?float=network|flow|depth|lattice swaps the constellation for a floating
  // connecting-dots background. Anything else keeps the current constellation experience.
  const floatParam = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("float") : null;
  const FLOATS = ["network", "flow", "depth", "lattice", "web", "ink", "aura", "mesh", "spectrum", "plexus", "silk", "contour", "beam", "gradient", "circuit", "cases", "wind"];
  const pattern: GatePattern = floatParam && FLOATS.includes(floatParam) ? (floatParam as GatePattern) : "mesh"; // prod default
  // WebGL "wow" backgrounds render a shader canvas instead of the 2D pattern.
  const webgl = floatParam === "liquid" || floatParam === "glass" ? floatParam : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#1c1c1e", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background: exact original CSS grid (static) + constellation canvas (fades in) */}
      <div className="absolute inset-0 pointer-events-none">
        {showGrid && (
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.85) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.85) 1px, transparent 1px)", backgroundSize: "24px 24px, 24px 24px, 120px 120px, 120px 120px", backgroundPosition: "center center" }} />
        )}
        {/* Iteration (?edges=bright): vignette sits UNDER the constellations so only the grid fades. */}
        {brightEdges && (
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, #1c1c1e 75%)" }} />
        )}
        <motion.div className="absolute inset-0"
          initial={{ opacity: 0, filter: "brightness(2.6) blur(3px)" }}
          animate={introStarted ? { opacity: [0, 1, 1], filter: ["brightness(2.6) blur(3px)", "brightness(1.7) blur(0px)", "brightness(1) blur(0px)"] } : {}}
          transition={{ duration: 1.6, ease: "easeOut", times: [0, 0.45, 1] }}
        >
          {floatParam === "field" ? <GateField />
            : floatParam === "sheet" ? <GateSheet />
            : floatParam === "tunnel" ? <GateTunnel />
            : webgl ? <GateWebGL variant={webgl} />
            : <GateBackground pattern={pattern} backdrop="plain" />}
        </motion.div>
        {/* Default: vignette over everything — grid + constellations both fade at the edges. */}
        {!brightEdges && (
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, #1c1c1e 75%)" }} />
        )}
      </div>

      <div className="w-full max-w-[420px] px-6 relative z-10">
        <div className="text-center mb-12">
          {/* The landing's wordmark, scaled down: Shane solid, Yun outlined. The
              name keeps its form across the unlock instead of changing shape. */}
          <h1 className="font-display font-extrabold uppercase flex flex-col items-center text-[5rem] leading-[0.86] tracking-[-0.02em]">
            <span style={{ color: "#f4f4f5" }}>Shane</span>
            <span style={{ color: "transparent", WebkitTextStroke: "1.5px rgba(255,255,255,0.5)" }}>Yun</span>
          </h1>
          <p className="font-mono text-[15px] text-white/50 tracking-[0.15em] uppercase mt-3">portfolio</p>
        </div>
        <div className="relative z-10">
        <div className="absolute inset-0 rounded-[12px] pointer-events-none" style={{ boxShadow: "0 20px 48px rgba(0,0,0,0.45)", opacity: showCard ? 1 : 0, transition: "opacity 0.8s ease 0.45s" }} />
        <div className="rounded-[12px] px-7 py-7 relative" style={{ background: "rgba(28,28,32,0.28)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)", clipPath: showCard ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transition: "clip-path 0.7s cubic-bezier(0.22, 1, 0.36, 1)" }}>
        <form onSubmit={handleSubmit}>
          <div
            className="relative rounded-[7px]"
            style={{
              // The box (bg/border/blur) lives on this wrapper so the input's emoji filter never tints it —
              // the background stays identical when toggling emoji ↔ text.
              background: hasText ? "rgba(90,210,130,0.05)" : "rgba(255,255,255,0.06)",
              border: error ? "1px solid rgba(255,80,80,0.5)" : hasText ? "1px solid rgba(120,225,150,0.16)" : "1px solid rgba(255,255,255,0.1)",
              boxShadow: hasText ? "0 2px 10px rgba(0,0,0,0.18), inset 0 0 18px rgba(90,210,130,0.05)" : "0 2px 10px rgba(0,0,0,0.18)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transition: "border-color 0.2s ease",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={showPassword ? password : emojis.join("")}
              onChange={() => { /* value is driven by handleKeyDown / handlePaste */ }}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="w-full px-4 py-3.5 pr-12 rounded-[7px] font-mono text-[15px] text-white/90 placeholder:text-[rgba(138,255,184,0.7)] placeholder:[text-shadow:0_0_6px_rgba(57,255,136,0.35)] placeholder:lowercase placeholder:tracking-[0.04em] outline-none whitespace-nowrap overflow-hidden"
              style={{
                background: "transparent",
                border: "none",
                // Masked emojis: green tint on the glyphs (detail kept), shifted toward the
                // placeholder's mint, with its soft glow. Instant switch (no transition).
                filter: masked ? "grayscale(1) sepia(1) hue-rotate(95deg) saturate(2) brightness(1.2)" : "none",
                textShadow: masked ? "0 0 6px rgba(57,255,136,0.35)" : "none",
                // Slightly larger glyphs + a touch more spacing; still fits openSesame (10) on one line. Placeholder unaffected.
                fontSize: masked ? "16px" : undefined,
                letterSpacing: masked ? "0.12em" : "normal",
                lineHeight: "24px", // fixed so toggling emoji(16px)/letters(15px) never resizes the box
                caretColor: "#fff",
              }}
            />
            {hasText && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/55"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
            )}
          </div>
          {error && (
            <p className="text-[12px] text-[#ff5050] mt-2 text-center lowercase tracking-[0.04em]">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3.5 rounded-[7px] font-mono text-[15px] font-semibold tracking-[0.1em] lowercase text-white transition-all duration-200 cursor-pointer active:scale-[0.97]"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 2px 10px rgba(0,0,0,0.18)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.17)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.28)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.16)";
            }}
          >
            {enterLabel || " "}
          </button>
        </form>
        </div>
        </div>
        <p className="text-center font-mono text-[11px] text-white/80 mt-6 lowercase tracking-[0.04em]" style={{ height: "16px", lineHeight: "16px" }}>
          {typed.length <= DISCLAIMER_PREFIX.length
            ? typed
            : <>{DISCLAIMER_PREFIX}<span className="text-white font-medium">{typed.slice(DISCLAIMER_PREFIX.length)}</span></>}
          {typed.length > 0 && typed.length < DISCLAIMER_FULL.length && <span className="text-white/40">|</span>}
        </p>
      </div>
    </div>
  );
}
