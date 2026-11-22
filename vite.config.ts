import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { globSync } from "node:fs";
import { sep } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import { generateApiReference } from "./scripts/generate-api-reference.ts";

function collectLlmDocPages(baseDir: string): string[] {
	const pages: string[] = [];

	for (const mdxPath of globSync("**/*.mdx", { cwd: baseDir })) {
		const normalizedPath = mdxPath.split(sep).join("/");
		let docPath = normalizedPath.slice(0, -".mdx".length);

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

function getLlmDocPages() {
	const docsDir = fileURLToPath(new URL("./content/docs", import.meta.url));
	return [...new Set(collectLlmDocPages(docsDir))].sort((a, b) => a.localeCompare(b));
}

export default defineConfig(async ({ isPreview }) => ({
	// Generate the MDX once and use the same spec across build environments.
	builder: { sharedConfigBuild: true },
	define: isPreview
		? undefined
		: { __ORCA_OPENAPI_DOCUMENT__: JSON.stringify(await generateApiReference()) },
	server: {
		port: 3000,
	},
	plugins: [
		mdx(await import("./source.config.ts")),
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
					path: "/docs/brand",
				},
				{
					path: "/docs/demo",
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
				{
					path: "/sitemap.xml",
				},
				...getLlmDocPages().map((path) => ({ path })),
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
}));
