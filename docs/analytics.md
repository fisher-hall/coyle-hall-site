# Analytics

The site uses **Cloudflare Web Analytics** — a free, privacy-first service. It sets no cookies, collects no personal data, and doesn't fingerprint visitors, so no consent banner is required. It reports visits, page views, referrers, and top pages.

---

## How it works

`layouts/partials/essentials/head.html` (a project-level override of the theme partial) injects the Cloudflare beacon script on every page, but only when both are true:

1. The build is a **production** build (the GitHub Actions workflow sets `HUGO_ENV: production`). Local `hugo server` runs never send analytics.
2. `cloudflare_analytics_token` is set in `config/_default/params.toml`.

Leave the token empty to disable analytics entirely.

---

## One-time setup

1. Log in at [dash.cloudflare.com](https://dash.cloudflare.com) (the same Cloudflare account that manages the site's DNS).
2. In the dashboard sidebar, go to **Web Analytics** → **Add a site**.
3. Enter `www.coylehallnd.com` as the hostname.
4. Cloudflare shows a JS snippet like:
   ```html
   <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
     data-cf-beacon='{"token": "abc123..."}'></script>
   ```
   Copy only the token value (`abc123...`).
5. Paste it into `config/_default/params.toml`:
   ```toml
   cloudflare_analytics_token = "abc123..."
   ```
6. Commit and push to `main`. Once the GitHub Pages deploy finishes, data appears in the Cloudflare dashboard within a few minutes of the first visit.

---

## Viewing reports

Log in to [dash.cloudflare.com](https://dash.cloudflare.com) → **Web Analytics** → select `www.coylehallnd.com`. Data is retained for 6 months on the free plan.

---

## Handoff

When transferring site maintenance, either add the new maintainer to the Cloudflare account (**Manage Account → Members**) or have them create their own account and re-add the site (generates a new token — update `params.toml` accordingly).
