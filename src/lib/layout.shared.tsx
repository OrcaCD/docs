import { Rocket, Book, Settings } from "lucide-react";
import {
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuLink,
	NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";
import type { BaseLayoutProps, LinkItemType } from "fumadocs-ui/layouts/shared";
import { GitHubRelease } from "@/components/github-release";
import { GithubInfo } from "@/components/github-info";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<>
					<img src="/assets/logo-dark.svg" alt="OrcaCD Logo" className="size-6 mr-2" />
					<span className="font-medium">OrcaCD</span>
				</>
			),
			transparentMode: "top",
		},
	};
}

export const navbarLinks: LinkItemType[] = [
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
		on: "nav",
		secondary: true,
		children: <GitHubRelease />,
	},
	{
		type: "custom",
		secondary: true,
		children: <GithubInfo />,
	},
];
