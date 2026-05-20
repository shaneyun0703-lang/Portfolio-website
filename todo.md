# v3.8 — §05 deep rewrite + §03 waterfall addendum

## §03 primer addendum
- [ ] Add one short paragraph explaining waterfall inheritance: each rung inherits from its parent, so a campaign-level setting cascades to every ad set under it, and an ad-set-level setting cascades to every ad under it. Critical context for §05 Round 2.

## §05 Round 1 rewrite
- [ ] Drop "Names are not used; segments are." line
- [ ] Bold "Concept X" prefix; description in regular weight; rewrite each as a clean sentence
- [ ] Swap single-card Option B image for the full "Concept Audience-Centric / Pre-Placement Search Features" frame from figmaAssets
- [ ] Add upfront framing on why those four entry points were chosen
- [ ] One-line plain definition of each entry-point card (Audience, Brand safety, Placements, Pre-placement page)

## §05 Round 2 rewrite
- [ ] Rationale: Round 1 settled the entry-point question (Placements + new-card backup) but left the ad-level vs ad-set-level Search Themes tradeoff open. Round 2 was structured to test that.
- [ ] Add per-wireframe walkthrough captions in click-to-enlarge view (matching Round 1 pattern)

## §05 visualization tightening
- [ ] Tighten RoundEvolution component for faster scanning
- [ ] Convert dense paragraphs to bullets where they earn it

## §05 partnerships → expandable diagram
- [ ] Replace "Why this work required alignment across many teams" Aside with PartnerTeamsDiagram component
- [ ] Concept's two new controls in center, partner team rings around it
- [ ] Each ring node expandable to one-line "what they owned + what we needed"

## Deliver
- [ ] Verify (fresh tsc, visual scan)
- [ ] Save checkpoint
- [ ] Deliver v3.8

# v3.10 — hero fixes
- [ ] Restore full-width rules around the hero meta row (only in-body rules should be shortened)
- [ ] Convert Team value to a vertical bullet list
- [ ] Convert Timeframe value to a vertical bullet list
- [ ] Keep Role and Work Type as single-line values

# v3.11
- [ ] Bottom hero divider (the rule under the meta block) → full-width
- [ ] Remove em-dash markers from Team and Timeframe vertical lists
- [ ] Rename "+ 4 partner teams" → "4+ partner teams"

# v3.12
- [ ] Narrow §01 landscape chart top/bottom rules
- [ ] Generate composite illustration: traditional search ad vs Meta search ad
- [ ] Add "what is a search ad" block to §01 with visual + short layman explanation
- [ ] Move descriptive kickers (e.g. "Search Themes set once on the ad set...") to appear as secondary text under each title
- [ ] §01 full-serif typography experiment — convert all §01 body/captions/chart labels to display serif

# v3.13 — TOC collision, truly fixed
- [ ] Audit every .rule, .rule--full, and border-t in Home.tsx + components; list offenders
- [ ] Hero meta-row rules currently cross under the TOC — shorten them too
- [ ] Verify — no divider line visually touching the TOC card at any scroll position
- [ ] Save checkpoint v3.13

# v3.14 — content + bug pass
- [ ] MetaRow: Team and Timeframe values display as bullet list (with markers this time)
- [ ] §01: omit "The inventory is live." line
- [ ] §01: broaden framing — not only Google; why this concept at large
- [ ] §01: don't use "Placements" on first mention; explain plainly (today you can only turn ads on/off for search)
- [ ] §01: use the real Google "cheap water bottles" screenshot to show what a search ad actually is
- [ ] §01: omit the "Even taking a small share of search away from Google..." paragraph
- [ ] §02→§03 segue: one short bridging paragraph explaining why the reader needs the Meta Ads Manager structure primer
- [ ] §04: fix carousel click-to-advance (currently broken)
- [ ] §04: delete "Three screens, no search-specific controls. Open the Placements card → expand Placement controls..." caption
- [ ] Upload Screenshot2026-04-28at9.21.10PM.png as the "what is a real search ad" image in §01

