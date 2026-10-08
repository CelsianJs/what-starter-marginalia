# How Marginalia was built

## Contemporary interface baseline — 2026-10-08

The stylesheet is consolidated around a shared local sans-serif stack, explicit 16px body and 14px control typography, 44px minimum button/input/navigation targets and an 8px spacing rhythm. Headings stop at 48px on desktop and 32px on mobile across product, detail and build routes. Source content, client state, routes, local persistence and file-download semantics are unchanged. Quiet borders replace decorative backgrounds, heavy outlines and offset shadows; the original content objects remain the focal point.

Visual verification covers 1440×1000 and 390×844 primary, detail, interactive and build surfaces, horizontal geometry, focus, source-native controls and no-JavaScript content. `npm test` runs content regressions, production build checks, existing browser/smoke flows and then the shared typography/geometry contract through `npm run test:style`. The existing CI `npm test` step runs this mandatory gate too; no optional or skipped style check is used. To rerun style checks independently, run `npm run build` followed by `npm run test:style`. No new dependencies or external font requests are needed.

## Product-depth patterns — 2026-10-07

Article duration is derived once from content: `Math.max(1, Math.ceil(article.body.join(' ').trim().split(/\s+/).length / 220))`. This fixes the misleading 4–7 minute labels on three-paragraph stubs without padding content to satisfy a timer. Server-rendered bylines, related reading and sidenotes remain useful without JavaScript. The existing bookmark utility locates `.bookmark-button` anywhere on the page, so moving it before the essay did not require another island or new storage behavior. The original `.article-body p` rule initially enlarged byline metadata; a scoped `.byline` rule repairs hierarchy. Product-depth checks validate every duration; browser checks preserve search, saved lists and denied-storage behavior.

Verification: `npm test` runs content/model regressions, production artifact checks, contextual browser flows, desktop/mobile screenshots and the original smoke suite. Screenshot proof is under `.screenshots/`; no external services are required.

Marginalia is a static publication starter. Article pages are generated at build time, then client-mounted islands add search, bookmarks and reading progress.

The important boundary: static article HTML stays useful without JavaScript. `mount()` replaces only the island host regions when the browser bundle loads; it is not SSR-preserving hydration.

## Source map

| Concern | File | Why it matters |
| --- | --- | --- |
| Article content | `src/content/articles.mjs` | Article data, categories and route helpers feed both server pages and client search. |
| Static renderer | `src/server/render.mjs` | Uses `h()` plus `renderToString()` for route HTML, article pages and the embedded article index. |
| Client islands | `src/client/main.jsx` | Mounts search, bookmarks and reading-progress behavior. |
| Styling | `src/shared/site.css` | Broadsheet visual system with no remote fonts. |
| Build checks | `scripts/check.mjs` | Verifies route files, static 404, generated assets and canonical Vura manifest shape. |

## Data flow

```text
article records -> static article routes -> embedded article index -> client search/bookmark islands
```

The article index is intentionally bundled into the static page. This avoids a search backend while keeping direct article URLs readable.

## Static rendering

`Layout()` renders shared navigation, footer, a progress-bar element and the JSON article index.

```js
h('script', {
  type: 'application/json',
  id: 'article-index',
}, JSON.stringify(articles.map(({ slug, title, category, dek, minutes }) => ({
  slug,
  title,
  category,
  dek,
  minutes,
  path: `/articles/${slug}`,
}))))
```

Client code decodes that script payload before parsing it:

```js
const index = safeJson(decodeEntities(document.querySelector('#article-index')?.textContent || '')) || [];
```

## Search island

Search is a direct computed projection over the bundled index.

```jsx
const query = useSignal('');
const results = useComputed(() => {
  const q = query().trim().toLowerCase();
  if (!q) return index;
  return index.filter((article) =>
    [article.title, article.category, article.dek].join(' ').toLowerCase().includes(q)
  );
});
```

The result count uses `aria-live`, so the filter remains understandable to screen-reader users.

## Bookmarks island

Bookmark ids are the source state. The article objects are derived from those ids.

```jsx
const ids = useSignal(readBookmarks(storageStatus));
const saved = useComputed(() => ids().map((id) => index.find((article) => article.slug === id)).filter(Boolean));
```

This matters because clearing the list should immediately switch the UI to the empty branch.

## Effects and cleanup

Bookmark persistence is an effect:

```jsx
useEffect(() => {
  safeStorageSet(STORAGE, JSON.stringify(ids()), storageStatus);
});
```

Page utilities also attach DOM listeners and remove them in cleanup:

```jsx
useEffect(() => {
  const bar = document.querySelector('#reading-progress');
  if (!bar) return;
  function update() {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress(max <= 0 ? 1 : Math.min(1, scrollY / max));
    bar.style.transform = `scaleX(${progress()})`;
  }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
  return () => {
    removeEventListener('scroll', update);
    removeEventListener('resize', update);
  };
});
```

## Real issues and fixes

### Cleared bookmarks must re-render the empty branch

Problem: if a bookmark view reads a stale array snapshot, clearing the list can leave old list markup visible.

Fix: derive `saved()` from `ids()` and branch on `saved().length`.

```jsx
{() => saved().length === 0 ? (
  <div class="empty-panel">...</div>
) : (
  <div class="article-list bookmark-list">
    {saved().map((article) => <a class="article-row" href={article.path}>...</a>)}
  </div>
)}
```

Proof: the rendered branch reads the computed accessor, so `ids([])` changes the branch.

### Storage denial should not erase reading lists

When localStorage throws, Marginalia stores a fallback copy in memory and, when allowed, in `window.name` for the current browsing context.

```js
function safeStorageSet(key, value, storageStatus) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    storageStatus('memory');
    storageFallback.set(key, value);
    const store = readFallbackStore();
    store[key] = value;
    writeFallbackStore(store);
  }
}
```

Takeaway: local-first features still need a failure mode users can understand.

### Let Vura synthesize the static manifest

Problem: a partial handwritten `dist/manifest.json` caused Vura upload validation to fail because it omitted platform-required fields such as `timestamp` and `pages[].filePath`.

Fix: Marginalia now writes the full static manifest contract, including `timestamp`, `layouts`, `pages[].filePath`, `hasLoader`, `hasGetServerData` and `config.staticKey`. The build check validates the emitted manifest with `@celsian/vura-contract`, the same public contract package used by the platform.

Takeaway: CLI uploads that keep files under `dist/static` should emit the complete route-manifest contract so public URLs map to promoted static keys.

## What went smoothly

- The same article index powers static routes, search results and bookmark labels.
- Reading progress is isolated to one utility island, so article rendering remains static.
- The publication works as content first; islands only improve navigation and retention.
- The Opus refinement pass added server-rendered sidenotes from article records, which fixed the “publication with no marginalia” critique while keeping no-JS article reading intact.
- Listing the current essay inside Recent pieces made the issue front and article index agree without duplicating route logic.

## Limits to preserve

- Search is local over a small bundled index, not a hosted search backend.
- Bookmarks are browser-local and anonymous.
- Client islands mount over static fallback content; they are not hydration.

## Verification

Run:

```bash
npm ci
npm run build
npm run smoke
```

The smoke should exercise direct article routes, search, bookmark save/clear, reading-progress utilities, static 404 and mobile layout.

## Reset

Delete local reading state:

```js
localStorage.removeItem('marginalia-bookmarks');
```

Then reload `/bookmarks`.
