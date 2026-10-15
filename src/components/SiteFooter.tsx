import Link from "next/link";
import { site } from "@/data/site";
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
            <a href={homeHref}>首頁</a>
            <Link href="/team">籌備團隊</Link>
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
