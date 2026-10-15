"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { TeamMember } from "@/data/team";
import { getHatRotation, getInitialHatAngle, normalizeHatAngle } from "@/lib/team-hats";

type Props = {
  member: TeamMember;
  angle: number;
  unlocked: boolean;
  onChange: (angle: number, commit: boolean) => void;
};

export function InteractiveTeamHat({ member, angle, unlocked, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const handle = useRef<HTMLButtonElement>(null);
  const initialized = useRef(false);
  const drag = useRef<{ pointerId: number; x: number; y: number; pointerAngle: number; angle: number } | null>(null);
  const frame = useRef<number | null>(null);
  const pending = useRef<number | null>(null);
  const decoration = member.decoration!;
  const initial = getInitialHatAngle(decoration);

  useLayoutEffect(() => {
    if (initialized.current || !handle.current) return;
    initialized.current = true;
    const hat = handle.current.getBoundingClientRect();
    const avatar = handle.current.closest(".team-avatar")!.getBoundingClientRect();
    const x = avatar.left + avatar.width / 2;
    const y = avatar.top + avatar.height / 2;
    const orbit = Math.atan2(hat.top + hat.height / 2 - y, hat.left + hat.width / 2 - x) * 180 / Math.PI;
    const viewportWidth = document.documentElement.clientWidth;
    let targetOrbit = -90;
    for (let attempt = 0; attempt < 16; attempt++) {
      const candidate = -140 + Math.random() * 100;
      const delta = (candidate - orbit) * Math.PI / 180;
      const corners = [[hat.left, hat.top], [hat.right, hat.top], [hat.left, hat.bottom], [hat.right, hat.bottom]];
      const fits = corners.every(([left, top]) => {
        const rotatedX = x + (left - x) * Math.cos(delta) - (top - y) * Math.sin(delta);
        return rotatedX >= 6 && rotatedX <= viewportWidth - 6;
      });
      if (fits) {
        targetOrbit = candidate;
        break;
      }
    }
    onChange(normalizeHatAngle(angle + targetOrbit - orbit), false);
    setReady(true);
  }, [angle, onChange]);

  useEffect(() => () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
  }, []);

  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || drag.current) return;
    event.preventDefault();
    event.stopPropagation();
    const avatar = event.currentTarget.closest(".team-avatar")!.getBoundingClientRect();
    const x = avatar.left + avatar.width / 2;
    const y = avatar.top + avatar.height / 2;
    drag.current = {
      pointerId: event.pointerId, x, y, angle,
      pointerAngle: Math.atan2(event.clientY - y, event.clientX - x) * 180 / Math.PI,
    };
    pending.current = angle;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }

  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    event.preventDefault();
    const pointerAngle = Math.atan2(event.clientY - start.y, event.clientX - start.x) * 180 / Math.PI;
    pending.current = normalizeHatAngle(start.angle + pointerAngle - start.pointerAngle);
    if (frame.current === null) {
      frame.current = window.requestAnimationFrame(() => {
        frame.current = null;
        if (pending.current !== null) onChange(pending.current, false);
      });
    }
  }

  function finish(event: PointerEvent<HTMLButtonElement>, commit: boolean) {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const latest = pending.current ?? angle;
    drag.current = null;
    pending.current = null;
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    onChange(latest, commit);
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const steps: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -15, PageUp: 15 };
    let next: number;
    if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 355;
    else if (event.key in steps) next = angle + steps[event.key];
    else return;
    event.preventDefault();
    event.stopPropagation();
    onChange(normalizeHatAngle(next), true);
  }

  return (
    <div className={`team-hat-orbit${unlocked ? " team-hat-orbit--unlocked" : ""}`}
      data-ready={ready} style={{ transform: `rotate(${getHatRotation(angle, initial)}deg)` }}>
      <button ref={handle} className={`team-decoration team-decoration--${decoration} team-hat-handle`} type="button" role="slider"
        aria-label={`${member.name} 的帽子角度`} aria-valuemin={0} aria-valuemax={360}
        aria-valuenow={Math.round(normalizeHatAngle(angle))} aria-valuetext={`${Math.round(normalizeHatAngle(angle))} 度`}
        title="拖曳帽子旋轉，也可以用方向鍵調整角度" data-dragging={dragging || undefined}
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event => finish(event, true)}
        onPointerCancel={event => finish(event, false)} onLostPointerCapture={event => finish(event, false)}
        onKeyDown={keyDown} onClick={event => event.stopPropagation()}>
        <Image src={`/images/team-decoration-${decoration === "left" ? "left" : "right"}.svg`}
          alt="" width={145} height={68} draggable={false} />
      </button>
    </div>
  );
}
