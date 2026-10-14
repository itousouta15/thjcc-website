import Image from "next/image";

export function Brand({ dark = false, footer = false }: { dark?: boolean; footer?: boolean }) {
  return (
    <a className={`brand${footer ? " brand--footer" : ""}`} href="#top" aria-label="THJCC 首頁">
      <Image src={`/images/logo-thjcc-${dark ? "dark" : "light"}.svg`} alt=""
        width={footer ? 60 : 50} height={footer ? 49 : 40} priority={!footer} />
      <span>THJCC</span>
    </a>
  );
}
