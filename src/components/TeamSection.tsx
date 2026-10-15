import Link from "next/link";
import { team } from "@/data/site";
import { TeamMemberList } from "./TeamMemberList";

export function TeamSection() {
  return (
    <section className="content-section team-section" id="team" aria-labelledby="team-title" data-node-id="77:613">
      <div className="section-inner">
        <div className="team-section-heading">
          <h2 className="section-title" id="team-title">籌備團隊</h2>
          <div className="team-section-actions">
            <span className="team-hat-achievement-slot" id="team-hat-achievement" />
            <Link className="team-directory-link" href="/team">
              查看完整團隊 <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <TeamMemberList members={team} achievementTargetId="team-hat-achievement" />
      </div>
    </section>
  );
}
