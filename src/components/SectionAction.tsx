import Link from "next/link";

const actions = {
  about: { href: "/about", label: "認識 THJCC", className: "section-detail-link" },
  team: { href: "/team", label: "查看完整團隊", className: "team-directory-link" },
  partners: { href: "/partners", label: "認識合作夥伴", className: "section-detail-link" },
} as const;

export function SectionAction({ section, placement }: {
  section: keyof typeof actions;
  placement: "header" | "footer";
}) {
  const action = actions[section];
  return (
    <Link className={`${action.className} section-link--${placement}`} href={action.href}>
      {action.label} <span aria-hidden="true">→</span>
    </Link>
  );
}
