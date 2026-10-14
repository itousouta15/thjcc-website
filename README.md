# THJCC Website

第四屆臺灣高中職聯合資安競賽（THJCC 4）的形象網站，提供賽事介紹、籌備團隊、主辦與協辦單位資訊，以及社群與聯絡入口。

網站以 Next.js App Router、React 與 TypeScript 建置，依 Figma 設計實作桌面版，並延伸為適用於平板與手機的單頁網站。目前頁面內容由專案內的資料檔管理，啟動時不需要環境變數、資料庫或外部 API。

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
| 導覽列 | 品牌標誌、頁內導覽與手機版選單 |
| Hero | THJCC 4 主視覺、金屬標誌、賽事名稱與社群入口 |
| 賽事介紹 | 競賽宗旨與學生自主籌辦的介紹 |
| 籌備團隊 | 五位籌備成員的職務、名稱與頭像 |
| 支持單位 | 三個主辦單位、兩個協辦單位與一個合作單位 |
| 單位介紹彈窗 | 單位摘要、主要領域與官方網站連結 |
| 頁尾 | 頁內連結、贊助入口、聯絡信箱與社群連結 |

頁內導覽使用 `#about`、`#team`、`#partners` 錨點，`#top` 可回到頁面頂端。FAQ 與贊助入口的設定方式見[目前連結狀態](#目前連結狀態)。

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
│   │   └── globals.css           # 全域樣式與鍵盤焦點樣式
│   ├── components/
│   │   ├── SiteHeader.tsx        # 桌面與手機導覽入口
│   │   ├── MobileNavigation.tsx  # 手機選單互動
│   │   ├── HeroSection.tsx       # 主視覺文字與行動連結
│   │   ├── HeroArtwork.tsx       # 金屬標誌與捲動／滑鼠互動
│   │   ├── AboutSection.tsx      # 賽事介紹
│   │   ├── TeamSection.tsx       # 籌備團隊
│   │   ├── PartnersSection.tsx   # 單位卡片與彈窗狀態
│   │   ├── OrganizationModal.tsx # 單位介紹對話框
│   │   ├── AnimatedBackground.tsx # 動態背景與滑鼠互動
│   │   ├── SmoothScroll.tsx      # Lenis 與錨點捲動
│   │   ├── ConfiguredLink.tsx    # 正式／待設定連結的共用處理
│   │   ├── Brand.tsx             # 品牌標誌
│   │   ├── SocialLinks.tsx       # 社群連結
│   │   └── SiteFooter.tsx        # 頁尾
│   ├── data/
│   │   ├── site.ts               # 網站名稱、連結、文案、成員與單位
│   │   └── organizationDetails.ts # 單位介紹、重點與官方網址
│   └── styles/
│       ├── tokens.css            # 色彩、字型、間距與圓角變數
│       ├── home.css              # 首頁版面與 RWD
│       ├── background.css        # 光暈與點陣動畫
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
| `team` | 成員名稱、職務、頭像與裝飾設定 |
| `organizers` | 主辦單位 |
| `coorganizers` | 協辦單位 |
| `partners` | 合作單位 |

部分標題仍直接寫在元件內。更新屆數時，需同步修改 `HeroSection.tsx` 的屆數與副標題，以及 `src/app/layout.tsx` 的頁面標題和描述；介紹區塊的標題則位於 `AboutSection.tsx`。

### 團隊成員

1. 將頭像放入 `public/images/`。
2. 在 `team` 中設定 `name`、`role` 與 `image`；`image` 填檔名即可，不含 `/images/` 前綴。
3. 依版面需要調整 `decoration` 與 `largeRole`。現有裝飾的尺寸和位置定義在 `src/styles/home.css`。

頭像以 200 × 200 的尺寸資訊交給 `next/image` 處理，手機版顯示尺寸由 CSS 控制。

### 主辦、協辦與合作單位

單位卡片資料與介紹內容分別維護：

- `src/data/site.ts`：單位 ID、名稱、分類清單與卡片圓角。
- `src/data/organizationDetails.ts`：簡稱、分類、介紹段落、領域重點與官方網站。
- `src/components/PartnersSection.tsx`：標誌來源、尺寸與各組卡片排列。

新增單位時，需擴充 `Organization["id"]` 型別，加入對應清單與 `organizationDetails`，再設定 `OrganizationLogo` 的圖片及尺寸。若單位數量改變，也要確認卡片欄數與手機排列。

### 圖片、字型與樣式

- 公開素材放在 `public/`，以根路徑引用，例如 `/images/THJCC.png`；檔名大小寫需與引用一致。
- Hero 目前使用 `public/images/THJCC.png`，更換素材時需同步調整 `HeroArtwork.tsx` 的原始寬高比例。
- 全站色彩、字型與間距優先修改 `src/styles/tokens.css`；各區塊樣式與響應式規則位於 `src/styles/home.css`。
- 字型由 `src/app/layout.tsx` 的 `next/font/local` 載入，新增或更換時需同步設定路徑、字重與 CSS 變數。
- 網頁標題、描述、圖示與主題色也在 `src/app/layout.tsx` 設定。

## 設計與互動

### 設計依據

[Figma 桌面設計稿：Frame 76:224](https://www.figma.com/design/ZJd84NrEnUC8BhiN993LxM/THJCC--Copy-?node-id=76-224&m=dev)

桌面設計基準為 1440 × 3367.06 px。網站沿用原稿的深色背景、暖白色文字、本機字型及不對稱單位卡片圓角；手機版單位卡片統一使用 50px 圓角。手機版為依桌面視覺延伸的響應式設計。

首頁主要響應式規則涵蓋 1320、1024、768 與 480px 邊界，可在 `home.css` 中調整。

### 捲動與動態效果

- **桌面捲動**：寬度至少 768px 且未啟用「減少動態效果」時，動態載入 Lenis，使用 `wheelMultiplier: 0.8`、`lerp: 0.1` 與 `autoRaf: true`。
- **頁內導覽**：桌面錨點由 Lenis 處理，更新網址 hash，捲動完成後將焦點移至目的區塊。導覽列避讓間距透過 `--header-scroll-offset` 設定。
- **Hero 標誌**：隨 Hero 至賽事介紹區塊的捲動進度線性縮小、下移，最後停在介紹標題右側。文字、字型載入或視窗尺寸改變時會重新測量位置。
- **滑鼠互動**：支援滑鼠且未要求減少動態效果的裝置，會呈現標誌與背景的輕微位移。
- **背景動畫**：低對比暖白光暈與點陣由 CSS 動畫呈現。
- **減少動態效果**：遵循 `prefers-reduced-motion`，停用 Lenis、標誌捲動位移、滑鼠位移與背景動畫；標誌保留靜態呈現。手機版使用原生捲動。

### 鍵盤操作與彈窗

網站提供「跳至主要內容」連結、可見的鍵盤焦點樣式與手機選單的 `aria-expanded` 狀態。手機選單可用 Esc 或點擊外部關閉。

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
