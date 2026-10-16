"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { TeamMember } from "@/data/team";
import { confineHat, findHatDropTarget, getWornHatPose, normalizeHatAngle, type HatPose, type HatTarget } from "@/lib/team-hats";

type Props = {
  member: TeamMember;
  members: readonly TeamMember[];
  targets: readonly HatTarget[];
  targetId: string | null;
  stack: number;
  wornPose?: HatPose;
  angle: number;
  unlocked: boolean;
  helpId: string;
  onChange: (angle: number, commit: boolean, targetId: string | null) => void;
  onHover: (targetId: string | null) => void;
};

type Drag = {
  pointerId: number;
  startX: number;
  startY: number;
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
  moved: boolean;
  mode: "rotate" | "move";
  detachable: boolean;
  radius: number;
  detachDistance: number;
  grabPose: HatPose;
  pivotX: number;
  pivotY: number;
  pointerAngle: number;
  targetId: string | null;
  origin: HatPose;
  pose: HatPose;
};

function getHatFloor(pose: HatPose) {
  const tilt = pose.angle * Math.PI / 180;
  const halfHeight = (Math.abs(Math.sin(tilt)) * pose.width + Math.abs(Math.cos(tilt)) * pose.width * 68 / 145) / 2;
  const viewport = window.visualViewport;
  const bottom = window.scrollY + (viewport?.offsetTop ?? 0) + (viewport?.height ?? window.innerHeight);
  return Math.min(document.documentElement.scrollHeight, bottom) - halfHeight - 6;
}

