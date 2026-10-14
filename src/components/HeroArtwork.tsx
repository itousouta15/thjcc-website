"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

const MAX_OFFSET = 3;
const SPRING_STIFFNESS = 32;
const SPRING_DAMPING = 12;

export function HeroArtwork() {
  const artwork = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = artwork.current;
    const hero = element?.closest<HTMLElement>(".hero");
    if (!element || !hero) return;

    const preference = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let frame: number | null = null;
    let previousTime: number | null = null;
    const current = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const velocity = { x: 0, y: 0 };

    function animate(time: number) {
      const delta = previousTime === null ? 1 / 60 : Math.min((time - previousTime) / 1000, 1 / 30);
      previousTime = time;
      const damping = Math.exp(-SPRING_DAMPING * delta);
      velocity.x = (velocity.x + (target.x - current.x) * SPRING_STIFFNESS * delta) * damping;
      velocity.y = (velocity.y + (target.y - current.y) * SPRING_STIFFNESS * delta) * damping;
      current.x += velocity.x * delta;
      current.y += velocity.y * delta;
      const settled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y)
        + Math.abs(velocity.x) + Math.abs(velocity.y) < 0.01;
      if (settled) {
        current.x = target.x;
        current.y = target.y;
        velocity.x = velocity.y = 0;
      }
      element!.style.setProperty("--hero-parallax-x", `${current.x.toFixed(3)}px`);
      element!.style.setProperty("--hero-parallax-y", `${current.y.toFixed(3)}px`);
      if (!settled) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = null;
      }
    }

    function schedule() {
      if (frame === null) {
        previousTime = null;
        frame = window.requestAnimationFrame(animate);
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
      previousTime = null;
      current.x = current.y = target.x = target.y = 0;
      velocity.x = velocity.y = 0;
      element!.style.removeProperty("--hero-parallax-x");
      element!.style.removeProperty("--hero-parallax-y");
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
