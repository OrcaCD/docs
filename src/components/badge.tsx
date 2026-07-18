import { cn } from "@/lib/utils";

const variants = {
	red: "bg-red-500/10 text-red-600 ring-red-500/20 dark:bg-red-500/15 dark:text-red-400 dark:ring-red-500/25",
	amber:
		"bg-amber-500/10 text-amber-600 ring-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400 dark:ring-amber-500/25",
	purple:
		"bg-purple-500/10 text-purple-600 ring-purple-500/20 dark:bg-purple-500/15 dark:text-purple-400 dark:ring-purple-500/25",
	gray: "bg-fd-muted text-fd-muted-foreground ring-fd-border dark:bg-fd-muted dark:text-fd-muted-foreground",
} as const;

export function Badge({
	variant,
	children,
}: {
	variant: keyof typeof variants;
	children: React.ReactNode;
}) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap",
				variants[variant],
			)}
		>
			{children}
		</span>
	);
}
