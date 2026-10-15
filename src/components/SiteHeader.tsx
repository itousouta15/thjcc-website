import { navigation, type SiteLink } from "@/data/site";
import { Brand } from "./Brand";
import { ConfiguredLink } from "./ConfiguredLink";
import { MobileNavigation } from "./MobileNavigation";

export function SiteHeader({ links = navigation, homeHref = "#top", currentPath }: {
  links?: SiteLink[];
  homeHref?: string;
  currentPath?: string;
}) {
  return (
    <header className="site-header" data-node-id="76:225">
      <div className="navbar" data-node-id="76:226">
        <Brand href={homeHref} />
        <nav className="desktop-navigation" aria-label="主導覽">
          {links.map(link => (
            <ConfiguredLink key={link.label} href={link.href} current={currentPath === link.href}
              className={link.variant === "button" ? "nav-sponsor-button" : undefined}>
              <span className="nav-link-label">{link.label}</span>
            </ConfiguredLink>
          ))}
        </nav>
        <MobileNavigation links={links} currentPath={currentPath} />
      </div>
    </header>
  );
}
