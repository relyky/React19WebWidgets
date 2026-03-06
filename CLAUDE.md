# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用指令

```bash
# 安裝所有套件依賴
pnpm install

# 建置所有套件
pnpm build

# 建置單一套件
pnpm --filter web-greeting build
pnpm --filter web-counter build

# 啟動 React 應用開發伺服器（port 5173）
pnpm --filter react-app dev

# 執行單元/整合測試（vitest，排除 *.spec.ts）
pnpm test --run

# 執行單一測試檔案
pnpm test --run tests/greeting.test.tsx

# 執行 E2E 測試（自動啟動 react-app dev server）
pnpm playwright test

# 啟動純 HTML demo 靜態伺服器（port 5174）
# 開啟後瀏覽 http://localhost:5174/demo/index.html
npx http-server . -p 5174 --cors

# 關閉 demo 靜態伺服器（前台執行時）
Ctrl+C
# 關閉 demo 靜態伺服器（背景執行時，找出 port 5174 的 PID 並終止）
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 5174).OwningProcess -Force"

# 執行純 HTML dist bundle 測試（自動啟動 http-server port 5174）
pnpm test:demo

# 啟動 Storybook（port 6006）
pnpm storybook
```

## 架構概覽

**pnpm monorepo**，工作區定義於 `pnpm-workspace.yaml`。

```
packages/
  web-greeting/   # React <Greeting> → <web-greeting> Web Component
  web-counter/    # React <Counter>  → <web-counter>  Web Component
  react-app/      # Vite + React 19 應用，消費上述兩個 Web Component
storybook/        # Greeting.stories.tsx、Counter.stories.tsx
tests/            # greeting.test.tsx、counter.test.tsx（vitest）
                  # integration.test.tsx（vitest）
                  # e2e.spec.ts（Playwright，react-app E2E）
                  # demo.spec.ts（Playwright，純 HTML dist bundle 測試）
demo/             # greeting.html、counter.html、index.html（純 HTML 測試頁面）
.storybook/       # Storybook 設定（main.ts、preview.ts）
```

## Web Component 套件模式

每個 `packages/web-*` 套件遵循相同的結構：

1. `src/Xxx.tsx` — 純 React 元件，持有業務邏輯
2. `src/index.ts` — 用 `r2wc()` 包裝後呼叫 `customElements.define()`
3. `vite.config.ts` — library mode，ESM 格式，`define: { "process.env.NODE_ENV": JSON.stringify("production") }` 替換 Node.js 全域變數（避免瀏覽器 `process is not defined` 錯誤）
4. 輸出：`dist/web-xxx.js`（ESM，React 已內嵌，可直接在非 Node 環境如 Blazor 使用）

props 型別在 `r2wc()` 第二參數宣告，例如 `{ props: { name: "string" } }`。
kebab-case HTML 屬性會自動對應到 camelCase React prop（如 `init-value` → `initValue`）。

## react-app 整合

`packages/react-app/src/pages/Home.tsx` 直接 `import "web-greeting"` 和 `import "web-counter"`（觸發 side-effect 式的 `customElements.define`），再以 JSX 使用自訂元素。TypeScript 自訂元素型別定義在 `src/custom-elements.d.ts`。

## 測試架構

- **vitest**：jsdom 環境，直接 import React 元件原始碼（`packages/*/src/`）測試，排除 `*.spec.ts`
- **Playwright（react-app）**：`playwright.config.ts`，`webServer` 自動啟動 `react-app` dev server，E2E 測試跑在真實 Chromium
- **Playwright（demo）**：`playwright.demo.config.ts`，`webServer` 啟動 `http-server` port 5174 serving 根目錄，`tests/demo.spec.ts` 驗證 dist bundle 在純 HTML 環境的行為
- **r2wc 預設 Light DOM**：`@r2wc/react-to-web-component` 不啟用 Shadow DOM，React 元件渲染到 Custom Element 的 Light DOM，Playwright 直接用 `web-greeting p`、`web-counter span` 等 CSS 選擇器存取，並搭配 `waitForSelector` 等待渲染

## 版本注意事項

- `@storybook/react-vite@8` 與 `vite@7` 有 peer dependency 警告，但實際運作正常
- `pnpm-workspace.yaml` 中 `onlyBuiltDependencies: [esbuild]` 用於核准 esbuild postinstall
