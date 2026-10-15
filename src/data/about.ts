import { aboutParagraphs } from "./site";

type AboutSection = {
  id: string;
  title: string;
  paragraphs: string[];
  link?: { label: string; href: string };
};

export const aboutPageSections: AboutSection[] = [
  {
    id: "students",
    title: "學生自主籌辦",
    paragraphs: [
      aboutParagraphs[0],
      "一場競賽的背後，有出題、平台維運、文書協調與視覺設計等工作。THJCC 的籌備團隊由對資訊與資安有熱情的學生組成，透過分工合作，把各自的專長放進同一場活動裡。",
      "我們也把籌備視為學習的一部分。除了技術，還需要練習討論、溝通、安排工作，以及在遇到問題時一起找出解法。希望每位參與的人，都能帶著實際做過一件事的經驗繼續前進。",
    ],
    link: { label: "認識籌備團隊", href: "/team" },
  },
  {
    id: "learning",
    title: "推廣資安教育",
    paragraphs: [
      aboutParagraphs[1],
      "資安的學習往往從一個問題開始：這個程式為什麼會這樣運作？網站的輸入是怎麼被處理的？看似正常的設計，可能在哪裡出錯？我們希望透過競賽，把這些好奇心變成可以動手探索的題目。",
      "在嘗試、查資料與驗證想法的過程中，練習拆解問題，也學會看懂失敗的原因。即使還沒找到答案，這些探索本身也能成為下一次解題的基礎。",
    ],
  },
  {
    id: "ctf",
    title: "從解題開始",
    paragraphs: [
      "CTF 是 Capture The Flag 的縮寫。參賽者透過分析題目、理解程式或系統的運作，找出題目中的線索，取得稱為 Flag 的答案。它把抽象的資安概念轉成可以實際觀察、測試與驗證的問題。",
      "解題可能會碰到網站安全、密碼學、程式分析或數位鑑識等不同方向。面對陌生領域時，先觀察、提出假設，再用實作確認，是一步步接近答案的方式。",
    ],
  },
  {
    id: "exchange",
    title: "讓交流延續",
    paragraphs: [
      "不同學校與地區的學生，接觸資安的機會和學習資源不盡相同。THJCC 希望讓這些原本分散的學習經驗有機會相遇，讓大家認識其他同樣喜歡研究問題、願意分享發現的夥伴。",
      "我們重視題目背後的想法，也重視人與人之間的交流。從一次討論、一篇解題紀錄，到後續持續參與社群，希望競賽帶來的連結能延續到活動之外。",
    ],
  },
];

export const aboutCommunityIntro =
  "THJCC 串連北、中、南的學生資訊社群與全國參與籌備的學生。透過跨區合作，讓不同地方的經驗與資源有機會互相支援，也一起推廣高中職的資訊安全學習。";
