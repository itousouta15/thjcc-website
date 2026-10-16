"use client";

import { useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getTeamMemberRole, getTeamMemberships, getTeamPositionLabel, type TeamGroupId, type TeamMember } from "@/data/team";
import { TeamAvatar } from "./TeamAvatar";
import { TeamMemberModal } from "./TeamMemberModal";
import { InteractiveTeamHat } from "./InteractiveTeamHat";
import { TeamHatEasterEgg } from "./TeamHatEasterEgg";
import { areHatsAligned, getHatStackPoses, getInitialHatAngle, normalizeHatAngle, type HatPose } from "@/lib/team-hats";
import { useTeamHatTargets } from "@/lib/use-team-hat-targets";

export function TeamMemberList({ members, directory = false, groupId, achievementTargetId }: {
  members: readonly TeamMember[];
  directory?: boolean;
  groupId?: TeamGroupId;
  achievementTargetId?: string;
}) {
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const helpId = useId();
  const targets = useTeamHatTargets(list, !directory);
  const [hovered, setHovered] = useState<Record<string, string | null>>({});
  const hatMembers = directory ? [] : members.filter(member => member.decoration);
  const initialAngles = (): Record<string, number> => Object.fromEntries(hatMembers.map(member => [member.id, normalizeHatAngle(getInitialHatAngle(member.decoration!))]));
  const initialWearers = (): Record<string, string | null> => Object.fromEntries(hatMembers.map(member => [member.id, member.id]));
  const initialStacks = (): Record<string, string[]> => Object.fromEntries(hatMembers.map(member => [member.id, [member.id]]));
  const [hats, setHats] = useState(() => ({ angles: initialAngles(), wearers: initialWearers(), stacks: initialStacks(), unlocked: false, open: false, round: 0 }));
  const wornPoses: Record<string, HatPose> = {};
  const dropTargets = targets.map(target => {
    const stack = hats.stacks[target.id] ?? [];
    const base = hatMembers.find(member => member.id === stack[0]);
    if (!base) return target;
    const poses = getHatStackPoses(target, base.decoration!, stack.map(id => hats.angles[id]), document.documentElement.clientWidth);
    stack.forEach((id, index) => { wornPoses[id] = poses[index]; });
    return { ...target, hat: poses[poses.length - 1] };
  });

  function changeHat(id: string, angle: number, commit: boolean, targetId: string | null) {
    setHats(current => {
      const angles = { ...current.angles, [id]: normalizeHatAngle(angle) };
      const wearers = { ...current.wearers, [id]: targetId };
      const stacks = { ...current.stacks };
      const previous = current.wearers[id];
      if (previous !== targetId) {
        if (previous) stacks[previous] = stacks[previous].filter(hatId => hatId !== id);
        if (targetId) {
          const destination = stacks[targetId] ?? [];
          if (destination.length) angles[id] = current.angles[destination[0]];
          stacks[targetId] = [...destination, id];
        }
      } else if (targetId) {
        for (const hatId of stacks[targetId]) angles[hatId] = normalizeHatAngle(angle);
      }
      const found = commit && !current.unlocked && hatMembers.every(member => wearers[member.id] !== null)
        && new Set(hatMembers.map(member => wearers[member.id])).size === hatMembers.length
        && areHatsAligned(hatMembers.map(member =>
        angles[member.id] ?? normalizeHatAngle(getInitialHatAngle(member.decoration!))));
      return { ...current, angles, wearers, stacks, unlocked: current.unlocked || found, open: current.open || found };
    });
  }

  function resetHats(focusHat = false) {
    setHovered({});
    setHats(current => ({ angles: initialAngles(), wearers: initialWearers(), stacks: initialStacks(), unlocked: false, open: false, round: current.round + 1 }));
    if (focusHat) window.requestAnimationFrame(() => {
      Array.from(document.querySelectorAll<HTMLButtonElement>("[data-hat-id]"))
        .find(button => button.dataset.hatId === hatMembers[0]?.id)?.focus({ preventScroll: true });
    });
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
      {hatMembers.length > 0 && (
        <div className="team-hat-toolbar">
          <p id={helpId}>
            沿著頭像拖曳旋轉，往外拉可拔下換人戴或甩出去。<span className="team-hat-rotation-hint">Shift＋拖曳可直接拿走。</span>
            <span className="visually-hidden">疊上去的帽子會對齊第一頂的角度，拖曳或點兩下可整疊一起轉。鍵盤：方向鍵旋轉，Shift 加方向鍵移動，Enter 換下一個人戴，Delete 拔下，Backspace 戴回原主人，Escape 取消拖曳。</span>
          </p>
          <button className="team-hat-tidy" type="button" onClick={() => resetHats()}>帽子歸位 <span aria-hidden="true">↺</span></button>
        </div>
      )}
      <ul ref={list} className={`team-grid${directory ? " team-directory-grid" : ""}`}>
        {members.map(member => {
          const membership = directory && groupId ? getTeamMemberships(member).find(role => role.group === groupId) ?? member : member;
          return (
            <li className={`team-member${directory ? " team-directory-member" : member.largeRole ? " team-member--large-role" : ""}`}
              key={member.id} data-team-member-id={member.id}
              data-hat-drop-target={Object.values(hovered).includes(member.id) || undefined}>
              <button className="team-member-trigger" type="button" aria-haspopup="dialog"
                aria-label={`查看 ${member.name} 的成員介紹`} onClick={event => {
                  event.currentTarget.focus({ preventScroll: true });
                  setSelected(member);
                }} />
              <TeamAvatar member={member} />
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
      {hatMembers.map(member => (
        <InteractiveTeamHat key={`${member.id}-${hats.round}`} member={member} members={members} targets={dropTargets}
          targetId={hats.wearers[member.id]} wornPose={wornPoses[member.id]}
          stack={hats.wearers[member.id] ? hats.stacks[hats.wearers[member.id]!].indexOf(member.id) : 0}
          angle={hats.angles[member.id]} unlocked={hats.unlocked} helpId={helpId}
          onChange={(angle, commit, targetId) => changeHat(member.id, angle, commit, targetId)}
          onHover={targetId => setHovered(current => current[member.id] === targetId ? current : { ...current, [member.id]: targetId })} />
      ))}
      {achievement && achievementTarget ? createPortal(achievement, achievementTarget) : achievement}
      <TeamMemberModal member={selected} onClose={() => setSelected(null)} />
      <TeamHatEasterEgg open={hats.open} onClose={() => setHats(current => ({ ...current, open: false }))}
        onReset={() => resetHats(true)} />
    </>
  );
}
