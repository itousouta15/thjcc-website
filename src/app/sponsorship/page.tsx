import type { Metadata } from "next";
import Link from "next/link";
import { ContactPanel } from "@/components/ContactPanel";
import { SubpageLayout } from "@/components/SubpageLayout";
import { site } from "@/data/site";
import { sponsorshipEmailSubject, sponsorshipImpacts, sponsorshipSteps, sponsorshipWays } from "@/data/sponsorship";
import "@/styles/sponsorship.css";

export const metadata: Metadata = {
  title: "我要贊助｜THJCC 臺灣高中職聯合資安競賽",
  description: "支持學生自主籌辦的 THJCC 資安競賽。了解經費、物資獎品與技術資源等贊助方式，與籌備團隊一起推廣高中職資安教育。",
};

export default function SponsorshipPage() {
  const emailHref = `mailto:${site.email}?subject=${encodeURIComponent(sponsorshipEmailSubject)}`;

  return (
    <SubpageLayout title="我要贊助" description="支持一場由學生發起的資安競賽，讓更多高中職生有機會動手探索、解題與交流。" currentPath="/sponsorship">
      <div className="subpage-content sponsorship-content">
        <section className="sponsorship-intro" aria-labelledby="sponsorship-intro-title">
          <div className="sponsorship-intro-heading">
            <h2 id="sponsorship-intro-title">一起讓好奇心<br />走得更遠</h2>
          </div>
          <div className="sponsorship-intro-copy">
            <p className="subpage-copy">從第一道解不開的題目，到第一次找到 Flag，資安學習需要親手嘗試的機會。THJCC 由北、中、南學生資訊社群與全國參與籌備的學生共同投入，為高中職生打造交流與實作的平台。</p>
            <p className="subpage-copy">您的支持，能協助我們準備競賽所需的資源，讓學生的熱情有機會成為一場真正的比賽。</p>
            <div className="sponsorship-actions">
              <a className="sponsorship-button" href={emailHref}>洽談贊助合作 <span aria-hidden="true">↗</span></a>
              <Link className="sponsorship-text-link" href="/partners">認識合作夥伴 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section className="subpage-section" aria-labelledby="sponsorship-impact-title">
          <h2 className="organization-heading" id="sponsorship-impact-title"><span>您的支持，能帶來什麼？</span></h2>
          <ul className="sponsorship-grid sponsorship-impacts">
            {sponsorshipImpacts.map((impact, index) => (
              <li className="sponsorship-impact" key={impact.title}>
                <span className="sponsorship-number" aria-hidden="true">0{index + 1}</span>
                <h3>{impact.title}</h3>
                <p className="subpage-copy">{impact.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="subpage-section" aria-labelledby="sponsorship-ways-title">
          <h2 className="organization-heading" id="sponsorship-ways-title"><span>找到適合您的支持方式</span></h2>
          <p className="subpage-copy">無論是經費、物資，或您擅長的技術，都歡迎與我們討論。以下是可以交流的合作方向。</p>
          <ul className="sponsorship-grid">
            {sponsorshipWays.map(way => (
              <li className="sponsorship-card" key={way.id}>
                <h3>{way.title}</h3>
                <p className="subpage-copy">{way.description}</p>
                <ul className="partner-profile-highlights" aria-label={`${way.title}參考項目`}>
                  {way.examples.map(example => <li key={example}>{example}</li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section className="subpage-section" aria-labelledby="sponsorship-steps-title">
          <h2 className="organization-heading" id="sponsorship-steps-title"><span>從一封信開始</span></h2>
          <ol className="sponsorship-steps" role="list">
            {sponsorshipSteps.map((step, index) => (
              <li className="sponsorship-step" key={step.title}>
                <span className="sponsorship-step-number" aria-hidden="true">0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p className="subpage-copy">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <ContactPanel title="一起支持下一次探索" emailSubject={sponsorshipEmailSubject}>
          歡迎企業、組織與個人來信。請附上您的稱呼或單位名稱、可提供的資源與聯絡方式，讓我們一起找到適合的合作方式。
        </ContactPanel>
      </div>
    </SubpageLayout>
  );
}
