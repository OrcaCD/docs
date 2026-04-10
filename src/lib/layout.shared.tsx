import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

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
