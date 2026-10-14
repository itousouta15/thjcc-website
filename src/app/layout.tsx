import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/SmoothScroll";
import "lenis/dist/lenis.css";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/home.css";

const lineSeed = localFont({
  src: [
    { path: "../../public/fonts/LINESeedTW_TTF_Rg.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/LINESeedTW_TTF_Bd.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-line-seed",
  display: "swap",
  adjustFontFallback: false,
});

const lineSeedOtf = localFont({
  src: "../../public/fonts/LINESeedTW_OTF_Bd.woff2",
  weight: "700",
  variable: "--font-line-seed-otf",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

const asul = localFont({
  src: "../../public/fonts/Asul-Regular.ttf",
  weight: "400",
  variable: "--font-asul",
  display: "swap",
  adjustFontFallback: false,
});

const bitcount = localFont({
  src: "../../public/fonts/BitcountGridSingle.ttf",
  weight: "100 900",
  variable: "--font-bitcount",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "THJCC 4｜第四屆臺灣高中職聯合資安競賽",
  description: "THJCC CTF 臺灣高中職聯合資安競賽，由學生自主籌辦，推廣資訊安全教育，讓全臺學生互相學習、切磋與交流。",
  icons: { icon: "/images/logo-thjcc-light.svg" },
};

export const viewport: Viewport = { themeColor: "#1A1B1B", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" className={`${lineSeed.variable} ${lineSeedOtf.variable} ${asul.variable} ${bitcount.variable}`}>
      <body>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
