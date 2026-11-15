import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	EditOnGitHub,
} from "fumadocs-ui/layouts/docs/page";
import { Suspense, use } from "react";
import { useMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";
import { seo } from "@/lib/seo";
import { gitConfig } from "@/lib/shared";
import { docs, source } from "@/lib/source";

export const Route = createFileRoute("/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const data = await serverLoader({
			data: {
				slugs: params._splat?.split("/").filter(Boolean) ?? [],
			},
		});
		await docs.getPage(data.path)?.preload();
		return data;
	},
	head: ({ loaderData }) =>
		loaderData
			? seo({
					title: loaderData.title,
					description: loaderData.description,
					path: loaderData.url,
					type: "article",
				})
			: {},
});

const serverLoader = createServerFn({
	method: "GET",
})
	.validator((params: { slugs: string[] }) => params)
	.handler(async ({ data: { slugs } }) => {
		const page = source.getPage(slugs);
		if (!page) throw notFound();

		return {
			path: page.path,
			url: page.url,
			title: page.data.title,
			description: page.data.description,
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

function Content({ path }: { path: string }) {
	const page = docs.getPage(path);
	if (!page) throw new Error(`unknown page: ${path}`);

	const { toc } = use(page.load());
	const MDX = page.body;

	return (
		<DocsPage toc={toc}>
			<DocsTitle>{page.title}</DocsTitle>
			<DocsDescription>{page.description}</DocsDescription>
			<DocsBody>
				<MDX components={useMDXComponents()} />
			</DocsBody>
			<EditOnGitHub
				href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${path}`}
			/>
		</DocsPage>
	);
}

function Page() {
	const data = useFumadocsLoader(Route.useLoaderData());

	return (
		<DocsLayout {...baseOptions()} tree={data.pageTree}>
			<Suspense>
				<Content path={data.path} />
			</Suspense>
		</DocsLayout>
	);
}
