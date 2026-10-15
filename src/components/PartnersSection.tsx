"use client";

import { useState } from "react";
import { coorganizers, organizers, partners, type Organization } from "@/data/site";
import { OrganizationModal } from "./OrganizationModal";
import { OrganizationLogo } from "./OrganizationLogo";
import { SectionAction } from "./SectionAction";

function OrganizationCards({ items, variant = "three", onSelect }: {
  items: Organization[];
  variant?: "one" | "two" | "three";
  onSelect: (organization: Organization) => void;
}) {
  return (
    <ul className={`organization-grid organization-grid--${variant}`}>
      {items.map(item => (
        <li className={`organization-card organization-card--${item.corner} organization-card--${item.id}`} key={item.id}>
          <button className="organization-card-trigger" type="button" aria-haspopup="dialog"
            aria-label={`詳細介紹：${item.name}`} onClick={() => onSelect(item)}>
            <OrganizationLogo id={item.id} />
            <span className="organization-name">{item.name}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export function PartnersSection() {
  const [selected, setSelected] = useState<Organization | null>(null);
  return (
    <section className="content-section partners-section" id="partners" aria-labelledby="partners-title" data-node-id="77:549">
      <div className="section-inner">
        <div className="section-heading-row section-heading-row--two-lines">
          <h2 className="section-title section-title--two-lines" id="partners-title">
            <span>來自國內多個</span>
            <span>資安組織與單位的支持</span>
          </h2>
          <SectionAction section="partners" placement="header" />
        </div>
        <section className="organization-group" aria-labelledby="organizers-title">
          <h3 className="organization-heading" id="organizers-title"><span>主辦單位</span></h3>
          <OrganizationCards items={organizers} onSelect={setSelected} />
        </section>
        <div className="support-groups">
          <section className="organization-group" aria-labelledby="coorganizers-title">
            <h3 className="organization-heading" id="coorganizers-title"><span>協辦單位</span></h3>
            <OrganizationCards items={coorganizers} variant="two" onSelect={setSelected} />
          </section>
          <section className="organization-group organization-group--partners" aria-labelledby="supporters-title">
            <h3 className="organization-heading" id="supporters-title"><span>合作單位</span></h3>
            <OrganizationCards items={partners} variant="one" onSelect={setSelected} />
          </section>
        </div>
        <SectionAction section="partners" placement="footer" />
      </div>
      <OrganizationModal organization={selected} logo={selected ? <OrganizationLogo id={selected.id} /> : null}
        onClose={() => setSelected(null)} />
    </section>
  );
}
