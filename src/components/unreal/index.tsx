import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { BlueprintGraph, BlueprintNode, PinTable } from "./blueprint-node";
import { type NodePin, PinIcon, pinColors } from "./pins";

export { BlueprintGraph, BlueprintNode, PinTable } from "./blueprint-node";
export type { NodePin, PinContainer, PinType } from "./pins";

const execPin: NodePin = { type: "exec" };

function FunctionIcon({ pure }: { pure: boolean }) {
	return (
		<span
			aria-hidden
			className={
				pure
					? "font-serif text-lg leading-5 font-bold text-lime-300 italic [text-shadow:0_1px_2px_black]"
					: "font-serif text-lg leading-5 font-bold text-sky-300 italic [text-shadow:0_1px_2px_black]"
			}
		>
			f
		</span>
	);
}

function EventIcon() {
	return (
		<svg
			aria-hidden
			width="16"
			height="16"
			viewBox="0 0 16 16"
			className="mt-0.5"
		>
			<path
				d="M8 1.5 14.5 8 8 14.5 1.5 8z"
				fill="#ffd2d2"
				stroke="#3a0000"
				strokeWidth="1"
			/>
			<path d="M8 5 11 8 8 11 5 8z" fill="#8c1d1d" />
		</svg>
	);
}

function BindIcon() {
	return (
		<svg
			aria-hidden
			width="16"
			height="16"
			viewBox="0 0 16 16"
			className="mt-0.5"
		>
			<rect
				x="1.5"
				y="4"
				width="7"
				height="8"
				rx="1.5"
				fill="none"
				stroke="#cde7ff"
				strokeWidth="1.5"
			/>
			<rect
				x="7.5"
				y="4"
				width="7"
				height="8"
				rx="1.5"
				fill="none"
				stroke="#cde7ff"
				strokeWidth="1.5"
			/>
		</svg>
	);
}

/* -------------------------------------------------------------------------- */
/*                                  UFunction                                 */
/* -------------------------------------------------------------------------- */

export interface UFunctionProps {
	name: string;
	/** Shown as "Target is …" under the title. */
	target?: string;
	/** Pure functions have no exec pins and a green header. */
	pure?: boolean;
	inputs?: NodePin[];
	outputs?: NodePin[];
	/** Render a parameter table under the node. Defaults to `true` when any pin has a description. */
	showTable?: boolean;
}

