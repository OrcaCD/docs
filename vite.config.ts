import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { readdirSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { defineConfig } from "vite";

function collectLlmDocPages(dir: string, baseDir = dir): string[] {
	const pages: string[] = [];

	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const absolutePath = resolve(dir, entry.name);

		if (entry.isDirectory()) {
			pages.push(...collectLlmDocPages(absolutePath, baseDir));
			continue;
		}

		if (!entry.isFile() || !entry.name.endsWith(".mdx")) {
			continue;
		}

		const relativePath = relative(baseDir, absolutePath).split(sep).join("/");
		let docPath = relativePath.slice(0, -".mdx".length);

		if (docPath === "index") {
			docPath = "";
		} else if (docPath.endsWith("/index")) {
			docPath = docPath.slice(0, -"/index".length);
		}

		const prefix = docPath ? `${docPath}/` : "";
		pages.push(`/llms.mdx/docs/${prefix}content.md`);
	}

	return pages;
}

const llmDocPages = [...new Set(collectLlmDocPages(resolve(process.cwd(), "content/docs")))].sort(
	(a, b) => a.localeCompare(b),
);

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		mdx(await import("./source.config")),
		tailwindcss(),
		tanstackStart({
			spa: {
				enabled: true,
				prerender: {
					enabled: true,
					outputPath: "index.html",
					crawlLinks: true,
				},
			},

			pages: [
				{
					path: "/docs",
				},
				{
					path: "/api/search",
				},
				{
					path: "/llms-full.txt",
				},
				{
					path: "/llms.txt",
				},
				...llmDocPages.map((path) => ({ path })),
			],
		}),
		react(),
	],
	resolve: {
		tsconfigPaths: true,
		alias: {
			tslib: "tslib/tslib.es6.js",
		},
	},
});
