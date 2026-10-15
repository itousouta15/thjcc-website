function getIcon(href: string, label: string) {
  if (/^mailto:/i.test(href)) return "email";
  let hostname = "";
  try {
    hostname = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "website";
  }

  if (hostname === "github.com" || hostname.endsWith(".github.com")) return "github";
  if (hostname === "linkedin.com" || hostname.endsWith(".linkedin.com")) return "linkedin";
  if (hostname === "instagram.com" || hostname.endsWith(".instagram.com")) return "instagram";
  if (hostname === "discord.com" || hostname === "discord.gg" || /discord/i.test(label)) return "discord";
  return "website";
}

export function SocialIcon({ href, label }: { href: string; label: string }) {
  const icon = getIcon(href, label);
  const asset = icon === "instagram" || icon === "discord" ? `${icon}-dark` : icon;
  const source = `url(/images/${asset}.svg)`;

  return (
    <span className={`social-link-icon${icon === "linkedin" ? " social-link-icon--linkedin" : ""}`}
      aria-hidden="true" style={{ maskImage: source, WebkitMaskImage: source }} />
  );
}
