import { PathUtils } from "fumadocs-core/source";
import type { Document, HttpMethods, PathItemObject, ReferenceObject } from "fumadocs-openapi";
import { apiReferencePageOptions, openapi } from "@/lib/openapi";

async function loadApiPages() {
	const source = await openapi.staticSource({
		...apiReferencePageOptions,
		baseDir: "api-reference",
	});
	return new Map(
		source.files.flatMap((file) =>
			file.type === "page" ? [[PathUtils.slash(file.path), file.data] as const] : [],
		),
	);
}

let apiPages: ReturnType<typeof loadApiPages> | undefined;

export async function getApiMarkdown(pagePath: string) {
	const page = (await (apiPages ??= loadApiPages())).get(pagePath);
	if (!page) {
		throw new Error(`No OpenAPI operation found for ${pagePath}`);
	}

	const { bundled: document } = page.getSchema();
	const { operations = [], webhooks = [] } = page.getOpenAPIPageProps();
	return [
		...operations.map(({ path, method }) =>
			formatOperation(document, document.paths?.[path], path, method),
		),
		...webhooks.map(({ name, method }) =>
			formatOperation(document, document.webhooks?.[name], name, method, true),
		),
	].join("\n\n");
}

function formatOperation(
	document: Document,
	item: PathItemObject | ReferenceObject | undefined,
	path: string,
	method: HttpMethods,
	webhook = false,
) {
	const seen = new Set<string>();
	while (item?.$ref && !seen.has(item.$ref)) {
		seen.add(item.$ref);
		item = getPointer(document, item.$ref) as typeof item;
	}
	const pathItem = item as PathItemObject | undefined;
	const operation = pathItem?.[method];
	if (!operation) {
		throw new Error(`Missing OpenAPI operation ${method.toUpperCase()} ${path}`);
	}

	const { description, ...details } = operation;
	const security = webhook ? undefined : (operation.security ?? document.security);
	const contract = {
		servers: operation.servers ?? pathItem?.servers ?? document.servers,
		pathParameters: pathItem?.parameters,
		...details,
		security,
	};
	const securitySchemes = Object.fromEntries(
		Object.keys(document.components?.securitySchemes ?? {})
			.filter((name) => security?.some((requirement) => Object.hasOwn(requirement, name)))
			.map((name) => [name, document.components?.securitySchemes?.[name]]),
	);
	const references = new Map<string, unknown>();
	collectReferences(document, { contract, securitySchemes }, references);

	return [
		`${webhook ? "Webhook " : ""}\`${method.toUpperCase()} ${path}\``,
		description ?? pathItem?.description,
		jsonBlock(contract),
		Object.keys(securitySchemes).length && `## Security schemes\n\n${jsonBlock(securitySchemes)}`,
		references.size && `## Referenced definitions\n\n${jsonBlock(Object.fromEntries(references))}`,
	]
		.filter(Boolean)
		.join("\n\n");
}

function collectReferences(document: Document, value: unknown, references: Map<string, unknown>) {
	if (!value || typeof value !== "object") {
		return;
	}

	for (const [key, child] of Object.entries(value)) {
		if ((key === "$ref" || key === "$dynamicRef") && typeof child === "string") {
			if (references.has(child)) {
				continue;
			}
			const target = getPointer(document, child);
			if (target === undefined) {
				continue;
			}
			references.set(child, target);
			collectReferences(document, target, references);
		} else {
			collectReferences(document, child, references);
		}
	}
}

function getPointer(document: Document, reference: string): unknown {
	if (!reference.startsWith("#/")) {
		return undefined;
	}

	let value: unknown = document;
	for (const segment of decodeURIComponent(reference.slice(2)).split("/")) {
		const key = segment.replaceAll("~1", "/").replaceAll("~0", "~");
		if (!value || typeof value !== "object" || !Object.hasOwn(value, key)) {
			return undefined;
		}
		value = (value as Record<string, unknown>)[key];
	}
	return value;
}

function jsonBlock(value: unknown) {
	return `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;
}
