import { h } from 'what-framework';
import { renderToString } from 'what-framework/server';
import { articlePath, articles, byCategory, bySlug, categories, nav, site } from '../content/articles.mjs';

export const routes = [
  { path: '/', title: 'Marginalia', description: site.description, kind: 'home' },
  { path: '/articles', title: 'Articles', description: 'All Marginalia essays.', kind: 'articles' },
  ...categories.map(([slug, label]) => ({ path: `/category/${slug}`, title: label, description: `${label} essays from Marginalia.`, kind: 'category', category: slug })),
  { path: '/search', title: 'Search', description: 'Search the local article index.', kind: 'search' },
  { path: '/bookmarks', title: 'Bookmarks', description: 'Local reading list.', kind: 'bookmarks' },
  ...articles.map((article) => ({ path: articlePath(article), title: article.title, description: article.dek, kind: 'article', slug: article.slug })),
  { path: '/build', title: 'How this starter was built', description: 'Agent-readable What Framework and Vura build reference.', kind: 'build' },
  { path: '/404', title: 'Page not found', description: 'Preview of the static 404 page used for unknown paths.', kind: 'notFound' },
];

function A(props, ...children) { return h('a', props, ...children); }

function Layout({ route, assetPath }, children) {
  return h('div', {},
    h('div', { id: 'reading-progress', class: 'progress', 'aria-hidden': 'true' }),
    h('a', { class: 'skip-link', href: '#content' }, 'Skip to content'),
    h('header', { class: 'masthead page' },
      h('div', { class: 'topline' }, h('span', {}, 'Vol. 01 / local edition'), h('span', {}, 'No trackers. No accounts.')),
      A({ class: 'brand', href: '/' }, 'Marginalia', h('span', { class: 'red' }, '.')),
      h('nav', { class: 'nav', 'aria-label': 'Primary' }, nav.map(([href, label]) => A({ href, 'aria-current': href === route.path ? 'page' : undefined }, label))),
    ),
    h('main', { id: 'content', class: 'page' }, ...children),
    h('footer', { class: 'footer page' }, h('span', {}, 'Marginalia independent notebook'), h('span', {}, 'Static articles · local reading list')),
    h('script', { type: 'application/json', id: 'article-index' }, JSON.stringify(articles.map(({ slug, title, category, dek, minutes }) => ({ slug, title, category, dek, minutes, path: `/articles/${slug}` })))),
    h('script', { type: 'module', src: assetPath }),
  );
}

function ArticleRow({ article }) {
  return A({ class: 'article-row', href: articlePath(article) },
    h('span', { class: 'meta' }, article.category),
    h('span', {}, h('h3', {}, article.title), h('p', {}, article.dek)),
    h('span', { class: 'meta' }, `${article.minutes} min`),
  );
}

function Home() {
  const [lead, ...rest] = articles;
  return h('div', {},
    h('section', { class: 'front' },
      h('article', { class: 'lead-article' },
        h('p', { class: 'label' }, 'Current argument'),
        h('h1', {}, lead.title),
        h('p', {}, lead.dek),
        A({ class: 'button', href: articlePath(lead) }, 'Read the essay'),
      ),
      h('aside', {},
        h('p', { class: 'label' }, 'Notebook'),
        h('p', {}, 'A notebook for readers who care about systems, aesthetics and the quiet infrastructure of attention.'),
      ),
    ),
    h('section', { class: 'section' },
      h('p', { class: 'label' }, 'Recent pieces'),
      h('div', { class: 'article-list' }, rest.map((article) => h(ArticleRow, { article }))),
    ),
  );
}

function Articles({ list = articles, title = 'All articles', label = 'Index' }) {
  return h('section', { class: 'section' },
    h('p', { class: 'label' }, label),
    h('h1', {}, title),
    h('div', { class: 'article-list' }, list.map((article) => h(ArticleRow, { article }))),
  );
}

