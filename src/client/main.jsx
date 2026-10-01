import { mount, useComputed, useEffect, useSignal } from 'what-framework';

const index = safeJson(decodeEntities(document.querySelector('#article-index')?.textContent || '')) || [];
const STORAGE = 'marginalia-bookmarks';
const storageFallback = new Map();
const FALLBACK_PREFIX = '__marginalia_memory_v1__:';

function SearchIsland() {
  const query = useSignal('');
  const results = useComputed(() => {
    const q = query().trim().toLowerCase();
    if (!q) return index;
    return index.filter((article) =>
      [article.title, article.category, article.dek].join(' ').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <label for="search-input-live" class="meta">Search title, category or summary</label>
      <input
        id="search-input-live"
        type="search"
        value={query}
        placeholder="systems, state, red ink…"
        onInput={(event) => query(event.target.value)}
      />
      <p aria-live="polite">{() => `${results().length} result${results().length === 1 ? '' : 's'}`}</p>
      <div class="article-list">
        {() => results().map((article) => (
          <a class="article-row" href={article.path}>
            <span class="meta">{article.category}</span>
            <span><h3>{article.title}</h3><p>{article.dek}</p></span>
            <span class="meta">{article.minutes} min</span>
          </a>
        ))}
      </div>
    </>
  );
}

function BookmarksIsland() {
  const storageStatus = useSignal('persistent');
  const ids = useSignal(readBookmarks(storageStatus));
  const saved = useComputed(() => ids().map((id) => index.find((article) => article.slug === id)).filter(Boolean));

  useEffect(() => {
    safeStorageSet(STORAGE, JSON.stringify(ids()), storageStatus);
  });

  return (
    <div>
      {() => saved().length === 0 ? (
        <div class="empty-panel">
          <p>No saved pieces yet. Open an article and use “Save to reading list.”</p>
          <a class="button" href="/articles">Browse articles</a>
          <p hidden={() => storageStatus() === 'persistent'}>Storage is unavailable in this browser context, so this reading list will reset after the tab closes.</p>
        </div>
      ) : (
        <>
          <p aria-live="polite">{`${saved().length} saved piece${saved().length === 1 ? '' : 's'} stored locally.`}</p>
          <p hidden={() => storageStatus() === 'persistent'}>Storage is unavailable in this browser context, so this reading list will reset after the tab closes.</p>
          <div class="article-list bookmark-list">
            {saved().map((article) => (
              <a class="article-row" href={article.path}>
                <span class="meta">{article.category}</span>
                <span><h3>{article.title}</h3><p>{article.dek}</p></span>
                <span class="meta">{article.minutes} min</span>
              </a>
            ))}
          </div>
          <button type="button" onClick={() => ids([])}>Clear reading list</button>
        </>
      )}
    </div>
  );
}

function PageUtilities() {
  const storageStatus = useSignal('persistent');
  const ids = useSignal(readBookmarks(storageStatus));
  const progress = useSignal(0);

  useEffect(() => {
    const buttons = [...document.querySelectorAll('.bookmark-button')];
    function syncButtons() {
      const current = ids();
      safeStorageSet(STORAGE, JSON.stringify(current), storageStatus);
      for (const button of buttons) {
        const saved = current.includes(button.dataset.slug);
        button.setAttribute('aria-pressed', saved ? 'true' : 'false');
        button.textContent = saved ? 'Saved locally' : 'Save to reading list';
      }
    }
    const removers = buttons.map((button) => {
      const onClick = () => {
        const slug = button.dataset.slug;
        ids(ids().includes(slug) ? ids().filter((id) => id !== slug) : [...ids(), slug]);
      };
      button.addEventListener('click', onClick);
      return () => button.removeEventListener('click', onClick);
    });
    syncButtons();
    return () => removers.forEach((remove) => remove());
  });

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

  return <span hidden data-marginalia-utilities="ready" />;
}

function readBookmarks(storageStatus) {
  const parsed = safeJson(safeStorageGet(STORAGE, storageStatus));
  return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
}

function safeJson(value) {
  try { return value ? JSON.parse(value) : null; } catch { return null; }
}

function safeStorageGet(key, storageStatus) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    storageStatus('memory');
    return readFallbackStore()[key] || storageFallback.get(key) || null;
  }
}

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

function readFallbackStore() {
  try {
    if (!window.name?.startsWith(FALLBACK_PREFIX)) return {};
    const parsed = safeJson(window.name.slice(FALLBACK_PREFIX.length));
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function writeFallbackStore(store) {
  try {
    window.name = `${FALLBACK_PREFIX}${JSON.stringify(store)}`;
  } catch {
    // The in-page Map fallback still keeps controls usable for this document.
  }
}

function decodeEntities(value) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = value;
  return textarea.value;
}

const search = document.querySelector('#search-island');
if (search) mount(<SearchIsland />, search);

const bookmarks = document.querySelector('#bookmarks-island');
if (bookmarks) mount(<BookmarksIsland />, bookmarks);

const utilitiesHost = document.createElement('div');
document.body.appendChild(utilitiesHost);
mount(<PageUtilities />, utilitiesHost);
