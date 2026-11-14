import { expect, test, waitForHydration } from "./fixtures";

test("renders a docs page from its frontmatter", async ({ page }) => {
	await page.goto("/docs/setup/installation");

	await expect(page.getByRole("heading", { level: 1, name: "Installation" })).toBeVisible();
	await expect(page.getByText("Get OrcaCD running quickly with Docker")).toBeVisible();
	await expect(page.getByRole("button", { name: "Copy Markdown" })).toBeVisible();
});

test("navigates between pages through the sidebar", async ({ page, isMobile }) => {
	await page.goto("/docs");
	await waitForHydration(page);

	if (isMobile) {
		await page.getByRole("button", { name: "Open Sidebar" }).click();
	}
	await page.getByRole("link", { name: "Reverse Proxy" }).filter({ visible: true }).click();

	await expect(page).toHaveURL("/docs/guides/reverse-proxy");
	await expect(page.getByRole("heading", { level: 1, name: "Reverse Proxy" })).toBeVisible();
});

test("toggles the color theme", async ({ page, isMobile }) => {
	test.skip(isMobile, "The theme toggle lives in the collapsed sidebar on mobile");
	await page.goto("/docs");
	await waitForHydration(page);
	const html = page.locator("html");
	const wasDark = (await html.getAttribute("class"))?.includes("dark") ?? false;

	await page.getByRole("button", { name: "Toggle Theme" }).click();

	await expect(html).toHaveClass(wasDark ? /\blight\b/ : /\bdark\b/);
});

test("shows a 404 page for unknown docs", async ({ page }) => {
	const response = await page.goto("/docs/does-not-exist");

	expect(response?.status()).toBe(404);
	await expect(page.getByText("Page Not Found")).toBeVisible();
});
