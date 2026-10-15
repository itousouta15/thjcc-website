export { featuredTeam as team } from "./team";

export type SiteLink = {
  label: string;
  href: string | null;
};

// Null destinations stay visibly faithful to the design without inventing URLs.
// Fill these in once the official destinations are available.
export const site = {
  email: "contact@thjcc.org",
  englishName: "Taiwan High-school Joint Cybersecurity Competition",
  chineseName: "臺灣高中職聯合資安競賽",
  links: {
    discord: "https://dc.thjcc.org/",
    instagram: "https://instagram.com/thjcc.tw",
    sponsorship: null as string | null,
    faq: null as string | null,
  },
};

export const navigation: SiteLink[] = [
  { label: "賽事介紹", href: "#about" },
  { label: "團隊成員", href: "#team" },
  { label: "合作夥伴", href: "#partners" }
];

export const aboutCopy =
  "THJCC CTF 是一場專為臺灣高中職生打造的資安競賽，由 SCINT 北臺灣學生資訊社群 、 SCAICT 中部高中電資社團聯合會議及 SCIST 南臺灣學生資訊社群與全國志同道合的學生共同主辦，並獲得國內多個資安組織與單位的支持。核心宗旨在於推廣資訊安全教育，培養高中生對資安技術的興趣與實作能力，同時提供全臺學生互相學習、切磋與交流的平台。";

export type Organization = {
  id: "scint" | "scaict" | "scist" | "hitcon" | "ocf" | "ncse";
  name: string;
  corner: "left" | "middle" | "right" | "round";
};

export const organizers: Organization[] = [
  { id: "scint", name: "北臺灣學生資訊社群", corner: "left" },
  { id: "scaict", name: "中部高中電資社團聯合會議", corner: "middle" },
  { id: "scist", name: "南臺灣學生資訊社群", corner: "right" },
];

export const coorganizers: Organization[] = [
  { id: "hitcon", name: "社團法人台灣駭客協會", corner: "left" },
  { id: "ocf", name: "財團法人開放文化基金會", corner: "right" },
];

export const partners: Organization[] = [
  { id: "ncse", name: "NCSE Network", corner: "round" },
];
