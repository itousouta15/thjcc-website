"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const pointerLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = pointerLayer.current;
    const background = layer?.parentElement;
    if (!layer || !background) return;
    const preference = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let frame: number | null = null;
    let idleTimer: number | null = null;
    let scrolling = false;
    let lastScrollTime = 0;
    const target = { x: 0, y: 0 };

    function schedule() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        if (!scrolling && !document.hidden) layer!.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      });
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse" || scrolling || document.hidden) return;
      target.x = (event.clientX / window.innerWidth - 0.5) * 20;
      target.y = (event.clientY / window.innerHeight - 0.5) * 16;
      schedule();
    }

    function reset() {
      target.x = target.y = 0;
      schedule();
    }

    function leave(event: PointerEvent) {
      if (event.relatedTarget === null) reset();
    }

    function syncPaused() {
      if (scrolling || document.hidden) {
        if (!background!.hasAttribute("data-paused")) background!.dataset.paused = "true";
      } else {
        background!.removeAttribute("data-paused");
      }
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
      schedule();
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
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", reset);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("visibilitychange", syncPaused);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = null;
      scrolling = false;
      background!.removeAttribute("data-paused");
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      target.x = target.y = 0;
      layer!.style.removeProperty("transform");
    }

    function syncPreference() {
      detach();
      if (!preference.matches) return;
      syncPaused();
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerout", leave);
      window.addEventListener("blur", reset);
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
      <div className="ambient-pointer" ref={pointerLayer}>
        <div className="ambient-glow" />
      </div>
      <div className="ambient-grid" />
    </div>
  );
}
