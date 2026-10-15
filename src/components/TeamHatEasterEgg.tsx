"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { ModalCloseButton } from "./ModalCloseButton";

const FLAG = "THJCC{H4TS_1N_SYNC}";

export function TeamHatEasterEgg({ open, onClose, onReset }: { open: boolean; onClose: () => void; onReset: () => void }) {
  const modal = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    const dialog = modal.current;
    if (!open || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setCopyStatus("");
    dialog.showModal();
    window.dispatchEvent(new CustomEvent("thjcc:scroll-lock", { detail: true }));
    return () => {
      if (dialog.open) dialog.close();
      window.dispatchEvent(new CustomEvent("thjcc:scroll-lock", { detail: false }));
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;

  async function copyFlag() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(FLAG);
      setCopyStatus("紀念 Flag 已複製，和朋友分享你的發現吧！");
    } catch {
      setCopyStatus("可以直接選取上方的 Flag，手動複製。");
    }
  }

  return (
    <dialog ref={modal} className="organization-modal team-hat-easter-egg" aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`} onClose={onClose} data-lenis-prevent
      onKeyDown={event => {
        if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
        const controls = [...event.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={event => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right
          || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
      }}>
      <div className="organization-modal-panel">
        <ModalCloseButton label="關閉彩蛋" onClick={() => modal.current?.close()} />
        <div className="team-hat-sparks" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <span key={index} style={{ "--spark": index } as CSSProperties}>✦</span>
          ))}
        </div>
        <p className="team-hat-achievement">隱藏彩蛋解鎖</p>
        <h2 id={`${id}-title`}>全員帽子對齊！</h2>
        <p className="team-hat-easter-egg-copy" id={`${id}-description`}>
          你把大家的帽子轉到同一個方向，解鎖了官網的隱藏成就。這枚紀念 Flag 是你的探索紀錄，複製後和朋友分享這個小彩蛋吧！
        </p>
        <code className="team-hat-flag">{FLAG}</code>
        <div className="team-hat-actions">
          <button className="team-hat-copy" type="button" onClick={copyFlag}>複製紀念 Flag</button>
          <button className="team-hat-reset" type="button" onClick={onReset}>重設帽子，再玩一次</button>
        </div>
        <p className="team-hat-copy-status" role="status">{copyStatus}</p>
      </div>
    </dialog>
  );
}