# v3.15 — §05 process pass
- [ ] RoundEvolution: rewrite as plain-language summary cards (Tested / Learned / Left open)
- [ ] No ad-jargon ("standalone cards drew the eye but felt heavy" → reframe)
- [ ] Move partner-teams aside to AFTER the three rounds
- [ ] Round 1 detail: name the two new controls ("Search Themes and Negative Keywords") so the four concepts read against a concrete reference
- [ ] Round 1 close: reframe from "settled on Placements" to "narrowed to two candidates"; Round 2 picked between them

# v3.16 — Round 3 trim, §06 final flow swap, drop §07
- [ ] §05 Round 3: drop the wireframe carousel; keep prose-only why-we-pursued-it + handoff into §06
- [ ] Move "An aside on alignment" + PartnerTeamsDiagram OUT of §05, place AFTER §06
- [ ] §06 Use Case 1.1 walkthrough: replace inaccurate screens with the correct final-design flow
- [ ] §07 Ad-format audit: delete entire section + section divider + TOC entry
- [ ] Renumber Reflections from §08 → §07; update TOC and any prose references
- [ ] Confirm with user which figma asset set is the correct final flow

# v4.1 — case-study entry polish + WhatsApp §01 rewrite
- [ ] Both case studies scroll to top on route entry
- [ ] WhatsApp hero title shortened to ≤2 display lines so lede stays above fold
- [ ] Add inline clickable TOC at top of WhatsApp case study (Search Ads parity)
- [ ] Add Shane Yun · Co-lead designer to Team list
- [ ] Replace "Post-GA" / "Shipped to 100%" / "Shipped product work" with layman wording
- [ ] Rewrite §01 in Search Ads primer style — no demeaning preamble, lead with visuals, real Updates/Status/ad/chat phone-frame anchors
- [ ] Save checkpoint v4.1

# v4.2 — content correction + §02 figure + §03 restructure
- [ ] §01 prose: at launch = Traffic + Engagement; this work added Sales + Leads + Awareness
- [ ] §01 grid: relabel cells accordingly (Traffic + Engagement = at launch; Sales + Leads + Awareness = our work; App promotion = out of scope)
- [ ] §02 placeholder → real "scope of expansion" graphic (no exported screen needed)
- [ ] §03 restructure: visual-first; shorter paragraphs; Ads Manager primer as a small sidebar
- [ ] Verify & save checkpoint v4.2

# v4.3 — obfuscate roadmap, terminology, §04 redesign
- [ ] §02 timeline: obfuscate "Beyond CTWA" card → vague "Future phases"
- [ ] §03 hierarchy: Creative → Media; Destination → "Where the ad goes"
- [ ] §03 glossary: same renames
- [ ] §03 prose: correct ad-set framing — it's a layer (multiple cards), not a single screen, and not just for picking a surface
- [ ] §04: drop "BAU" entirely
- [ ] §04: drop redundant re-definition of "objective"
- [ ] §04: reduce density (shorter paragraphs, less prose)
- [ ] §04: replace placeholder with a real visualisation
- [ ] Verify & checkpoint v4.3


# v4.4 — merge §04+§05, slim Reflections, add UX placeholders
- [ ] Re-read current §04, §05, §06, TOC and helpers
- [ ] Build merged §04: numbers strip on top, five threading points as spine, one tall UX placeholder per row
- [ ] Add small-multiples grid placeholder showing volume of artefacts
- [ ] Reduce Reflections to single-paragraph statement on execution speed (PRD, use cases, design review, QA guide)
- [ ] Renumber Reflections to §05; update TableOfContents
- [ ] Verify & checkpoint v4.4


# v4.6 — slice-of-the-work reframe (WhatsApp)
- [x] §01: positioning sentence; ObjectivesGapFigure removed
- [x] §02: parallel-workstreams disclaimer
- [x] §04: 3-item stat strip + outcome line
- [x] §05 Reflections: numbers as proof points
- [x] Saved checkpoint v4.6 (ef5a8964)

# v4.6.1 — Search Ads back link
- [x] Add ← All case studies link to top of /search-ads (mirror WhatsApp pattern)
- [x] Saved checkpoint v4.6.1 (932d7fd4)

