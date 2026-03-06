# React 19 + Web Components 開發任務清單

## Phase 1：初始化 Monorepo

- [x] 在根目錄建立 `package.json`，設定 `workspaces: ["packages/*"]` 與根層 scripts
- [x] 在根目錄建立 `tsconfig.json`，設定 `paths`、`composite` 及共用編譯選項

## Phase 2：建立 web-greeting 套件

- [ ] 建立 `packages/web-greeting/package.json`，設定套件名稱、版本、`main`/`module` 欄位
- [ ] 安裝依賴：`react`、`react-dom`、`@r2wc/react-to-web-component` 及對應 `@types`
- [ ] 建立 `packages/web-greeting/vite.config.ts`，設定 library mode，入口為 `src/index.ts`
- [ ] 建立 `packages/web-greeting/src/Greeting.tsx`，實作 `<Greeting name={string} />` 元件
- [ ] 建立 `packages/web-greeting/src/index.ts`，用 r2wc 包裝並呼叫 `customElements.define("web-greeting", ...)`
- [ ] 執行 `pnpm --filter web-greeting build`，確認 `dist/` 產出正確

## Phase 3：建立 web-counter 套件

- [ ] 建立 `packages/web-counter/package.json`，設定套件名稱、版本、`main`/`module` 欄位
- [ ] 安裝依賴：`react`、`react-dom`、`@r2wc/react-to-web-component` 及對應 `@types`
- [ ] 建立 `packages/web-counter/vite.config.ts`，設定 library mode，入口為 `src/index.ts`
- [ ] 建立 `packages/web-counter/src/Counter.tsx`，實作 `<Counter initValue={number} />` 元件（含 `useState`）
- [ ] 建立 `packages/web-counter/src/index.ts`，用 r2wc 包裝並呼叫 `customElements.define("web-counter", ...)`
- [ ] 執行 `pnpm --filter web-counter build`，確認 `dist/` 產出正確

## Phase 4：建立 react-app

- [ ] 建立 `packages/react-app/package.json`，設定 Vite + React 19 應用依賴
- [ ] 建立 `packages/react-app/vite.config.ts`，設定應用模式
- [ ] 建立 `packages/react-app/src/main.tsx`，掛載 React root
- [ ] 建立 `packages/react-app/src/pages/Home.tsx`，匯入 `web-greeting` 與 `web-counter` 套件，在 JSX 中使用 `<web-greeting name="郝聰明" />` 與 `<web-counter init-value={87} />`
- [ ] 執行 `pnpm --filter react-app dev`，在瀏覽器確認兩個 Web Component 正確渲染

## Phase 5：測試

- [ ] 在根目錄安裝 `vitest`、`@testing-library/react`、`@testing-library/jest-dom`，建立 `vitest.config.ts`
- [ ] 建立 `tests/greeting.test.tsx`，測試 `Greeting` 元件渲染輸出正確文字
- [ ] 建立 `tests/counter.test.tsx`，測試 `Counter` 初始值顯示與 `+1` 按鈕點擊行為
- [ ] 建立 `tests/integration.test.tsx`，測試 `web-greeting` 與 `web-counter` 在 React 應用中的整合渲染
- [ ] 安裝 `@playwright/test`，建立 `playwright.config.ts`
- [ ] 建立 `tests/e2e.spec.ts`，撰寫 E2E 測試驗證 Web Components 在真實瀏覽器中的互動行為
- [ ] 執行 `pnpm test`，確認所有單元與整合測試通過
- [ ] 執行 `pnpm playwright test`，確認 E2E 測試通過

## Phase 6：Storybook

- [ ] 在根目錄執行 `npx storybook init`，完成 Storybook 初始化設定
- [ ] 建立 `storybook/Greeting.stories.tsx`，定義 `Default`、`LongName` 等 story
- [ ] 建立 `storybook/Counter.stories.tsx`，定義 `Default`、`HighInitValue` 等 story
- [ ] 執行 `pnpm storybook`，確認兩個元件在 Storybook 中正確展示
