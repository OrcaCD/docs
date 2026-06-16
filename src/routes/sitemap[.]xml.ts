import { source } from "@/lib/source";
import { createFileRoute } from "@tanstack/react-router";

const DEFAULT_SITE_URL = "https://orcacd.dev";
const DEFAULT_PRIORITY = 0.5;

// Static routes are included as-is; any entry here also overrides priority.
// Fumadocs pages not listed here get DEFAULT_PRIORITY.
const ROUTES = new Map([
	["/", 1.0],
	["/docs", 0.9],
]);

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET() {
				const baseUrl = (process.env.SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, "");

				const allUrls = new Set([...ROUTES.keys(), ...source.getPages().map((page) => page.url)]);

				const urls = [...allUrls]
					.map((url) => {
						const priority = (ROUTES.get(url) ?? DEFAULT_PRIORITY).toFixed(1);
						return `  <url><loc>${baseUrl}${url}</loc><priority>${priority}</priority></url>`;
					})
					.join("\n");

				const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

				return new Response(xml, {
					headers: { "Content-Type": "application/xml" },
				});
			},
		},
	},
});
