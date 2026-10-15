import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import "@/styles/subpage.css";

export function SubpageLayout({ title, description, currentPath, children }: {
  title: string;
  description: string;
  currentPath: string;
  children: ReactNode;
}) {
  return (
    <div className="site-shell subpage" id="top">
      <a className="skip-link" href="#main">跳至主要內容</a>
      <SiteHeader currentPath={currentPath} homeHref="/" />
      <main className="subpage-main" id="main">
        <header className="subpage-heading">
          <Link className="subpage-back" href="/">← 返回首頁</Link>
          <h1>{title}</h1>
          <p className="subpage-description">{description}</p>
        </header>
        {children}
      </main>
      <SiteFooter homeHref="/" />
    </div>
  );
}
