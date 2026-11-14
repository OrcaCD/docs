# <div align="center"><img src="https://raw.githubusercontent.com/OrcaCD/orca-cd/f6fb48965df90a57a2b181e9e2b359653ae5c6b9/frontend/public/assets/logo-dark-256.png" width="100"/> <br>OrcaCD Documentation</div>

</div>

OrcaCD is a simple GitOps tool for Docker.

This website is built with [Fumadocs](https://www.fumadocs.dev/) and [Tanstack Start](https://tanstack.com/start/latest).

> [!WARNING]
> OrcaCD is in early development and not yet production-ready. There are no stable releases. Expect breaking changes at any time.

## Contributing

### Setup

1. Install the dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm run dev
```

### End-to-end tests

The [Playwright](https://playwright.dev/) tests in `e2e/` run against the prerendered production build. Install the browser once, then run the tests:

```bash
pnpm exec playwright install chromium
pnpm run test:e2e
```

Playwright builds the site and starts `vite preview` on port 4173 automatically. If a server is already running on that port, it is reused, so rebuild first when testing content changes.

### Structure

The markdown files for the documentation are located in the `content/docs` folder.
