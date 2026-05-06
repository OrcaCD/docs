import { fetcher, useFallbackData } from "@/lib/fetcher";
import useSWR from "swr";

type ReleaseData = {
	tag_name: string;
};

export function GitHubRelease() {
	const fallbackData = useFallbackData<ReleaseData>("github_release");
	const { data, isLoading } = useSWR<ReleaseData>(
		"https://api.github.com/repos/OrcaCD/orca-cd/releases/latest",
		fetcher,
		{
			onSuccess: (data) => {
				localStorage.setItem("github_release", JSON.stringify(data));
			},
			fallbackData: fallbackData ?? undefined,
		},
	);

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
