import { expect, test, waitForHydration } from "./fixtures";

test.beforeEach(async ({ page }) => {
	await page.goto("/docs");
	await waitForHydration(page);
});

test("finds a page and navigates to it", async ({ page }) => {
	await page
		.getByRole("button", { name: /search/i })
		.filter({ visible: true })
		.first()
		.click();
	const dialog = page.getByRole("dialog");
	await dialog.getByRole("combobox", { name: "Search" }).fill("reverse proxy");
	await dialog
		.getByRole("option", { name: "Learn how to use a reverse proxy with OrcaCD" })
		.click();

	await expect(page).toHaveURL(/\/docs\/guides\/reverse-proxy/);
	await expect(page.getByRole("heading", { level: 1, name: "Reverse Proxy" })).toBeVisible();
});

test("opens with the keyboard shortcut", async ({ page, isMobile }) => {
	test.skip(isMobile, "No keyboard on mobile");

	await page.keyboard.press("ControlOrMeta+k");

	await expect(page.getByRole("dialog").getByRole("combobox", { name: "Search" })).toBeFocused();
});
