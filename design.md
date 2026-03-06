# React 19 + Web Components 開發文件

## 1. 技術棧選擇
- **React 19**
  - 支援 Server Components、Actions API、Hooks (`useActionState`, `useOptimistic`)
  - JSX 可直接渲染 Web Components
- **Web Components**
  - 使用 `@r2wc/react-to-web-component` 將 React 元件包裝成獨立 Web Components
  - 每個元件獨立打包，跨框架可重用
- **工具鏈**
  - **Vite**：快速打包，支援多入口
  - **TypeScript**：型別安全，定義 props 與事件
  - **Storybook**：展示元件，方便設計與 QA
  - **Vitest/Jest + React Testing Library**：單元與整合測試
  - **Playwright**：端到端測試

---

## 2. 專案結構

```
project-root/
├── packages/
│   ├── web-greeting/          # <web-greeting />
│   │   ├── src/
│   │   │   ├── Greeting.tsx   # React 元件
│   │   │   └── index.ts       # r2wc 包裝
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   ├── web-counter/           # <web-counter />
│   │   ├── src/
│   │   │   ├── Counter.tsx    # React 元件
│   │   │   └── index.ts
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── react-app/             # React 19 應用
│       ├── src/
│       │   ├── pages/Home.tsx
│       │   └── main.tsx
│       ├── vite.config.ts
│       └── package.json
│
├── tests/
│   ├── greeting.test.tsx
│   ├── counter.test.tsx
│   └── integration.test.tsx
└── storybook/
    ├── Greeting.stories.tsx
    └── Counter.stories.tsx
```

---

## 3. 範例元件

### `<web-greeting name="郝聰明" />`

```tsx
// packages/web-greeting/src/Greeting.tsx
import React from "react";

export const Greeting: React.FC<{ name: string }> = ({ name }) => {
  return <p>你好，{name}！</p>;
};
```

```ts
// packages/web-greeting/src/index.ts
import r2wc from "@r2wc/react-to-web-component";
import { Greeting } from "./Greeting";

customElements.define("web-greeting", r2wc(Greeting, { props: { name: "string" } }));
```

---

### `<web-counter init-value="87" />`

```tsx
// packages/web-counter/src/Counter.tsx
import React, { useState } from "react";

export const Counter: React.FC<{ initValue: number }> = ({ initValue }) => {
  const [value, setValue] = useState(initValue);
  return (
    <div>
      <span>計數: {value}</span>
      <button onClick={() => setValue(value + 1)}>+1</button>
    </div>
  );
};
```

```ts
// packages/web-counter/src/index.ts
import r2wc from "@r2wc/react-to-web-component";
import { Counter } from "./Counter";

customElements.define("web-counter", r2wc(Counter, { props: { initValue: "number" } }));
```

---

## 4. 測試策略
- **單元測試**：使用 Vitest/Jest 測試 React 元件邏輯。
- **整合測試**：React Testing Library 驗證 `<web-greeting />` 與 `<web-counter />` 在 React 中的渲染與事件。
- **端到端測試**：Playwright 驗證 Web Components 在瀏覽器中運作。
- **Storybook**：提供設計與 QA 團隊可視化測試環境。

---

## 5. 開發流程
1. 在 `packages/` 下建立新 Web Component 專案。
2. 使用 React 撰寫元件，並透過 `@r2wc` 包裝成 Web Component。
3. 使用 Vite 打包成獨立 ES module。
4. 在 React 應用或其他框架中直接使用 `<web-xxx />`。
5. 撰寫測試與 Storybook 範例，確保元件穩定。

---

## 結論
- 使用 `@r2wc/react-to-web-component` 能顯著降低維護成本，因為只需維護 React 元件。
- 每個 Web Component 獨立打包，符合跨框架重用需求。
- 測試與 Storybook 確保品質，適合團隊協作與長期維護。
