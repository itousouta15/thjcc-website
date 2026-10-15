import { navigation, pastWebsites, site } from "@/data/site";
import { Brand } from "./Brand";
import { ConfiguredLink } from "./ConfiguredLink";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter({ homeHref = "#top" }: { homeHref?: string }) {
  return (
    <footer className="site-footer" data-node-id="77:467">
      <div className="footer-inner">
        <div className="footer-columns">
          <nav className="footer-column" aria-label="頁尾連結">
            <h2>連結</h2>
            <ConfiguredLink href={homeHref}>首頁</ConfiguredLink>
            {navigation.filter(link => link.href !== site.links.sponsorship).map(link => <ConfiguredLink key={link.label} href={link.href}>{link.label}</ConfiguredLink>)}
          </nav>
          <nav className="footer-column" aria-label="歷年網站">
            <h2>歷年網站</h2>
            {pastWebsites.map(website => (
              <ConfiguredLink key={website.href} href={website.href} className="footer-archive-link"
                label={`${website.label} 歷年網站（另開視窗）`}>
                {website.label} <span aria-hidden="true">↗</span>
              </ConfiguredLink>
            ))}
          </nav>
          <div className="footer-column">
            <h2>支持我們</h2>
            <ConfiguredLink href={site.links.sponsorship}>我要贊助</ConfiguredLink>
          </div>
          <div className="footer-column">
            <h2>聯絡我們</h2>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-identity">
            <Brand dark footer href={homeHref} />
            <div className="footer-description">
              <p>{site.chineseName}</p>
              <p lang="en">{site.englishName}</p>
            </div>
          </div>
          <SocialLinks footer />
        </div>
      </div>
    </footer>
  );
}
