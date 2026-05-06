import { fetcher, getFallbackData } from "@/lib/fetcher";
import useSWR from "swr";

export function GitHubRelease() {
	const { data, isLoading } = useSWR<{
		tag_name: string;
	}>("https://api.github.com/repos/OrcaCD/orca-cd/releases/latest", fetcher, {
		onSuccess: (data) => {
			localStorage.setItem("github_release", JSON.stringify(data));
		},
		fallbackData: getFallbackData("github_release"),
	});

	return (
		<a
			href="https://github.com/OrcaCD/orca-cd/releases"
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center rounded-md border border-fd-border bg-fd-card px-1 py-0.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent"
		>
			{isLoading ? "..." : (data?.tag_name ?? "No release yet")}
		</a>
	);
}
