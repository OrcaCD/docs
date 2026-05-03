import { AnimatedSpan, Terminal, TypingAnimation } from "./terminal";

export function AccountRecoveryTerminal() {
	return (
		<Terminal>
			<TypingAnimation delay={0} duration={30}>
				$ docker compose exec hub /app/hub reset-password 019dc111-5220-77bc-9729-2335f88fa658
			</TypingAnimation>
			<AnimatedSpan delay={2500} className="text-fd-primary">
				{`
╭────────────────────────────────────────────────────────────────────╮
│                                                                    │
│ Password Reset Successful                                          │
│                                                                    │
│ User ID: 019dc111-5220-77bc-9729-2335f88fa658                      │
│ Email: test@orcacd.dev                                             │
│ New temporary password: w&BU6G,WM#!MX9M4eq                         │
│                                                                    │
│ Important: The user must change this password on the next login.   │
│                                                                    │
╰────────────────────────────────────────────────────────────────────╯
`}
			</AnimatedSpan>
		</Terminal>
	);
}
