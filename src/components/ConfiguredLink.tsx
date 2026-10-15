import type { ReactNode } from "react";
import Link from "next/link";

type ConfiguredLinkProps = {
  href: string | null;
  children: ReactNode;
  className?: string;
  label?: string;
  title?: string;
  current?: boolean;
  onClick?: () => void;
};

export function ConfiguredLink({ href, children, className, label, title, current, onClick }: ConfiguredLinkProps) {
  if (!href) {
    return (
      <span className={className} role="link" aria-disabled="true" aria-label={label} title={title ?? "官方連結待提供"}>
        {children}
      </span>
    );
  }

  const external = /^https?:\/\//i.test(href);

  if (href.startsWith("/") && !href.startsWith("//")) {
    return (
      <Link className={className} href={href} aria-label={label} title={title}
        aria-current={current ? "page" : undefined} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <a className={className} href={href} aria-label={label} title={title} aria-current={current ? "page" : undefined} onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}
