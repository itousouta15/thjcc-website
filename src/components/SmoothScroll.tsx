"use client";

import type Lenis from "lenis";
import { useEffect } from "react";

const SCROLL_OPTIONS = { wheelMultiplier: 0.8, lerp: 0.1, autoRaf: true };

export function SmoothScroll() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let generation = 0;
    let locked = false;

    // Load the same Lenis version and wheel parameters as itouSouta.me.
    const syncPreference = () => {
      const request = ++generation;
      lenis?.destroy();
      lenis = null;
      if (!desktop.matches || reducedMotion.matches) return;
      void import("lenis").then(({ default: Lenis }) => {
        if (request !== generation) return;
        lenis = new Lenis(SCROLL_OPTIONS);
        if (locked) lenis.stop();
      });
    };

    const onScrollLock = (event: Event) => {
      locked = Boolean((event as CustomEvent<boolean>).detail);
      if (locked) lenis?.stop();
      else lenis?.start();
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (!lenis || event.defaultPrevented || event.button !== 0
        || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link || (link.target && link.target !== "_self") || link.hasAttribute("download")) return;
      const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      if (!target) return;

      // Prevent a native hash jump from racing Lenis's smooth anchor animation.
      event.preventDefault();
      if (window.location.hash !== link.hash) window.history.pushState(null, "", link.hash);
      lenis.scrollTo(target, {
        onComplete: () => {
          if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
          target.focus({ preventScroll: true });
        },
      });
    };

    syncPreference();
    desktop.addEventListener("change", syncPreference);
    reducedMotion.addEventListener("change", syncPreference);
    document.addEventListener("click", onAnchorClick);
    window.addEventListener("thjcc:scroll-lock", onScrollLock);
    return () => {
      generation++;
      lenis?.destroy();
      desktop.removeEventListener("change", syncPreference);
      reducedMotion.removeEventListener("change", syncPreference);
      document.removeEventListener("click", onAnchorClick);
      window.removeEventListener("thjcc:scroll-lock", onScrollLock);
    };
  }, []);

  return null;
}
