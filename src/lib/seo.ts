import { appDescription, appName, siteUrl } from "./shared";

interface SeoOptions {
	title?: string;
	description?: string;
	/** Path of the page, e.g. `/docs/setup`. */
	path?: string;
	image?: string;
	type?: "website" | "article";
}

export const defaultOgImage = "/og.png";

export function absoluteUrl(path = "/") {
	return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Builds the `meta` and `links` arrays for a TanStack Router `head()` function. */
export function seo({
	title,
	description = appDescription,
	path = "/",
	image = defaultOgImage,
	type = "website",
}: SeoOptions = {}) {
	const fullTitle = title
		? `${title} | ${appName}`
		: `${appName} – Unreal Engine plugin`;
	const url = absoluteUrl(path);
	const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);

	return {
		meta: [
			{ title: fullTitle },
			{ name: "description", content: description },
			{ property: "og:type", content: type },
			{ property: "og:site_name", content: appName },
			{ property: "og:title", content: fullTitle },
			{ property: "og:description", content: description },
			{ property: "og:url", content: url },
			{ property: "og:image", content: imageUrl },
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: fullTitle },
			{ name: "twitter:description", content: description },
			{ name: "twitter:image", content: imageUrl },
		],
		links: [{ rel: "canonical", href: url }],
	};
}
