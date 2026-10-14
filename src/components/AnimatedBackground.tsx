"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const pointerLayer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = pointerLayer.current;
    if (!layer) return;
    const preference = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let frame: number | null = null;
    const target = { x: 0, y: 0 };

    function schedule() {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        layer!.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
        frame = null;
      });
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
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

    function detach() {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", leave);
      window.removeEventListener("blur", reset);
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      target.x = target.y = 0;
      layer!.style.removeProperty("transform");
    }

    function syncPreference() {
      detach();
      if (!preference.matches) return;
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerout", leave);
      window.addEventListener("blur", reset);
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
        <div className="ambient-grid" />
      </div>
    </div>
  );
}
