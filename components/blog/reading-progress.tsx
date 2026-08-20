"use client";

import { useEffect } from "react";

const SUPPORTS_SCROLL_TIMELINE =
  typeof CSS !== "undefined" && CSS.supports?.("animation-timeline", "view()");

/**
 * Progress through the article, not through the document: the header, the
 * footer and anything after the article are not reading.
 *
 * Where scroll-driven animations exist the whole thing is CSS and runs off the
 * main thread — see `.reading-progress` in globals.css. This component only
 * carries the fallback, and it does not even attach it when the CSS path works.
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  useEffect(() => {
    if (SUPPORTS_SCROLL_TIMELINE) {
      return;
    }

    const article = document.getElementById(targetId);

    if (!article) {
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = article.getBoundingClientRect();
      // Distance the article still has to travel before its end reaches the
      // bottom of the viewport.
      const total = rect.height - window.innerHeight;
      const scrolled = -rect.top;
      const ratio = total > 0 ? scrolled / total : 0;

      // The custom property inherits, so the root is enough to reach the bar.
      document.documentElement.style.setProperty(
        "--reading-progress",
        String(Math.min(1, Math.max(0, ratio)))
      );
    };

    const schedule = () => {
      // Coalesces bursts of scroll events into one write per frame.
      frame ||= requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [targetId]);

  return <div aria-hidden="true" className="reading-progress" />;
}
