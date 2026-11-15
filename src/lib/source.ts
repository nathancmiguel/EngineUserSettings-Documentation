import { loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { docsRoute } from "./shared";

export const docs = defineDocs({
	dir: "content/docs",
	docs: {
		async: true,
	},
});

export const source = loader({
	baseUrl: docsRoute,
	source: docs.toFumadocsSource(),
});
