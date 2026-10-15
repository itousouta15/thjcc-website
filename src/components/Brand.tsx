import Image from "next/image";
import { ConfiguredLink } from "./ConfiguredLink";
import lightLogo from "../../public/images/logo-thjcc-light.svg?inline";
import darkLogo from "../../public/images/logo-thjcc-dark.svg?inline";

export function Brand({ dark = false, footer = false, href = "#top" }: { dark?: boolean; footer?: boolean; href?: string }) {
  return (
    <ConfiguredLink className={`brand${footer ? " brand--footer" : ""}`} href={href} label="THJCC 首頁">
      <Image src={dark ? darkLogo : lightLogo} alt=""
        width={footer ? 60 : 50} height={footer ? 49 : 40} unoptimized />
      <span>THJCC</span>
    </ConfiguredLink>
  );
}
