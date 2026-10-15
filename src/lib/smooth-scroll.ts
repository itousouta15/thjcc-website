type ScrollListener = (scrollY: number) => void;

const listeners = new Set<ScrollListener>();
let active = false;

export function setSmoothScrollActive(value: boolean) {
  active = value;
}

export function isSmoothScrollActive() {
  return active;
}

export function publishSmoothScroll(scrollY: number) {
  for (const listener of listeners) listener(scrollY);
}

export function subscribeSmoothScroll(listener: ScrollListener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
