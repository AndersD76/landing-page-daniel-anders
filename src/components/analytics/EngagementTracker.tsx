"use client";

import { useEffect } from "react";
import { trackEvent } from "./Analytics";

export function EngagementTracker() {
  useEffect(() => {
    const firedScrollMarks = new Set<number>();
    const SCROLL_MARKS = [25, 50, 75, 90];

    function onScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const pct = Math.round((scrollTop / docHeight) * 100);

      for (const mark of SCROLL_MARKS) {
        if (pct >= mark && !firedScrollMarks.has(mark)) {
          firedScrollMarks.add(mark);
          trackEvent("scroll_depth", {
            percent: mark,
            page: window.location.pathname,
          });
        }
      }
    }

    let timeOnPageTimer: ReturnType<typeof setTimeout>;
    const TIME_MARKS = [10, 30, 60, 120];
    let currentTimeIdx = 0;

    function scheduleTimeEvent() {
      if (currentTimeIdx >= TIME_MARKS.length) return;
      const seconds = TIME_MARKS[currentTimeIdx];
      const delay = currentTimeIdx === 0
        ? seconds * 1000
        : (seconds - TIME_MARKS[currentTimeIdx - 1]) * 1000;

      timeOnPageTimer = setTimeout(() => {
        trackEvent("time_on_page", {
          seconds,
          page: window.location.pathname,
        });
        currentTimeIdx++;
        scheduleTimeEvent();
      }, delay);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    scheduleTimeEvent();

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeOnPageTimer);
    };
  }, []);

  return null;
}
