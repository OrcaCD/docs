import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
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
import { baseOptions } from "@/lib/layout.shared";
import { getPageMarkdownUrl, source } from "@/lib/source";
import { Suspense } from "react";

export const Route = createFileRoute("/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await loader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
});

const loader = createServerFn({
	method: "GET",
})
	.inputValidator((slugs: string[]) => slugs)
	.middleware([staticFunctionMiddleware])
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) {
			throw notFound();
		}

		return {
			path: page.path,
			markdownUrl: getPageMarkdownUrl(page).url,
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component(
		{ toc, frontmatter, default: MDX, lastModified }, // you can define props for the component
		{
			markdownUrl,
			path,
		}: {
			markdownUrl: string;
			path: string;
		},
	) {
		return (
			<DocsPage toc={toc}>
				<DocsTitle>{frontmatter.title}</DocsTitle>
				<DocsDescription>{frontmatter.description}</DocsDescription>
				<div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
					<MarkdownCopyButton markdownUrl={markdownUrl} />
					<ViewOptionsPopover
						markdownUrl={markdownUrl}
						githubUrl={`https://github.com/OrcaCD/docs/blob/main/content/docs/${path}`}
					/>
				</div>
				<DocsBody>
					<MDX
						components={{
							...defaultMdxComponents,
						}}
					/>
				</DocsBody>
				{lastModified && <PageLastUpdate date={lastModified} />}
			</DocsPage>
		);
	},
});

function Page() {
	const { path, pageTree, markdownUrl } = useFumadocsLoader(Route.useLoaderData());

	return (
		<DocsLayout {...baseOptions()} tree={pageTree}>
			<Suspense>{clientLoader.useContent(path, { markdownUrl, path })}</Suspense>
		</DocsLayout>
	);
}
