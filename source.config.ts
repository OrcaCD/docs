import { remarkSteps } from "fumadocs-core/mdx-plugins";
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import lastModified from "fumadocs-mdx/plugins/last-modified";

export const docs = defineDocs({
	dir: "content/docs",
	docs: {
		postprocess: {
			includeProcessedMarkdown: { output: "function" },
		},
	},
});

export default defineConfig({
	plugins: [lastModified()],
	mdxOptions: {
		remarkPlugins: [remarkSteps],
	},
});
