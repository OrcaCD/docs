import { expect, getSitemapPaths, test } from "./fixtures";

test("llms.txt lists the docs", async ({ request }) => {
	const response = await request.get("/llms.txt");

	expect(response.ok()).toBe(true);
	expect(await response.text()).toContain("/docs/setup/installation");
});

test("llms-full.txt contains the page contents", async ({ request }) => {
	const response = await request.get("/llms-full.txt");

	expect(response.ok()).toBe(true);
	expect(await response.text()).toContain("# Installation (/docs/setup/installation)");
});

test("every docs page has a markdown version", async ({ request }) => {
	const docsPaths = (await getSitemapPaths(request)).filter((path) => path.startsWith("/docs"));

	for (const path of docsPaths) {
		const response = await request.get(`/llms.mdx${path}/content.md`);
		expect.soft(response.status(), path).toBe(200);
	}
});

test("sitemap lists the home page and docs", async ({ request }) => {
	const paths = await getSitemapPaths(request);

	expect(paths).toContain("/");
	expect(paths).toContain("/docs");
	expect(paths).toContain("/docs/setup/installation");
});
