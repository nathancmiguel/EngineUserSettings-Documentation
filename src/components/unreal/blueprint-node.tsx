import { CheckIcon, ChevronDownIcon, CopyIcon } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { describePinType, type NodePin, PinIcon, pinColors } from "./pins";

export type NodeKind = "function" | "pure" | "event" | "bind";

const headerStyles: Record<NodeKind, string> = {
	function: "from-[#2b5f9e] via-[#2b5f9e]/70",
	pure: "from-[#4f8a2b] via-[#4f8a2b]/70",
	event: "from-[#8c1d1d] via-[#8c1d1d]/70",
	bind: "from-[#2b5f9e] via-[#2b5f9e]/70",
};

/* -------------------------------------------------------------------------- */
/*                                   Graph                                    */
/* -------------------------------------------------------------------------- */

interface BlueprintGraphProps {
	children: ReactNode;
	/** Text copied by the copy button, usually the node name. */
	copyText?: string;
	label?: string;
	className?: string;
}

/** Dark, gridded canvas that mimics the Blueprint editor background. */
export function BlueprintGraph({
	children,
	copyText,
	label,
	className,
}: BlueprintGraphProps) {
	return (
		<figure
			className={cn(
				"not-prose group/graph relative my-6 overflow-x-auto rounded-xl border border-white/10 bg-[#262626] p-6 shadow-inner",
				"bg-[linear-gradient(rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.35)_1px,transparent_1px),linear-gradient(rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.18)_1px,transparent_1px)]",
				"bg-[size:128px_128px,128px_128px,16px_16px,16px_16px]",
				className,
			)}
		>
			{label && <figcaption className="sr-only">{label}</figcaption>}
			{copyText && <CopyNameButton text={copyText} />}
			<div className="flex flex-wrap items-start gap-6">{children}</div>
		</figure>
	);
}

function CopyNameButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			aria-label={`Copy node name "${text}"`}
			title="Copy node name to search it in the Blueprint editor"
			className="absolute top-2 right-2 text-white/50 opacity-0 transition-opacity group-hover/graph:opacity-100 hover:bg-white/10 hover:text-white focus-visible:opacity-100"
			onClick={() => {
				void navigator.clipboard.writeText(text).then(() => {
					setCopied(true);
					setTimeout(() => setCopied(false), 1500);
				});
			}}
		>
			{copied ? <CheckIcon /> : <CopyIcon />}
		</Button>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    Node                                    */
/* -------------------------------------------------------------------------- */

interface BlueprintNodeProps {
	kind: NodeKind;
	title: string;
	subtitle?: string;
	icon?: ReactNode;
	headerAccessory?: ReactNode;
	inputs?: NodePin[];
	outputs?: NodePin[];
}

export function BlueprintNode({
	kind,
	title,
	subtitle,
	icon,
	headerAccessory,
	inputs = [],
	outputs = [],
}: BlueprintNodeProps) {
	const rows = Math.max(inputs.length, outputs.length);

	return (
		<div className="inline-flex min-w-44 flex-col overflow-hidden rounded-lg border border-black/80 bg-[#0f0f0f]/95 font-sans text-white shadow-[0_6px_18px_rgba(0,0,0,0.65)] ring-1 ring-white/5">
			<div
				className={cn(
					"flex items-start gap-2 bg-gradient-to-r to-transparent px-3 py-1.5",
					headerStyles[kind],
				)}
			>
				{icon}
				<div className="flex min-w-0 flex-col pr-4">
					<span className="text-[13px] leading-5 font-bold [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
						{title}
					</span>
					{subtitle && (
						<span className="text-[11px] leading-4 text-white/60 italic">
							{subtitle}
						</span>
					)}
				</div>
				{headerAccessory && (
					<div className="ml-auto self-center">{headerAccessory}</div>
				)}
			</div>

			{rows > 0 && (
				<div className="grid grid-cols-[auto_auto] gap-x-8 px-2 py-2.5">
					<div className="flex flex-col gap-2">
						{inputs.map((pin, index) => (
							<PinRow
								key={`in-${pin.name ?? ""}-${index}`}
								pin={pin}
								side="input"
							/>
						))}
					</div>
					<div className="flex flex-col items-end gap-2">
						{outputs.map((pin, index) => (
							<PinRow
								key={`out-${pin.name ?? ""}-${index}`}
								pin={pin}
								side="output"
							/>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

function PinRow({ pin, side }: { pin: NodePin; side: "input" | "output" }) {
	return (
		<div
			className={cn(
				"flex min-h-5 items-center gap-1.5 text-xs",
				side === "output" && "flex-row-reverse",
			)}
		>
			<PinIcon pin={pin} />
			{pin.name && <span className="text-white/90">{pin.name}</span>}
			{side === "input" && pin.defaultValue !== undefined && (
				<DefaultValue pin={pin} />
			)}
		</div>
	);
}

function DefaultValue({ pin }: { pin: NodePin }) {
	const value = pin.defaultValue;

	if (pin.type === "bool") {
		return (
			<span
				className={cn(
					"ml-1 inline-flex size-3.5 items-center justify-center rounded-[3px] border border-white/30 bg-[#1a1a1a]",
				)}
			>
				{value === true && <CheckIcon className="size-3 text-white" />}
			</span>
		);
	}

	if (pin.type === "byte" || pin.type === "enum") {
		return (
			<span className="ml-1 inline-flex items-center gap-1 rounded-sm border border-white/15 bg-[#1a1a1a] px-1.5 py-0.5 text-[11px] text-white/85">
				{String(value)}
				<ChevronDownIcon className="size-3 text-white/50" />
			</span>
		);
	}

	return (
		<span
			className="ml-1 inline-flex min-w-8 rounded-sm border border-white/15 bg-[#1a1a1a] px-1.5 py-0.5 text-[11px] text-white/85"
			style={{ borderBottomColor: pinColors[pin.type] }}
		>
			{String(value)}
		</span>
	);
}

/* -------------------------------------------------------------------------- */
/*                                  Pin table                                 */
/* -------------------------------------------------------------------------- */

export function PinTable({
	inputs = [],
	outputs = [],
}: {
	inputs?: NodePin[];
	outputs?: NodePin[];
}) {
	const rows = [
		...inputs.map((pin) => ({ pin, direction: "Input" as const })),
		...outputs.map((pin) => ({ pin, direction: "Output" as const })),
	].filter(({ pin }) => pin.type !== "exec" && pin.name);

	if (rows.length === 0) return null;

	return (
		<div className="not-prose my-4 overflow-hidden rounded-xl border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/4">Pin</TableHead>
						<TableHead className="w-1/4">Type</TableHead>
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.map(({ pin, direction }) => (
						<TableRow key={`${direction}-${pin.name}`}>
							<TableCell className="font-medium">
								<span className="flex items-center gap-2">
									<PinIcon
										pin={pin}
										className="drop-shadow-[0_0_1px_rgba(0,0,0,0.9)]"
									/>
									{pin.name}
								</span>
								<span className="text-muted-foreground text-xs">
									{direction}
								</span>
							</TableCell>
							<TableCell>
								<code className="rounded bg-muted px-1.5 py-0.5 text-xs">
									{describePinType(pin)}
								</code>
							</TableCell>
							<TableCell className="whitespace-normal text-muted-foreground">
								{pin.description ?? "—"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
