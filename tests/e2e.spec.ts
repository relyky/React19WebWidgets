import { test, expect } from "@playwright/test";

test("web-greeting renders correctly", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("你好，郝聰明！")).toBeVisible();
});

test("web-counter renders with initial value", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("87")).toBeVisible();
});

test("web-counter increments on +1 click", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "+1" }).click();
  await expect(page.getByText("88")).toBeVisible();
});
