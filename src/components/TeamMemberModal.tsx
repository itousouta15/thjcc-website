"use client";

import { useEffect, useId, useRef } from "react";
import { getTeamMemberRole, teamGroups, type TeamMember } from "@/data/team";
import { ConfiguredLink } from "./ConfiguredLink";
import { TeamAvatar } from "./TeamAvatar";
import { ModalCloseButton } from "./ModalCloseButton";
import { SocialIcon } from "./SocialIcon";

export function TeamMemberModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  const modal = useRef<HTMLDialogElement>(null);
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  useEffect(() => {
    const dialog = modal.current;
    if (!member || !dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    window.dispatchEvent(new CustomEvent("thjcc:scroll-lock", { detail: true }));
    return () => {
      if (dialog.open) dialog.close();
      window.dispatchEvent(new CustomEvent("thjcc:scroll-lock", { detail: false }));
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [member]);

  if (!member) return null;
  const group = teamGroups.find(group => group.id === member.group)!;
  const bio = member.bio?.filter(paragraph => paragraph.trim()) ?? [];
  const socialLinks = member.socialLinks?.filter(link => /^(https?:\/\/|mailto:)/i.test(link.href)) ?? [];

  return (
    <dialog ref={modal} className="organization-modal team-member-modal"
      aria-labelledby={titleId} aria-describedby={descriptionId} onClose={onClose} data-lenis-prevent
      onKeyDown={event => {
        if (event.key !== "Tab" || event.ctrlKey || event.metaKey || event.altKey) return;
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')];
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
        <ModalCloseButton label="關閉成員介紹" onClick={() => modal.current?.close()} />
        <div className="team-member-modal-header">
          <div className="team-member-modal-avatar" aria-hidden="true">
            <TeamAvatar member={member} sizes="(max-width: 767px) 96px, 144px" />
          </div>
          <div className="team-member-modal-info">
            <p className="organization-modal-category">{group.name} · {getTeamMemberRole(member)}</p>
            <h2 id={titleId}>{member.name}</h2>
            {socialLinks.length > 0 && (
              <nav className="team-member-socials" aria-label={`${member.name} 的社群連結`}>
                <ul>
                  {socialLinks.map(link => {
                    const external = /^https?:\/\//i.test(link.href);
                    return (
                      <li key={`${link.label}-${link.href}`}>
                        <ConfiguredLink href={link.href} className="team-member-social-link" title={link.label}
                          label={`${member.name} ${link.label}${external ? "（另開視窗）" : ""}`}>
                          <SocialIcon href={link.href} label={link.label} />
                        </ConfiguredLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
          </div>
        </div>
        <div className="organization-modal-copy">
          {bio.length ? bio.map((paragraph, index) => (
            <p id={index === 0 ? descriptionId : undefined} key={`${member.id}-${index}`}>{paragraph}</p>
          )) : <p id={descriptionId}>自我介紹準備中。</p>}
        </div>
      </div>
    </dialog>
  );
}