# Search Ads restructuring exercise
- [x] Drive label checks on both source docs (both DSS-2, allowed)
- [x] Read product narrative + UX/craft narrative
- [x] Capture key claims (sa_sources/notes_key_claims.md)
- [x] Audit current SearchAds.tsx structure
- [x] Write recommendation memo (sa_sources/recommendation_memo.md)
- [x] User responded with three constraints

# v4.7 — Search Ads strategic + design-call tightening
User constraints to honor:
- (a) Frame as **differing product approaches**, NOT FoA × CAG reconciliation — keep it about the design philosophy disagreement, not org politics
- (b) Design-call asides must be **legible to non-ads readers** — explain salience-implies-investment + duplicate-vs-route-to-existing-surface in plain terms
- (c) **KEEP** the sixteen advertiser conversations beat in current §02 — new "the bet" beat slots in alongside, not as replacement

## Edits to execute
- [ ] Insert NEW §02 "The product approach we chose" between current §01 and current §02 (sixteen conversations); renumber sixteen-conversations to §03 and shift everything down by one
- [ ] Update TableOfContents.tsx with new section id + label
- [ ] Add R1 Aside: standalone-card refusal, plain-language (salience implies investment)
- [ ] Add R3 Aside: route-to-BSS-instead-of-duplicating, plain-language (one source of truth vs. two places to edit)
- [ ] Compress §04 (status-quo) prose duplication — keep carousel + PMax comparison, drop redundant restating paragraph
- [ ] Trim Round 2 carousels: ad-set 16 → ~6 representative steps; ad-level 21 → ~6 representative steps
- [ ] Add stat strip near top of §06 (3 rounds · 14+ accounts · 4 partner surfaces · code-ready handoff)
- [ ] Add new "What this de-risked" coda at end of §06 (or as separate section before Reflections)
- [ ] Tighten Reflections from 5 → 4 bullets (collapse "three rounds was right number" + "content design is a feature")
- [ ] Update walkthrough caption: "25 themes with a path to 50 at GA" instead of "up to 50"
- [ ] Rewrite partner-teams diagram lede to lead with the four specific partner surfaces and the Placements-card-splitting concrete fact
- [x] Verify TS + LSP clean
- [ ] (DEFER) Save checkpoint v4.7 — user wants two more passes first

# v4.7.1 — vocabulary cleanup before checkpoint
- [ ] §02: remove "supply story / competitor story" vocabulary entirely (not defined, ad-specific jargon); rewrite the framing in plain language about matching the size of the opportunity
- [ ] §08 "What this de-risked": abstract all four cards so they don't name internal Phase 1B specifics (no per-query reporting, no PMax parity numbers, no swim-lanes); keep the *shape* of the four de-riskings but strip ad-specific terminology
- [ ] Verify TS + LSP clean
- [ ] Save checkpoint v4.7


