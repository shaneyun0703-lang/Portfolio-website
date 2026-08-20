/**
 * HANDOFF PREVIEW — "Manifest" (comp 4c).
 *
 * Every project renders its own detail slot, collapsed to zero height until the
 * project is active. Moving across projects animates one closed while the next
 * opens, so the sweep is continuous rather than a hard swap.
 *
 * The index arrives fully collapsed and expands on hover, closing again when
 * the cursor leaves. An intro hint opens 01 once to show that the rows do
 * anything at all. The list is floored at its tallest state so none of this
 * moves the page — see .hx-man-list in handoff.css.
 *
 * PREVIEW ONLY — the live landing (/) is LandingV3 and is untouched.
 */
import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ME, WORK, type Work, type Choreography, type Part,
  AccessBadge, ContactPills, GateMesh, Rev, Scramble, ShotStack, Slice, SweepBar,
  useAccessBadge, useChoreography, usePlay, useRevealParam, useTypewriter,
} from "./shared";

/* The role line as typed runs, kept in their own styled segments so the role
   stays bold and the divider stays dim as the line is written. */
const SUB_PARTS: Part[] = [
  { text: ME.role, className: "hx-man-role" },
  { text: ` @ ${ME.org} ` },
  { text: "|", className: "hx-man-div" },
  { text: ` ${ME.location}` },
];
const SUB_LEN = SUB_PARTS.reduce((n, p) => n + p.text.length, 0);

/* Held until every beat of the reveal is finished — the last one lands at
   ~1.55s — so the writing reads as a separate act, not part of the arrival. */
const TYPE_AT = 1700;
const SUB_STEP = 52;

function Row({
  w, i, ch, open, onOpen, href,
}: {
  w: Work; i: number; ch: Choreography; open: boolean; onOpen: () => void; href: string;
}) {
  return (
    <Rev name={`row${i}`} ch={ch}>
      <Link
        href={href}
        className={`hx-man-r${open ? " is-open" : ""}`}
        style={{ ["--acc" as string]: w.accent }}
        onMouseEnter={onOpen}
        onFocus={onOpen}
      >
        <span className="hx-man-rn">{w.n}</span>
        {/* Title only. Status is rendered by the item wrapper so it can centre
            across the panel as well as the row. The third column is left empty
            to hold the title off it. */}
        <span className="hx-man-rt">
          {w.title}
          {/* Turns 45° when open — the standing affordance the intro hint
              demonstrates once. */}
          <i className="hx-man-rx" aria-hidden="true" />
        </span>
      </Link>
    </Rev>
  );
}

/* Category, role and timeline all live in the row itself, so the detail carries
   only what the row cannot: the description, the work, and the way in. */
function Detail({ w, open, href }: { w: Work; open: boolean; href: string }) {
  return (
    <div
      className={`hx-man-detail${open ? " is-open" : ""}`}
      style={{ ["--acc" as string]: w.accent }}
      aria-hidden={!open}
    >
      <div className="hx-man-din">
        <div className="hx-man-dl">
          {/* Everything the row used to carry — role, timeline and the status
              that was its own column — labelled here and decrypting together as
              the panel opens. */}
          <dl className="hx-man-dmeta">
            <dt>Role</dt>
            <dd><Scramble text={w.role} hover={open} /></dd>
            <dt>Timeline</dt>
            <dd><Scramble text={w.timeline} hover={open} /></dd>
          </dl>
          <p className="hx-man-dblurb">{w.blurb}</p>
          <Link href={href} className="hx-cta" tabIndex={open ? 0 : -1}>
            Open case study<span className="hx-cta-ar">→</span>
          </Link>
        </div>
        <ShotStack w={w} variant="solo" />
      </div>
    </div>
  );
}

