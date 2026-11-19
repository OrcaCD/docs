import { RotateCcw } from "lucide-react";
import {
	Children,
	createContext,
	isValidElement,
	useContext,
	useMemo,
	useSyncExternalStore,
} from "react";

const STORAGE_PREFIX = "orcacd-checklist:";

type ChecklistContextValue = {
	checked: ReadonlySet<string>;
	toggle: (id: string) => void;
};

const ChecklistContext = createContext<ChecklistContextValue | null>(null);

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
	listeners.add(listener);
	window.addEventListener("storage", listener);
	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", listener);
	};
}

function readRaw(storageKey: string): string {
	try {
		return localStorage.getItem(storageKey) ?? "";
	} catch {
		return "";
	}
}

function parseChecked(raw: string): Set<string> {
	try {
		const parsed: unknown = JSON.parse(raw || "[]");
		if (Array.isArray(parsed)) {
			return new Set(parsed.filter((value) => typeof value === "string"));
		}
	} catch {
		// Invalid data
	}
	return new Set();
}

function saveChecked(storageKey: string, checked: ReadonlySet<string>) {
	try {
		if (checked.size === 0) {
			localStorage.removeItem(storageKey);
		} else {
			localStorage.setItem(storageKey, JSON.stringify([...checked]));
		}
	} catch {
		// Storage unavailable
	}
	listeners.forEach((listener) => listener());
}

export function Checklist({ id, children }: { id: string; children: React.ReactNode }) {
	const storageKey = STORAGE_PREFIX + id;
	// The empty server snapshot avoids a hydration mismatch
	const raw = useSyncExternalStore(
		subscribe,
		() => readRaw(storageKey),
		() => "",
	);
	const checked = useMemo(() => parseChecked(raw), [raw]);

	const itemIds = Children.toArray(children).flatMap((child) => {
		if (isValidElement<{ id?: unknown }>(child) && typeof child.props.id === "string") {
			return [child.props.id];
		}
		return [];
	});
	const doneCount = itemIds.filter((itemId) => checked.has(itemId)).length;

	function update(next: Set<string>) {
		saveChecked(storageKey, next);
	}

	function toggle(itemId: string) {
		const next = new Set(checked);
		if (!next.delete(itemId)) {
			next.add(itemId);
		}
		update(next);
	}

	return (
		<ChecklistContext.Provider value={{ checked, toggle }}>
			<div className="my-6 rounded-xl border bg-fd-card p-4">
				<div className="mb-3 flex items-center justify-between gap-2 text-sm text-fd-muted-foreground">
					<span>
						{doneCount} / {itemIds.length} done
					</span>
					<button
						type="button"
						onClick={() => update(new Set())}
						disabled={checked.size === 0}
						className="inline-flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground disabled:pointer-events-none disabled:opacity-50"
					>
						<RotateCcw className="size-3.5" />
						Reset
					</button>
				</div>
				<div
					role="progressbar"
					aria-valuemin={0}
					aria-valuemax={itemIds.length}
					aria-valuenow={doneCount}
					className="mb-4 h-1.5 overflow-hidden rounded-full bg-fd-muted"
				>
					<div
						className="h-full bg-fd-primary transition-all"
						style={{ width: itemIds.length > 0 ? `${(doneCount / itemIds.length) * 100}%` : 0 }}
					/>
				</div>
				<ul className="m-0 list-none space-y-2 ps-0">{children}</ul>
			</div>
		</ChecklistContext.Provider>
	);
}

export function ChecklistItem({ id, children }: { id: string; children: React.ReactNode }) {
	const context = useContext(ChecklistContext);
	if (!context) {
		throw new Error("ChecklistItem must be used inside Checklist");
	}

	return (
		<li className="m-0 ps-0">
			<label className="flex cursor-pointer items-start gap-3">
				<span className="flex h-7 shrink-0 items-center">
					<input
						type="checkbox"
						checked={context.checked.has(id)}
						onChange={() => context.toggle(id)}
						className="size-4 cursor-pointer accent-fd-primary"
					/>
				</span>
				<div className="min-w-0 leading-7 [&>p]:my-0 [&>p]:leading-[inherit]">{children}</div>
			</label>
		</li>
	);
}
