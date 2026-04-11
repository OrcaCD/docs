import { baseOptions, navbarLinks } from "@/lib/layout.shared";
import { DefaultNotFound } from "fumadocs-ui/layouts/home/not-found";
import { HomeLayout } from "fumadocs-ui/layouts/home";

export function NotFound() {
	return (
		<HomeLayout {...baseOptions()} links={navbarLinks}>
			<DefaultNotFound />
		</HomeLayout>
	);
}
