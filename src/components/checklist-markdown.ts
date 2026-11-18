import { asMarkdown, md } from "fumadocs-core/server";
import type { ReactNode } from "react";

// Markdown forms of the checklist components, used for the copied/LLM markdown

export function MarkdownChecklist({ children }: { children: ReactNode }) {
	asMarkdown();
	return children;
}

export async function MarkdownChecklistItem({ children }: { children: ReactNode }) {
	asMarkdown();
	const text = (await md`${children}`).trim();
	return md`- [ ] ${text}\n`;
}
