export const HAT_ALIGNMENT_TOLERANCE = 5;

export type HatTarget = { id: string; x: number; y: number; width: number; height: number; hat?: HatPose };
export type HatPose = { x: number; y: number; width: number; angle: number };

export function getWornHatPose(target: HatTarget, decoration: string, angle: number, stack = 0): HatPose {
  const left = decoration === "left";
  const rotation = getHatRotation(angle, getInitialHatAngle(decoration)) * Math.PI / 180;
  const dx = target.width * (left ? 0.319155 : -0.30784);
  const dy = target.height * (left ? -0.4284825 : -0.4370475);
  const tilt = angle * Math.PI / 180;
  const rise = stack * target.width * 0.17;
  return {
    x: target.x + dx * Math.cos(rotation) - dy * Math.sin(rotation) + rise * Math.sin(tilt),
    y: target.y + dx * Math.sin(rotation) + dy * Math.cos(rotation) - rise * Math.cos(tilt),
    width: target.width * 0.72269,
    angle,
  };
}

export function getHatStackPoses(target: HatTarget, decoration: string, angles: readonly number[], pageWidth: number) {
  const poses = angles.map((angle, index) => ({ ...getWornHatPose(target, decoration, angles[0], index), angle }));
  const radius = target.width * 0.72269 * Math.hypot(1, 68 / 145) / 2;
  const left = Math.min(...poses.map(pose => pose.x - radius));
  const right = Math.max(...poses.map(pose => pose.x + radius));
  // Shift the whole tower at the viewport edge so it stays stacked while turning.
  const shift = left < 6 ? 6 - left : right > pageWidth - 6 ? pageWidth - 6 - right : 0;
  return poses.map(pose => ({ ...pose, x: pose.x + shift }));
}

export function findHatDropTarget(targets: readonly HatTarget[], x: number, y: number) {
  return targets.map(target => ({
    target,
    distance: Math.min(Math.hypot((x - target.x) / (target.width * 0.65),
      (y - (target.y - target.height * 0.25)) / (target.height * 0.8)),
    target.hat ? Math.hypot((x - target.hat.x) / (target.hat.width * 0.75),
      (y - target.hat.y) / (target.hat.width * 0.55)) : Infinity),
  })).filter(({ distance }) => distance <= 1).sort((a, b) => a.distance - b.distance)[0]?.target;
}

export function confineHat(pose: HatPose): HatPose {
  // The diagonal keeps rotated corners inside the page, too.
  const radius = Math.hypot(pose.width, pose.width * 68 / 145) / 2 + 6;
  const maxX = Math.max(radius, document.documentElement.clientWidth - radius);
  const maxY = Math.max(radius, document.documentElement.scrollHeight - radius);
  return { ...pose, x: Math.max(radius, Math.min(maxX, pose.x)), y: Math.max(radius, Math.min(maxY, pose.y)) };
}

export function normalizeHatAngle(angle: number) {
  return ((angle % 360) + 360) % 360;
}

export function getInitialHatAngle(decoration: string) {
  return decoration === "left" ? 38.07 : -31.33;
}

export function getHatRotation(angle: number, initial: number) {
  return normalizeHatAngle(angle - initial + 180) - 180;
}

export function areHatsAligned(angles: readonly number[]) {
  return angles.length > 1 && angles.every((angle, index) => angles.slice(index + 1)
    .every(other => Math.abs(getHatRotation(angle, other)) <= HAT_ALIGNMENT_TOLERANCE));
}
