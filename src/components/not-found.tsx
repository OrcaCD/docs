import { baseOptions } from "@/lib/layout.shared";
import { Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Rocket, Book, Settings } from "lucide-react";
import {
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuLink,
	NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";
import { GithubInfo } from "fumadocs-ui/components/github-info";
import useSWR from "swr";

export function NotFound() {
	const { data, isLoading } = useSWR(
		"https://api.github.com/repos/OrcaCD/orca-cd/releases/latest",
		// oxlint-disable-next-line promise/prefer-await-to-then
		(...args) => fetch(...args).then((res) => res.json()),
	);

	return (
		<HomeLayout
			{...baseOptions()}
			links={[
				{
					type: "menu",
					on: "menu",
					text: "Documentation",
					items: [
						{
							text: "Introduction",
							url: "/docs",
							icon: <Book />,
						},
						{
							text: "Installation",
							url: "/docs/setup/installation",
							icon: <Rocket />,
						},
						{
							text: "Environment Variables",
							url: "/docs/configuration/env-variables",
							icon: <Settings />,
						},
					],
				},
				{
					type: "custom",
					on: "nav",
					children: (
						<NavbarMenu>
							<NavbarMenuTrigger>Docs</NavbarMenuTrigger>
							<NavbarMenuContent>
								<NavbarMenuLink href="/docs">
									<Book className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
									<p className="font-medium">Introduction</p>
									<p className="text-fd-muted-foreground text-sm">Welcome to OrcaCD</p>
								</NavbarMenuLink>
								<NavbarMenuLink href="/docs/setup/installation">
									<Rocket className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
									<p className="font-medium">Installation</p>
									<p className="text-fd-muted-foreground text-sm">
										Get OrcaCD running quickly with Docker installation.
									</p>
								</NavbarMenuLink>
								<NavbarMenuLink href="/docs/configuration/env-variables">
									<Settings className="bg-fd-primary text-fd-primary-foreground p-1 mb-2 rounded-md" />
									<p className="font-medium">Environment Variables</p>
									<p className="text-fd-muted-foreground text-sm">
										Complete reference for all OrcaCD configuration options.
									</p>
								</NavbarMenuLink>
							</NavbarMenuContent>
						</NavbarMenu>
					),
				},
				{
					type: "custom",
					secondary: true,
					children: (
						<a
							href="https://github.com/OrcaCD/orca-cd/releases"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center rounded-md border border-fd-border bg-fd-card px-1 py-0.5 text-sm text-fd-muted-foreground transition-colors hover:bg-fd-accent"
						>
							{isLoading ? "..." : (data.tag_name ?? "No release yet")}
						</a>
					),
				},
				{
					type: "custom",
					secondary: true,
					children: <GithubInfo owner="OrcaCD" repo="orca-cd" className="flex-row" />,
				},
			]}
		>
			<div className="flex flex-col items-center gap-4 text-center py-32 justify-center">
				<h1 className="text-6xl font-bold text-fd-muted-foreground">404</h1>
				<h2 className="text-2xl font-semibold">Page Not Found</h2>
				<p className="text-fd-muted-foreground max-w-md">
					The page you are looking for might have been removed, had its name changed, or is
					temporarily unavailable.
				</p>
				<Link
					to="/"
					className="mt-4 px-4 py-2 rounded-lg bg-fd-primary text-fd-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
				>
					Back to Home
				</Link>
			</div>
		</HomeLayout>
	);
}
