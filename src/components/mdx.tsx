import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Step, Steps } from "fumadocs-ui/components/steps";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import {
	UEnum,
	UEVersion,
	UEvent,
	UFunction,
	UVar,
	UVariables,
} from "@/components/unreal";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		ImageZoom,
		Step,
		Steps,
		Tab,
		Tabs,
		UFunction,
		UEvent,
		UVar,
		UVariables,
		UEnum,
		UEVersion,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
