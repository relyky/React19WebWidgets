# 純 HTML 頁面 Web Component 測試設計

## 1. 現行測試架構說明

本專案目前具備三層測試：

| 測試層 | 工具 | 環境 | 目的 |
|--------|------|------|------|
| 單元測試 | Vitest + React Testing Library | jsdom | 驗證 React 元件邏輯與渲染 |
| 整合測試 | Vitest + React Testing Library | jsdom | 驗證 Web Component 在 React 應用中的掛載行為 |
| E2E 測試 | Playwright | 真實 Chromium | 驗證 react-app 整合頁面的互動行為 |

**現行缺口**：上述測試皆以「React 應用消費 Web Component」為前提。dist bundle（`packages/web-greeting/dist/web-greeting.js`、`packages/web-counter/dist/web-counter.js`）作為獨立 ES module 在純 HTML 環境的行為，尚未被測試覆蓋。

---

## 2. 新增測試層的動機

Web Component 的核心價值在於「跨框架可重用」。若 dist bundle 本身有問題（例如 `process is not defined`、Shadow DOM 結構異常、kebab-case 屬性對應錯誤），react-app 的測試不一定能捕捉，因為 react-app 是透過 workspace 直接 import 原始碼。

新增「純 HTML 頁面測試層」的目的：

1. **驗證 dist bundle 本身**：確保建置產出可在無框架的瀏覽器環境直接執行
2. **模擬最終消費方場景**：如 Blazor、一般 HTML 頁面、其他框架
3. **補足 file:// 協定限制**：ES module 的 `import` 在 `file://` 下受 CORS 限制，必須透過 HTTP server 提供

---

## 3. 設計決策

### 3.1 demo/ 目錄

在根目錄新增 `demo/` 目錄，存放純 HTML 測試頁面。不放入 `tests/` 是因為 `tests/` 專屬於 vitest/Playwright 測試程式碼；`demo/` 強調「可人工開啟瀏覽器檢視」的展示兼測試用途。

### 3.2 使用 vite serve（或 http-server）

選擇 `vite preview` / `npx http-server` 而非直接開啟 `file://`：

- ES module `import` 在 `file://` 下會觸發 CORS 錯誤
- vite serve 零設定，開發機已有 vite 依賴，不需額外安裝

### 3.3 Port 規劃

| 服務 | Port |
|------|------|
| react-app dev server（現有） | 5173 |
| demo/ static server（新增） | 5174 |
| Storybook（現有） | 6006 |

使用 `5174` 避免與現有服務衝突，且 Playwright 的 `webServer` 支援多個 server 設定。

### 3.4 為何不用 file://

- ES module 的 `import` 需要同源（same-origin），`file://` 不滿足此條件
- 現代瀏覽器與 Playwright 皆預設阻擋 `file://` 跨來源請求
- 使用 HTTP server 能完整模擬部署後的真實行為

---

## 4. 目錄結構

新增後的相關檔案：

```
project-root/
├── demo/
│   ├── index.html              # 兩個 Web Component 合併展示
│   ├── greeting.html           # web-greeting 單獨測試頁
│   └── counter.html            # web-counter 單獨測試頁
├── tests/
│   └── demo.spec.ts            # Playwright E2E，針對 demo/ 頁面（新增）
└── playwright.demo.config.ts   # 獨立 Playwright config（新增）
```

dist bundle 路徑（build 後產出）：

```
packages/web-greeting/dist/web-greeting.js
packages/web-counter/dist/web-counter.js
```

---

## 5. HTML 頁面設計

### 5.1 `demo/greeting.html`

驗證 `<web-greeting>` 的靜態屬性渲染：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><title>web-greeting demo</title></head>
<body>
  <web-greeting name="郝聰明"></web-greeting>
  <script type="module" src="../packages/web-greeting/dist/web-greeting.js"></script>
</body>
</html>
```

**預期結果**：頁面顯示「你好，郝聰明！」

### 5.2 `demo/counter.html`

驗證 `<web-counter>` 的初始值與互動行為：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><title>web-counter demo</title></head>
<body>
  <web-counter init-value="87"></web-counter>
  <script type="module" src="../packages/web-counter/dist/web-counter.js"></script>
</body>
</html>
```

**預期結果**：顯示「計數: 87」，點擊「+1」後顯示「計數: 88」

### 5.3 `demo/index.html`

兩個元件並列，驗證同頁面共存無衝突：

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head><meta charset="UTF-8"><title>Web Components Demo</title></head>
<body>
  <web-greeting name="郝聰明"></web-greeting>
  <web-counter init-value="87"></web-counter>
  <script type="module" src="../packages/web-greeting/dist/web-greeting.js"></script>
  <script type="module" src="../packages/web-counter/dist/web-counter.js"></script>
</body>
</html>
```

---

## 6. Playwright 整合

### 6.1 獨立 config

新增 `playwright.demo.config.ts`，與現有 `playwright.config.ts`（react-app E2E）分離：

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  testMatch: ["**/demo.spec.ts"],
  webServer: {
    command: "npx http-server . -p 5174 --cors",
    port: 5174,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: "http://localhost:5174",
  },
});
```

### 6.2 DOM 存取

`@r2wc/react-to-web-component` **預設不啟用 Shadow DOM**，React 元件直接渲染到 Light DOM（Custom Element 內部）。Playwright 可直接以 CSS 選擇器穿透存取：

```ts
// 等待元件渲染完成後直接查詢
await page.waitForSelector("web-greeting p");
const text = await page.locator("web-greeting p").textContent();

// counter 按鈕點擊
await page.waitForSelector("web-counter button");
await page.locator("web-counter button").click();
```

若需啟用 Shadow DOM，可在 `r2wc()` 第二參數加入 `shadow: "open"`，屆時改用 `shadowRoot` 查詢。

---

## 7. 執行流程

```bash
# Step 1：建置 dist bundle
pnpm build

# Step 2：啟動 demo static server（背景執行）
npx http-server . -p 5174 --cors &

# Step 3：在瀏覽器手動檢視（可選）
open http://localhost:5174/demo/index.html

# Step 4：執行 Playwright demo 測試
pnpm playwright test --config=playwright.demo.config.ts
```

或整合為單一指令（加入根目錄 `package.json` scripts）：

```json
{
  "scripts": {
    "test:demo": "playwright test --config=playwright.demo.config.ts"
  }
}
```

---

## 8. 測試矩陣

各測試層職責對比：

| 測試層 | 測試對象 | 環境 | 驗證重點 |
|--------|----------|------|----------|
| 單元測試（vitest） | React 元件原始碼 | jsdom | 元件邏輯、渲染輸出 |
| 整合測試（vitest） | Web Component + React app | jsdom | customElements 在 React 中掛載 |
| E2E 測試（Playwright react-app） | react-app 頁面 | Chromium | 使用者互動、完整頁面行為 |
| **純 HTML 測試（Playwright demo）** | **dist bundle** | **Chromium** | **bundle 可用性、Shadow DOM、kebab-case 屬性** |
| Storybook | React 元件原始碼 | 瀏覽器 | 視覺展示、設計 QA |

純 HTML 測試層是唯一直接驗證 **dist bundle 在無框架環境** 行為的測試，確保 Web Component 作為獨立可部署單元的品質。
