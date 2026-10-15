import Image from "next/image";

export function Brand({ dark = false, footer = false, href = "#top" }: { dark?: boolean; footer?: boolean; href?: string }) {
  return (
    <a className={`brand${footer ? " brand--footer" : ""}`} href={href} aria-label="THJCC 首頁">
      <Image src={`/images/logo-thjcc-${dark ? "dark" : "light"}.svg`} alt=""
        width={footer ? 60 : 50} height={footer ? 49 : 40} priority={!footer} />
      <span>THJCC</span>
    </a>
  );
}
