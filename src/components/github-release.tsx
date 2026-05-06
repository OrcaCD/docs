import { fetcher, useFallbackData } from "@/lib/fetcher";
import useSWR from "swr";

type ReleaseData = {
	tag_name: string;
};

export function GitHubRelease() {
	const {
		data: fallbackData,
		hasFreshData,
		setCachedData,
		markCacheWindow,
	} = useFallbackData<ReleaseData>("github_release");
	const { data, isLoading } = useSWR<ReleaseData>(
		"https://api.github.com/repos/OrcaCD/orca-cd/releases/latest",
		fetcher,
		{
			onSuccess: setCachedData,
			onError: markCacheWindow,
			fallbackData: fallbackData ?? undefined,
			revalidateOnMount: !hasFreshData,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
			shouldRetryOnError: false,
		},
	);

	const releaseData = data ?? fallbackData;
	const isPending = !releaseData && isLoading;

	return (
		<a
			href="https://github.com/OrcaCD/orca-cd/releases"
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center rounded-md border border-fd-border bg-fd-card px-1 py-0.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent"
		>
			{isPending ? "..." : (releaseData?.tag_name ?? "No release yet")}
		</a>
	);
}
