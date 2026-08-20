/**
 * HANDOFF PREVIEW — the whole thing end to end, on one URL.
 *
 *   /flow  →  gate  →  (unlock)  →  landing  →  case study
 *
 * Enter the password and the gate clears into the Manifest landing; the landing
 * then carries `?skin=manifest` onto whichever project is opened, so the case
 * study arrives in the same language. Password: openSesame.
 *
 * PREVIEW ONLY. The production gate is middleware.ts and is untouched.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { PasswordGate } from "@/components/PasswordGate";
import { UNLOCK_FLAG } from "./shared";

export default function Flow() {
  const [, setLocation] = useLocation();
  const [leaving, setLeaving] = useState(false);

  const handleUnlock = () => {
    setLeaving(true);
    sessionStorage.setItem(UNLOCK_FLAG, "1"); // the landing shows its badge once
    // Clears fast and flat — the landing's own writing is the moment.
    window.setTimeout(() => setLocation("/"), 300);
  };

  return (
    // A persistent plate under the gate so the swap never flashes.
    <div style={{ position: "fixed", inset: 0, background: "#1c1c1e" }}>
      <div
        style={{
          height: "100%",
          opacity: leaving ? 0 : 1,
          filter: leaving ? "blur(6px)" : undefined,
          transition: "opacity .3s ease, filter .3s ease",
        }}
      >
        <PasswordGate preview onUnlock={handleUnlock}>{null}</PasswordGate>
      </div>
    </div>
  );
}
