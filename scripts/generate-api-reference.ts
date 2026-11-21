import { writeFile } from "node:fs/promises";
import { generateFiles } from "fumadocs-openapi";
import { openapi } from "../src/lib/openapi.ts";

// The docs always show the API of the main branch
const specUrl =
	process.env.OPENAPI_URL ??
	"https://raw.githubusercontent.com/OrcaCD/orca-cd/main/backend/openapi.json";

const response = await fetch(specUrl);
if (!response.ok) {
	throw new Error(`Failed to download the OpenAPI spec from ${specUrl}: ${response.status}`);
}
await writeFile("openapi.json", await response.text());

await generateFiles({
	input: openapi,
	output: "./content/docs/api-reference",
	per: "operation",
	groupBy: "tag",
	includeDescription: true,
	meta: true,
	// The meta.json of the folder itself is committed, to add the overview page
	beforeWrite(files) {
		const index = files.findIndex((file) => file.path === "meta.json");
		if (index !== -1) {
			files.splice(index, 1);
		}
	},
});