# v4.8 / v5.0 — Third case study (commerce ads alpha, product-media-focused) + cross-cutting audit
User scope notes from this round:
- Third case study about an early invite-only commerce-ads alpha (~100k high-spend eComm advertisers); design details scoped to **product media** section only; Senior designer on 5+ IC team across 2 orgs; sign-off required all leads to explicitly approve with consultation across 3 designers; 2-month heavy design sprint; only feasible because of deep eComm advertising-solutions experience.
- DO NOT use "PCA" / "PCA-U" / org code names anywhere on the public page — use abstracted, plain names.
- Length goal: about as long as the WhatsApp case study, but ALL THREE case studies need a length-tightening pass — current versions are not landing for non-ads readers.
- Audience clarity: WhatsApp and Search Ads currently don't make the *target advertiser audience* obvious. Add explicit audience callouts to all three.
- Significance clarity: WhatsApp also needs a sign-off-significance callout (mirroring the new case study's "all leads explicitly approved with consultation across 3 designers" point).
- Deep-domain-experience callout: BOTH WhatsApp and the new case study should mention this was only feasible because of deep prior experience in their respective ad domains.
- One open question still pending: the design call held against pressure for product media (user said "let's get back to this one").

## Open clarifications to send to user before drafting
- [ ] Confirm Drive search scope: search across all of Drive for "PCA OR PCA-U" or restrict to a specific folder?
- [ ] Confirm exact target advertiser audiences for all three pages (rough segments / plain-language sentence each)
- [ ] Confirm 2 dimensions of "deep eComm experience" wording (years? prior projects? advertiser-side experience?)
- [ ] Confirm whether the third case study should use a new public-facing name (e.g. "Commerce Ads Alpha", "Unified Shop Ads alpha") and abstracted names for the two flow types currently called "DA" and "SA"
- [ ] Get the held-against-pressure design call for product media

## Workstream phases
- [ ] Phase 2: Drive label check on both linked source docs + scoped search for additional PCA/PCA-U docs; read all
- [ ] Phase 3: Audit existing two pages for legibility-to-non-ads-reader; write a single combined memo covering (a) new case study structure, (b) audience+significance+deep-experience edits to existing pages, (c) length-tightening pass across all three
- [ ] Phase 4: User approval on memo
- [ ] Phase 5: Execute approved edits across all three pages + new page
- [ ] Phase 6: Save checkpoint and deliver


# v4.8.1 — Commerce Ads tightening (after first scroll-through)

User feedback after option-1 scroll-through:
- Whole page is too text-dense; readers can't grok the work without visualizations
- Meta block (Role/Team/Timeframe/Audience) must mirror the streamlined other case studies; team must include "Me"
- §01–§04 too long. Restructure to **3 sections** with visualizations between them, non-ads-reader friendly. §01 and §03 are saying similar things. §04 needs visuals (a feature table; 3 different DA UIs concept), and must clearly land "we have to offer DA functionality while retaining SA simplicity."
- Drop §06 entirely
- §07: reduce to one paragraph; secondary text not 4 lines; rework the 4 boxes (currently 2/3/4/1 numbers look identical and don't communicate priority)
- §08: cut text in half; add a visual element so it isn't all prose
- Drop the reflections section entirely

## Steps
- [ ] Memo: draft the new §01–§03 structure (3 sections + 2 visualizations) for user approval before any code edits
- [ ] After approval: streamline meta block (incl. "Me" in Team)
- [ ] Execute the new §01–§03 (replace existing §01–§04)
- [ ] Drop §06
- [ ] Tighten §07 (1 para + redesigned 4-tile)
- [ ] Tighten §08 (half text + visual)
- [ ] Drop reflections section
- [ ] Verify TS + LSP clean
- [ ] One consolidated checkpoint


# v4.8.1 — Foundational corrections to §01–§03 recommendation

User flagged five foundational corrections before any code edits:

(a) Not "building a third flow" — **merging two flows that have been fragmented since 2016**, both significant portions of Meta's revenue.

(b) Not "all of Meta's ad-building tool" has parallel universes — **only the ads campaigns that drive sales** have this fragmentation.

(c) Paragraph 1 framing of static ads as "one image or one video" is wrong — static ads can be carousel format with multiple images. Need better framing that doesn't conflate the asset count with the static/catalog distinction.

(d) Paragraph 2 (catalog) — keep the substance, make it even easier to understand.

(e) Paragraph 3 — corrected: they live in the **exact same flow**, but within that same flow they are set up **differently** (different setup paths, different controls). NOT two completely different parts of the tool.

(f) The §01 → §02 transition needs to land an explicit, easy-to-understand **problem statement**:
  1. Advertiser UX friction: complicated setup without understanding what is the best setup for them
  2. Maintenance overhead: multiple fragmented campaign setups with reduced performance, budget split across different campaigns

(g) The other case studies need their own clear problem statements too — pending for later (user said "not done yet").

## Steps
- [ ] Rewrite §01 v2 with all five corrections
- [ ] Send v2 §01 only for user sign-off before continuing to §02 + §03
- [ ] Once §01 approved: rewrite §02 + §03 with the explicit two-part problem statement
- [ ] Get user sign-off on §02 + §03
- [ ] Then execute all of §01–§03 in code, plus the rest of v4.8.1 (drop §06, tighten §07/§08, drop reflections, add visualizations)
- [ ] (Future) Add explicit problem statements to WhatsApp + Search Ads case studies


# v4.8.2 — pass 2 (commerce-ads + cross-cutting hero text compression)

User clarification: the 4-column meta-row grid stays as-is. Compress only the text ABOVE the meta row (kicker line, h1, lede). §03 figure goes lo-fi labelled boxes for now; iterate if needed.

## Cross-cutting (all three case studies)
- [ ] Hero text above the meta-row: shorten the kicker line where it pads, trim the h1 if it spans more than 2 lines, and either drop the lede paragraph entirely or compress to a single sentence. Keep the 4-column meta-row grid as-is.

## Commerce Ads §01 — The fork
- [ ] Reframe: static ads as the original default; catalog-driven ads as the addition layered in around 2016
- [ ] Add use-case lines: static for sales advertisers using a specific creative (paid celebrity image, finished launch video); catalog-driven for retailers with a lot of products (fashion sites with thousands of SKUs, marketplaces with constantly changing inventory)
- [ ] Replace TwoSetupPathsFigure: drop the numbered steps; render a much simpler side-by-side of two square panels (Static / Catalog-driven), each with a one-line description and a single illustrative element

## Commerce Ads §02 — Why the fork costs money
- [ ] Reorder: Cost 01 = performance loss (split budget hurts optimisation), Cost 02 = maintenance overhead, Cost 03 = setup friction
- [ ] Tighten each cost row to ~25 words with a stronger headline

## Commerce Ads §03 — What we built
- [ ] Trim opening prose to ~50 words on the unification framing
- [ ] Add a new figure: three lo-fi labelled boxes representing the three current catalog-driven ad-creation flows side by side, each with a feature count
- [ ] Add a 50-word paragraph mentioning the audit (every control across the three flows against usage data) and the 8-load-bearing-controls finding
- [ ] Keep the closing 50-word paragraph on landing the eight inside the unified path without burying the simpler workflow
- [ ] Keep the deep-experience aside

## Commerce Ads §05 — What it took across the room
- [ ] Replace AlignmentTiles with a stat-banner stripe: numbers rendered at ~5rem in the case-accent color, three-line caption-mono labels below, single horizontal line

## Verification
- [ ] TS + LSP clean
- [ ] One consolidated checkpoint at end (v4.8)


# v4.8.3 — Commerce Ads pass 3 (and cross-cutting where noted)

## Cross-cutting (all three case studies)
- [ ] Meta-row: longer/clearer titles for the four cells (Role / Team / Timeframe / Audience), bulleted content underneath instead of one paragraph blob — match the pattern WhatsApp + Search Ads use for Team/Timeframe lists
- [ ] Hero → §01 transition: add a short bridge paragraph between the hero and §01 so the reader doesn't drop straight into a section-numbered context block; this applies on Search Ads and WhatsApp too

## Commerce Ads only — §01
- [ ] Reposition static + catalog as two high-revenue-driving flows, not "options" — language framing
- [ ] Sales-campaign primer: tighten + add a one-liner about what "Sales" actually means in plain English
- [ ] Fix the static-ad delta: catalog ads also have finished media in the catalog, so the differentiator isn't "finished image" — it's customisation (advertiser hand-picks specific media) vs. automation (Meta picks from the catalog using its data)
- [ ] Add a small UX visual in §01 to anchor the static-vs-catalog delta (small phone mocks or schematic screens)
- [ ] Reduce paragraph depth before the visual — visual should land sooner, not 3 paragraphs deep

## Commerce Ads only — §03
- [ ] Heavy reduction: 3 paragraphs maximum
- [ ] Remove the current ThreeFlowsFigure (lo-fi labelled boxes — feedback says this is not the right visual)
- [ ] Replace with a different visual — propose options to user (e.g., a Venn-style overlap diagram of the eight controls; a horizontal "before/after" diagram of three flows collapsing into one; a stat-banner of the audit numbers)
- [ ] Confirm chosen visual with user before building

## Deliver
- [ ] TS clean
- [ ] Save consolidated v4.8 checkpoint
