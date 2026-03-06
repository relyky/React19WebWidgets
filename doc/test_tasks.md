# 純 HTML 頁面 Web Component 測試實作任務清單

依據 `doc/test_design.md` 拆解為可逐步執行的實作步驟。

---

## Step 1：確認 dist bundle 存在

- [x] 執行 `pnpm build`，確認以下檔案產出：
  - `packages/web-greeting/dist/web-greeting.js`
  - `packages/web-counter/dist/web-counter.js`

---

## Step 2：建立 demo/ HTML 頁面

- [x] 建立 `demo/greeting.html`
  - 載入 `../packages/web-greeting/dist/web-greeting.js`
  - 使用 `<web-greeting name="郝聰明"></web-greeting>`
- [x] 建立 `demo/counter.html`
  - 載入 `../packages/web-counter/dist/web-counter.js`
  - 使用 `<web-counter init-value="87"></web-counter>`
- [x] 建立 `demo/index.html`
  - 同時載入兩個 bundle
  - 並列使用 `<web-greeting>` 與 `<web-counter>`

---

## Step 3：手動驗證 demo 頁面

- [x] 在根目錄執行 `npx http-server . -p 5174 --cors`
- [x] 瀏覽器開啟 `http://localhost:5174/demo/greeting.html`，確認顯示「你好，郝聰明！」
- [x] 瀏覽器開啟 `http://localhost:5174/demo/counter.html`，確認顯示「計數: 87」且「+1」按鈕正常
- [x] 瀏覽器開啟 `http://localhost:5174/demo/index.html`，確認兩個元件同頁共存無錯誤

---

## Step 4：建立 Playwright demo config

- [x] 建立 `playwright.demo.config.ts`
  - `testDir: "./tests"`
  - `testMatch: ["**/demo.spec.ts"]`
  - `webServer`: `npx http-server . -p 5174 --cors`，port 5174
  - `use.baseURL`: `http://localhost:5174`

---

## Step 5：建立 Playwright demo 測試

- [x] 建立 `tests/demo.spec.ts`，包含以下測試案例：
  - `greeting.html`：`waitForSelector("web-greeting p")` 後確認包含「郝聰明」
  - `counter.html`：`waitForSelector("web-counter span")` 後確認包含「87」
  - `counter.html`：點擊「+1」後確認顯示「88」
  - `index.html`：確認兩個元件皆正常渲染（greeting 文字 + counter 計數）
  - **注意**：r2wc 預設使用 Light DOM，直接以 CSS 選擇器查詢，不需 `shadowRoot`

---

## Step 6：加入 package.json script

- [x] 在根目錄 `package.json` 的 `scripts` 新增：
  ```json
  "test:demo": "playwright test --config=playwright.demo.config.ts"
  ```
- [x] 安裝 `http-server` 為 devDependency：`pnpm add -D http-server`

---

## Step 7：執行並驗收

- [x] 執行 `pnpm test:demo`，4 個 demo 測試全數通過
- [x] 執行 `pnpm test --run`，7 個 vitest 測試仍全數通過

---

## 驗收標準

| 項目 | 標準 | 結果 |
|------|------|------|
| demo 頁面可在瀏覽器手動開啟 | 三個 HTML 頁面無 console 錯誤 | ✓ |
| `pnpm test:demo` | 所有 demo.spec.ts 測試案例通過 | 4/4 通過 |
| 現有測試不受影響 | vitest 測試保持綠燈 | 7/7 通過 |
