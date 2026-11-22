import { AnimatedSpan, Terminal, TypingAnimation } from "./terminal";

export function AccountRecoveryTerminal() {
	return (
		<Terminal>
			<TypingAnimation delay={0} duration={30}>
				$ docker compose exec hub /app/hub reset-passkeys --email test@orcacd.dev
			</TypingAnimation>
			<AnimatedSpan delay={2500} className="text-fd-primary">
				{`
╭────────────────────────────────────────────────────────────────────────────╮
│                                                                            │
│  Passkey Recovery Ready                                                    │
│                                                                            │
│  User ID: 019dc111-5220-77bc-9729-2335f88fa658                             │
│  Email: test@orcacd.dev                                                    │
│  Enrollment code: Hq3vX9kLm2Tz…                                            │
│                                                                            │
│  Use this code on the enrollment page linked from sign-in within 24 hours. │
│                                                                            │
╰────────────────────────────────────────────────────────────────────────────╯
`}
			</AnimatedSpan>
		</Terminal>
	);
}
