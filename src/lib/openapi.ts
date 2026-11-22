import type { Document } from "fumadocs-openapi";
import { createOpenAPI } from "fumadocs-openapi/server";

declare const __ORCA_OPENAPI_DOCUMENT__: Document;

export function createOrcaOpenAPI(document: () => Document) {
	return createOpenAPI({
		input: { orcacd: document },
		// The pages load the document once through the docs route.
		includeDocument: false,
	});
}

export const openapi = createOrcaOpenAPI(() => __ORCA_OPENAPI_DOCUMENT__);
