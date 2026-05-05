import useSWR from "swr";

export function GitHubRelease() {
	const { data } = useSWR(
		"https://api.github.com/repos/OrcaCD/orca-cd/releases/latest",
		// oxlint-disable-next-line promise/prefer-await-to-then
		(...args) => fetch(...args).then((res) => res.json()),
	);

	return (
		<a
			href="https://github.com/OrcaCD/orca-cd/releases"
			target="_blank"
			rel="noopener noreferrer"
			className="inline-flex items-center rounded-md border border-fd-border bg-fd-card px-1 py-0.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent"
		>
			{!data ? "..." : (data.tag_name ?? "No release yet")}
		</a>
	);
}
