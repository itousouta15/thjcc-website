import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/SmoothScroll";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import "./globals.css";
import "@/styles/tokens.css";
import "@/styles/background.css";
import "@/styles/home.css";
import "@/styles/modal.css";

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
  metadataBase: new URL("https://thjcc.org"),
  title: "THJCC 4｜第四屆臺灣高中職聯合資安競賽",
  description: "THJCC CTF 臺灣高中職聯合資安競賽，由學生自主籌辦，推廣資訊安全教育，讓全臺學生互相學習、切磋與交流。",
  applicationName: "THJCC",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "THJCC",
    images: [{
      url: "/images/OG.png",
      width: 1200,
      height: 630,
      alt: "THJCC 4｜第四屆臺灣高中職聯合資安競賽",
    }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{
      url: "/images/OG.png",
      alt: "THJCC 4｜第四屆臺灣高中職聯合資安競賽",
    }],
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "16x16 24x24 32x32 48x48 64x64 96x96 128x128 256x256" },
      { url: "/icons/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icons/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/icons/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export const viewport: Viewport = { themeColor: "#1A1B1B", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" className={`${lineSeed.variable} ${lineSeedOtf.variable} ${asul.variable} ${bitcount.variable}`}>
      <body>
        <AnimatedBackground />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
