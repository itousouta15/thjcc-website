"use client";

import Image from "next/image";
import { useState } from "react";
import { coorganizers, organizers, partners, type Organization } from "@/data/site";
import { OrganizationModal } from "./OrganizationModal";

function OrganizationLogo({ id }: { id: Organization["id"] }) {
  if (id === "ncse") {
    return (
      <div className="organization-logo organization-logo--ncse" aria-hidden="true">
        <Image className="ncse-wordmark" src="/images/ncse-wordmark.svg" alt="" width={174} height={56} />
        <Image className="ncse-network" src="/images/ncse-network.svg" alt="" width={142} height={26} />
        <Image className="ncse-symbol" src="/images/ncse-symbol.svg" alt="" width={27} height={28} />
      </div>
    );
  }

  const sizes = {
    scint: [262, 46], scaict: [247, 78], scist: [226, 57], hitcon: [138, 105], ocf: [277, 118],
  } as const;
  const [width, height] = sizes[id];
  return (
    <div className={`organization-logo organization-logo--${id}`}>
      <Image src={`/images/logo-${id}.${id === "scist" ? "svg" : "png"}`} alt="" width={width} height={height}
        sizes="(max-width: 479px) 240px, 277px" />
    </div>
  );
}

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
        <h2 className="section-title section-title--two-lines" id="partners-title">
          <span>來自國內多個</span>
          <span>資安組織與單位的支持</span>
        </h2>
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
      </div>
      <OrganizationModal organization={selected} logo={selected ? <OrganizationLogo id={selected.id} /> : null}
        onClose={() => setSelected(null)} />
    </section>
  );
}
