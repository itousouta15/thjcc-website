import Link from "next/link";
import { aboutCopy } from "@/data/site";

export function AboutSection() {
  return (
    <section className="content-section about-section" id="about" aria-labelledby="about-title" data-node-id="76:233">
      <div className="section-inner">
        <div className="about-heading">
          <div className="about-heading-content">
            <div className="section-heading-row section-heading-row--two-lines">
              <h2 className="section-title section-title--two-lines" id="about-title">
                <span>全台灣最大</span>
                <span>學生自主籌辦資安競賽</span>
              </h2>
              <Link className="section-detail-link" href="/about">
                認識 THJCC <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="about-art-target" aria-hidden="true" />
        </div>
        <p className="about-copy" data-node-id="77:543">{aboutCopy}</p>
      </div>
    </section>
  );
}
