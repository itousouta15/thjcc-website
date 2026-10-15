"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

export function useAnimatedDialog(open: boolean, onClose: () => void) {
  const modal = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const closeRequest = useRef<((afterClose?: () => void) => void) | null>(null);

  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const dialog = modal.current;
    if (!open || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    let disposed = false;
    let closing = false;
    let afterClose: (() => void) | undefined;

    function requestClose(action?: () => void) {
      if (closing || !dialog!.open) return;
      closing = true;
      afterClose = action;
      dialog!.dataset.state = "closing";
      // Wait for both the panel and its ::backdrop, including an interrupted entrance.
      const transitions = dialog!.getAnimations({ subtree: true }).filter(animation =>
        animation.effect instanceof KeyframeEffect && animation.effect.target === dialog);
      void Promise.allSettled(transitions.map(animation => animation.finished)).then(() => {
        if (!disposed && dialog!.open) dialog!.close();
      });
    }

    function handleClose() {
      // Ignore a queued close event from Strict Mode's previous effect cleanup.
      if (!disposed && !dialog!.open) (afterClose ?? onCloseRef.current)();
    }

    function handleCancel(event: Event) {
      event.preventDefault();
      requestClose();
    }

    function handleBackdrop(event: MouseEvent) {
      if (event.target !== dialog) return;
      const bounds = dialog!.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right
        || event.clientY < bounds.top || event.clientY > bounds.bottom) requestClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
      const controls = [...dialog!.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]')]
        .filter(control => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    closeRequest.current = requestClose;
    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);
    dialog.addEventListener("click", handleBackdrop);
    dialog.addEventListener("keydown", handleKeyDown);
    dialog.dataset.state = "opening";
    dialog.showModal();
    // Establish the transparent backdrop before transitioning to the open state.
    void window.getComputedStyle(dialog, "::backdrop").opacity;
    dialog.dataset.state = "open";
    window.dispatchEvent(new CustomEvent("thjcc:scroll-lock", { detail: true }));

    return () => {
      disposed = true;
      closeRequest.current = null;
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
      dialog.removeEventListener("click", handleBackdrop);
      dialog.removeEventListener("keydown", handleKeyDown);
      if (dialog.open) dialog.close();
      window.dispatchEvent(new CustomEvent("thjcc:scroll-lock", { detail: false }));
      if (trigger?.isConnected && (document.activeElement === document.body || dialog.contains(document.activeElement))) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [open]);

  const requestClose = useCallback((afterClose?: () => void) => closeRequest.current?.(afterClose), []);
  return { modal, requestClose };
}
