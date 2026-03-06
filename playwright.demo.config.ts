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
