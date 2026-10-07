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
    notes: [
      { label: 'mark 01', text: 'A change from hours to days is a small edit with a large effect on interpretation.' },
      { label: 'state', text: 'A useful record preserves the decision a colleague needs, not every incidental action.' },
      { label: 'annotation', text: 'The margin holds a qualification without asking the main argument to stop.' },
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
    notes: [
      { label: 'resolved', text: 'The server build decides the route graph before a visitor asks for a page.' },
      { label: 'local', text: 'Small client decisions can exist without moving the essay into an app shell.' },
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
    notes: [
      { label: 'rule', text: 'One accent color carries state, not decoration.' },
      { label: 'token', text: 'The punctuation color is a single CSS variable on purpose.' },
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
    notes: [
      { label: 'appendix', text: 'Build notes are separated from the issue front so product reading stays uninterrupted.' },
      { label: 'public', text: 'Only durable source lessons belong in public notes; private prompts do not.' },
    ],
  },
];

export const categories = [
  ['systems', 'Systems'],
  ['aesthetics', 'Aesthetics'],
];

const essays = {
  'interfaces-that-leave-marks': [
    'The most useful interface is not always the cleanest one. A clean room can hide the work. A margin can reveal it. In a notebook, a crossed-out sentence tells us that a claim was revised; in software, an equally useful revision often disappears behind the newest state.',
    'Consider a research table shared by two colleagues. One changes the unit from hours to days. If the table simply redraws, the other sees smaller numbers without knowing why. A brief annotation beside the column makes the change legible. The mark is not decoration: it connects an action to its consequence.',
    'That does not mean every interface should preserve every keystroke. A permanent history can become a second task the reader must manage. The useful question is narrower: what would someone need to know to resume this work tomorrow? Keep that evidence near the object, and let incidental noise fall away.',
    'A good margin has a different rhythm from the main text. It holds a qualification, a source, or an alternative reading without competing with the argument. In a product, the equivalent might be a changed-value label, a clear saved state, or an explanation of the assumptions behind a total.',
    'Visible seams are also a form of hospitality. They admit that work has a before and an after, that decisions have costs, and that a reader may arrive halfway through. The goal is not an unfinished appearance. It is a finished object that leaves enough evidence for the next person to understand how to use it.',
  ],
  'the-static-system-is-a-system': [
    'A static page is not the absence of application architecture. It is an architecture that resolves earlier. Before the first visitor arrives, someone has decided which routes exist, which record owns a title, and where an unfamiliar reader can go next. Those decisions are a system even when their output is a folder of files.',
    'An exhibition catalogue is a useful comparison. Its index, essays and captions are fixed before printing, but readers still make different journeys through it. Some begin with the artist; others follow a theme. A publication should offer those same routes instead of treating its homepage as the only legitimate entrance.',
    'The benefit of early resolution is not only speed. It makes the content boundary inspectable. An editor can review the whole issue, check that each reference points somewhere, and notice that a category has no pieces before the issue ships. The deployed object is then the object that was reviewed.',
    'Local decisions remain possible. A reader can search an index, mark an essay for later, or choose a larger reading size without asking a distant service for permission. These tools do not change the published argument. They help a particular reader move through it, and their limits should be stated plainly.',
    'The tradeoff is freshness. A corrected paragraph needs a new edition, and a changing inventory cannot honestly be described by yesterday’s file. That boundary is not a failure. A reliable static system names what was published, keeps direct links useful, and declines to imitate a live service it does not have.',
  ],
  'red-ink-for-state': [
    'A red mark earns its place by telling us that something deserves attention. On a proof sheet it might flag an omission; on a map it might identify a closed passage. When a publication uses the same mark for every ornament, it spends that meaning before the reader needs it.',
    'Start with a reading list. The difference between an unsaved piece and a saved piece is an action the reader chose. A restrained red button can acknowledge that action. But color alone is not enough: the label must change too, so the state survives grayscale, poor lighting, and the ways people perceive color differently.',
    'Focus is another state worth marking. A keyboard user needs to know which link will open next. A visible outline can do this without turning the entire navigation into a row of bright banners. The point is not to make the page quieter for its own sake, but to make the next action unmistakable.',
    'Restraint also requires exceptions. An urgent warning may need more space, stronger wording, and a symbol. A decorative initial may use the accent without describing a state. What matters is that these uses form a readable hierarchy rather than an arbitrary collection of red things.',
    'A practical test is to remove the accent and read the page again. If the argument, control labels and error messages still make sense, color is reinforcing meaning. Restore it and ask where attention goes first. A successful mark directs the reader to a real decision, then lets the rest of the page remain available.',
  ],
  'agents-reading-source': [
    'An appendix makes a promise: the evidence behind this argument is available to inspect. Too often it offers only a list of impressive tools. A useful appendix instead explains which decision mattered, what changed because of it, and where a reader can see the result.',
    'Suppose a report says that a reading list is private. The supporting note should say where the list lives, whether it follows the reader to another device, and what happens when browser storage is unavailable. These limits tell us more than a broad claim about privacy because they describe observable behavior.',
    'Examples should be small enough to carry their own explanation. A short code fragment that stores a list locally can show a boundary. A page of copied implementation can obscure it. The editorial task is to select evidence that answers a question, not to reproduce every file that happened to be involved.',
    'The same discipline applies to failures. Describe the condition that caused a problem and the behavior that now prevents it. Keep unfinished experiments separate from verified lessons. A future reader should not have to guess whether a confident sentence refers to a tested system or an attractive plan.',
    'An appendix belongs beside the publication, not inside every paragraph. Readers who want the essay should be able to read it uninterrupted. Readers who need the machinery should have a clear route to it. The strongest technical notes are modest in scope and precise enough that their promises can be checked.',
  ],
};
for (const article of articles) {
  article.body = essays[article.slug];
  article.minutes = Math.max(1, Math.ceil(article.body.join(' ').trim().split(/\s+/).length / 220));
}

export function articlePath(article) {
  return `/articles/${article.slug}`;
}

export function bySlug(slug) {
  return articles.find((article) => article.slug === slug);
}

export function byCategory(category) {
  return articles.filter((article) => article.category === category);
}
