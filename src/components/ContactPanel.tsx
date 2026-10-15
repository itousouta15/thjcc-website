import type { ReactNode } from "react";
import { site } from "@/data/site";
import { SocialLinks } from "./SocialLinks";

export function ContactPanel({ title = "聯絡我們", children }: { title?: string; children: ReactNode }) {
  return (
    <section className="subpage-contact" aria-label={title}>
      <h2>{title}</h2>
      <p>{children}</p>
      <div className="subpage-contact-links">
        <a className="subpage-email" href={`mailto:${site.email}`}>{site.email}</a>
        <SocialLinks />
      </div>
    </section>
  );
}
