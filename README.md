# Marginalia — What Framework starter

Marginalia is a static/hybrid starter for an independent technology and design publication. It includes build-time rendered articles, category pages, local search, bookmarks, reading progress and a live `/build` reference.

## Quick start

Prerequisite: Node.js 22.

```sh
npm ci
npm run dev
```

Build and test the deployable artifact:

```sh
npm run build
npm run test
```

Preview the production artifact exactly as a static host will serve it:

```sh
npm run build
npm run preview
# Open http://127.0.0.1:4173
```

The Vura-ready artifact is written to `dist/`:

- `dist/static/**` — article pages, category pages and assets
- `dist/manifest.json` — static route manifest
- `vura.json` — cache headers and redirect rules sent by `vura-platform deploy`

## Routes

- `/` — issue front
- `/articles` — full article index
- `/category/systems` and `/category/aesthetics` — category archives
- `/search` — client-mounted local search
- `/bookmarks` — client-mounted local reading list
- `/articles/:slug` — build-time rendered articles
- `/build` — implementation reference
- `/404` — preview of the not-found page; unknown paths are served from root `404.html` with HTTP 404

## Vura deployment

After creating or linking the Vura project, run:

```sh
npm ci
npx vura-platform login
npx vura-platform projects create marginalia --team <team-id>
# or: npx vura-platform projects link <project-id>
SITE_URL=https://what-starter-marginalia-fae244da.vura.app npm run build
npx vura-platform deploy --prod
```

`SITE_URL` must be an absolute `http` or `https` origin with no path, query or hash. Local builds safely default to `http://localhost:4173`; production builds should set the deployed Vura origin so canonical, sitemap and robots URLs are correct.

This starter has no secrets, no database and no remote assets.

## Source

Public repository: <https://github.com/CelsianJs/what-starter-marginalia>

See [BUILD.md](./BUILD.md) and `/build` for agent-focused implementation notes.
