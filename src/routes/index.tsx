import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import {
	ArrowRightIcon,
	BookOpenIcon,
	CpuIcon,
	GaugeIcon,
	MessageCircleIcon,
	MonitorIcon,
	ShoppingBagIcon,
	SparklesIcon,
	SunIcon,
	ZapIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BlueprintNode } from "@/components/unreal";
import { baseOptions } from "@/lib/layout.shared";
import { seo } from "@/lib/seo";
import { appName, latestRelease, links, supportedVersions } from "@/lib/shared";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => seo({ path: "/" }),
});

const features: {
	icon: ReactNode;
	title: string;
	description: string;
	splat: string;
	hash?: string;
}[] = [
	{
		icon: <MonitorIcon />,
		title: "Upscaling & resolution",
		description:
			"TSR, DLSS, FSR, XeSS, TAA or MSAA, internal resolution presets and dynamic resolution.",
		splat: "Nodes/upscaling",
	},
	{
		icon: <SunIcon />,
		title: "Lighting & shadows",
		description:
			"Lumen, SSGI, reflections, Virtual Shadow Maps, MegaLights, Nanite and shadow quality.",
		splat: "Nodes/render",
	},
	{
		icon: <SparklesIcon />,
		title: "Post FX, effects & LOD",
		description:
			"Volumetric fog, depth of field, bloom, Niagara quality, view distance and mesh LODs.",
		splat: "Nodes/post-processing",
	},
	{
		icon: <GaugeIcon />,
		title: "Presets & Auto Configure",
		description:
			"Performance → Ultra presets, named profiles and settings picked from the player's GPU.",
		splat: "Nodes/presets",
	},
	{
		icon: <CpuIcon />,
		title: "Graphics API & shader model",
		description:
			"DirectX 12, DirectX 11 or Vulkan and SM6, SM5 or Performance Mode, validated against the GPU.",
		splat: "Nodes/rhi",
	},
	{
		icon: <ZapIcon />,
		title: "Shader & PSO pre-compilation",
		description:
			"Warm up materials, Niagara and PSOs behind a loading screen to stop hitches.",
		splat: "Nodes/shader-compiler",
	},
];

const releaseHighlights = [
	"Everything in one Engine User Settings Subsystem",
	"Upscalers: TSR, DLSS, FSR, XeSS + dynamic resolution",
	"Shadows, Lumen, post FX, LOD and NVIDIA Reflex",
	"Presets, profiles and Auto Configure",
	"Example map with a full settings menu",
];

function Home() {
	return (
		<HomeLayout {...baseOptions()}>
			<main className="flex flex-1 flex-col">
				<Hero />
				<Features />
				<Release />
				<CallToAction />
			</main>
		</HomeLayout>
	);
}

function Hero() {
	return (
		<section className="relative overflow-hidden border-b">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
			/>

			<div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_1fr] lg:py-28">
				<div className="flex flex-col items-start gap-6">
					<Badge
						variant="outline"
						className="h-7 gap-2 px-3 backdrop-blur"
						render={<Link to="/docs/$" params={{ _splat: "changelog" }} />}
					>
						<span className="size-1.5 rounded-full bg-primary" />v
						{latestRelease.version} · Unreal Engine {latestRelease.engine}
						<ArrowRightIcon />
					</Badge>

					<h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
						Let players tune <span className="text-primary">Unreal Engine</span>{" "}
						graphics in game
					</h1>

					<p className="max-w-xl text-lg text-muted-foreground text-pretty">
						{appName} exposes RHI, shader model, Lumen, Nanite, anti-aliasing
						and post-processing settings as Blueprint nodes — and saves them for
						the next launch.
					</p>

					<div className="flex flex-wrap gap-3">
						<Button
							size="lg"
							nativeButton={false}
							render={<Link to="/docs/$" params={{ _splat: "" }} />}
						>
							<BookOpenIcon data-icon="inline-start" />
							Read the docs
						</Button>
						<Button
							size="lg"
							variant="outline"
							nativeButton={false}
							render={<a href={links.fab} target="_blank" rel="noreferrer" />}
						>
							<ShoppingBagIcon data-icon="inline-start" />
							Get it on Fab
						</Button>
						<Button
							size="lg"
							variant="ghost"
							nativeButton={false}
							render={
								<a href={links.discord} target="_blank" rel="noreferrer" />
							}
						>
							<MessageCircleIcon data-icon="inline-start" />
							Discord
						</Button>
					</div>

					<dl className="flex flex-wrap gap-x-8 gap-y-2 pt-2 text-sm">
						<div>
							<dt className="text-muted-foreground">Unreal Engine 5</dt>
							<dd className="font-semibold">{supportedVersions.ue5}</dd>
						</div>
						<div>
							<dt className="text-muted-foreground">Unreal Engine 4</dt>
							<dd className="font-semibold">{supportedVersions.ue4}</dd>
						</div>
						<div>
							<dt className="text-muted-foreground">Platform</dt>
							<dd className="font-semibold">Windows</dd>
						</div>
					</dl>
				</div>

				<HeroGraph />
			</div>
		</section>
	);
}

