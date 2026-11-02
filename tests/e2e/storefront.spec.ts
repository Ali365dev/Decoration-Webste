import { test, expect } from "@playwright/test";

test("storefront home renders brand and CMS blocks", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Dec Walls" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dec Walls" })).toBeVisible();
  await expect(page.getByText("New arrivals")).toBeVisible();
});

test("product detail is reachable from collection", async ({ page }) => {
  await page.goto("/collections/new-in");
  await expect(page.getByRole("heading", { name: "New In" })).toBeVisible();
  await page.getByRole("link", { name: /Quilt/i }).first().click();
  await expect(page.getByRole("heading", { name: /Quilt/i })).toBeVisible();
});
