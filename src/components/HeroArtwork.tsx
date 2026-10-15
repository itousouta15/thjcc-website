"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { isSmoothScrollActive, subscribeSmoothScroll } from "@/lib/smooth-scroll";

export function HeroArtwork() {
  const artwork = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = artwork.current;
    const slot = element?.parentElement;
    const stage = element?.closest<HTMLElement>(".intro-stage");
    const title = stage?.querySelector<HTMLElement>("#about-title");
    const target = stage?.querySelector<HTMLElement>(".about-art-target");
    if (!element || !slot || !stage || !title || !target) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;
    let geometry = { x: 0, y: 0, scale: 1, endScroll: 1 };
    let lastProgress = -1;
    let disposed = false;
    let unsubscribeScroll: (() => void) | null = null;

    function applyScroll(scrollY: number) {
      const progress = Math.max(0, Math.min(1, scrollY / geometry.endScroll));
      if (progress === lastProgress) return;
      lastProgress = progress;
      const scale = 1 + (geometry.scale - 1) * progress;
      // Follow Lenis/native scroll position linearly, without pointer offsets or timed easing.
      element!.style.transform = `translate3d(${geometry.x * progress}px, ${geometry.y * progress}px, 0) scale(${scale})`;
    }

    function render() {
      frame = null;
      applyScroll(window.scrollY);
    }

    function schedule() {
      if (isSmoothScrollActive()) return;
      if (frame === null) frame = window.requestAnimationFrame(render);
    }

    function measure() {
      if (reducedMotion.matches) {
        element!.style.removeProperty("transform");
        return;
      }

      const targetBounds = target!.getBoundingClientRect();
      const titleBounds = title!.getBoundingClientRect();
      // Measure the untransformed CSS slot so refresh and resize never reset the image's position.
      const slotBounds = slot!.getBoundingClientRect();
      const scale = Math.min(targetBounds.width / slotBounds.width, targetBounds.height / slotBounds.height, 1);
      geometry = {
        x: targetBounds.right - slotBounds.right,
        y: targetBounds.top + (targetBounds.height - slotBounds.height * scale) / 2 - slotBounds.top,
        scale,
        endScroll: Math.max(320, titleBounds.top + window.scrollY + titleBounds.height / 2 - window.innerHeight * 0.6),
      };
      lastProgress = -1;
      if (frame !== null) window.cancelAnimationFrame(frame);
      render();
    }

    const observer = new ResizeObserver(measure);

    function detach() {
      unsubscribeScroll?.();
      unsubscribeScroll = null;
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      document.fonts.removeEventListener("loadingdone", measure);
      observer.disconnect();
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      lastProgress = -1;
      element!.style.removeProperty("transform");
    }

    function syncPreference() {
      detach();
      measure();
      observer.observe(stage!);
      observer.observe(slot!);
      observer.observe(title!);
      observer.observe(target!);
      if (!reducedMotion.matches) {
        unsubscribeScroll = subscribeSmoothScroll(scrollY => {
          if (frame !== null) window.cancelAnimationFrame(frame);
          frame = null;
          applyScroll(scrollY);
        });
        window.addEventListener("scroll", schedule, { passive: true });
      }
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
