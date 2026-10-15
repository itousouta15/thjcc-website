import type { Metadata } from "next";
import { SubpageLayout } from "@/components/SubpageLayout";
import { TeamMemberList } from "@/components/TeamMemberList";
import { teamGroups, teamMembers, type TeamPosition } from "@/data/team";
import "@/styles/team.css";

export const metadata: Metadata = {
  title: "籌備團隊｜THJCC",
  description: "第四屆臺灣高中職聯合資安競賽的籌備成員與分組，包含總召、出題、網管、文書及設計團隊。",
};

const positionOrder: Record<TeamPosition, number> = { lead: 0, deputy: 1, member: 2 };

export default function TeamPage() {
  return (
    <SubpageLayout title="籌備團隊" description="由北中南學生資訊社群與全國志同道合的學生們組成" currentPath="/team">
        <section className="team-directory" id="members" aria-label="團隊成員">
          <nav className="team-group-navigation" aria-label="團隊分組">
            {teamGroups.map(group => <a key={group.id} href={`#team-group-${group.id}`}>{group.name}</a>)}
          </nav>

          {teamGroups.map(group => {
            const members = teamMembers.filter(member => member.group === group.id)
              .sort((a, b) => positionOrder[a.position] - positionOrder[b.position]);
            return (
              <section className="team-directory-group" id={`team-group-${group.id}`}
                aria-labelledby={`team-group-title-${group.id}`} key={group.id}>
                <h2 className="organization-heading team-directory-heading" id={`team-group-title-${group.id}`}>
                  <span>{group.name}</span>
                </h2>
                {members.length ? (
                  <TeamMemberList members={members} directory />
                ) : <p className="team-directory-empty">成員資料更新中。</p>}
              </section>
            );
          })}
        </section>
    </SubpageLayout>
  );
}
