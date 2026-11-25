import { createOpenAPIPage } from "fumadocs-openapi/ui";

export const OpenAPIPage = createOpenAPIPage({
	// The hub doesn't allow requests from other origins, so requests from the docs would fail
	playground: { enabled: false },
});
