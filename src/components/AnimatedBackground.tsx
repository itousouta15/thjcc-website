"use client";

import { useEffect, useRef } from "react";

const DRIFT_RADIUS = 120;
const DRIFT_SPEED = 2; // Maximum average travel speed in pixels per second.
const MIN_DRIFT_DURATION = 24_000;

export function AnimatedBackground() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = glow.current;
    const background = layer?.parentElement;
    if (!layer || !background) return;
    const preference = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let drift: Animation | null = null;
    let enabled = false;
    let idleTimer: number | null = null;
    let scrolling = false;
    let lastScrollTime = 0;
    let position = { x: 0, y: 0 };

    function syncPaused() {
      if (scrolling || document.hidden) {
        if (!background!.hasAttribute("data-paused")) background!.dataset.paused = "true";
        if (drift?.playState === "running") drift.pause();
      } else {
        background!.removeAttribute("data-paused");
        if (drift?.playState === "paused") drift.play();
      }
    }

    function startDrift() {
      if (!enabled) return;
      // Every destination is inside the same circle, so motion never wanders away.
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * DRIFT_RADIUS;
      const destination = { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
      const distance = Math.hypot(destination.x - position.x, destination.y - position.y);
      const from = `translate3d(${position.x}px, ${position.y}px, 0)`;
      const to = `translate3d(${destination.x}px, ${destination.y}px, 0)`;
      const animation = layer!.animate([{ transform: from }, { transform: to }], {
        duration: Math.max(MIN_DRIFT_DURATION, distance / DRIFT_SPEED * 1000),
        easing: "ease-in-out",
        fill: "forwards",
      });
      drift = animation;
      syncPaused();
      void animation.finished.then(() => {
        if (!enabled || drift !== animation) return;
        position = destination;
        // Keep the endpoint in place while replacing the completed animation.
        layer!.style.transform = to;
        animation.cancel();
        startDrift();
      }, () => {
        // Preference changes and unmounts intentionally cancel the animation.
      });
    }

    function checkIdle() {
      const remaining = 160 - (performance.now() - lastScrollTime);
      if (remaining > 0) {
        idleTimer = window.setTimeout(checkIdle, remaining);
        return;
      }
      idleTimer = null;
      scrolling = false;
      syncPaused();
    }

    function scroll() {
      lastScrollTime = performance.now();
      if (!scrolling) {
        scrolling = true;
        syncPaused();
      }
      if (idleTimer === null) idleTimer = window.setTimeout(checkIdle, 160);
    }

    function detach() {
      enabled = false;
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", syncPaused);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = null;
      scrolling = false;
      background!.removeAttribute("data-paused");
      drift?.cancel();
      drift = null;
      position = { x: 0, y: 0 };
      layer!.style.removeProperty("transform");
    }

    function syncPreference() {
      detach();
      if (!preference.matches) return;
      enabled = true;
      startDrift();
      window.addEventListener("scroll", scroll, { passive: true });
      document.addEventListener("visibilitychange", syncPaused);
    }

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      preference.removeEventListener("change", syncPreference);
      detach();
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      <div className="ambient-glow" ref={glow} style={{ inset: -(DRIFT_RADIUS + 16) }} />
    </div>
  );
}
