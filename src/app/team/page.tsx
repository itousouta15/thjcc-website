import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { TeamMemberList } from "@/components/TeamMemberList";
import { navigation } from "@/data/site";
import { teamGroups, teamMembers, type TeamPosition } from "@/data/team";
import "@/styles/team.css";

export const metadata: Metadata = {
  title: "籌備團隊｜THJCC 4",
  description: "第四屆臺灣高中職聯合資安競賽的籌備成員與分組，包含總召、出題、網管、文書及設計團隊。",
};

const teamNavigation = navigation.map(link => ({
  ...link,
  href: link.href === "#team" ? "#members" : link.href?.startsWith("#") ? `/${link.href}` : link.href,
}));

const positionOrder: Record<TeamPosition, number> = { lead: 0, deputy: 1, member: 2 };

export default function TeamPage() {
  return (
    <div className="site-shell team-page" id="top">
      <a className="skip-link" href="#main">跳至主要內容</a>
      <SiteHeader links={teamNavigation} homeHref="/" />
      <main className="team-page-main" id="main">
        <header className="team-page-heading">
          <Link className="team-page-back" href="/#team">← 返回首頁</Link>
          <h1>籌備團隊</h1>
          <p className="team-page-description">由北中南學生資訊社群與全國志同道合的學生們組成</p>
        </header>

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
      </main>
      <SiteFooter homeHref="/" />
    </div>
  );
}
