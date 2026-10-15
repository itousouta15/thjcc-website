import type { Metadata } from "next";
import Link from "next/link";
import { ContactPanel } from "@/components/ContactPanel";
import { SubpageLayout } from "@/components/SubpageLayout";
import { aboutParagraphs, organizers } from "@/data/site";
import { organizationDetails } from "@/data/organizationDetails";

export const metadata: Metadata = {
  title: "關於 THJCC｜臺灣高中職聯合資安競賽",
  description: "認識 THJCC 臺灣高中職聯合資安競賽、學生自主籌辦理念，以及串連北中南的學生資訊社群。",
};

export default function AboutPage() {
  return (
    <SubpageLayout title="關於 THJCC" description="臺灣高中職聯合資安競賽，由學生自主籌辦，讓資安成為彼此交流與成長的起點。" currentPath="/about">
      <div className="subpage-content">
        <section className="subpage-section" aria-labelledby="about-students-title">
          <h2 className="organization-heading" id="about-students-title"><span>學生自主籌辦</span></h2>
          <p className="subpage-copy">{aboutParagraphs[0]}</p>
          <Link className="section-detail-link" href="/team">認識籌備團隊 <span aria-hidden="true">→</span></Link>
        </section>

        <section className="subpage-section" aria-labelledby="about-learning-title">
          <h2 className="organization-heading" id="about-learning-title"><span>推廣資安教育</span></h2>
          <p className="subpage-copy">{aboutParagraphs[1]}</p>
        </section>

        <section className="subpage-section" aria-labelledby="about-communities-title">
          <h2 className="organization-heading" id="about-communities-title"><span>社群夥伴</span></h2>
          <ul className="subpage-communities">
            {organizers.map(organization => (
              <li key={organization.id}>
                <Link href={`/partners#${organization.id}`}>
                  <span className="subpage-community-shortname">{organizationDetails[organization.id].shortName}</span>
                  <span>{organization.name}</span>
                  <span className="subpage-community-arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <ContactPanel>有想了解的事情，歡迎透過 Email 或社群與我們聯絡。</ContactPanel>
      </div>
    </SubpageLayout>
  );
}
