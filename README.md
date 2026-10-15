# THJCC Website

臺灣高中職聯合資安競賽（THJCC）的常駐官網，提供籌辦理念、籌備團隊、合作單位介紹，以及社群與聯絡入口。目前首頁使用第四屆主視覺。

網站以 Next.js App Router、React 與 TypeScript 建置，依 Figma 設計實作桌面版，並延伸為適用於平板與手機的響應式官網。目前頁面內容由專案內的資料檔管理，啟動時不需要環境變數、資料庫或外部 API。

Make and Design by [itouSouta](https://github.com/itousouta15)

## 目錄

- [網站功能](#網站功能)
- [技術組成](#技術組成)
- [本機開發](#本機開發)
- [開發指令](#開發指令)
- [專案結構](#專案結構)
- [內容與素材維護](#內容與素材維護)
- [設計與互動](#設計與互動)
- [檢查與驗收](#檢查與驗收)
- [建置與部署](#建置與部署)
- [目前連結狀態](#目前連結狀態)
- [字型與授權](#字型與授權)
- [聯絡方式](#聯絡方式)

## 網站功能

| 區塊 | 內容 |
| --- | --- |
| 導覽列 | 品牌標誌回首頁，連至關於 THJCC、籌備團隊、合作夥伴，並標示目前頁面 |
| Hero | THJCC 4 主視覺、金屬標誌、賽事名稱與社群入口 |
| 賽事介紹 | 競賽宗旨與學生自主籌辦的介紹 |
| 籌備團隊 | 五位籌備成員的職務、名稱與頭像 |
| 成員介紹彈窗 | 點選首頁或團隊子頁的成員，查看自我介紹與社群連結 |
| 支持單位 | 三個主辦單位、兩個協辦單位與一個合作單位 |
| 單位介紹彈窗 | 單位摘要、主要領域與官方網站連結 |
| 頁尾 | 首頁與子頁連結、贊助入口、聯絡信箱與社群連結 |

主導覽使用 `/about`、`/team`、`/partners` 三個子頁，首頁各區摘要也提供完整內容的入口。首頁的 `#about`、`#team`、`#partners` 為頁內錨點，`#top` 可回到頁面頂端。FAQ 與贊助入口的設定方式見[目前連結狀態](#目前連結狀態)。

| 路徑 | 內容來源 |
| --- | --- |
| `/about` | `src/data/about.ts` 的完整介紹，以及 `src/data/site.ts` 的主辦社群名單與聯絡資訊 |
| `/team` | `src/data/team.ts` 的分組、成員、自我介紹與社群連結 |
| `/partners` | `src/data/site.ts` 的單位分類與 `src/data/organizationDetails.ts` 的完整介紹 |

三個子頁共用 `SubpageLayout.tsx` 與 `src/styles/subpage.css`，導覽項目集中在 `src/data/site.ts` 的 `navigation`。站內路由透過 Next.js Link 切換，首頁與分組的頁內錨點則沿用平滑捲動。

## 技術組成

| 技術 | 版本／用途 |
| --- | --- |
| Next.js | 14.2.35，App Router、頁面中繼資料、圖片與本機字型載入 |
| React / React DOM | 18.3.1，頁面元件與互動狀態 |
| TypeScript | 5.9.3（lockfile 鎖定版本），嚴格型別檢查 |
| Lenis | 1.3.25，桌面慣性捲動與頁內導覽 |
| Sharp | 0.34 系列，Next.js 圖片最佳化 |
| CSS | 原生 CSS、CSS custom properties 與響應式版面 |
| ESLint | 8.57 系列，使用 `next/core-web-vitals` 規則 |

相依套件範圍定義於 [`package.json`](./package.json)，實際安裝版本由 [`package-lock.json`](./package-lock.json) 鎖定。

## 本機開發

### 環境需求

- 建議使用 Node.js 22 LTS 與隨附的 npm。
- 安裝 Git，並先取得此專案的原始碼。

在專案根目錄執行：

```sh
npm ci
npm run dev
```

開啟 <http://localhost:3000>。修改 `src/` 內的檔案後，開發伺服器會自動更新頁面。

若預設連接埠已被占用，可指定其他連接埠：

```sh
npm run dev -- --port 3001
```

此時開啟 <http://localhost:3001>。

## 開發指令

| 指令 | 說明 |
| --- | --- |
| `npm ci` | 依 lockfile 安裝相依套件，適合首次設定與 CI |
| `npm run dev` | 啟動開發伺服器 |
| `npm run typecheck` | 執行 `tsc --noEmit`，檢查 TypeScript 型別 |
| `npm run lint` | 執行 `next lint`，檢查程式碼規則 |
| `npm run icons:generate` | 從 `public/images/THJCC.webp` 重新產生 ICO 與裝置圖示 |
| `npm run build` | 建立正式版產物，輸出至 `.next/` |
| `npm start` | 啟動正式版伺服器，須先完成建置 |

## 專案結構

```text
thjcc-website/
├── public/
│   ├── fonts/                    # 本機字型與 OFL 授權文件
│   └── images/                   # 標誌、頭像、圖示與裝飾素材
├── src/
│   ├── app/
│   │   ├── layout.tsx            # 根版面、字型、metadata 與全域效果
│   │   ├── page.tsx              # 首頁區塊組合
│   │   ├── globals.css           # 全域樣式與鍵盤焦點樣式
│   │   ├── about/page.tsx        # 關於 THJCC 與聯絡入口
│   │   ├── team/page.tsx         # 完整團隊分組子頁
│   │   └── partners/page.tsx     # 合作單位完整介紹
│   ├── components/
│   │   ├── SiteHeader.tsx        # 桌面與手機導覽入口
│   │   ├── SubpageLayout.tsx     # 子頁共用頁首、標題、頁尾
│   │   ├── ContactPanel.tsx      # 聯絡資訊與合作入口
│   │   ├── MobileNavigation.tsx  # 手機選單互動
│   │   ├── HeroSection.tsx       # 主視覺文字與行動連結
│   │   ├── HeroArtwork.tsx       # 金屬標誌與線性捲動動畫
│   │   ├── AboutSection.tsx      # 賽事介紹
│   │   ├── TeamSection.tsx       # 籌備團隊
│   │   ├── TeamAvatar.tsx        # 團隊共用頭像與待補圖片樣式
│   │   ├── TeamMemberList.tsx    # 共用成員清單與彈窗入口
│   │   ├── TeamMemberModal.tsx   # 成員自我介紹與社群連結
│   │   ├── PartnersSection.tsx   # 單位卡片與彈窗狀態
│   │   ├── OrganizationModal.tsx # 單位介紹對話框
│   │   ├── OrganizationLogo.tsx  # 首頁、子頁與 Modal 共用單位 Logo
│   │   ├── AnimatedBackground.tsx # 動態背景與滑鼠互動
│   │   ├── SmoothScroll.tsx      # Lenis 與錨點捲動
│   │   ├── ConfiguredLink.tsx    # 正式／待設定連結的共用處理
│   │   ├── Brand.tsx             # 品牌標誌
│   │   ├── SocialLinks.tsx       # 社群連結
│   │   └── SiteFooter.tsx        # 頁尾
│   ├── data/
│   │   ├── site.ts               # 網站名稱、連結、文案、成員與單位
│   │   ├── about.ts              # 關於 THJCC 的詳細介紹與社群說明
│   │   ├── team.ts               # 成員、分組、職位與首頁精選設定
│   │   └── organizationDetails.ts # 單位介紹、重點與官方網址
│   └── styles/
│       ├── tokens.css            # 色彩、字型、間距與圓角變數
│       ├── home.css              # 首頁版面與 RWD
│       ├── background.css        # 光暈與點陣動畫
│       ├── team.css              # 團隊子頁與職位標記
│       ├── subpage.css           # 子頁共用版型與合作單位介紹
│       └── modal.css             # 單位介紹彈窗樣式
├── .eslintrc.json                 # ESLint 設定
├── next.config.mjs                # Next.js 設定
├── package.json                   # 套件與開發指令
├── package-lock.json              # 相依套件鎖定檔
└── tsconfig.json                  # TypeScript 與 @/* 路徑別名
```

`@/*` 對應 `src/*`，例如 `@/data/site` 即為 `src/data/site.ts`。

## 內容與素材維護

### 網站資訊與文案

主要內容集中在 [`src/data/site.ts`](./src/data/site.ts)：

| 設定 | 用途 |
| --- | --- |
| `site` | 中英文名稱、聯絡信箱、Discord、Instagram、FAQ 與贊助連結 |
| `navigation` | 導覽項目的標籤與目的地 |
| `aboutCopy` | 賽事介紹內文 |
| `team` | 首頁精選成員，由 `src/data/team.ts` 匯出 |
| `organizers` | 主辦單位 |
| `coorganizers` | 協辦單位 |
| `partners` | 合作單位 |

部分標題仍直接寫在元件內。更新屆數時，需同步修改 `HeroSection.tsx` 的屆數與副標題，以及 `src/app/layout.tsx` 的頁面標題和描述；介紹區塊的標題則位於 `AboutSection.tsx`。

### 團隊成員

完整團隊頁位於 `/team`，可從首頁「查看完整團隊」及頁尾進入。所有成員集中在 [`src/data/team.ts`](./src/data/team.ts) 的 `teamMembers`，首頁只顯示 `featured: true` 的成員。

新增成員時，在 `teamMembers` 陣列加入：

```ts
{
  id: "member-id",             // 唯一識別名稱
  name: "成員名稱",
  image: null,                 // 之後填入 "/images/team-member.webp"
  group: "challenges",         // 分組 ID
  position: "member",          // lead / deputy / member
  bio: ["第一段自我介紹。", "可以繼續加入其他段落。"],
  socialLinks: [
    { label: "GitHub", href: "https://github.com/your-account" },
    { label: "個人網站", href: "https://example.com" },
    { label: "Email", href: "mailto:hello@example.com" },
  ],
}
```

| `group` | 分組 |
| --- | --- |
| `coordination` | 總召組 |
| `challenges` | 出題組 |
| `infrastructure` | 網管組 |
| `administration` | 文書組 |
| `design` | 設計組 |

`position: "lead"` 顯示組長標記，`"deputy"` 顯示副組長標記，`"member"` 為一般組員；總召組對應「總召／副召」。各組內依組長、副組長、組員排序，其餘依資料順序呈現。分組名稱與職位文字可在同檔案的 `teamGroups` 調整。

頭像放入 `public/images/`，`image` 填完整公開路徑，例如 `/images/team-member.webp`。設為 `null` 時會顯示名字縮寫，可先建立名單再補圖。首頁精選成員另外支援 `decoration` 與 `largeRole`，樣式定義在 `src/styles/home.css`。

首頁與 `/team` 的每位成員都能點開介紹彈窗。`bio` 為自我介紹段落，空陣列或未設定時顯示「自我介紹準備中。」；`socialLinks` 接受任意顯示名稱及完整的 `https://`、`http://` 或 `mailto:` 網址。沒有連結時不顯示社群區塊。外部網站另開視窗，Email 則使用郵件連結。

首頁成員的帽子每次載入或重設時會隨機出現在頭像上半圈，可繞頭像圓心拖曳旋轉，也支援方向鍵（每次 5°）、Page Up／Down（每次 15°）、Home（0°）及 End（355°）。所有帽子的角度相差不超過 5° 時，放開帽子或完成鍵盤調整會觸發彩蛋。彩蛋 Flag 作為可複製分享的官網探索成就，並提供重設功能；內容位於 `src/components/TeamHatEasterEgg.tsx`。團隊內頁與成員 Modal 不顯示這些帽子。

頭像以 200 × 200 的尺寸資訊交給 `next/image` 處理，手機版顯示尺寸由 CSS 控制。

### 主辦、協辦與合作單位

單位卡片資料與介紹內容分別維護：

- `src/data/site.ts`：單位 ID、名稱、分類清單與卡片圓角。
- `src/data/organizationDetails.ts`：簡稱、分類、介紹段落、領域重點與官方網站。
- `src/components/PartnersSection.tsx`：標誌來源、尺寸與各組卡片排列。

新增單位時，需擴充 `Organization["id"]` 型別，加入對應清單與 `organizationDetails`，再設定 `OrganizationLogo` 的圖片及尺寸。若單位數量改變，也要確認卡片欄數與手機排列。

### 圖片、字型與樣式

- 公開素材放在 `public/`，以根路徑引用，例如 `/images/THJCC.webp`；檔名大小寫需與引用一致。
- Hero 目前使用 `public/images/THJCC.webp`，更換素材時需同步調整 `HeroArtwork.tsx` 的原始寬高比例。
- 全站色彩、字型與間距優先修改 `src/styles/tokens.css`；各區塊樣式與響應式規則位於 `src/styles/home.css`。
- 字型由 `src/app/layout.tsx` 的 `next/font/local` 載入，新增或更換時需同步設定路徑、字重與 CSS 變數。
- 網頁標題、描述、圖示與主題色也在 `src/app/layout.tsx` 設定。

### 網站圖示

網站圖示由 `public/images/THJCC.webp` 製作，採深色背景，讓銀色主視覺在淺色與深色介面都能辨識。更新素材後執行：

```sh
npm run icons:generate
```

- `public/favicon.ico`：內含 16、24、32、48、64、96、128、256px 八種解析度與 32-bit 色彩。
- `public/icons/favicon-*.png`：16、32、48、96px 瀏覽器 PNG 圖示。
- `public/icons/apple-touch-icon.png`：180px Apple 圖示。
- `public/icons/android-chrome-*.png`：192、512px 圖示，以及保留安全留白的 512px maskable 圖示。
- `public/site.webmanifest`：裝置圖示與網站名稱設定。

ICO 的所有尺寸均使用 32-bit DIB 格式，保留透明度與透明遮罩，方便 Windows 圖示讀取器使用。Apple 與 Android 圖示使用不透明背景；瀏覽器圖示使用透明圓角。圖示連結與 manifest 在 `src/app/layout.tsx` 的 metadata 設定。

## 設計與互動

### 設計依據

[Figma 桌面設計稿：Frame 76:224](https://www.figma.com/design/ZJd84NrEnUC8BhiN993LxM/THJCC--Copy-?node-id=76-224&m=dev)

桌面設計基準為 1440 × 3367.06 px。網站沿用原稿的深色背景、暖白色文字、本機字型及不對稱單位卡片圓角；手機版單位卡片統一使用 50px 圓角。手機版為依桌面視覺延伸的響應式設計。

首頁主要響應式規則涵蓋 1320、1024、768 與 480px 邊界，可在 `home.css` 中調整。

### 捲動與動態效果

- **桌面捲動**：寬度至少 768px 且未啟用「減少動態效果」時，動態載入 Lenis，使用 `wheelMultiplier: 0.8`、`lerp: 0.1` 與 `autoRaf: true`。
- **頁內導覽**：桌面錨點由 Lenis 處理，更新網址 hash，捲動完成後將焦點移至目的區塊。導覽列避讓間距透過 `--header-scroll-offset` 設定。
- **Hero 標誌**：依捲動進度線性縮小、移至介紹標題右側；僅保留捲動動畫，不套用滑鼠視差。初始尺寸和位置由 CSS 排列，避免重新整理時跳動。
- **滑鼠互動**：支援滑鼠且未要求減少動態效果的裝置，背景會呈現輕微位移。
- **背景動畫**：低對比暖白光暈與點陣由 CSS 動畫呈現。
- **減少動態效果**：遵循 `prefers-reduced-motion`，停用 Lenis、背景滑鼠位移與背景動畫。手機版使用原生捲動。

### 鍵盤操作與彈窗

網站提供「跳至主要內容」連結、可見的鍵盤焦點樣式與手機選單的 `aria-expanded` 狀態。手機選單可用 Esc 或點擊外部關閉。

成員介紹彈窗可由滑鼠、觸控或鍵盤 Enter／Space 開啟，支援 Esc、關閉按鈕、點擊背景及 Tab／Shift+Tab 焦點循環。開啟時鎖定背景捲動並暫停 Lenis，關閉後恢復捲動與觸發成員的焦點。

單位介紹使用原生 `<dialog>`，支援關閉按鈕、Esc、點擊背景，以及 Tab／Shift+Tab 焦點循環。開啟時鎖定背景捲動，並透過 `thjcc:scroll-lock` 事件暫停 Lenis；關閉後恢復捲動與觸發按鈕的焦點。外部網站連結另開分頁並設定 `noopener noreferrer`。

## 檢查與驗收

提交變更或部署前，在專案根目錄依序執行：

```sh
npm run typecheck
npm run lint
npm run build
```

目前 `package.json` 沒有自動化測試指令。版面或互動修改後，建議在瀏覽器確認：

- 桌面、平板與手機版的文字、頭像及卡片排列。
- 頁內導覽能到達正確區塊，標題不被導覽列遮住。
- 手機選單的開關、Esc 與外部點擊行為。
- 六個單位彈窗的內容、官方網址、關閉方式與鍵盤焦點。
- 彈窗開啟時背景不捲動，關閉後可繼續捲動。
- 系統啟用「減少動態效果」後的靜態畫面與原生捲動。
- 圖片、字型與社群連結能正常載入。

## 建置與部署

### 本機預覽正式版

```sh
npm ci
npm run build
npm start
```

預設服務位址為 <http://localhost:3000>。若需指定連接埠：

```sh
npm start -- --port 3001
```

### 部署至支援 Next.js 的平台

匯入 Git 儲存庫後，將專案根目錄設為工作目錄，使用下列設定：

| 項目 | 設定 |
| --- | --- |
| 框架 | Next.js |
| Node.js | 建議 22 LTS |
| 安裝指令 | `npm ci` |
| 建置指令 | `npm run build` |
| 啟動指令 | `npm start`，適用於自行管理的 Node.js 主機 |
| 環境變數 | 目前無必要設定 |

Vercel 等具備 Next.js 整合的平台可由框架預設處理產物與啟動流程。自行部署時，需保留建置後的 `.next/`、`public/`、執行所需的套件與設定檔，並以常駐服務管理正式版伺服器。

目前 `next.config.mjs` 啟用 React Strict Mode 並關閉 `X-Powered-By` 標頭，未設定靜態匯出或 `standalone` 輸出。部署方式應支援 Next.js 執行環境；僅將 `public/` 上傳至靜態主機不會產生完整網站。

### GitHub Actions 自動部署至 Vercel

部署流程定義於 [`.github/workflows/deploy-vercel.yml`](./.github/workflows/deploy-vercel.yml)。推送至 `main` 後會自動執行，也可在 GitHub 的 **Actions → Deploy to Vercel → Run workflow** 選擇 `main` 手動部署。

首次啟用前，請到儲存庫 **Settings → Secrets and variables → Actions → New repository secret** 設定：

| Secret | 來源 |
| --- | --- |
| `VERCEL_TOKEN` | 在 [Vercel Access Tokens](https://vercel.com/account/tokens) 建立，需有目標專案的部署權限 |
| `VERCEL_ORG_ID` | 本機 `.vercel/project.json` 的 `orgId` |
| `VERCEL_PROJECT_ID` | 本機 `.vercel/project.json` 的 `projectId` |

亦可透過 GitHub CLI 的互動提示設定 Token：

```sh
gh secret set VERCEL_TOKEN
```

流程使用 Node.js 22 與固定版本的 Vercel CLI，依序執行 `npm ci`、ESLint、TypeScript 檢查、`vercel pull`、`vercel build --prod`，最後以 `vercel deploy --prebuilt --prod` 上傳建置產物。成功後，Actions 執行摘要會顯示部署網址。

`vercel.json` 已關閉 Vercel Git 整合的自動部署，改由此 workflow 統一處理正式環境部署。請先設定上述 Secrets 再推送 workflow；同時觸發的部署會依序執行。

## 目前連結狀態

| 入口 | 目前設定 |
| --- | --- |
| Discord | <https://dc.thjcc.org/> |
| Instagram | <https://instagram.com/thjcc.tw> |
| 聯絡信箱 | [contact@thjcc.org](mailto:contact@thjcc.org) |
| FAQ | `site.links.faq` 為 `null`，待填入正式目的地 |
| 我要贊助 | `site.links.sponsorship` 為 `null`，待填入正式目的地 |

FAQ 與贊助網址取得後，在 `src/data/site.ts` 將相應的 `null` 改為網址即可。`ConfiguredLink` 會將沒有目的地的項目呈現為 `aria-disabled="true"` 的停用連結，並顯示「官方連結待提供」提示。

## 字型與授權

網站使用的字型及授權文件均位於 `public/fonts/`：

| 字型 | 用途 | 授權文件 |
| --- | --- | --- |
| LINE Seed TW | 中文內文與粗體文案，包含 TTF 與 WOFF2 檔 | [LINE-Seed-OFL.txt](./public/fonts/LINE-Seed-OFL.txt) |
| Asul | Hero 的 THJCC 字樣 | [Asul-OFL.txt](./public/fonts/Asul-OFL.txt) |
| Bitcount Grid Single | Hero 屆數字樣 | [BitcountGridSingle-OFL.txt](./public/fonts/BitcountGridSingle-OFL.txt) |

字型附有 SIL Open Font License 文件。目前儲存庫未提供專案整體的 `LICENSE`；字型授權的適用範圍請以各自文件為準。

## 聯絡方式

- Email：[contact@thjcc.org](mailto:contact@thjcc.org)
- Discord：<https://dc.thjcc.org/>
- Instagram：<https://instagram.com/thjcc.tw>
