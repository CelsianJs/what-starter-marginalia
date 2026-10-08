# Design

## Product-depth refinement — 2026-10-07

Four complete editorial arguments replace the short sample stubs. Reading durations derive from body words at 220 words per minute. Author/date and the reading-list action appear before the body; related category reading closes each essay. The issue rail lists other pieces while retaining the notebook and red-punctuation identity without oversized newsprint typography.

## Source of truth
- Status: Active
- Last refreshed: 2026-10-08
- Primary product surfaces: Home, article index, category route, search route, article details, bookmarks, build reference, 404.
- Evidence reviewed: existing What Framework starter conventions, server-rendering documentation and Vura static artifact conventions.

## Brand
- Personality: independent, literate, rigorous, quiet until it needs a red mark.
- Trust signals: complete articles, transparent local bookmark storage, proper 404, build notes and source paths.
- Avoid: SaaS cards, glossy gradients, fake comments, fake subscriber counts, remote editorial imagery.

## Product goals
- Goals: demonstrate a publication starter with build-time article rendering and small client-side reading tools; provide a distinctive contrast to the SaaS starters.
- Non-goals: CMS integration, user accounts, newsletter backend, analytics.
- Success signals: article pages read well with JavaScript disabled; search/bookmarks/progress client-mount cleanly; docs explain the patterns.

## Personas and jobs
- Primary personas: designer-publisher, research lab editor, agent generating a content-heavy static site.
- User jobs: browse articles, search categories, save a reading list, understand how to adapt the starter.
- Key contexts of use: public starter gallery, local template cloning, Vura static deployment.

## Information architecture
- Primary navigation: Front, Articles, Systems, Aesthetics, Search, Bookmarks, Build.
- Core routes/screens: `/`, `/articles`, `/category/systems`, `/category/aesthetics`, `/search`, `/bookmarks`, `/articles/:slug`, `/build`, `/404`.
- Content hierarchy: issue-led homepage, index/category lists, long-form article detail pages, reading tools.

## Design principles
- Principle 1: A readable contemporary notebook, with essay and index ahead of display typography.
- Principle 2: Client interactivity supports reading, not engagement theater.
- Tradeoffs: local search/bookmarks are preferred over remote services; the aesthetic is stark and text-led.

## Visual language
- Color: newsprint black, paper white, muted gray, one red punctuation color.
- Typography: Avenir Next / Segoe UI Variable / Segoe UI / sans-serif; 16px body at 1.6 line height, 14px chrome, bounded 48px desktop / 32px mobile headings and compact 28px masthead.
- Spacing/layout rhythm: 8px rhythm, light hairlines, two-column issue lead, flat index rows and readable article measure.
- Shape/radius/elevation: 6px controls, no shadows, hairlines rather than repeated cards.
- Motion: subtle route/read progress transitions, disabled under reduced motion.
- Imagery/iconography: typographic marks and section numbers only; no remote assets.

## Components
- Existing components to reuse: What `h` server rendering; What client `useSignal`, `useComputed`, `useEffect`.
- New/changed components: issue rail, article list, article page, server-rendered sidenotes, search island, bookmark button/list, reading-progress bar.
- Variants and states: bookmarked/unbookmarked, empty reading list, query results, active categories.
- Token/component ownership: CSS variables in `src/shared/site.css`; editorial data in `src/content/articles.mjs`.

## Accessibility
- Target standard: WCAG AA practical starter baseline.
- Keyboard/focus behavior: strong red outline, native buttons/links, focusable bookmark controls.
- Contrast/readability: black-on-white body copy, red used for emphasis only.
- Screen-reader semantics: one H1 per route, article landmarks, labeled search input, aria-live result count.
- Reduced motion and sensory considerations: transition and progress animations become instant.

## Responsive behavior
- Supported breakpoints/devices: mobile 360px+, tablet, desktop.
- Layout adaptations: broadsheet columns collapse to one column; article measure stays readable.
- Touch/hover differences: bookmark/search controls do not depend on hover.

## Interaction states
- Loading: static content is present at first paint.
- Empty: bookmarks route explains how to save articles.
- Error: 404 route uses publication language and links back to article index.
- Success: bookmark state changes text and local list immediately.
- Disabled: no disabled controls in normal flow.
- Offline/slow network: no external assets or services.

## Content voice
- Tone: precise, editorial, slightly severe.
- Terminology: issue, section, notebook, marginal note, reading list.
- Microcopy rules: avoid growth claims; disclose local-only storage.

## Implementation constraints
- Framework/styling system: `what-framework@0.13.10`, `what-compiler@0.13.10`, vanilla CSS.
- Design-token constraints: no remote fonts; CSS only.
- Performance constraints: pre-render all article pages, one small client bundle.
- Compatibility constraints: Node 22 build/test path; Vura CLI-prebuilt static artifact.
- Test/screenshot expectations: build checks, Playwright route/interaction smoke, desktop and mobile screenshots under `.screenshots/`.

## Open questions
- [ ] Publishing owner will confirm final public Vura URL after deployment.

## Refinement notes — 2026-10-02 Opus review
- Increased masthead/nav clearance so the large wordmark descender no longer crowds the primary nav.
- Added article-content sidenotes rendered on the server, strengthening the product’s actual marginalia concept without requiring JavaScript.
- Marked the featured essay as Current in Recent pieces and introduced a distinct article lede scale.