function HeroGraph() {
	return (
		<div
			role="img"
			aria-label="Blueprint nodes Set Upscaler, Set Global Illumination and Apply Graphics Preset"
			className="relative rounded-2xl border border-white/10 bg-[#262626] bg-[linear-gradient(rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.18)_1px,transparent_1px)] bg-[size:128px_128px,128px_128px,16px_16px,16px_16px] p-6 shadow-2xl"
		>
			<div className="flex flex-col gap-6">
				<BlueprintNode
					kind="function"
					title="Set Upscaler"
					subtitle="Target is Engine User Settings Subsystem"
					icon={<FunctionGlyph />}
					inputs={[
						{ type: "exec" },
						{ name: "Target", type: "object" },
						{
							name: "Upscaler",
							type: "enum",
							defaultValue: "TSR (Temporal Super Resolution)",
						},
					]}
					outputs={[{ type: "exec" }, { name: "Return Value", type: "bool" }]}
				/>
				<div className="self-end">
					<BlueprintNode
						kind="function"
						title="Set Global Illumination"
						subtitle="Target is Engine User Settings Subsystem"
						icon={<FunctionGlyph />}
						inputs={[
							{ type: "exec" },
							{ name: "Method", type: "enum", defaultValue: "Lumen" },
						]}
						outputs={[{ type: "exec" }]}
					/>
				</div>
				<BlueprintNode
					kind="function"
					title="Apply Graphics Preset"
					subtitle="Target is Engine User Settings Subsystem"
					icon={<FunctionGlyph />}
					inputs={[
						{ type: "exec" },
						{ name: "Preset", type: "enum", defaultValue: "Ultra" },
					]}
					outputs={[{ type: "exec" }]}
				/>
			</div>
		</div>
	);
}

function FunctionGlyph({ pure = false }: { pure?: boolean }) {
	return (
		<span
			aria-hidden
			className={`font-serif text-lg leading-5 font-bold italic [text-shadow:0_1px_2px_black] ${pure ? "text-lime-300" : "text-sky-300"}`}
		>
			f
		</span>
	);
}

