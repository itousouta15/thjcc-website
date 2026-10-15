"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getTeamMemberRole, getTeamMemberships, getTeamPositionLabel, type TeamGroupId, type TeamMember } from "@/data/team";
import { TeamAvatar } from "./TeamAvatar";
import { TeamMemberModal } from "./TeamMemberModal";
import { InteractiveTeamHat } from "./InteractiveTeamHat";
import { TeamHatEasterEgg } from "./TeamHatEasterEgg";
import { areHatsAligned, getInitialHatAngle, normalizeHatAngle } from "@/lib/team-hats";

export function TeamMemberList({ members, directory = false, groupId, achievementTargetId }: {
  members: readonly TeamMember[];
  directory?: boolean;
  groupId?: TeamGroupId;
  achievementTargetId?: string;
}) {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const hatMembers = directory ? [] : members.filter(member => member.decoration);
  const initialAngles = (): Record<string, number> => Object.fromEntries(hatMembers.map(member => [member.id, normalizeHatAngle(getInitialHatAngle(member.decoration!))]));
  const [hats, setHats] = useState(() => ({ angles: initialAngles(), unlocked: false, open: false, round: 0 }));

  function changeHat(id: string, angle: number, commit: boolean) {
    setHats(current => {
      const angles = { ...current.angles, [id]: normalizeHatAngle(angle) };
      const found = commit && !current.unlocked && areHatsAligned(hatMembers.map(member =>
        angles[member.id] ?? normalizeHatAngle(getInitialHatAngle(member.decoration!))));
      return { ...current, angles, unlocked: current.unlocked || found, open: current.open || found };
    });
  }

  function resetHats() {
    setHats(current => ({ angles: initialAngles(), unlocked: false, open: false, round: current.round + 1 }));
    window.requestAnimationFrame(() => list.current?.querySelector<HTMLButtonElement>(".team-hat-handle")?.focus({ preventScroll: true }));
  }

  const achievement = hats.unlocked ? (
    <button className="team-hat-easter-egg-reopen" type="button" aria-label="彩蛋已解鎖，查看彩蛋" title="查看已解鎖的彩蛋"
      onClick={() => setHats(current => ({ ...current, open: true }))}>
      <span className="team-hat-achievement-label">彩蛋已解鎖</span><span aria-hidden="true">✦</span>
    </button>
  ) : null;
  const achievementTarget = hats.unlocked && achievementTargetId && typeof document !== "undefined"
    ? document.getElementById(achievementTargetId) : null;

  return (
    <>
      <ul ref={list} className={`team-grid${directory ? " team-directory-grid" : ""}`}>
        {members.map(member => {
          const membership = directory && groupId ? getTeamMemberships(member).find(role => role.group === groupId) ?? member : member;
          return (
            <li className={`team-member${directory ? " team-directory-member" : member.largeRole ? " team-member--large-role" : ""}`}
              key={member.id}>
              <button className="team-member-trigger" type="button" aria-haspopup="dialog"
                aria-label={`查看 ${member.name} 的成員介紹`} onClick={event => {
                  event.currentTarget.focus({ preventScroll: true });
                  setSelected(member);
                }} />
              <TeamAvatar member={member} accessory={!directory && member.decoration ? (
                <InteractiveTeamHat key={`${member.id}-${hats.round}`} member={member} angle={hats.angles[member.id] ?? normalizeHatAngle(getInitialHatAngle(member.decoration))}
                  unlocked={hats.unlocked} onChange={(angle, commit) => changeHat(member.id, angle, commit)} />
              ) : undefined} />
              {directory ? (
                <div className="team-directory-caption">
                  <span className={`team-position team-position--${membership.position}`}>{getTeamPositionLabel(membership)}</span>
                  <h3 className="team-directory-name">{member.name}</h3>
                </div>
              ) : (
                <div className="team-caption">
                  <h3 className="team-role">{getTeamMemberRole(member)}</h3>
                  <p className="team-name">{member.name}</p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {achievement && achievementTarget ? createPortal(achievement, achievementTarget) : achievement}
      <TeamMemberModal member={selected} onClose={() => setSelected(null)} />
      <TeamHatEasterEgg open={hats.open} onClose={() => setHats(current => ({ ...current, open: false }))}
        onReset={resetHats} />
    </>
  );
}
