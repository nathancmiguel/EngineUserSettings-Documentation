export const appName = "Engine User Settings";
export const appTagline = "In-game graphics settings for Unreal Engine";
export const appDescription =
	"Engine User Settings is an Unreal Engine plugin that lets players change graphics API, shader model, upscaling (TSR, DLSS, FSR, XeSS), Lumen, shadows, post-processing, LOD, latency and more at runtime from Blueprints, with presets, profiles, Auto Configure and in-game shader pre-compilation.";

/**
 * Public URL of the deployed site, used for canonical links, Open Graph tags and the sitemap.
 * Override it with the `VITE_SITE_URL` environment variable.
 */
export const siteUrl = (
	import.meta.env.VITE_SITE_URL ??
	"https://engineusersettings-documentation.vercel.app"
).replace(/\/$/, "");

export const docsRoute = "/docs";

export const gitConfig = {
	user: "nathancmiguel",
	repo: "EngineUserSettings-Documentation",
	branch: "master",
};

export const links = {
	github: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	pluginRepo: "https://github.com/nathancmiguel/EngineUserSettings",
	issues: `https://github.com/${gitConfig.user}/${gitConfig.repo}/issues`,
	fab: "https://www.fab.com/listings/a3e48cd3-8b06-4121-8e97-0d17b60aca05",
	ue4: "https://1drv.ms/f/s!As665UQkWddtpBVB5vyecSvJ15zN?e=o5j3mH",
	discord: "https://discord.gg/DBNATxA6Jx",
	youtube: "https://www.youtube.com/watch?v=IVlGHYiMjxY",
	author: "https://nathan-miguel.vercel.app/",
};

/** Latest plugin release, keep in sync with `content/docs/changelog.mdx`. */
export const latestRelease = {
	version: "1.4.0",
	engine: "5.8",
	date: "2026-11-19",
};

export const supportedVersions = {
	ue4: "4.26 – 4.27",
	ue5: "5.1 – 5.8",
};
