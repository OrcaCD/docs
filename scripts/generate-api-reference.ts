import { lstat, readdir, rm } from "node:fs/promises";
import { isAbsolute, join, relative, resolve, sep } from "node:path";
import { generateFiles, type Document } from "fumadocs-openapi";
import { apiReferencePageOptions, createOrcaOpenAPI } from "../src/lib/openapi.ts";

const mainSpecUrl = "https://raw.githubusercontent.com/OrcaCD/orca-cd/main/backend/openapi.json";
const output = resolve("content/docs/api-reference");
const checkedInFiles = new Set(["index.mdx", "meta.json"]);

async function downloadSpec(): Promise<Document> {
	const url = process.env.OPENAPI_URL ?? mainSpecUrl;
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to download the OpenAPI spec from ${url}: ${response.status}`);
	}

	const document: unknown = await response.json();
	if (
		!isObject(document) ||
		typeof document.openapi !== "string" ||
		!/^3\.[12]\.\d+$/.test(document.openapi) ||
		!isObject(document.info) ||
		typeof document.info.title !== "string" ||
		typeof document.info.version !== "string" ||
		!isObject(document.paths)
	) {
		throw new Error(`Expected an OpenAPI 3.1 or 3.2 JSON document from ${url}`);
	}

	checkReferences(document);
	return document as unknown as Document;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkReferences(value: unknown): void {
	if (Array.isArray(value)) {
		value.forEach(checkReferences);
	} else if (isObject(value)) {
		for (const [key, child] of Object.entries(value)) {
			if (
				(key === "$ref" || key === "$dynamicRef") &&
				(typeof child !== "string" || !child.startsWith("#"))
			) {
				throw new Error("The OpenAPI spec must use only internal references");
			}
			checkReferences(child);
		}
	}
}

export async function generateApiReference(): Promise<Document> {
	const document = await downloadSpec();
	for (const server of document.servers ?? []) {
		if (server.url === "/api/v1") {
			server.url = "https://orca.example.com/api/v1";
		}
	}

	const tags = (document.tags ??= []);
	const apiTokens = { name: "API tokens", "x-displayName": "API Tokens" };
	const apiTokensTag = tags.find((tag) => tag.name === apiTokens.name);
	if (apiTokensTag) {
		Object.assign(apiTokensTag, apiTokens);
	} else {
		tags.push(apiTokens);
	}

	await generateFiles({
		...apiReferencePageOptions,
		input: createOrcaOpenAPI(() => document),
		output,
		includeDescription: true,
		meta: true,
		async beforeWrite(files) {
			// Keep the checked-in navigation metadata and overview.
			const index = files.findIndex((file) => file.path === "meta.json");
			if (index !== -1) {
				files.splice(index, 1);
			}
			for (const { path } of files) {
				const target = relative(output, resolve(output, path));
				if (
					!target ||
					target === ".." ||
					target.startsWith(`..${sep}`) ||
					isAbsolute(target) ||
					checkedInFiles.has(target)
				) {
					throw new Error(`Invalid generated API page path: ${path}`);
				}
			}

			if (!(await lstat(output)).isDirectory()) {
				throw new Error(`Expected an API reference directory at ${output}`);
			}
			const entries = await readdir(output);
			await Promise.all(
				entries
					.filter((entry) => !checkedInFiles.has(entry))
					.map((entry) => rm(join(output, entry), { recursive: true, force: true })),
			);
		},
	});
	return document;
}

if (import.meta.main) {
	await generateApiReference();
}
