import { createFileRoute } from "@tanstack/react-router";
import { absoluteUrl } from "@/lib/seo";
import { source } from "@/lib/source";

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const urls = ["/", ...source.getPages().map((page) => page.url)];
				const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) =>
			`  <url><loc>${absoluteUrl(url)}</loc><changefreq>monthly</changefreq><priority>${url === "/" ? "1.0" : "0.7"}</priority></url>`,
	)
	.join("\n")}
</urlset>`;
				return new Response(body, {
					headers: { "Content-Type": "application/xml; charset=utf-8" },
				});
			},
		},
	},
});
