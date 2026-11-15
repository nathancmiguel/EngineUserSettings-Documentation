import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { seo } from "@/lib/seo";
import {
	appDescription,
	appName,
	latestRelease,
	links,
	siteUrl,
} from "@/lib/shared";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "SoftwareApplication",
	name: appName,
	description: appDescription,
	applicationCategory: "DeveloperApplication",
	operatingSystem: "Windows",
	softwareVersion: latestRelease.version,
	url: siteUrl,
	image: `${siteUrl}/og.png`,
	downloadUrl: links.fab,
	author: { "@type": "Person", name: "Nathan Miguel", url: links.author },
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => {
		const defaults = seo();
		return {
			meta: [
				{ charSet: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "theme-color", content: "#0a0a0b" },
				{ name: "author", content: "Nathan Miguel" },
				{
					name: "keywords",
					content:
						"Unreal Engine, UE5, UE4, plugin, graphics settings, RHI, DirectX 12, Vulkan, shader model, Lumen, Nanite, MegaLights, anti-aliasing, shader compilation, Blueprint",
				},
				...defaults.meta,
			],
			links: [
				{ rel: "stylesheet", href: appCss },
				{ rel: "icon", href: "/favicon.ico", sizes: "any" },
				{ rel: "icon", type: "image/png", href: "/favicon.png" },
				{ rel: "apple-touch-icon", href: "/favicon.png" },
				{ rel: "manifest", href: "/site.webmanifest" },
			],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify(jsonLd),
				},
			],
		};
	},
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-screen flex-col">
				<RootProvider>{children}</RootProvider>
				{import.meta.env.DEV && (
					<TanStackDevtools
						config={{ position: "bottom-right" }}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				)}
				<Scripts />
			</body>
		</html>
	);
}
