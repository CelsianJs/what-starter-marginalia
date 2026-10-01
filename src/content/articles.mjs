export const site = {
  name: 'Marginalia',
  description: 'An independent technology and design publication with a local reading notebook.',
  origin: 'http://localhost:4173',
};

export const nav = [
  ['/', 'Front'],
  ['/articles', 'Articles'],
  ['/category/systems', 'Systems'],
  ['/category/aesthetics', 'Aesthetics'],
  ['/search', 'Search'],
  ['/bookmarks', 'Bookmarks'],
  ['/build', 'Build'],
];

export const articles = [
  {
    slug: 'interfaces-that-leave-marks',
    title: 'Interfaces that leave marks',
    category: 'aesthetics',
    dek: 'A small argument for visible seams, reading rhythm and software that remembers its own making.',
    author: 'M. Vale',
    date: '2026-09-18',
    minutes: 6,
    body: [
      'The most useful interface is not always the cleanest one. A clean room can hide the work. A margin can reveal it.',
      'Marginalia treats the page as a record of attention. Progress, saved pieces and search are kept local, because the reader should not need an account to think in public.',
      'The pattern is simple: render the whole article first, then mount the small client behaviors that make reading easier.'
    ],
  },
  {
    slug: 'the-static-system-is-a-system',
    title: 'The static system is a system',
    category: 'systems',
    dek: 'Static publishing can still have state, routes, lists and useful interactions when boundaries are named carefully.',
    author: 'N. Ives',
    date: '2026-08-29',
    minutes: 7,
    body: [
      'A static page is not the absence of application architecture. It is an architecture that resolves earlier.',
      'The route graph, article corpus and navigation all exist at build time. The browser receives the finished argument, plus a small script for local decisions.',
      'This lets distribution be extremely boring in the best way: files, headers and a route manifest.'
    ],
  },
  {
    slug: 'red-ink-for-state',
    title: 'Red ink for state',
    category: 'aesthetics',
    dek: 'A visual system can reserve color for change instead of decoration.',
    author: 'S. Cato',
    date: '2026-08-03',
    minutes: 4,
    body: [
      'Red appears only when something changes: a bookmark, a focus ring, a reading bar, a punctuation mark.',
      'The restraint makes state legible. If everything is accented, nothing is.',
      'The publication keeps that rule in CSS variables so a future issue can choose its own punctuation color.'
    ],
  },
  {
    slug: 'agents-reading-source',
    title: 'Appendices that keep their promises',
    category: 'systems',
    dek: 'Technical notes become more useful when they point to the running system they describe.',
    author: 'K. Sato',
    date: '2026-07-17',
    minutes: 5,
    body: [
      'A publication can be both finished surface and reference object. A technical appendix can point to the files that matter, the choices made and the issues encountered.',
      'That is why Marginalia includes a technical appendix without interrupting the issue front.',
      'The goal is not to expose private process. The goal is to make the public source teach the public pattern.'
    ],
  },
];

export const categories = [
  ['systems', 'Systems'],
  ['aesthetics', 'Aesthetics'],
];

export function articlePath(article) {
  return `/articles/${article.slug}`;
}

export function bySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

export function byCategory(category) {
  return articles.filter((article) => article.category === category);
}
