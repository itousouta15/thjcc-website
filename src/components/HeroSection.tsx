import Image from "next/image";
import { site } from "@/data/site";
import { SocialLinks } from "./SocialLinks";
import { HeroArtwork } from "./HeroArtwork";

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title" data-node-id="76:227">
      <div className="hero-inner">
        <div className="hero-content">
          <div className="hero-title-group">
            <p className="hero-eyebrow" lang="en">{site.englishName}</p>
            <h1 className="hero-title" id="hero-title" aria-label="THJCC 第四屆">
              <span className="hero-wordmark" aria-hidden="true">THJCC</span>
              <span className="hero-edition" aria-hidden="true">4</span>
            </h1>
            <p className="hero-subtitle">第四屆臺灣高中職聯合資安競賽</p>
          </div>
          <Image className="hero-divider" src="/images/hero-divider.svg" alt="" width={350} height={2} />
          <div className="hero-actions">
            <a className="primary-button" href="#about">關於我們</a>
            <SocialLinks />
          </div>
        </div>
      </div>
      <HeroArtwork />
    </section>
  );
}