function Article({ article }) {
  return h('article', { class: 'article' },
    h('div', { class: 'article-body' },
      h('p', { class: 'label' }, article.category),
      h('h1', {}, article.title),
      h('p', {}, article.dek),
      article.body.map((paragraph) => h('p', {}, paragraph)),
    ),
    h('aside', { class: 'sidebar' },
      h('p', { class: 'meta' }, `${article.author} · ${article.date} · ${article.minutes} min`),
      h('button', { type: 'button', class: 'bookmark-button', 'data-slug': article.slug, 'aria-pressed': 'false' }, 'Save to reading list'),
      h('p', {}, 'Bookmarks are stored locally in this browser only.'),
    ),
  );
}

function Search() {
  return h('section', { class: 'section' },
    h('p', { class: 'label' }, 'Find a piece'),
    h('h1', {}, 'Search the issue.'),
    h('div', { id: 'search-island', class: 'search-panel' },
      h('label', { for: 'search-input', class: 'meta' }, 'Search title, category or summary'),
      h('input', { id: 'search-input', type: 'search', placeholder: 'systems, state, red ink…' }),
      h('p', {}, 'Enable JavaScript for local instant search; article pages are still fully static.'),
    ),
  );
}

function Bookmarks() {
  return h('section', { class: 'section' },
    h('p', { class: 'label' }, 'Reading list'),
    h('h1', {}, 'Saved locally.'),
    h('div', { id: 'bookmarks-island', class: 'empty-panel' },
      h('p', {}, 'Use article pages to save pieces. Your list stays in localStorage and never leaves the browser.'),
    ),
  );
}

function Build() {
  return h('section', { class: 'section' },
    h('p', { class: 'label' }, 'Build reference'),
    h('h1', {}, 'How Marginalia works.'),
    h('div', { class: 'build-panel' },
      h('p', {}, 'Articles are content records rendered at build time. Search, bookmarks and reading progress are small What client islands.'),
      h('ul', { class: 'build-notes' },
        h('li', {}, 'Signals: `src/client/main.jsx` uses `useSignal` for query, bookmark ids and scroll progress.'),
        h('li', {}, 'Computed: search results and bookmark lists derive from article data.'),
        h('li', {}, 'Effects: localStorage persists bookmarks; a scroll listener updates reading progress.'),
        h('li', {}, 'Routing: each article becomes `/articles/:slug/index.html` during `scripts/build.mjs`.'),
        h('li', {}, 'Source: planned public repo `https://github.com/CelsianJs/what-starter-marginalia`.'),
        h('li', {}, 'Lesson: server-rendered article pages use `h()` and `renderToString`; browser JSX stays in `src/client/main.jsx` so compiler-lowered DOM code is never imported by the Node renderer.'),
        h('li', {}, 'Lesson: search and bookmark islands use `mount()`, replacing fallback containers after JavaScript loads rather than preserving SSR nodes through hydration.'),
        h('li', {}, 'Lesson: storage access can throw in locked-down browser contexts, so bookmark reads/writes use safe wrappers with tab-local memory fallback.'),
      ),
    ),
  );
}

function NotFound() {
  return h('section', { class: 'not-found' },
    h('div', {},
      h('p', { class: 'label' }, '404'),
      h('h1', {}, 'The note is missing.'),
      h('p', {}, 'Return to the index or search the issue.'),
      A({ class: 'button', href: '/articles' }, 'Open article index'),
    ),
  );
}

function pageFor(route) {
  if (route.kind === 'home') return h(Home);
  if (route.kind === 'articles') return h(Articles, {});
  if (route.kind === 'category') return h(Articles, { list: byCategory(route.category), title: route.title, label: 'Category' });
  if (route.kind === 'article') return h(Article, { article: bySlug(route.slug) });
  if (route.kind === 'search') return h(Search);
  if (route.kind === 'bookmarks') return h(Bookmarks);
  if (route.kind === 'build') return h(Build);
  return h(NotFound);
}

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

export function renderRoute(route, { assetPath, siteUrl = site.origin }) {
  const body = renderToString(Layout({ route, assetPath }, [pageFor(route)]));
  const canonical = route.path === '/' ? `${siteUrl}/` : `${siteUrl}${route.path}`;
  return '<!doctype html>' +
    `<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<title>${esc(route.title)} | ${esc(site.name)}</title>` +
    `<meta name="description" content="${esc(route.description)}">` +
    `<link rel="canonical" href="${esc(canonical)}">` +
    `<link rel="stylesheet" href="/site.css">` +
    `</head><body>${body}</body></html>`;
}