export function UFunction({
	name,
	target,
	pure = false,
	inputs = [],
	outputs = [],
	showTable,
}: UFunctionProps) {
	const nodeInputs = pure ? inputs : [execPin, ...inputs];
	const nodeOutputs = pure ? outputs : [execPin, ...outputs];
	const hasDescriptions = [...inputs, ...outputs].some(
		(pin) => pin.description,
	);

	return (
		<>
			<BlueprintGraph
				copyText={name}
				label={`${pure ? "Pure function" : "Function"} node: ${name}`}
			>
				<BlueprintNode
					kind={pure ? "pure" : "function"}
					title={name}
					subtitle={target ? `Target is ${target}` : undefined}
					icon={<FunctionIcon pure={pure} />}
					inputs={nodeInputs}
					outputs={nodeOutputs}
				/>
			</BlueprintGraph>
			{(showTable ?? hasDescriptions) && (
				<PinTable inputs={inputs} outputs={outputs} />
			)}
		</>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   UEvent                                   */
/* -------------------------------------------------------------------------- */

export interface UEventProps {
	name: string;
	/** Also render the "Bind Event to …" node next to the event. */
	bind?: boolean;
	/** Data pins of the event (the exec output is added automatically). */
	outputs?: NodePin[];
	showTable?: boolean;
}

export function UEvent({
	name,
	bind = false,
	outputs = [],
	showTable,
}: UEventProps) {
	const hasDescriptions = outputs.some((pin) => pin.description);

	return (
		<>
			<BlueprintGraph copyText={name} label={`Event node: ${name}`}>
				{bind && (
					<BlueprintNode
						kind="bind"
						title={`Bind Event to ${name}`}
						icon={<BindIcon />}
						inputs={[
							execPin,
							{ name: "Target", type: "object" },
							{ name: "Event", type: "delegate" },
						]}
						outputs={[execPin]}
					/>
				)}
				<BlueprintNode
					kind="event"
					title={name}
					subtitle="Custom Event"
					icon={<EventIcon />}
					headerAccessory={<PinIcon pin={{ type: "delegate" }} />}
					outputs={[execPin, ...outputs]}
				/>
			</BlueprintGraph>
			{(showTable ?? hasDescriptions) && <PinTable outputs={outputs} />}
		</>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    UVar                                    */
/* -------------------------------------------------------------------------- */

export interface UVarProps {
	pin: NodePin & { name: string };
	description?: string;
}

/** A Blueprint variable getter node. */
export function UVar({ pin }: UVarProps) {
	const color = pinColors[pin.type];

	return (
		<span className="not-prose my-2 inline-flex">
			<span
				className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-gradient-to-b from-[#2a2a2a] to-[#0a0a0a] py-1.5 pr-3 pl-4 text-xs text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
				style={{
					boxShadow: `inset 0 -2px 0 ${color}55, 0 4px 12px rgba(0,0,0,0.5)`,
				}}
			>
				{pin.name}
				<PinIcon pin={pin} />
			</span>
		</span>
	);
}

/** A row of variable getter nodes on a Blueprint canvas. */
export function UVariables({
	variables,
}: {
	variables: (NodePin & { name: string })[];
}) {
	return (
		<>
			<BlueprintGraph label="Variables">
				{variables.map((variable) => (
					<UVar key={variable.name} pin={variable} />
				))}
			</BlueprintGraph>
			<PinTable outputs={variables} />
		</>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   UStruct                                  */
/* -------------------------------------------------------------------------- */

export interface UStructProps {
	name: string;
	description?: ReactNode;
	fields: {
		name: string;
		type: string;
		defaultValue?: string;
		range?: string;
		description?: ReactNode;
	}[];
}

export function UStruct({ name, description, fields }: UStructProps) {
	const showDefault = fields.some((field) => field.defaultValue !== undefined);
	const showRange = fields.some((field) => field.range !== undefined);

	return (
		<div className="not-prose my-4 overflow-hidden rounded-xl border">
			<div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2 text-sm">
				<PinIcon
					pin={{ type: "struct" }}
					className="drop-shadow-[0_0_1px_rgba(0,0,0,0.9)]"
				/>
				<code className="font-semibold">{name}</code>
				<Badge variant="outline" className="ml-auto">
					Struct
				</Badge>
			</div>
			{description && (
				<p className="border-b px-4 py-2 text-sm text-muted-foreground">
					{description}
				</p>
			)}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/4">Field</TableHead>
						<TableHead className="w-24">Type</TableHead>
						{showDefault && <TableHead className="w-20">Default</TableHead>}
						{showRange && <TableHead className="w-24">Range</TableHead>}
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{fields.map((field) => (
						<TableRow key={field.name}>
							<TableCell className="font-medium">{field.name}</TableCell>
							<TableCell>
								<code className="text-xs">{field.type}</code>
							</TableCell>
							{showDefault && (
								<TableCell>
									<code className="text-xs">{field.defaultValue ?? "—"}</code>
								</TableCell>
							)}
							{showRange && (
								<TableCell>
									<code className="text-xs">{field.range ?? "—"}</code>
								</TableCell>
							)}
							<TableCell className="whitespace-normal text-muted-foreground">
								{field.description ?? "—"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                                    UEnum                                   */
/* -------------------------------------------------------------------------- */

export interface UEnumProps {
	name: string;
	values: { name: string; description?: ReactNode; cvar?: string | number }[];
}

export function UEnum({ name, values }: UEnumProps) {
	const showCvar = values.some((value) => value.cvar !== undefined);

	return (
		<div className="not-prose my-4 overflow-hidden rounded-xl border">
			<div className="flex items-center gap-2 border-b bg-muted/40 px-4 py-2 text-sm">
				<PinIcon
					pin={{ type: "enum" }}
					className="drop-shadow-[0_0_1px_rgba(0,0,0,0.9)]"
				/>
				<code className="font-semibold">{name}</code>
				<Badge variant="outline" className="ml-auto">
					Enum
				</Badge>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-1/3">Value</TableHead>
						{showCvar && <TableHead className="w-24">CVar</TableHead>}
						<TableHead>Description</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{values.map((value) => (
						<TableRow key={value.name}>
							<TableCell className="font-medium">{value.name}</TableCell>
							{showCvar && (
								<TableCell>
									<code className="text-xs">{value.cvar ?? "—"}</code>
								</TableCell>
							)}
							<TableCell className="whitespace-normal text-muted-foreground">
								{value.description ?? "—"}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/*                               Version badges                               */
/* -------------------------------------------------------------------------- */

export interface UEVersionProps {
	/** e.g. `"UE5"`, `"UE4"`, `"5.5+"` */
	children: ReactNode;
	tone?: "ue4" | "ue5" | "since" | "editor";
}

const toneClasses: Record<NonNullable<UEVersionProps["tone"]>, string> = {
	ue4: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300",
	ue5: "border-sky-500/40 bg-sky-500/10 text-sky-700 dark:text-sky-300",
	since:
		"border-violet-500/40 bg-violet-500/10 text-violet-700 dark:text-violet-300",
	editor: "border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

export function UEVersion({ children, tone = "ue5" }: UEVersionProps) {
	return (
		<Badge
			variant="outline"
			className={`not-prose align-middle ${toneClasses[tone]}`}
		>
			{children}
		</Badge>
	);
}
