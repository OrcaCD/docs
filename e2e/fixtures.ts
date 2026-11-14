import { test as base, type APIRequestContext, type Page } from "@playwright/test";

// The navbar fetches release and repo info from the GitHub API. Stub it so tests
// don't depend on the network or GitHub's rate limits.
const GITHUB_STUBS: Record<string, unknown> = {
	"/repos/OrcaCD/orca-cd/releases/latest": { tag_name: "v0.0.0-test" },
	"/repos/OrcaCD/orca-cd": { stargazers_count: 42, forks: 7 },
};

export const test = base.extend<{ stubGitHub: void }>({
	stubGitHub: [
		async ({ context }, use) => {
			await context.route("https://api.github.com/**", (route) => {
				const stub = GITHUB_STUBS[new URL(route.request().url()).pathname];
				return stub ? route.fulfill({ json: stub }) : route.fulfill({ status: 404 });
			});
			await use();
		},
		{ auto: true },
	],
});

export { expect } from "@playwright/test";

export async function getSitemapPaths(request: APIRequestContext): Promise<string[]> {
	const response = await request.get("/sitemap.xml");
	const xml = await response.text();
	return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
}

// Pages are prerendered, so controls only work once React has hydrated them.
export async function waitForHydration(page: Page) {
	await page.waitForFunction(() =>
		Object.keys(document.body).some((key) => key.startsWith("__reactFiber")),
	);
}
