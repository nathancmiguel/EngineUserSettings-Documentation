import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, links } from "./shared";

export function Logo() {
	return (
		<span className="flex items-center gap-2 font-semibold">
			<img
				src="/favicon.png"
				alt=""
				width={24}
				height={24}
				className="size-6 invert dark:invert-0"
			/>
			{appName}
		</span>
	);
}

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: <Logo />,
			url: "/",
		},
		githubUrl: links.github,
		links: [
			{ text: "Documentation", url: "/docs", active: "nested-url" },
			{ text: "Changelog", url: "/docs/changelog" },
			{ text: "Get on Fab", url: links.fab, external: true },
		],
	};
}