export function InteractiveTeamHat({ member, members, targets, targetId, stack, wornPose, angle, unlocked, helpId, onChange, onHover }: Props) {
  const [loose, setLoose] = useState<HatPose | null>(null);
  const [dragging, setDragging] = useState(false);
  const [flying, setFlying] = useState(false);
  const handle = useRef<HTMLButtonElement>(null);
  const initialized = useRef(false);
  const drag = useRef<Drag | null>(null);
  const frame = useRef<number | null>(null);
  const viewportChanged = useRef<() => void>(() => {});
  const target = targets.find(item => item.id === targetId);
  const pose = target ? wornPose : loose;

  useLayoutEffect(() => {
    if (initialized.current || !target) return;
    initialized.current = true;
    let initial = angle;
    for (let attempt = 0; attempt < 16; attempt++) {
      const candidate = -50 + Math.random() * 100;
      const next = getWornHatPose(target, member.decoration!, candidate);
      const radius = Math.hypot(next.width, next.width * 68 / 145) / 2;
      if (next.x - radius >= 6 && next.x + radius <= document.documentElement.clientWidth - 6) {
        initial = candidate;
        break;
      }
    }
    onChange(normalizeHatAngle(initial), false, target.id);
  }, [angle, member.decoration, onChange, target]);

  useEffect(() => () => {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
  }, []);

  useLayoutEffect(() => {
    viewportChanged.current = () => {
      if (targetId === null && loose && !drag.current && frame.current === null) toss(loose, 0, 0);
    };
  });

  useEffect(() => {
    const update = () => viewportChanged.current();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", update);
    viewport?.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      viewport?.removeEventListener("resize", update);
      viewport?.removeEventListener("scroll", update);
    };
  }, []);

  function stopFlight() {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    frame.current = null;
    setFlying(false);
  }

  function toss(start: HatPose, vx: number, vy: number) {
    const bounded = confineHat(start);
    if (vx === 0 && vy === 0 && Math.abs(start.y - getHatFloor(start)) < 0.5 && Math.abs(start.x - bounded.x) < 0.5) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const settled = { ...bounded, y: getHatFloor(start) };
      setLoose(settled);
      onChange(settled.angle, false, null);
      return;
    }
    const radius = Math.hypot(start.width, start.width * 68 / 145) / 2 + 6;
    let current = { ...start, x: bounded.x };
    let last = performance.now();
    const began = last;
    let spin = vx * 0.16;
    setFlying(true);

    function tick(now: number) {
      const dt = Math.min(32, now - last);
      last = now;
      vx *= Math.pow(0.994, dt);
      vy += 0.0016 * dt;
      let x = current.x + vx * dt;
      let y = current.y + vy * dt;
      const angle = normalizeHatAngle(current.angle + spin * dt);
      // Read the visible floor every frame, including while scrolling or resizing.
      const floor = getHatFloor({ ...current, angle });
      const right = Math.max(radius, document.documentElement.clientWidth - radius);
      if (x < radius || x > right) {
        x = Math.max(radius, Math.min(right, x));
        vx *= -0.55;
        spin *= -0.6;
      }
      if (y < radius) {
        y = radius;
        vy = Math.abs(vy) * 0.45;
      }
      if (y >= floor) {
        y = floor;
        vy = -Math.abs(vy) * 0.42;
        vx *= 0.7;
        spin *= 0.6;
      }
      current = { ...current, x, y, angle };
      setLoose(current);
      if (y >= floor && ((Math.abs(vy) < 0.08 && Math.abs(vx) < 0.04) || now - began > 4000)) {
        frame.current = null;
        setFlying(false);
        onChange(current.angle, false, null);
      } else frame.current = window.requestAnimationFrame(tick);
    }
    frame.current = window.requestAnimationFrame(tick);
  }

  function pointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (event.button !== 0 || drag.current || !pose) return;
    event.preventDefault();
    event.stopPropagation();
    stopFlight();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;
    const pivotX = target?.x ?? pose.x;
    const pivotY = target?.y ?? pose.y;
    drag.current = {
      pointerId: event.pointerId, startX: x, startY: y, x, y, time: performance.now(), vx: 0, vy: 0,
      moved: false, mode: event.altKey || (target && !event.shiftKey) ? "rotate" : "move",
      detachable: Boolean(target) && !event.altKey && !event.shiftKey,
      radius: Math.hypot(x - pivotX, y - pivotY), detachDistance: Math.max(28, (target?.width ?? pose.width) * 0.22),
      grabPose: pose, pivotX, pivotY,
      pointerAngle: Math.atan2(y - pivotY, x - pivotX) * 180 / Math.PI,
      targetId, origin: pose, pose,
    };
    setDragging(true);
  }

  function pointerMove(event: PointerEvent<HTMLButtonElement>) {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    event.preventDefault();
    const x = event.clientX + window.scrollX;
    const y = event.clientY + window.scrollY;
    const now = performance.now();
    if (!start.moved && Math.hypot(x - start.startX, y - start.startY) < 4) return;
    start.moved = true;
    if (start.mode === "rotate" && start.detachable
      && Math.hypot(x - start.pivotX, y - start.pivotY) > start.radius + start.detachDistance) {
      start.mode = "move";
      start.grabPose = { ...start.origin, angle: pose?.angle ?? start.pose.angle };
    }
    if (start.mode === "rotate") {
      const pointerAngle = Math.atan2(y - start.pivotY, x - start.pivotX) * 180 / Math.PI;
      const next = normalizeHatAngle(start.origin.angle + pointerAngle - start.pointerAngle);
      start.pose = { ...start.origin, angle: next };
      if (!start.targetId) setLoose(start.pose);
      onChange(next, false, start.targetId);
      start.x = x;
      start.y = y;
      start.time = now;
      return;
    }
    const dt = Math.max(8, now - start.time);
    start.vx = Math.max(-2.6, Math.min(2.6, (x - start.x) / dt));
    start.vy = Math.max(-2.6, Math.min(2.6, (y - start.y) / dt));
    start.x = x;
    start.y = y;
    start.time = now;
    start.pose = confineHat({ ...start.grabPose, x: start.grabPose.x + x - start.startX, y: start.grabPose.y + y - start.startY });
    setLoose(start.pose);
    if (targetId !== null) onChange(start.pose.angle, false, null);
    onHover(findHatDropTarget(targets, start.pose.x, start.pose.y)?.id ?? null);
  }

  function finish(event: PointerEvent<HTMLButtonElement>, commit: boolean) {
    const start = drag.current;
    if (!start || start.pointerId !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    onHover(null);
    if (!commit) {
      setLoose(start.origin);
      onChange(start.origin.angle, false, start.targetId);
    } else if (start.mode === "rotate" || !start.moved) {
      onChange(start.pose.angle, start.moved, start.targetId);
    } else {
      const destination = findHatDropTarget(targets, start.pose.x, start.pose.y);
      onChange(start.pose.angle, Boolean(destination), destination?.id ?? null);
      if (!destination) {
        setLoose(start.pose);
        const recent = performance.now() - start.time < 100;
        toss(start.pose, recent ? start.vx : 0, recent ? start.vy : 0);
      }
    }
  }

  function keyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape" && drag.current) {
      event.preventDefault();
      const start = drag.current;
      drag.current = null;
      if (handle.current?.hasPointerCapture(start.pointerId)) handle.current.releasePointerCapture(start.pointerId);
      setDragging(false);
      setLoose(start.origin);
      onHover(null);
      onChange(start.origin.angle, false, start.targetId);
      return;
    }
    if (drag.current || !pose) return;
    const steps: Record<string, number> = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5, PageDown: -15, PageUp: 15 };
    if (!(event.key in steps) && !["Home", "End", "Enter", " ", "Delete", "Backspace"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    stopFlight();
    if (event.key === "Enter" || event.key === " ") {
      const next = targets[(targets.findIndex(item => item.id === targetId) + 1) % targets.length];
      if (next) onChange(pose.angle, true, next.id);
    } else if (event.key === "Backspace") {
      onChange(pose.angle, true, member.id);
    } else if (event.key === "Delete" || (event.shiftKey && event.key.startsWith("Arrow"))) {
      const dx = event.key === "ArrowLeft" ? -20 : event.key === "ArrowRight" ? 20 : 0;
      const dy = event.key === "ArrowUp" ? -20 : event.key === "ArrowDown" ? 20 : event.key === "Delete" ? 60 : 0;
      setLoose(confineHat({ ...pose, x: pose.x + dx, y: pose.y + dy }));
      onChange(pose.angle, false, null);
    } else {
      const next = normalizeHatAngle(event.key === "Home" ? 0 : event.key === "End" ? 355 : pose.angle + steps[event.key]);
      setLoose({ ...pose, angle: next });
      onChange(next, true, targetId);
    }
  }

  if (!pose || typeof document === "undefined") return null;
  const wearer = members.find(item => item.id === targetId);
  const location = wearer ? `戴在 ${wearer.name} 頭上，第 ${stack + 1} 頂` : "放在頁面上";

  return createPortal(
    <div className={`team-hat-playground${unlocked ? " team-hat-playground--unlocked" : ""}`}
      style={{ zIndex: dragging ? 30 : flying ? 20 : 10 + stack }}>
      <button ref={handle} className="team-hat-handle team-hat-movable" type="button" role="slider"
        data-hat-id={member.id} data-hat-target={targetId ?? "loose"} data-hat-stack={targetId ? stack : undefined}
        data-dragging={dragging || undefined} data-flying={flying || undefined}
        style={{ width: pose.width, height: pose.width * 68 / 145,
          transform: `translate3d(${pose.x}px, ${pose.y}px, 0) translate(-50%, -50%) rotate(${pose.angle}deg)`,
          zIndex: dragging ? 3 : flying ? 2 : 1 }}
        aria-label={`${member.name} 的帽子，${location}`} aria-describedby={helpId}
        aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(normalizeHatAngle(pose.angle))}
        aria-valuetext={`${Math.round(normalizeHatAngle(pose.angle))} 度，${location}`}
        title="沿頭像拖曳旋轉；往外拉拔下；Shift＋拖曳直接拿走；點兩下或方向鍵也可旋轉" data-lenis-prevent
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={event => finish(event, true)}
        onPointerCancel={event => finish(event, false)} onLostPointerCapture={event => finish(event, false)}
        onKeyDown={keyDown} onClick={event => event.stopPropagation()}
        onDoubleClick={event => {
          event.preventDefault();
          event.stopPropagation();
          if (drag.current || flying) return;
          const next = normalizeHatAngle(Math.round(pose.angle / 15) * 15 + 15);
          setLoose({ ...pose, angle: next });
          onChange(next, true, targetId);
        }}>
        <Image src={`/images/team-decoration-${member.decoration === "left" ? "left" : "right"}.svg`}
          alt="" width={145} height={68} draggable={false} />
      </button>
    </div>, document.body,
  );
}
