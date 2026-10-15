"use client";

import type { ReactNode } from "react";
import type { Organization } from "@/data/site";
import { organizationDetails } from "@/data/organizationDetails";
import { ModalCloseButton } from "./ModalCloseButton";
import { useAnimatedDialog } from "@/lib/use-animated-dialog";

type Props = {
  organization: Organization | null;
  logo: ReactNode;
  onClose: () => void;
};

export function OrganizationModal({ organization, logo, onClose }: Props) {
  const { modal, requestClose } = useAnimatedDialog(Boolean(organization), onClose);

  if (!organization) return null;
  const details = organizationDetails[organization.id];

  return (
    <dialog ref={modal} className="organization-modal" id="organization-modal"
      aria-labelledby="organization-modal-title" aria-describedby="organization-modal-description"
      data-lenis-prevent>
      <div className="organization-modal-panel">
        <ModalCloseButton label="關閉單位介紹" onClick={() => requestClose()} />
        <div className="organization-modal-logo" aria-hidden="true">{logo}</div>
        <p className="organization-modal-category">{details.category} · {details.shortName}</p>
        <h2 id="organization-modal-title">{organization.name}</h2>
        <div className="organization-modal-copy">
          {details.paragraphs.map((paragraph, index) => (
            <p key={paragraph} id={index === 0 ? "organization-modal-description" : undefined}>{paragraph}</p>
          ))}
        </div>
        <ul className="organization-modal-highlights" aria-label="主要領域">
          {details.highlights.map(item => <li key={item}>{item}</li>)}
        </ul>
        <a className="organization-modal-website" href={details.website} target="_blank" rel="noopener noreferrer">
          前往官方網站 <span aria-hidden="true">↗</span>
          <span className="visually-hidden">（另開視窗）</span>
        </a>
      </div>
    </dialog>
  );
}
