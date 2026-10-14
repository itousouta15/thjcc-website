"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_OFFSET = 3;

export function HeroArtwork() {
  const artwork = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = artwork.current;
    const hero = element?.closest<HTMLElement>(".hero");
    const image = element?.querySelector("img");
    if (!element || !hero || !image) return;

    const preference = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let frame: number | null = null;
    const target = { x: 0, y: 0 };

    function applyTarget() {
      // Update only the destination; the compositor interpolates every frame.
      image!.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) scale(1.015)`;
      frame = null;
    }

    function schedule() {
      if (frame === null) {
        frame = window.requestAnimationFrame(applyTarget);
      }
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const bounds = hero!.getBoundingClientRect();
      const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const normalizedY = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
      // Smoothly compress movement near the edges instead of hitting a hard clamp.
      target.x = Math.tanh(normalizedX * 1.15) * MAX_OFFSET;
      target.y = Math.tanh(normalizedY * 1.15) * MAX_OFFSET;
      schedule();
    }

    function reset() {
      target.x = 0;
      target.y = 0;
      schedule();
    }

    function detach() {
      hero!.removeEventListener("pointermove", move);
      hero!.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      target.x = target.y = 0;
      image!.style.removeProperty("transform");
      delete element!.dataset.parallax;
    }

    function syncPreference() {
      detach();
      if (!preference.matches) return;
      element!.dataset.parallax = "true";
      hero!.addEventListener("pointermove", move, { passive: true });
      hero!.addEventListener("pointerleave", reset);
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
    <div className="hero-art" ref={artwork} aria-hidden="true" data-node-id="76:232">
      <Image src="/images/hero-thjcc.png" alt="" width={603} height={547} priority
        sizes="(max-width: 767px) 390px, 603px" />
    </div>
  );
}
