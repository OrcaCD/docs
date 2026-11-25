import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { FullSearchTrigger, SearchTrigger } from "fumadocs-ui/layouts/shared/slots/search-trigger";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	PageLastUpdate,
	MarkdownCopyButton,
	ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { apiReferenceUrl, baseOptions } from "@/lib/layout.shared";
import { getDocsNavigationTree, getPageMarkdownUrl, source } from "@/lib/source";
import { Suspense } from "react";
import type { Document } from "fumadocs-openapi";
import { OpenAPIPage } from "@/components/api-page";
import { openapi } from "@/lib/openapi";
import { AccountRecoveryTerminal } from "@/components/account-recovery-terminal";
import { Badge } from "@/components/badge";
import { Checklist, ChecklistItem } from "@/components/checklist";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { BookOpen, Braces } from "lucide-react";

const docsTabs = [
	{ title: "Documentation", url: "/docs", icon: <BookOpen className="size-full" /> },
	{ title: "API Reference", url: apiReferenceUrl, icon: <Braces className="size-full" /> },
];

export const Route = createFileRoute("/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await loader({ data: slugs });
		await clientLoader.preload(data.path);
		const openapiDocs = Object.fromEntries(
			await Promise.all(
				data.openapiDocuments.map(async (id) => [id, await loadOpenAPIDocument(id)]),
			),
		);
		return { ...data, openapiDocs };
	},
});

// The API reference pages share one document, so it's loaded once and kept for
// the next pages instead of being part of every page's data
const openapiDocuments = new Map<string, Promise<Document>>();

const getOpenAPIDocument = createServerFn({
	method: "GET",
})
	.validator((id: string) => id)
	.middleware([staticFunctionMiddleware])
	.handler(async ({ data: id }) => (await openapi.getSchema(id)).bundled);

async function loadOpenAPIDocument(id: string) {
	const cached = openapiDocuments.get(id);
	if (cached) {
		return cached;
	}

	const document = getOpenAPIDocument({ data: id });
	openapiDocuments.set(id, document);
	try {
		return await document;
	} catch (error) {
		openapiDocuments.delete(id);
		throw error;
	}
}

const loader = createServerFn({
	method: "GET",
})
	.validator((slugs: string[]) => slugs)
	.middleware([staticFunctionMiddleware])
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) {
			throw notFound();
		}

		return {
			path: page.path,
			markdownUrl: getPageMarkdownUrl(page).url,
			pageTree: await source.serializePageTree(getDocsNavigationTree()),
			// The IDs of the OpenAPI documents an API reference page shows
			openapiDocuments: (page.data._openapi?.preload as string[] | undefined) ?? [],
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component(
		{ toc, frontmatter, default: MDX, lastModified }, // you can define props for the component
		{
			markdownUrl,
			path,
			openapiDocs,
		}: {
			markdownUrl: string;
			path: string;
			openapiDocs: Record<string, Document>;
		},
	) {
		return (
			<DocsPage
				toc={toc}
				full={frontmatter.full}
				tableOfContent={{
					style: "clerk",
				}}
			>
				<DocsTitle>{frontmatter.title}</DocsTitle>
				<DocsDescription>{frontmatter.description}</DocsDescription>
				<div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
					<MarkdownCopyButton markdownUrl={markdownUrl} />
					<ViewOptionsPopover
						markdownUrl={markdownUrl}
						githubUrl={
							Object.keys(openapiDocs).length > 0
								? undefined
								: `https://github.com/OrcaCD/docs/blob/main/content/docs/${path}`
						}
					/>
				</div>
				<DocsBody>
					<MDX
						components={{
							...defaultMdxComponents,
							AccountRecoveryTerminal,
							Accordion,
							Accordions,
							Badge,
							Checklist,
							ChecklistItem,
							OpenAPIPage: (props: Parameters<typeof OpenAPIPage>[0]) => (
								<OpenAPIPage {...props} preloaded={{ docs: openapiDocs }} />
							),
							img: (props) => <ImageZoom {...(props as any)} />,
						}}
					/>
				</DocsBody>
				{lastModified && <PageLastUpdate date={lastModified} />}
			</DocsPage>
		);
	},
});

function Page() {
	const { path, pageTree, markdownUrl, openapiDocs } = useFumadocsLoader(Route.useLoaderData());

	return (
		<DocsLayout
			{...baseOptions()}
			tree={pageTree}
			tabs={docsTabs}
			githubUrl="https://github.com/OrcaCD/orca-cd"
			slots={{ searchTrigger: { sm: SearchTrigger, full: () => null } }}
			sidebar={{ banner: <FullSearchTrigger hideIfDisabled /> }}
		>
			<Suspense>{clientLoader.useContent(path, { markdownUrl, path, openapiDocs })}</Suspense>
		</DocsLayout>
	);
}
