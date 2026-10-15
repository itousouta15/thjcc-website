import { team } from "@/data/site";
import { TeamMemberList } from "./TeamMemberList";
import { SectionAction } from "./SectionAction";

export function TeamSection() {
  return (
    <section className="content-section team-section" id="team" aria-labelledby="team-title" data-node-id="77:613">
      <div className="section-inner">
        <div className="team-section-heading">
          <h2 className="section-title" id="team-title">籌備團隊</h2>
          <div className="team-section-actions">
            <span className="team-hat-achievement-slot" id="team-hat-achievement" />
            <SectionAction section="team" placement="header" />
          </div>
        </div>
        <TeamMemberList members={team} achievementTargetId="team-hat-achievement" />
        <SectionAction section="team" placement="footer" />
      </div>
    </section>
  );
}
