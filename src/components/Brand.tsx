import Image from "next/image";
import lightLogo from "../../public/images/logo-thjcc-light.svg?inline";
import darkLogo from "../../public/images/logo-thjcc-dark.svg?inline";

export function Brand({ dark = false, footer = false, href = "#top" }: { dark?: boolean; footer?: boolean; href?: string }) {
  return (
    <a className={`brand${footer ? " brand--footer" : ""}`} href={href} aria-label="THJCC 首頁">
      <Image src={dark ? darkLogo : lightLogo} alt=""
        width={footer ? 60 : 50} height={footer ? 49 : 40} unoptimized />
      <span>THJCC</span>
    </a>
  );
}
