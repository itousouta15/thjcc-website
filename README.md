# THJCC Website

依 Figma `76:224` 實作的第四屆臺灣高中職聯合資安競賽首頁。

## 技術

- Next.js 14 App Router
- TypeScript、React 18
- Plain CSS 與 CSS custom properties
- 本機字型：LINE Seed TW、Asul、Bitcount Grid Single
- Lenis 桌面慣性捲動，採用 itouSouta.me 的 `wheelMultiplier: 0.8`、`lerp: 0.1`

## 啟動

```sh
npm ci
npm run dev
```

開啟 <http://localhost:3000>。

```sh
npm run typecheck
npm run lint
npm run build
npm start
```

## 專案結構

```text
src/app/          App Router 頁面與全域樣式
src/components/   導覽、Hero、介紹、團隊、單位卡片與頁尾
src/data/site.ts  文案、成員、單位與連結設定
src/styles/       設計變數、首頁樣式與 RWD
public/images/    Figma 原始圖示、Logo、頭像與 Hero 渲染素材
public/fonts/     字型與隨附授權文件
```

## 設計依據

[Figma Desktop Frame 76:224](https://www.figma.com/design/ZJd84NrEnUC8BhiN993LxM/THJCC--Copy-?node-id=76-224&m=dev)

- 桌面基準：1440 × 3367.06 px，以實作時重新取得的最新設計為準。
- 保留原稿字體、配色、區塊尺寸與桌面不對稱卡片圓角；手機版 Partners 全部卡片統一為 50px 圓角。
- 已同步新增的 Denny、twcat0503 頭像與帽子、左側閃電及 20px 區塊間距，Justin 保留原稿灰色頭像。
- Hero 的金屬效果使用 Figma 渲染圖搭配原向量輪廓保留外觀；素材是桌面稿可見範圍的裁切版本。
- 尚未提供手機設計稿，RWD 是沿用桌面視覺的響應式延伸。
- 手機（小於 768px）與「減少動態效果」模式使用原生捲動；桌面頁內導覽由 Lenis 處理，保留 Navbar 避讓間距。
- LINE Seed TW 保留原稿 TTF／OTF 用法，所有字型隨附 OFL 授權文件。

## 待補連結

在 `src/data/site.ts` 填入正式的 Discord、Instagram、贊助及 FAQ 目的地。
目前 `null` 目的地顯示為停用連結，沒有設定虛構網址。頁面內導覽與聯絡 Email 已可使用。
