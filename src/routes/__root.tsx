import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import type { ReactNode } from "react";
import SearchDialog from "@/components/search";
import appCss from "@/styles/app.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				name: "description",
				content: "GitOps for Docker",
			},
			{
				title: "OrcaCD Documentation",
			},
		],

		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "icon",
				href: "/assets/favicon.ico",
			},
			{
				rel: "apple-touch-icon",
				href: "/assets/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				sizes: "any",
				href: "/assets/logo-dark.svg",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/assets/logo-dark-32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "64x64",
				href: "/assets/logo-dark-64.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "96x96",
				href: "/assets/logo-dark-96.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "128x128",
				href: "/assets/logo-dark-128.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "144x144",
				href: "/assets/logo-dark-144.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "180x180",
				href: "/assets/logo-dark-180.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "192x192",
				href: "/assets/logo-dark-192.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "256x256",
				href: "/assets/logo-dark-256.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "512x512",
				href: "/assets/logo-dark-512.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "1024x1024",
				href: "/assets/logo-dark-1024.png",
			},
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<RootDocument>
			<Outlet />
		</RootDocument>
	);
}

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="flex flex-col min-h-screen">
				<RootProvider search={{ SearchDialog }}>{children}</RootProvider>
				<Scripts />
			</body>
		</html>
	);
}
