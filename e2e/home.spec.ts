import { expect, test } from "./fixtures";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
});

test("shows the hero", async ({ page }) => {
	await expect(page).toHaveTitle("OrcaCD Documentation");
	await expect(page.getByRole("heading", { level: 1, name: "OrcaCD" })).toBeVisible();
	await expect(page.getByText("GitOps for Docker").first()).toBeVisible();
	await expect(page.getByRole("img", { name: "OrcaCD Dashboard" })).toBeVisible();
});

test("Get Started opens the installation guide", async ({ page }) => {
	await page.getByRole("link", { name: "Get Started" }).click();

	await expect(page).toHaveURL("/docs/setup/installation");
	await expect(page.getByRole("heading", { level: 1, name: "Installation" })).toBeVisible();
});

test("Demo opens the demo page", async ({ page }) => {
	await page.getByRole("link", { name: "Demo", exact: true }).click();

	await expect(page).toHaveURL("/docs/demo");
});

test("links to the GitHub repository", async ({ page }) => {
	await expect(page.getByRole("link", { name: "View on GitHub" })).toHaveAttribute(
		"href",
		"https://github.com/OrcaCD/orca-cd",
	);
});
