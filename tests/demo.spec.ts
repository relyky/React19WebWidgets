import { test, expect } from "@playwright/test";

test.describe("web-greeting 純 HTML", () => {
  test("顯示問候文字", async ({ page }) => {
    await page.goto("/demo/greeting.html");
    await page.waitForSelector("web-greeting p");
    const text = await page.locator("web-greeting p").textContent();
    expect(text).toContain("郝聰明");
  });
});

test.describe("web-counter 純 HTML", () => {
  test("顯示初始計數值", async ({ page }) => {
    await page.goto("/demo/counter.html");
    await page.waitForSelector("web-counter span");
    const text = await page.locator("web-counter span").textContent();
    expect(text).toContain("87");
  });

  test("點擊 +1 後計數遞增", async ({ page }) => {
    await page.goto("/demo/counter.html");
    await page.waitForSelector("web-counter button");
    await page.locator("web-counter button").click();
    const text = await page.locator("web-counter span").textContent();
    expect(text).toContain("88");
  });
});

test.describe("index.html 兩元件共存", () => {
  test("greeting 與 counter 同頁無衝突", async ({ page }) => {
    await page.goto("/demo/index.html");
    await page.waitForSelector("web-greeting p");
    await page.waitForSelector("web-counter span");

    const greetingText = await page.locator("web-greeting p").textContent();
    expect(greetingText).toContain("郝聰明");

    const counterText = await page.locator("web-counter span").textContent();
    expect(counterText).toContain("87");
  });
});
