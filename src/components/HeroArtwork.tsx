"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";

const MAX_OFFSET = 3;

export function HeroArtwork() {
  const artwork = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = artwork.current;
    const hero = element?.closest(".intro-stage")?.querySelector<HTMLElement>(".hero");
    const image = element?.querySelector("img");
    if (!element || !hero || !image) return;

    const preference = window.matchMedia("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)");
    let frame: number | null = null;
    const target = { x: 0, y: 0 };
    let bounds = { left: 0, top: 0, width: 1, height: 1 };

    function measure() {
      const rect = hero!.getBoundingClientRect();
      bounds = { left: rect.left, top: rect.top + window.scrollY, width: rect.width, height: rect.height };
    }

    const observer = new ResizeObserver(measure);

    function applyTarget() {
      // Update only the destination; the compositor interpolates every frame.
      image!.style.transform = `translate3d(${target.x}px, ${target.y}px, 0)`;
      frame = null;
    }

    function schedule() {
      if (frame === null) {
        frame = window.requestAnimationFrame(applyTarget);
      }
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const normalizedX = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const normalizedY = ((event.clientY + window.scrollY - bounds.top) / bounds.height) * 2 - 1;
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
      window.removeEventListener("resize", measure);
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      target.x = target.y = 0;
      image!.style.removeProperty("transform");
      delete element!.dataset.parallax;
    }

    function syncPreference() {
      detach();
      if (!preference.matches) return;
      measure();
      observer.observe(hero!);
      element!.dataset.parallax = "true";
      hero!.addEventListener("pointermove", move, { passive: true });
      hero!.addEventListener("pointerleave", reset);
      window.addEventListener("blur", reset);
      window.addEventListener("resize", measure);
    }

    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => {
      preference.removeEventListener("change", syncPreference);
      detach();
    };
  }, []);

  useLayoutEffect(() => {
    const element = artwork.current;
    const slot = element?.parentElement;
    const stage = element?.closest<HTMLElement>(".intro-stage");
    const title = stage?.querySelector<HTMLElement>("#about-title");
    const target = stage?.querySelector<HTMLElement>(".about-art-target");
    const hero = stage?.querySelector<HTMLElement>(".hero");
    if (!element || !slot || !stage || !title || !target || !hero) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let geometry = { x: 0, y: 0, scale: 1, endScroll: 1 };
    let lastProgress = -1;
    let disposed = false;

    function render() {
      frame = null;
      const progress = Math.max(0, Math.min(1, window.scrollY / geometry.endScroll));
      if (progress === lastProgress) return;
      lastProgress = progress;
      const scale = 1 + (geometry.scale - 1) * progress;
      // Scroll position is the only timeline: no easing or timed transition here.
      element!.style.transform = `translate3d(${geometry.x * progress}px, ${geometry.y * progress}px, 0) scale(${scale})`;
      element!.dataset.scrollProgress = String(progress);
    }

    function schedule() {
      if (frame === null) frame = window.requestAnimationFrame(render);
    }

    function measure() {
      if (reducedMotion.matches) {
        element!.style.removeProperty("transform");
        delete element!.dataset.scrollProgress;
        return;
      }

      const targetBounds = target!.getBoundingClientRect();
      const titleBounds = title!.getBoundingClientRect();
      // The CSS slot stays in normal flow and never inherits the scroll transform.
      const slotBounds = slot!.getBoundingClientRect();
      const { width, height } = slotBounds;
      const scale = Math.min(targetBounds.width / width, targetBounds.height / height, 1);

      geometry = {
        x: targetBounds.right - slotBounds.right,
        y: targetBounds.top + (targetBounds.height - height * scale) / 2 - slotBounds.top,
        scale,
        // Finish as the intro heading reaches the lower-middle of the viewport.
        endScroll: Math.max(320, titleBounds.top + window.scrollY + titleBounds.height / 2 - window.innerHeight * 0.6),
      };
      lastProgress = -1;
      if (frame !== null) window.cancelAnimationFrame(frame);
      render();
    }

    const observer = new ResizeObserver(measure);

    function detach() {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.fonts.removeEventListener("loadingdone", measure);
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastProgress = -1;
      element!.style.removeProperty("transform");
      delete element!.dataset.scrollProgress;
    }

    function syncPreference() {
      detach();
      measure();
      observer.observe(stage!);
      observer.observe(slot!);
      observer.observe(hero!);
      observer.observe(title!);
      observer.observe(target!);
      if (!reducedMotion.matches) window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", measure);
      document.fonts.addEventListener("loadingdone", measure);
    }

    syncPreference();
    void document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    reducedMotion.addEventListener("change", syncPreference);
    return () => {
      disposed = true;
      reducedMotion.removeEventListener("change", syncPreference);
      detach();
    };
  }, []);

  return (
    <div className="hero-art-slot" aria-hidden="true">
      <div className="hero-art" ref={artwork} data-node-id="76:232">
        <Image src="/images/THJCC.webp" alt="" width={2070} height={1707} priority
          sizes="(max-width: 767px) 300px, (max-width: 1319px) 55vw, 675px" />
      </div>
    </div>
  );
}
