import { cn } from "@/lib/utils";

export type PinType =
	| "exec"
	| "bool"
	| "byte"
	| "enum"
	| "int"
	| "int64"
	| "float"
	| "string"
	| "name"
	| "text"
	| "object"
	| "softobject"
	| "class"
	| "struct"
	| "delegate"
	| "wildcard";

export type PinContainer = "array" | "set";

export interface NodePin {
	/** Label shown next to the pin. Leave empty for unnamed exec pins. */
	name?: string;
	type: PinType;
	container?: PinContainer;
	/** Type shown in the parameter table, e.g. `EGraphicsRHI` or `Material`. */
	typeName?: string;
	/** Default value drawn inside the node (enum dropdown, checkbox, number, text). */
	defaultValue?: string | number | boolean;
	description?: string;
}

/** Pin colors taken from Unreal Engine 5's default Graph Editor settings. */
export const pinColors: Record<PinType, string> = {
	exec: "#ffffff",
	bool: "#a30000",
	byte: "#00786a",
	enum: "#00786a",
	int: "#1fe3ad",
	int64: "#a9e3ae",
	float: "#9dff4a",
	string: "#ff00d4",
	name: "#c88aff",
	text: "#e86e9f",
	object: "#00a8f4",
	softobject: "#96ffff",
	class: "#5900dc",
	struct: "#0058c9",
	delegate: "#ff3a3a",
	wildcard: "#a0a0a0",
};

export const pinTypeLabels: Record<PinType, string> = {
	exec: "Exec",
	bool: "Boolean",
	byte: "Byte",
	enum: "Enum",
	int: "Integer",
	int64: "Integer64",
	float: "Float",
	string: "String",
	name: "Name",
	text: "Text",
	object: "Object Reference",
	softobject: "Soft Object Reference",
	class: "Class Reference",
	struct: "Struct",
	delegate: "Delegate",
	wildcard: "Wildcard",
};

export function describePinType(pin: NodePin) {
	const base = pin.typeName ?? pinTypeLabels[pin.type];
	if (pin.container === "array") return `Array of ${base}`;
	if (pin.container === "set") return `Set of ${base}`;
	return base;
}

interface PinIconProps {
	pin: Pick<NodePin, "type" | "container">;
	className?: string;
}

/** SVG pin glyph that mirrors the shapes Unreal uses for each pin kind. */
export function PinIcon({ pin, className }: PinIconProps) {
	const color = pinColors[pin.type];
	const common = {
		"aria-hidden": true,
		className: cn("shrink-0", className),
	} as const;

	if (pin.type === "exec") {
		return (
			<svg
				{...common}
				aria-hidden="true"
				width="14"
				height="14"
				viewBox="0 0 14 14"
			>
				<path
					d="M2 1.5h5.5L12.5 7l-5 5.5H2z"
					fill="none"
					stroke={color}
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
			</svg>
		);
	}

	if (pin.container === "array") {
		return (
			<svg
				{...common}
				aria-hidden="true"
				width="14"
				height="14"
				viewBox="0 0 14 14"
			>
				{[0, 1, 2].flatMap((row) =>
					[0, 1, 2].map((col) => (
						<rect
							key={`${row}-${col}`}
							x={1 + col * 4.2}
							y={1 + row * 4.2}
							width="3.2"
							height="3.2"
							rx="0.6"
							fill={row === 1 && col === 1 ? "transparent" : color}
							stroke={color}
							strokeWidth="0.8"
						/>
					)),
				)}
			</svg>
		);
	}

	if (pin.container === "set") {
		return (
			<svg
				{...common}
				aria-hidden="true"
				width="14"
				height="14"
				viewBox="0 0 14 14"
			>
				<path
					d="M5 1.5C3 1.5 4 6 1.8 7 4 8 3 12.5 5 12.5M9 1.5c2 0 1 4.5 3.2 5.5C10 8 11 12.5 9 12.5"
					fill="none"
					stroke={color}
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		);
	}

	if (pin.type === "delegate") {
		return (
			<svg
				{...common}
				aria-hidden="true"
				width="14"
				height="14"
				viewBox="0 0 14 14"
			>
				<rect
					x="2"
					y="2"
					width="10"
					height="10"
					rx="1.5"
					fill="none"
					stroke={color}
					strokeWidth="1.6"
				/>
			</svg>
		);
	}

	return (
		<svg
			{...common}
			aria-hidden="true"
			width="16"
			height="14"
			viewBox="0 0 16 14"
		>
			<circle
				cx="6"
				cy="7"
				r="4.6"
				fill="none"
				stroke={color}
				strokeWidth="1.6"
			/>
			<path d="M12.5 4.5 15 7l-2.5 2.5z" fill={color} />
		</svg>
	);
}
