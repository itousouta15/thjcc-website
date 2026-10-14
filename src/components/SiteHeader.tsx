import { navigation } from "@/data/site";
import { Brand } from "./Brand";
import { ConfiguredLink } from "./ConfiguredLink";
import { MobileNavigation } from "./MobileNavigation";

export function SiteHeader() {
  return (
    <header className="site-header" data-node-id="76:225">
      <div className="navbar" data-node-id="76:226">
        <Brand />
        <nav className="desktop-navigation" aria-label="主導覽">
          {navigation.map(link => <ConfiguredLink key={link.label} href={link.href}>{link.label}</ConfiguredLink>)}
        </nav>
        <MobileNavigation />
      </div>
    </header>
  );
}
