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

test("switches between documentation and API reference sidebars", async ({ page, isMobile }) => {
	await page.goto("/docs");
	await waitForHydration(page);

	if (isMobile) {
		await page.getByRole("button", { name: "Open Sidebar" }).click();
	}
	const sidebar = page.locator(isMobile ? "#nd-sidebar-mobile" : "#nd-sidebar");
	const documentation = sidebar.getByRole("button", { name: "Documentation", exact: true });
	const search = sidebar.getByRole("button", { name: /^Search/ });
	await expect(sidebar.getByRole("link", { name: "Introduction" })).toBeVisible();
	await expect(sidebar.getByRole("link", { name: "API Reference" })).toHaveCount(0);
	await expect(search).toBeVisible();
	const dropdownTop = await documentation.evaluate(
		(element) => element.getBoundingClientRect().top,
	);
	const searchTop = await search.evaluate((element) => element.getBoundingClientRect().top);
	expect(dropdownTop).toBeLessThan(searchTop);

	await documentation.click();
	await page.getByRole("link", { name: "API Reference", exact: true }).click();
	await expect(page).toHaveURL("/docs/api-reference");
	await expect(sidebar.getByRole("link", { name: "Overview", exact: true })).toBeVisible();
	await expect(sidebar.getByRole("link", { name: "Introduction" })).toHaveCount(0);

	await sidebar.getByRole("button", { name: "API Reference", exact: true }).click();
	await page.getByRole("link", { name: "Documentation", exact: true }).click();
	await expect(page).toHaveURL("/docs");
	await expect(sidebar.getByRole("link", { name: "Introduction" })).toBeVisible();
});

test("shows colored HTTP methods in the API Tokens sidebar group", async ({ page, isMobile }) => {
	await page.goto("/docs/api-reference/api-tokens/list-api-tokens");
	await waitForHydration(page);

	if (isMobile) {
		await page.getByRole("button", { name: "Open Sidebar" }).click();
	}
	const sidebar = page.locator(isMobile ? "#nd-sidebar-mobile" : "#nd-sidebar");
	await expect(sidebar.getByRole("button", { name: "API Tokens", exact: true })).toBeVisible();
	const get = sidebar
		.getByRole("link", { name: /List your API tokens/ })
		.getByText("GET", { exact: true });
	const post = sidebar
		.getByRole("link", { name: /Create an API token/ })
		.getByText("POST", { exact: true });
	await expect(get).toBeVisible();
	await expect(post).toBeVisible();
	const getColor = await get.evaluate((element) => getComputedStyle(element).color);
	const postColor = await post.evaluate((element) => getComputedStyle(element).color);
	expect(getColor).not.toBe(postColor);
});

test("uses an example hub URL and offers Markdown on generated API pages", async ({ page }) => {
	await page.goto("/docs/api-reference/api-tokens/list-api-tokens");
	await waitForHydration(page);

	await expect(
		page.getByText("https://orca.example.com/api/v1", { exact: false }).first(),
	).toBeVisible();
	await page.getByRole("button", { name: "Open", exact: true }).click();
	await expect(page.getByRole("link", { name: "View as Markdown" })).toBeVisible();
	await expect(page.getByRole("link", { name: "Open in GitHub", exact: true })).toHaveCount(0);
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
