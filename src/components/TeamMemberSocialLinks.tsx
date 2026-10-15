import type { TeamSocialLink } from "@/data/team";
import { ConfiguredLink } from "./ConfiguredLink";
import { SocialIcon } from "./SocialIcon";

export function TeamMemberSocialLinks({ name, links, placement }: {
  name: string;
  links: readonly TeamSocialLink[];
  placement: "header" | "footer";
}) {
  if (!links.length) return null;

  return (
    <nav className={`team-member-socials team-member-socials--${placement}`} aria-label={`${name} 的社群連結`}>
      <ul>
        {links.map(link => {
          const external = /^https?:\/\//i.test(link.href);
          return (
            <li key={`${link.label}-${link.href}`}>
              <ConfiguredLink href={link.href} className="team-member-social-link" title={link.label}
                label={`${name} ${link.label}${external ? "（另開視窗）" : ""}`}>
                <SocialIcon href={link.href} label={link.label} />
              </ConfiguredLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
