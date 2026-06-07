import { useState, useEffect } from "react";

const SITE_PASSWORD = "openSesame";
const STORAGE_KEY = "portfolio_auth";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "#1c1c1e", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background — grid with fade */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, #1c1c1e 75%)" }} />
      </div>

      <div className="w-full max-w-[420px] px-6 relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-display text-[3.5rem] font-extrabold tracking-[-0.04em] text-white leading-none whitespace-nowrap">Shane Yun</h1>
          <p className="font-mono text-[17px] text-white/70 tracking-[0.15em] uppercase mt-3">Portfolio</p>
        </div>
        <div className="rounded-2xl px-7 py-7 backdrop-blur-md" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)" }}>
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-3.5 pr-12 rounded-xl text-[15px] text-white/90 placeholder:text-white/25 outline-none transition-all duration-200 focus:border-white/20"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: error ? "1px solid rgba(255,80,80,0.5)" : "1px solid rgba(255,255,255,0.1)",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors duration-200 cursor-pointer"
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          </div>
          {error && (
            <p className="text-[12px] text-[#ff5050] mt-2 text-center">Incorrect password</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 px-4 py-3.5 rounded-xl font-display text-[14px] font-semibold text-white transition-all duration-200 cursor-pointer active:scale-[0.97]"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            Enter
          </button>
        </form>
        </div>
        <p className="text-center text-[13px] text-white/40 mt-6">Request access via <span className="text-white/60 font-medium">shane.yun0703@gmail.com</span></p>
      </div>
    </div>
  );
}
