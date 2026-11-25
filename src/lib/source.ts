import { docs } from "fumadocs-mdx:collections/server";
import { InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { openapi } from "@/lib/openapi";
import { getApiMarkdown } from "@/lib/openapi-markdown";

export const source = loader({
	source: docs.toFumadocsSource(),
	baseUrl: "/docs",
	plugins: [lucideIconsPlugin(), openapi.loaderPlugin()],
});

export function getDocsNavigationTree() {
	const tree = source.getPageTree();
	const apiReference = tree.children.find(
		(node) => node.type === "folder" && node.root === "api-reference",
	);
	if (!apiReference) {
		return tree;
	}

	// Keep the reference in the source index and open its navigation only on API pages.
	return {
		...tree,
		children: tree.children.filter((node) => node !== apiReference),
		fallback: {
			name: tree.name,
			...tree.fallback,
			children: [apiReference, ...(tree.fallback?.children ?? [])],
		},
	};
}

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
	const segments = [...page.slugs, "content.md"];

	return {
		segments,
		url: `/llms.mdx/docs/${segments.join("/")}`,
	};
}

export async function getLLMText(page: InferPageType<typeof source>) {
	const processed = page.data._openapi
		? await getApiMarkdown(page.path)
		: await page.data.getText("processed");

	return `# ${page.data.title} (${page.url})

${processed}`;
}
