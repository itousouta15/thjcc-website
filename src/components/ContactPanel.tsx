import type { ReactNode } from "react";
import { site } from "@/data/site";
import { SocialLinks } from "./SocialLinks";

export function ContactPanel({ title = "聯絡我們", emailSubject, children }: { title?: string; emailSubject?: string; children: ReactNode }) {
  const emailHref = `mailto:${site.email}${emailSubject ? `?subject=${encodeURIComponent(emailSubject)}` : ""}`;

  return (
    <section className="subpage-contact" aria-label={title}>
      <h2>{title}</h2>
      <p>{children}</p>
      <div className="subpage-contact-links">
        <a className="subpage-email" href={emailHref}>{site.email}</a>
        <SocialLinks />
      </div>
    </section>
  );
}
