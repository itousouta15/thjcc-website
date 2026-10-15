import type { Metadata } from "next";
import { ContactPanel } from "@/components/ContactPanel";
import { OrganizationLogo } from "@/components/OrganizationLogo";
import { SubpageLayout } from "@/components/SubpageLayout";
import { coorganizers, organizers, partners } from "@/data/site";
import { organizationDetails } from "@/data/organizationDetails";

export const metadata: Metadata = {
  title: "合作夥伴｜THJCC 臺灣高中職聯合資安競賽",
  description: "認識參與 THJCC 的主辦、協辦與合作單位，了解各單位的介紹、主要領域與聯絡入口。",
};

const groups = [
  { id: "organizers", name: "主辦單位", items: organizers },
  { id: "coorganizers", name: "協辦單位", items: coorganizers },
  { id: "supporters", name: "合作單位", items: partners },
];

export default function PartnersPage() {
  return (
    <SubpageLayout title="合作夥伴" description="來自學生社群、資安組織與合作單位的支持，一起讓 THJCC 成為可能。" currentPath="/partners">
      <div className="subpage-content">
        {groups.map(group => (
          <section className="subpage-section" key={group.id} aria-labelledby={`partners-${group.id}-title`}>
            <h2 className="organization-heading" id={`partners-${group.id}-title`}><span>{group.name}</span></h2>
            <ul className="partner-directory">
              {group.items.map(organization => {
                const details = organizationDetails[organization.id];
                return (
                  <li className="partner-profile" id={organization.id} key={organization.id}>
                    <div className="partner-profile-logo" aria-hidden="true"><OrganizationLogo id={organization.id} /></div>
                    <article className="partner-profile-content" aria-labelledby={`partner-${organization.id}-title`}>
                      <p className="partner-profile-category">{details.category} · {details.shortName}</p>
                      <h3 id={`partner-${organization.id}-title`}>{organization.name}</h3>
                      {details.paragraphs.map(paragraph => <p className="subpage-copy" key={paragraph}>{paragraph}</p>)}
                      <ul className="partner-profile-highlights" aria-label="主要領域">
                        {details.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}
                      </ul>
                      <a className="partner-profile-website" href={details.website} target="_blank" rel="noopener noreferrer">
                        前往官方網站 <span aria-hidden="true">↗</span><span className="visually-hidden">（另開視窗）</span>
                      </a>
                    </article>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <ContactPanel title="與 THJCC 合作">合作與贊助相關事宜，歡迎來信與籌備團隊討論。</ContactPanel>
      </div>
    </SubpageLayout>
  );
}