export default function LandingManifest() {
  const [kind, setKind] = useRevealParam();
  const ch = useChoreography(kind);
  const play = usePlay();
  const badge = useAccessBadge(ch.delayOf("badge"));
  const [open, setOpen] = useState(-1); // everything collapsed on arrival
  const typed = kind === "type" && !ch.reduced;
  const subN = useTypewriter(SUB_LEN, TYPE_AT, SUB_STEP, typed);

  /* Plain URLs. The skin used to ride on `?skin=manifest` because the case
     studies defaulted to their old appearance and this landing was a preview;
     both are true no longer, so the query string would only be noise in a
     visitor's address bar. */
  const hrefFor = (w: Work) => w.href;

  /* 01 opens once the reveal settles and STAYS open — it is the page's resting
     state, not a hint that plays and leaves. Two reasons it no longer closes:
     the collapsed index reserves the panel's height whether or not anything is
     in it, so an all-closed page shows ~280px of nothing and reads as unfinished
     or as the end of the content; and a hint you can miss by glancing away is
     not an affordance. Leaving it open means the first thing anyone sees is a
     complete project, and the interaction has already demonstrated itself.

     The list does not answer the cursor while this plays. Guarding it on hover
     events instead was the wrong instinct: expanding a row reshuffles what sits
     under a still pointer, the browser fires enter events for that on its own,
     and no amount of filtering them apart from real intent is reliable. Nothing
     can fight the hint if nothing is listening yet. */
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!play) return;
    if (ch.reduced) { setArmed(true); setOpen(0); return; }
    setArmed(false);
    const at = (ch.delayOf("pane") + 0.5) * 1000;
    let arm: (() => void) | null = null;
    const on = window.setTimeout(() => setOpen(0), at);
    /* Hand the list over on the next real movement rather than on this timer.
       A cursor already resting over a row gets an enter event the instant the
       list becomes live, which would yank the page to whatever it happens to
       be sitting on. */
    const hand = window.setTimeout(() => {
      arm = () => { setArmed(true); if (arm) window.removeEventListener("pointermove", arm); };
      window.addEventListener("pointermove", arm, { passive: true });
    }, at + 1250);
    return () => {
      clearTimeout(on);
      clearTimeout(hand);
      if (arm) window.removeEventListener("pointermove", arm);
    };
  }, [play, ch]);

  return (
    <div className="hx hx-man" data-play={play ? "1" : "0"}>
      {/* No grid on this one — the mesh and the vignette carry the background
          alone. The gate still runs it. */}
      <Rev name="bg" ch={ch} className="hx-bg">
        <GateMesh />
        <div className="hx-vig" />
      </Rev>
      <SweepBar ch={ch} />

      <AccessBadge state={badge} />

      {/* Only the role line is written on. The name is set too large for a
          typewriter to flatter it — eight letters at that size read as eight
          separate events however softly each one arrives — so it resolves as a
          whole while the line above types. */}
      <Rev name="meta" ch={ch} className="hx-man-sub">
        <Slice parts={SUB_PARTS} n={typed ? subN : SUB_LEN} ink={typed} />
        {typed && subN < SUB_LEN && <i className="hx-caret" aria-hidden="true" />}
      </Rev>

      <Rev name="mast" ch={ch} className="hx-man-wm">
        <span>Shane</span><span>Yun</span>
      </Rev>

      <Rev name="meta" ch={ch} className="hx-man-contact"><ContactPills /></Rev>

      <div className="hx-man-work">
        <Rev name="head" ch={ch} className="hx-man-ih">
          <span>No.</span><span>Selected work · 2025–2026</span><span>Status</span>
        </Rev>
        {/* Leaving the list falls back to 01 rather than to nothing. Closing
            everything would put the page back to the empty reserve the arrival
            state was changed to avoid — the index should never show a blank
            panel, whether you have touched it or not. */}
        <div
          className={`hx-man-list${armed ? "" : " is-locked"}`}
          onMouseLeave={() => setOpen(0)}
        >
          {WORK.map((w, i) => (
            /* Row and panel share one positioned box so the status can hang off
               it and centre against whichever height is currently showing. The
               hover lives here rather than on the row, so the status strip and
               the open panel hold the row open instead of falling outside it. */
            <div
              className={`hx-man-item${i === open ? " is-open" : ""}`}
              key={w.n}
              style={{ ["--acc" as string]: w.accent }}
              onMouseEnter={() => setOpen(i)}
            >
              <Row w={w} i={i} ch={ch} open={i === open} onOpen={() => setOpen(i)} href={hrefFor(w)} />
              <Rev name="pane" ch={ch}><Detail w={w} open={i === open} href={hrefFor(w)} /></Rev>
              <Scramble className="hx-man-rs" text={w.status} hover={i === open} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
