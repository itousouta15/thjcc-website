"use client";

import { useLayoutEffect, useState, type RefObject } from "react";
import type { HatTarget } from "./team-hats";

export function useTeamHatTargets(list: RefObject<HTMLUListElement>, enabled: boolean) {
  const [targets, setTargets] = useState<HatTarget[]>([]);

  useLayoutEffect(() => {
    const element = list.current;
    if (!enabled || !element) return;
    let frame: number | null = null;
    let active = true;

    function measure() {
      frame = null;
      if (!active) return;
      const next = Array.from(element!.querySelectorAll<HTMLElement>("[data-team-member-id]")).flatMap(member => {
        const avatar = member.querySelector(".team-avatar");
        if (!avatar) return [];
        const rect = avatar.getBoundingClientRect();
        return [{ id: member.dataset.teamMemberId!, x: rect.left + window.scrollX + rect.width / 2,
          y: rect.top + window.scrollY + rect.height / 2, width: rect.width, height: rect.height }];
      });
      setTargets(current => current.length === next.length && current.every((target, index) => {
        const other = next[index];
        return target.id === other.id && Math.abs(target.x - other.x) < 0.1 && Math.abs(target.y - other.y) < 0.1
          && Math.abs(target.width - other.width) < 0.1 && Math.abs(target.height - other.height) < 0.1;
      }) ? current : next);
    }

    function schedule() {
      if (active && frame === null) frame = window.requestAnimationFrame(measure);
    }

    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    // Changes above the team section (fonts, images, viewport) may shift every head.
    observer.observe(document.body);
    element.querySelectorAll(".team-avatar").forEach(avatar => observer.observe(avatar));
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    void document.fonts.ready.then(schedule);
    measure();
    return () => {
      active = false;
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [enabled, list]);

  return targets;
}
