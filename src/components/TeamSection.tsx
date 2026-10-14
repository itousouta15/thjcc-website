import Image from "next/image";
import { team } from "@/data/site";

export function TeamSection() {
  return (
    <section className="content-section team-section" id="team" aria-labelledby="team-title" data-node-id="77:613">
      <div className="section-inner">
        <h2 className="section-title" id="team-title">籌備團隊</h2>
        <ul className="team-grid">
          {team.map(member => (
            <li className={`team-member${member.largeRole ? " team-member--large-role" : ""}`} key={member.name}>
              <div className="team-avatar">
                <Image src={`/images/${member.image}`} width={200} height={200}
                  alt={member.image === "team-placeholder.svg" ? "" : `${member.name} 的頭像`}
                  sizes="(max-width: 767px) 140px, 200px" />
                {member.decoration && (
                  <Image className={`team-decoration team-decoration--${member.decoration}`}
                    src={`/images/team-decoration-${member.decoration}.svg`} alt="" width={145} height={68} />
                )}
              </div>
              <div className="team-caption">
                <h3 className="team-role">{member.role}</h3>
                <p className="team-name">{member.name}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
