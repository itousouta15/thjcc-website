export const teamGroups = [
  { id: "coordination", name: "總召組", leadLabel: "總召", deputyLabel: "副召" },
  { id: "challenges", name: "出題組", leadLabel: "組長", deputyLabel: "副組長" },
  { id: "infrastructure", name: "網管組", leadLabel: "組長", deputyLabel: "副組長" },
  { id: "administration", name: "文書組", leadLabel: "組長", deputyLabel: "副組長" },
  { id: "design", name: "設計組", leadLabel: "組長", deputyLabel: "副組長" },
] as const;

export type TeamGroupId = typeof teamGroups[number]["id"];
export type TeamPosition = "lead" | "deputy" | "member";

export type TeamMembership = {
  group: TeamGroupId;
  position: TeamPosition;
};

export type TeamSocialLink = {
  label: string;
  href: string;
};

export type TeamMember = {
  id: string;
  name: string;
  /** Public image path, for example /images/team-name.webp. Null shows initials. */
  image: string | null;
  group: TeamGroupId;
  position: TeamPosition;
  /** Additional assignments reuse this member's image, biography, and social links. */
  additionalRoles?: TeamMembership[];
  /** Self-introduction paragraphs shown in the member's modal. */
  bio?: string[];
  /** GitHub, Instagram, personal website, email, or other public profiles. */
  socialLinks?: TeamSocialLink[];
  /** Include this member in the homepage's featured team. */
  featured?: boolean;
  decoration?: "left" | "right" | "denny" | "justin" | "twcat";
  largeRole?: boolean;
};

// Add the rest of the team here. Group and position control the directory badges.
export const teamMembers: TeamMember[] = [
  {
    id: "pgpenguin72", name: "PGpenguin72", image: "/images/team-pgpenguin72.webp",
    group: "coordination", position: "lead", featured: true, decoration: "left",
    bio: ["咕咕嘎嘎，是一隻企鵝喔，然後還是個資安小白，但莫名其妙當了總召…?"],
    socialLinks: [
      { label: "GitHub", href: "https://github.com/PGpenguin72" },
      { label: "Instagram", href: "https://www.instagram.com/pg_penguin_72/" },
      { label: "Email", href: "mailto:hi@pg72.tw" },
    ],
  },
  {
    id: "denny", name: "Denny", image: "/images/team-denny.webp",
    group: "challenges", position: "lead", featured: true, decoration: "denny",
    bio: [],
    socialLinks: [],
  },
  {
    id: "justin", name: "Justin", image: "/images/team-justin.webp",
    group: "infrastructure", position: "lead", featured: true, decoration: "justin",
    bio: [],
    socialLinks: [],
  },
  {
    id: "twcat0503", name: "twcat0503", image: "/images/team-twcat0503.webp",
    group: "administration", position: "lead", featured: true, decoration: "twcat", largeRole: true,
    bio: ["一隻台貓，本屆文書組組長，一個可悲科研仔。喵"],
    socialLinks: [
      { label: "個人網站", href: "https://twcat0503.org" },
      { label: "GitHub", href: "https://github.com/twcat0503" },
      { label: "Email", href: "mailto:me@twcat0503.org" },
    ],
  },
  {
    id: "itousouta", name: "itouSouta", image: "/images/team-itousouta.webp",
    group: "design", position: "lead", featured: true, decoration: "right", largeRole: true,
    additionalRoles: [{ group: "infrastructure", position: "member" }],
    bio: ["SCAICT第五屆會長，一個喜歡 VOCALOID 和畫畫的可悲高三牲，BTW 我是這個網站的主要設計者及開發者。設計組沒招到人啊QAQ"],
    socialLinks: [
      { label: "個人網站", href: "https://itousouta.me/" },
      { label: "GitHub", href: "https://github.com/itousouta15" },
      { label: "Instagram", href: "https://www.instagram.com/itou.souta15" },
      { label: "Email", href: "mailto:itousouta@scaict.org" },
      { label: "Linkedin", href: "https://www.linkedin.com/in/jia-ruei-kuo-6654a6442" },
    ],
  },
];

export function getTeamMemberships(member: TeamMember): TeamMembership[] {
  const memberships = [{ group: member.group, position: member.position }, ...(member.additionalRoles ?? [])];
  return memberships.filter((membership, index) => memberships.findIndex(role => role.group === membership.group) === index);
}

export function getTeamPositionLabel(member: TeamMembership) {
  const group = teamGroups.find(group => group.id === member.group)!;
  if (member.position === "lead") return group.leadLabel;
  if (member.position === "deputy") return group.deputyLabel;
  return "組員";
}

export function getTeamMemberRole(member: TeamMembership) {
  const group = teamGroups.find(group => group.id === member.group)!;
  const position = getTeamPositionLabel(member);
  return member.group === "coordination" ? position : `${group.name.slice(0, -1)}${position}`;
}

export const featuredTeam = teamMembers.filter(member => member.featured)
  .map(member => ({ ...member, role: getTeamMemberRole(member) }));
