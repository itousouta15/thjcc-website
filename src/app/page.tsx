import { AboutSection } from "@/components/AboutSection";
import { HeroSection } from "@/components/HeroSection";
import { PartnersSection } from "@/components/PartnersSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TeamSection } from "@/components/TeamSection";

export default function HomePage() {
  return (
    <div className="site-shell" id="top" data-node-id="76:224">
      <a className="skip-link" href="#main">跳至主要內容</a>
      <SiteHeader />
      <main id="main">
        <HeroSection />
        <AboutSection />
        <TeamSection />
        <PartnersSection />
      </main>
      <SiteFooter />
    </div>
  );
}
