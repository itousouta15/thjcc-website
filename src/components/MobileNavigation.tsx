"use client";

import { useEffect, useId, useRef, useState } from "react";
import { navigation } from "@/data/site";
import { ConfiguredLink } from "./ConfiguredLink";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="mobile-navigation" ref={root}>
      <button className={`menu-toggle${open ? " is-open" : ""}`} ref={button} type="button"
        aria-expanded={open} aria-controls={menuId} aria-label={open ? "關閉導覽選單" : "開啟導覽選單"}
        onClick={() => setOpen(!open)}>
        <span /><span />
      </button>
      <nav className="mobile-menu" id={menuId} aria-label="手機版主導覽" hidden={!open}>
        {navigation.map(link => (
          <ConfiguredLink key={link.label} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </ConfiguredLink>
        ))}
      </nav>
    </div>
  );
}
