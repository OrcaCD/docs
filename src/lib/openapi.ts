import { createOpenAPI } from "fumadocs-openapi/server";

// Written by scripts/generate-api-reference.ts from the spec on the main branch of orca-cd
export const openapi = createOpenAPI({
	input: { orcacd: "./openapi.json" },
	// The pages load the document once through the docs route instead
	includeDocument: false,
});
