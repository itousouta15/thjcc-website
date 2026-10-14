import Image from "next/image";
import { site } from "@/data/site";
import { ConfiguredLink } from "./ConfiguredLink";

export function SocialLinks({ footer = false }: { footer?: boolean }) {
  return (
    <div className={`social-links${footer ? " social-links--footer" : ""}`} aria-label="社群連結">
      <ConfiguredLink href={site.links.discord} className={`social-link${footer ? "" : " social-link--discord"}`} label="THJCC Discord（另開視窗）">
        <Image src={`/images/${footer ? "discord-dark.svg" : "discord-button.svg"}`} alt=""
          width={footer ? 24 : 69} height={footer ? 24 : 69} />
      </ConfiguredLink>
      <ConfiguredLink href={site.links.instagram} className="social-link social-link--instagram" label="THJCC Instagram（另開視窗）">
        <Image src={`/images/instagram-${footer ? "dark" : "light"}.svg`} alt=""
          width={footer ? 24 : 36} height={footer ? 24 : 36} />
      </ConfiguredLink>
    </div>
  );
}
