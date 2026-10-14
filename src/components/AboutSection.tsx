import { aboutCopy } from "@/data/site";

export function AboutSection() {
  return (
    <section className="content-section about-section" id="about" aria-labelledby="about-title" data-node-id="76:233">
      <div className="section-inner">
        <h2 className="section-title section-title--two-lines" id="about-title">
          <span>全台灣最大</span>
          <span>學生自主籌辦資安競賽</span>
        </h2>
        <p className="about-copy" data-node-id="77:543">{aboutCopy}</p>
      </div>
    </section>
  );
}
