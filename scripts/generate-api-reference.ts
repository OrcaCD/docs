import { isAbsolute, relative, resolve, sep } from "node:path";
import { generateFiles, type Document } from "fumadocs-openapi";
import { createOrcaOpenAPI } from "../src/lib/openapi.ts";

const mainSpecUrl = "https://raw.githubusercontent.com/OrcaCD/orca-cd/main/backend/openapi.json";
const output = resolve("content/docs/api-reference");

async function downloadSpec(): Promise<Document> {
	const override = process.env.OPENAPI_URL;
	const fallback = process.env.OPENAPI_FALLBACK_URL;
	let url = override ?? mainSpecUrl;
	let response = await fetch(url);
	if (response.status === 404 && !override && fallback) {
		process.stderr.write(`OpenAPI spec is missing on main. Using ${fallback}\n`);
		url = fallback;
		response = await fetch(url);
	}
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
	const tags = (document.tags ??= []);
	const apiTokens = { name: "API tokens", "x-displayName": "API Tokens" };
	const apiTokensTag = tags.find((tag) => tag.name === apiTokens.name);
	if (apiTokensTag) {
		Object.assign(apiTokensTag, apiTokens);
	} else {
		tags.push(apiTokens);
	}

	await generateFiles({
		input: createOrcaOpenAPI(() => document),
		output,
		per: "operation",
		groupBy: "tag",
		includeDescription: true,
		meta: true,
		beforeWrite(files) {
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
					target === "index.mdx"
				) {
					throw new Error(`Invalid generated API page path: ${path}`);
				}
			}
		},
	});
	return document;
}

if (import.meta.main) {
	await generateApiReference();
}
