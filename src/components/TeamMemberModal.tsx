"use client";

import { useId } from "react";
import { getTeamMemberRole, getTeamMemberships, type TeamMember } from "@/data/team";
import { TeamAvatar } from "./TeamAvatar";
import { ModalCloseButton } from "./ModalCloseButton";
import { TeamMemberSocialLinks } from "./TeamMemberSocialLinks";
import { useAnimatedDialog } from "@/lib/use-animated-dialog";

export function TeamMemberModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  const { modal, requestClose } = useAnimatedDialog(Boolean(member), onClose);
  const id = useId();
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  if (!member) return null;
  const roleSummary = getTeamMemberships(member).map(getTeamMemberRole).join(" · ");
  const bio = member.bio?.filter(paragraph => paragraph.trim()) ?? [];
  const socialLinks = member.socialLinks?.filter(link => /^(https?:\/\/|mailto:)/i.test(link.href)) ?? [];

  return (
    <dialog ref={modal} className="organization-modal team-member-modal"
      aria-labelledby={titleId} aria-describedby={descriptionId} data-lenis-prevent>
      <div className="organization-modal-panel">
        <ModalCloseButton label="關閉成員介紹" onClick={() => requestClose()} />
        <div className="team-member-modal-header">
          <div className="team-member-modal-avatar" aria-hidden="true">
            <TeamAvatar member={member} sizes="(max-width: 767px) 96px, 144px" />
          </div>
          <div className="team-member-modal-info">
            <p className="organization-modal-category team-member-roles" title={roleSummary}>{roleSummary}</p>
            <h2 id={titleId}>{member.name}</h2>
            <TeamMemberSocialLinks name={member.name} links={socialLinks} placement="header" />
          </div>
        </div>
        <div className="organization-modal-copy">
          {bio.length ? bio.map((paragraph, index) => (
            <p id={index === 0 ? descriptionId : undefined} key={`${member.id}-${index}`}>{paragraph}</p>
          )) : <p id={descriptionId}>自我介紹準備中。</p>}
        </div>
        <TeamMemberSocialLinks name={member.name} links={socialLinks} placement="footer" />
      </div>
    </dialog>
  );
}
