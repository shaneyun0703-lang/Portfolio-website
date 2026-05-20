import { useEffect } from "react";

/**
 * Scroll the window to the very top whenever a route is mounted.
 *
 * The Search Ads and WhatsApp case studies are long pages with internal
 * anchor links. Without this hook, navigating from the landing page
 * directly to a case study sometimes leaves the viewport at whatever
 * position it had on the previous page, especially on mobile.
 */
export function useScrollToTop() {
  useEffect(() => {
    // Force-top on mount; "instant" avoids a visible jump.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);
}
