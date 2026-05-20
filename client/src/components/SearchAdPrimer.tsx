/**
 * SearchAdPrimer — an illustrative "what is a search ad?" side-by-side for §01.
 *
 * Two stylised device frames sit next to each other:
 *   • Left  — a traditional web-search result page (search engine style), with a
 *             sponsored result pinned above the organic ones.
 *   • Right — a Meta search results page (Facebook / Instagram style), with a
 *             sponsored item tucked inside the results feed.
 *
 * Everything is hand-drawn in HTML / CSS. No real product screenshots are used
 * so there's no brand or trademark exposure in the portfolio.
 */
export function SearchAdPrimer() {
  return (
    <figure className="my-10 md:my-12 max-w-4xl">
      <div className="caption-label mb-3 text-[var(--mid)]">
        What a search ad actually is
      </div>
      <h3 className="font-display text-[1.2rem] md:text-[1.35rem] font-medium text-[var(--ink)] leading-snug max-w-2xl mb-6">
        A search ad is a promoted result that shows up when someone is
        actively looking for something. It answers intent, not interest.
      </h3>

      <div className="grid md:grid-cols-2 gap-5 md:gap-6">
        {/* Traditional web-search ad */}
        <div className="border border-[var(--rule)] bg-[var(--paper)] p-5">
          <div className="caption-label text-[var(--mid)] mb-3">
            Traditional search engine
          </div>

          {/* fake search bar */}
          <div className="flex items-center gap-2 border border-[var(--rule)] rounded-full px-4 py-2 bg-white">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--mid)]/60" />
            <span className="caption text-[var(--ink)]">
              best running shoes
            </span>
          </div>

          {/* sponsored block */}
          <div className="mt-4 border-l-2 border-[var(--primary)] pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--primary)]">
                Sponsored
              </span>
            </div>
            <div className="caption-label text-[var(--ink)] mb-0.5">
              Athleta — Women&apos;s Running Shoes
            </div>
            <div className="caption text-[var(--mid)] leading-snug">
              Free shipping on orders over $50. Shop our new arrivals.
            </div>
          </div>

          {/* organic results */}
          <div className="mt-4 space-y-3">
            {[
              "How to choose the right running shoe — Runner's guide",
              "10 best running shoes of 2026, reviewed",
            ].map((title) => (
              <div key={title}>
                <div className="caption-label text-[var(--ink)] mb-0.5">
                  {title}
                </div>
                <div className="caption text-[var(--mid)]">
                  Short description of the organic result…
                </div>
              </div>
            ))}
          </div>

          <p className="caption mt-5 text-[var(--mid)] leading-snug">
            The sponsored result sits on top of a page of organic results.
            The advertiser pays to be there because the person is already
            searching.
          </p>
        </div>

        {/* Meta search ad */}
        <div className="border border-[var(--rule)] bg-[var(--paper)] p-5">
          <div className="caption-label text-[var(--mid)] mb-3">
            Meta (Facebook / Instagram) search
          </div>

          {/* fake search bar */}
          <div className="flex items-center gap-2 border border-[var(--rule)] rounded-full px-4 py-2 bg-white">
            <div className="w-3 h-3 rounded-full border-2 border-[var(--mid)]/60" />
            <span className="caption text-[var(--ink)]">running shoes</span>
          </div>

          {/* tabs */}
          <div className="mt-3 flex items-center gap-4 caption text-[var(--mid)]">
            <span className="text-[var(--ink)] border-b-2 border-[var(--ink)] pb-1">
              Top
            </span>
            <span>People</span>
            <span>Reels</span>
            <span>Shops</span>
          </div>

          {/* feed results */}
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded bg-[var(--tint)] shrink-0" />
              <div>
                <div className="caption-label text-[var(--ink)] mb-0.5">
                  Marathon prep 101
                </div>
                <div className="caption text-[var(--mid)]">
                  Organic post from @runclub
                </div>
              </div>
            </div>

            {/* sponsored feed item */}
            <div className="border-l-2 border-[var(--primary)] pl-3 py-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--primary)]">
                  Sponsored
                </span>
              </div>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded bg-[var(--tint)] shrink-0" />
                <div>
                  <div className="caption-label text-[var(--ink)] mb-0.5">
                    Athleta Performance Runner
                  </div>
                  <div className="caption text-[var(--mid)]">
                    Shop now · Free shipping
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-10 h-10 rounded bg-[var(--tint)] shrink-0" />
              <div>
                <div className="caption-label text-[var(--ink)] mb-0.5">
                  Best shoes for beginners
                </div>
                <div className="caption text-[var(--mid)]">
                  Organic Reel · 12.4K views
                </div>
              </div>
            </div>
          </div>

          <p className="caption mt-5 text-[var(--mid)] leading-snug">
            On Meta, the sponsored result lives inside a feed of posts,
            people, Reels, and shops. Same intent signal; different
            surface.
          </p>
        </div>
      </div>

      <figcaption className="caption mt-4 text-[var(--mid)] max-w-3xl">
        Both are search ads. The one on the right is what this concept is
        trying to build a real advertiser experience around.
      </figcaption>
    </figure>
  );
}
