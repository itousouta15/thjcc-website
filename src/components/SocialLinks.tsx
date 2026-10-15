import { site } from "@/data/site";
import { ConfiguredLink } from "./ConfiguredLink";
import { SocialIcon } from "./SocialIcon";

export function SocialLinks({ footer = false }: { footer?: boolean }) {
  const links = [
    { name: "Discord", href: site.links.discord },
    { name: "Instagram", href: site.links.instagram },
    ...(footer ? [
      { name: "Threads", href: site.links.threads },
      { name: "GitHub", href: site.links.GitHub },
    ] : []),
  ];

  return (
    <div className={`social-links${footer ? " social-links--footer" : ""}`} aria-label="社群連結">
      {links.map(link => (
        <ConfiguredLink key={link.name} href={link.href} className="social-link" title={link.name} label={`THJCC ${link.name}（另開視窗）`}>
          <SocialIcon href={link.href} label={link.name} />
        </ConfiguredLink>
      ))}
    </div>
  );
}
