import { createFileRoute, Link } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import {
	GitBranch,
	Container,
	RefreshCw,
	Shield,
	Terminal,
	Rocket,
	BookOpen,
	Users,
	Heart,
	Book,
	ComponentIcon,
	Settings,
} from "lucide-react";
import {
	NavbarMenu,
	NavbarMenuContent,
	NavbarMenuLink,
	NavbarMenuTrigger,
} from "fumadocs-ui/layouts/home/navbar";

export const Route = createFileRoute("/")({
	component: Home,
});

function FeatureCard({
	icon: Icon,
	title,
	description,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
}) {
	return (
		<div className="flex flex-col gap-3 rounded-xl border border-fd-border bg-fd-card p-6 transition-colors hover:bg-fd-accent/50">
			<div className="flex size-10 items-center justify-center rounded-lg bg-fd-primary/10">
				<Icon className="size-5 text-fd-primary" />
			</div>
			<h3 className="font-semibold text-fd-foreground">{title}</h3>
			<p className="text-sm text-fd-muted-foreground leading-relaxed">{description}</p>
		</div>
	);
}

function SmallFeature({
	icon: Icon,
	title,
	description,
}: {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
}) {
	return (
		<div className="flex items-start gap-3">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-fd-primary/10">
				<Icon className="size-4 text-fd-primary" />
			</div>
			<div>
				<h4 className="font-medium text-fd-foreground text-sm">{title}</h4>
				<p className="text-sm text-fd-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

function Home() {
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
			]}
		>
			<section className="relative overflow-hidden border-b border-fd-border">
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-fd-primary)/0.08,transparent_60%)]" />
				<div className="relative mx-auto max-w-5xl px-6 py-24 text-center md:py-36">
					<div className="mb-6 inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-card px-4 py-1.5 text-sm text-fd-muted-foreground">
						<Container className="size-4" />
						GitOps for Docker
					</div>
					<h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-fd-foreground md:text-6xl">
						OrcaCD
					</h1>
					<p className="mx-auto mt-6 max-w-2xl text-lg text-fd-muted-foreground">
						OrcaCD is a simple GitOps controller for Docker Compose. Deploy and manage your services
						with ease, directly from your Git repository.
					</p>
					<div className="mt-10 flex flex-wrap items-center justify-center gap-4">
						<Link
							to="/docs/$"
							params={{ _splat: "setup/installation" }}
							className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
						>
							<Rocket className="size-4" />
							Get Started
						</Link>
					</div>
				</div>
			</section>

			<section className="border-b border-fd-border">
				<div className="mx-auto max-w-5xl px-6 py-16 text-center">
					<div className="overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-lg">
						<div className="flex items-center gap-2 border-b border-fd-border px-4 py-3">
							<div className="size-3 rounded-full bg-fd-muted-foreground/20" />
							<div className="size-3 rounded-full bg-fd-muted-foreground/20" />
							<div className="size-3 rounded-full bg-fd-muted-foreground/20" />
						</div>
						<div className="flex items-center justify-center p-12 text-fd-muted-foreground">
							<p className="text-sm italic">TODO: Add OrcaCD dashboard screenshot image</p>
						</div>
					</div>
				</div>
			</section>

			<section className="border-b border-fd-border">
				<div className="mx-auto max-w-5xl px-6 py-20">
					<div className="mb-12 text-center">
						<h2 className="text-3xl font-bold text-fd-foreground">Key Features</h2>
						<p className="mt-3 text-fd-muted-foreground">
							Everything you need for GitOps-powered Docker deployments
						</p>
					</div>
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						<FeatureCard
							icon={GitBranch}
							title="Git-Driven Deployments"
							description="Push to your repository and OrcaCD automatically detects changes and deploys your services. True GitOps with zero manual intervention."
						/>
						<FeatureCard
							icon={Container}
							title="Docker Compose Native"
							description="Works directly with your existing Docker Compose files. No need to learn new configuration formats or migration tools."
						/>
						<FeatureCard
							icon={RefreshCw}
							title="Automatic Sync"
							description="OrcaCD continuously watches your repositories and keeps your running services in sync with your desired state."
						/>
						<FeatureCard
							icon={Shield}
							title="Secure by Default"
							description="Built with security in mind. Supports OIDC authentication and fine-grained access controls for your deployments."
						/>
						<FeatureCard
							icon={Terminal}
							title="Simple Setup"
							description="Get up and running in minutes with a single Docker Compose file. Minimal configuration, maximum productivity."
						/>
						<FeatureCard
							icon={Rocket}
							title="Lightweight"
							description="Designed to be resource-efficient. OrcaCD runs with minimal overhead, perfect for home labs and small-scale deployments."
						/>
					</div>
				</div>
			</section>

			<section className="border-b border-fd-border">
				<div className="mx-auto max-w-5xl px-6 py-20">
					<div className="mb-12 text-center">
						<h2 className="text-3xl font-bold text-fd-foreground">How It Works</h2>
						<p className="mt-3 text-fd-muted-foreground">
							Three simple steps to automated Docker deployments
						</p>
					</div>
					<div className="grid gap-8 md:grid-cols-3">
						{[
							{
								step: "1",
								title: "Connect Your Repo",
								description:
									"Point OrcaCD to your Git repository containing your Docker Compose files.",
							},
							{
								step: "2",
								title: "Push Changes",
								description: "Commit and push updates to your Compose files or application code.",
							},
							{
								step: "3",
								title: "Auto Deploy",
								description:
									"OrcaCD detects the changes and automatically updates your running services.",
							},
						].map((item) => (
							<div key={item.step} className="text-center">
								<div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-fd-primary text-lg font-bold text-fd-primary-foreground">
									{item.step}
								</div>
								<h3 className="mb-2 font-semibold text-fd-foreground">{item.title}</h3>
								<p className="text-sm text-fd-muted-foreground">{item.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="border-b border-fd-border">
				<div className="mx-auto max-w-5xl px-6 py-20">
					<div className="mb-12 text-center">
						<h2 className="text-3xl font-bold text-fd-foreground">Join the Community</h2>
						<p className="mt-3 text-fd-muted-foreground">
							OrcaCD is open source and community-driven
						</p>
					</div>
					<div className="grid gap-6 sm:grid-cols-3">
						<SmallFeature
							icon={BookOpen}
							title="Documentation"
							description="Comprehensive guides to get you started quickly."
						/>
						<SmallFeature
							icon={Users}
							title="Open Source"
							description="Contribute on GitHub and help shape the future of OrcaCD."
						/>
						<SmallFeature
							icon={Heart}
							title="Community Support"
							description="Get help and share ideas with other self-hosters."
						/>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section>
				<div className="mx-auto max-w-5xl px-6 py-20 text-center">
					<h2 className="text-3xl font-bold text-fd-foreground">Ready to get started?</h2>
					<p className="mt-3 text-fd-muted-foreground">
						Deploy OrcaCD today and start using GitOps for your Docker services.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<Link
							to="/docs/$"
							params={{ _splat: "setup/installation" }}
							className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground transition-opacity hover:opacity-90"
						>
							Read Documentation
						</Link>
						<a
							href="https://github.com/OrcaCD/orca-cd"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-5 py-2.5 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-accent"
						>
							View on GitHub
						</a>
					</div>
				</div>
			</section>
		</HomeLayout>
	);
}