function Features() {
	return (
		<section className="mx-auto w-full max-w-6xl px-6 py-20">
			<div className="mb-10 flex max-w-2xl flex-col gap-3">
				<h2 className="font-heading text-3xl font-bold tracking-tight">
					Every setting players ask for
				</h2>
				<p className="text-muted-foreground">
					Build a complete graphics menu without touching C++. Each feature is a
					Blueprint node with a matching getter, so your UI always reflects the
					current state.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{features.map((feature) => (
					<Link
						key={feature.title}
						to="/docs/$"
						params={{ _splat: feature.splat }}
						hash={feature.hash}
						className="group"
					>
						<Card className="h-full transition-colors group-hover:bg-muted/40 group-hover:ring-primary/40">
							<CardHeader>
								<div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary [&_svg]:size-5">
									{feature.icon}
								</div>
								<CardTitle className="flex items-center gap-2">
									{feature.title}
									<ArrowRightIcon className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
								</CardTitle>
								<CardDescription>{feature.description}</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>
		</section>
	);
}

function Release() {
	return (
		<section className="border-y bg-muted/30">
			<div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-20 lg:grid-cols-2">
				<Card>
					<CardHeader>
						<Badge variant="secondary">Latest release</Badge>
						<CardTitle className="text-2xl">
							v{latestRelease.version} — Unreal Engine {latestRelease.engine}
						</CardTitle>
						<CardDescription>
							Released{" "}
							<time dateTime={latestRelease.date}>
								{new Date(`${latestRelease.date}T12:00:00Z`).toLocaleDateString(
									"en-US",
									{ year: "numeric", month: "long", day: "numeric" },
								)}
							</time>
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="flex flex-col gap-2 text-sm">
							{releaseHighlights.map((item) => (
								<li key={item} className="flex items-start gap-2">
									<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
									{item}
								</li>
							))}
						</ul>
					</CardContent>
					<CardFooter>
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/docs/$" params={{ _splat: "changelog" }} />}
						>
							Full changelog
							<ArrowRightIcon data-icon="inline-end" />
						</Button>
					</CardFooter>
				</Card>

				<Card>
					<CardHeader>
						<Badge variant="secondary">Get started</Badge>
						<CardTitle className="text-2xl">
							Up and running in minutes
						</CardTitle>
						<CardDescription>
							Three steps from install to a working graphics menu.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ol className="flex flex-col gap-4 text-sm">
							{[
								["Install", "Add the plugin from Fab and enable it."],
								[
									"Target RHIs",
									"Tick DirectX 12, DirectX 11 and Vulkan in Project Settings.",
								],
								[
									"Wire your menu",
									"Call the Set nodes from your UI and the Get nodes to show the current state.",
								],
							].map(([title, text], index) => (
								<li key={title} className="flex gap-3">
									<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
										{index + 1}
									</span>
									<span>
										<span className="font-medium">{title}</span>
										<span className="block text-muted-foreground">{text}</span>
									</span>
								</li>
							))}
						</ol>
					</CardContent>
					<CardFooter>
						<Button
							variant="outline"
							nativeButton={false}
							render={<Link to="/docs/$" params={{ _splat: "setup" }} />}
						>
							Setup guide
							<ArrowRightIcon data-icon="inline-end" />
						</Button>
					</CardFooter>
				</Card>
			</div>
		</section>
	);
}

function CallToAction() {
	return (
		<section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-6 py-20 text-center">
			<h2 className="font-heading text-3xl font-bold tracking-tight text-balance">
				Ship a graphics menu your players will actually use
			</h2>
			<p className="max-w-xl text-muted-foreground">
				Free for Unreal Engine 4. Available on Fab for Unreal Engine 5.
			</p>
			<div className="flex flex-wrap justify-center gap-3">
				<Button
					size="lg"
					nativeButton={false}
					render={<a href={links.fab} target="_blank" rel="noreferrer" />}
				>
					Get the UE5 plugin
				</Button>
				<Button
					size="lg"
					variant="outline"
					nativeButton={false}
					render={<a href={links.ue4} target="_blank" rel="noreferrer" />}
				>
					Download for UE4
				</Button>
			</div>
			<Separator className="mt-12" />
			<footer className="flex w-full flex-col items-center justify-between gap-2 text-sm text-muted-foreground sm:flex-row">
				<span>
					© {new Date().getFullYear()}{" "}
					<a
						href={links.author}
						className="hover:text-foreground"
						target="_blank"
						rel="noreferrer"
					>
						Nathan Miguel
					</a>
				</span>
				<nav className="flex gap-4">
					<a
						href={links.github}
						className="hover:text-foreground"
						target="_blank"
						rel="noreferrer"
					>
						GitHub
					</a>
					<a
						href={links.youtube}
						className="hover:text-foreground"
						target="_blank"
						rel="noreferrer"
					>
						Video
					</a>
					<a
						href={links.issues}
						className="hover:text-foreground"
						target="_blank"
						rel="noreferrer"
					>
						Report an issue
					</a>
				</nav>
			</footer>
		</section>
	);
}
