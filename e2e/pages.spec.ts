import { expect, getSitemapPaths, test } from "./fixtures";

// Smoke-test every page in the sitemap: it must render without runtime errors or
// failing same-origin requests (e.g. missing images). Broken internal links are
// already caught by the prerender crawler during the build.
test("every sitemap page renders cleanly", async ({ page, request, baseURL }) => {
	test.slow();
	const paths = await getSitemapPaths(request);
	expect(paths.length).toBeGreaterThan(1);

	for (const path of paths) {
		await test.step(path, async () => {
			const errors: string[] = [];
			const onPageError = (error: Error) => errors.push(error.message);
			const onResponse = (response: { url(): string; status(): number }) => {
				if (response.url().startsWith(baseURL!) && response.status() >= 400) {
					errors.push(`${response.status()} ${response.url()}`);
				}
			};
			page.on("pageerror", onPageError);
			page.on("response", onResponse);

			const response = await page.goto(path);
			expect(response?.status()).toBe(200);
			await expect(page.locator("h1").first()).not.toBeEmpty();
			await page.waitForLoadState("networkidle");

			page.off("pageerror", onPageError);
			page.off("response", onResponse);
			expect.soft(errors, path).toEqual([]);
		});
	}
});
