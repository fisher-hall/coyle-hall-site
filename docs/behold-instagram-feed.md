# Behold Instagram Feed

The homepage Instagram section is powered by [Behold.so](https://behold.so), a third-party service that proxies the Instagram Graph API and caches post data on its CDN.

## How it works

1. Behold connects to the `@real_coylehall` Instagram account via Meta's official API.
2. It exposes a public JSON feed URL that the site fetches client-side on scroll.
3. `assets/js/home.js` fetches the feed, picks the 6 most recent posts, and renders them into the `#ig-grid` element on the homepage.

**Feed endpoint:** `https://feeds.behold.so/9XCk73VEQkyAaVvvrrBh`

This URL is public and read-only — it contains no secret or auth token. Anyone can call it, but they can only read what Behold exposes (your public Instagram posts).

## Account access

- **Service:** behold.so
- **Account holder:** Daniel Burke (`dburke6`)
- **Instagram account linked:** `@real_coylehall`

If you need to transfer ownership or add a new admin, log in to behold.so and use the team/account settings.

## Changing the feed ID

If you ever rotate the feed or create a new one in Behold, update the fetch URL in `assets/js/home.js`:

```js
fetch('https://feeds.behold.so/<NEW_FEED_ID>')
```

The feed ID in the source is not a secret, so there is no need to treat it like an environment variable.

## What breaks if Behold goes down

The feed fetch has an 8-second timeout and a `.catch()` handler. If Behold is unreachable, the Instagram section falls back to the text:

> Follow us @real_coylehall on Instagram.

The rest of the site is unaffected.

## Security notes

**No credentials in the codebase.** Behold does not require an API key embedded in the frontend — the feed URL is the only thing needed to read public post data.

**Caption rendering.** Post captions are rendered using `textContent` (not `innerHTML`), so there is no XSS risk from caption text even if it contained angle brackets.

**Account compromise scenario.** If the Behold account were hijacked, an attacker could change which posts appear in the feed. They cannot inject JavaScript — captions are plain text and the site uses `textContent`. The worst realistic outcome is unwanted posts showing on the homepage until you log in to Behold and fix it.

**CDN images.** Post images are served from `cdn.behold.pictures` (Behold's persistent CDN), not from Instagram's short-lived CDN. This means images don't expire. If a post is deleted from Instagram, Behold may still serve the cached image until the feed is refreshed.

## Updating the feed display

The number of posts shown is controlled in `home.js`:

```js
posts.slice(0, 6)   // change 6 to show more or fewer tiles
```

Styles for the grid and overlay are in `assets/css/home.css` under the `.ig-grid` and `.ig-post` selectors.