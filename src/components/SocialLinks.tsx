import { site } from "@/data/site";
import { ConfiguredLink } from "./ConfiguredLink";

export function SocialLinks({ footer = false }: { footer?: boolean }) {
  const links = [
    { name: "Discord", href: site.links.discord, icon: "discord-dark.svg" },
    { name: "Instagram", href: site.links.instagram, icon: "instagram-dark.svg" },
  ];

  return (
    <div className={`social-links${footer ? " social-links--footer" : ""}`} aria-label="社群連結">
      {links.map(link => (
        <ConfiguredLink key={link.name} href={link.href} className="social-link" label={`THJCC ${link.name}（另開視窗）`}>
          <span className="social-link-icon" aria-hidden="true" style={{
            maskImage: `url(/images/${link.icon})`,
            WebkitMaskImage: `url(/images/${link.icon})`,
          }} />
        </ConfiguredLink>
      ))}
    </div>
  );
}
