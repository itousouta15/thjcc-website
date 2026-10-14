"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    const element = artwork.current;
    const stage = element?.closest<HTMLElement>(".intro-stage");
    const title = stage?.querySelector<HTMLElement>("#about-title");
    const target = stage?.querySelector<HTMLElement>(".about-art-target");
    const hero = stage?.querySelector<HTMLElement>(".hero");
    const inner = hero?.querySelector<HTMLElement>(".hero-inner");
    if (!element || !stage || !title || !target || !hero || !inner) return;

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
      const stageBounds = stage!.getBoundingClientRect();

      // Use actual glyph bounds, not an arbitrary fixed-width text box.
      if (window.innerWidth >= 768) {
        const textBounds = [...hero!.querySelectorAll<HTMLElement>(".hero-eyebrow, .hero-wordmark, .hero-edition, .hero-subtitle")].map(text => {
          const range = document.createRange();
          range.selectNodeContents(text);
          return range.getBoundingClientRect().right;
        });
        const gap = Math.max(28, Math.min(44, window.innerWidth * 0.025));
        const left = Math.max(...textBounds) + gap;
        const rightLimit = Math.min(stageBounds.right + 24, inner!.getBoundingClientRect().right + 100);
        const width = Math.max(220, Math.min(675, rightLimit - left));
        element!.style.width = `${width}px`;
        element!.style.left = `${left - stageBounds.left}px`;
        element!.style.right = "auto";
      } else {
        element!.style.removeProperty("width");
        element!.style.removeProperty("left");
        element!.style.removeProperty("right");
      }

      if (reducedMotion.matches) {
        element!.style.removeProperty("transform");
        delete element!.dataset.scrollProgress;
        return;
      }

      const targetBounds = target!.getBoundingClientRect();
      const titleBounds = title!.getBoundingClientRect();
      const style = window.getComputedStyle(element!);
      const width = Number.parseFloat(style.width);
      const height = Number.parseFloat(style.height);
      const scale = Math.min(targetBounds.width / width, targetBounds.height / height, 1);
      const startTop = stageBounds.top + window.scrollY + Number.parseFloat(style.top);
      const startRight = stageBounds.left + Number.parseFloat(style.left) + width;

      geometry = {
        x: stageBounds.right - 12 - startRight,
        y: targetBounds.top + window.scrollY + (targetBounds.height - height * scale) / 2 + 12 - startTop,
        scale,
        // Finish as the intro heading reaches the lower-middle of the viewport.
        endScroll: Math.max(320, titleBounds.top + window.scrollY + titleBounds.height / 2 - window.innerHeight * 0.6),
      };
      lastProgress = -1;
      schedule();
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
      element.style.removeProperty("width");
      element.style.removeProperty("left");
      element.style.removeProperty("right");
    };
  }, []);

  return (
    <div className="hero-art" ref={artwork} aria-hidden="true" data-node-id="76:232">
      <Image src="/images/THJCC.png" alt="" width={2070} height={1707} priority
        sizes="(max-width: 767px) 90vw, (max-width: 1023px) 520px, 675px" />
    </div>
  );
}
