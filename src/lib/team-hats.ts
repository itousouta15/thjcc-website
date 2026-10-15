export const HAT_ALIGNMENT_TOLERANCE = 5;

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
