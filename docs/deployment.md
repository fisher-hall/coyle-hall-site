# Deployment

---

## Primary deployment: GitHub Pages

The site is hosted on GitHub Pages and deployed by GitHub Actions. Deployment is fully automatic:

1. Push (or merge a PR) to the `main` branch on GitHub.
2. The workflow in `.github/workflows/main.yml` builds the site and publishes it to GitHub Pages.
3. The site goes live at `www.coylehallnd.com` within a few minutes.

That's it. There is no manual upload, FTP, or SSH involved.

### Build steps

Defined in `.github/workflows/main.yml`. The workflow runs:

```bash
npm run project-setup   # copies theme assets into place (scripts/projectSetup.js)
npm install
npm run build           # hugo --gc --minify
```

The workflow sets `HUGO_ENV: production`, which is what enables production-only features like the analytics beacon (see `analytics.md`).

### Hugo and Go versions

Pinned in the workflow's `env` block:

```yaml
HUGO_VERSION: "0.147.3"
GO_VERSION: "1.23.3"
```

If you upgrade Hugo locally, update these values so CI uses the same version. Mismatched versions are the most common cause of "works locally, fails in CI" errors.

---

## Checking a build

The **Actions** tab on the GitHub repository shows every deploy: whether it passed, the full build log, and which commit it came from. A green checkmark next to the latest commit on `main` means the deploy succeeded.

Common failure causes:
- A YAML data file has a syntax error (check indentation — YAML is whitespace-sensitive)
- A Hugo template references a data field that doesn't exist (nil pointer error)
- `hugo_stats.json` is out of date after adding new Tailwind classes (run `hugo` locally first)

---

## Local build

To build exactly as CI does:

```bash
yarn project-setup
hugo --gc --minify
```

The `public/` folder is gitignored and contains the full built site. You can open `public/index.html` directly in a browser or use `hugo server` for hot-reload during development.

---

## Domain and DNS

The site is served at `www.coylehallnd.com`:

- **Domain registrar:** Namecheap — the domain is registered and renewed here.
- **DNS:** managed through Cloudflare.
- **`static/CNAME`:** must contain `www.coylehallnd.com` — GitHub Pages reads this file to know which custom domain to serve. Don't delete it.

If the domain ever stops resolving, check (in order): Namecheap renewal status, Cloudflare DNS records pointing at GitHub Pages, and the custom-domain setting under the repo's **Settings → Pages**.

---

## Alternate deployment targets

The repo also contains configs for Netlify (`netlify.toml`), Vercel (`vercel.json`, `vercel-build.sh`), and AWS Amplify (`amplify.yml`). These are **not** the active deployment path — GitHub Pages is. They exist as fallbacks if Pages ever needs to be replaced. Do not push to these services unless intentionally migrating.

---

## Transferring access

To hand off to the next maintainer, they need:

1. **GitHub** — write access to the `fisher-hall/coyle-hall-site` repository (deploys are just pushes to `main`).
2. **Namecheap** — account access for domain renewal.
3. **Cloudflare** — account access for DNS and Web Analytics (**Manage Account → Members**, or transfer the account).
