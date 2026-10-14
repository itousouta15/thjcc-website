import type { ReactNode } from "react";

type ConfiguredLinkProps = {
  href: string | null;
  children: ReactNode;
  className?: string;
  label?: string;
  onClick?: () => void;
};

export function ConfiguredLink({ href, children, className, label, onClick }: ConfiguredLinkProps) {
  if (!href) {
    return (
      <span className={className} role="link" aria-disabled="true" aria-label={label} title="官方連結待提供">
        {children}
      </span>
    );
  }

  const external = /^https?:\/\//.test(href);

  return (
    <a className={className} href={href} aria-label={label} onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
