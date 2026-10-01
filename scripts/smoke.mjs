import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(process.cwd(), 'dist/static');
if (!existsSync(root)) throw new Error('dist/static missing; run npm run build first');

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let file = join(root, decodeURIComponent(url.pathname));
  if (!extname(file)) file = join(file, 'index.html');
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, '404.html');
  res.setHeader('content-type', contentType(file));
  res.statusCode = file.endsWith('404.html') && !url.pathname.startsWith('/404') ? 404 : 200;
  res.end(readFileSync(file));
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const failures = [];

async function check(name, fn) {
  try {
    await fn();
    console.log(`ok ${name}`);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
    console.log(`FAIL ${name}: ${error.message}`);
  }
}

try {
  await check('desktop routes load without console errors', async () => {
    const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    for (const path of ['/', '/articles', '/category/systems', '/category/aesthetics', '/search', '/bookmarks', '/build', '/articles/red-ink-for-state']) {
      const res = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      if (res.status() !== 200) throw new Error(`${path} status ${res.status()}`);
      if (await page.locator('h1').count() !== 1) throw new Error(`${path} h1 count`);
      if (path === '/') await page.screenshot({ path: '.screenshots/marginalia-home-desktop.png', fullPage: true });
    }
    if (errors.length) throw new Error(errors.join(' | '));
    await page.screenshot({ path: '.screenshots/marginalia-article-desktop.png', fullPage: true });
    await page.close();
  });

  await check('search filters the local article index', async () => {
    const page = await browser.newPage();
    await page.goto(`${base}/search`, { waitUntil: 'networkidle' });
    await page.locator('#search-input-live').fill('red');
    const count = await page.locator('.article-row').count();
    if (count < 1 || count > 2) throw new Error(`unexpected result count ${count}`);
    await page.close();
  });

  await check('bookmark saves article locally and appears in reading list', async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 820 }, isMobile: true });
    await page.goto(`${base}/articles/red-ink-for-state`, { waitUntil: 'networkidle' });
    await page.locator('.bookmark-button').click();
    const stored = await page.evaluate(() => localStorage.getItem('marginalia-bookmarks'));
    if (!stored?.includes('red-ink-for-state')) throw new Error('bookmark was not stored');
    await page.goto(`${base}/bookmarks`, { waitUntil: 'networkidle' });
    const title = await page.locator('.article-row h3').first().textContent();
    if (!title.includes('Red ink')) throw new Error(`bookmark did not render: ${title}`);
    await page.locator('button', { hasText: 'Clear reading list' }).click();
    if (await page.locator('.article-row').count() !== 0) throw new Error('bookmark rows remained after clear');
    if (await page.locator('a.button[href="/articles"]', { hasText: 'Browse articles' }).count() !== 1) {
      throw new Error('empty guidance did not return after clear');
    }
    await page.screenshot({ path: '.screenshots/marginalia-mobile.png', fullPage: true });
    await page.close();
  });

  await check('bookmarks still function when browser storage is denied', async () => {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      const denied = () => { throw new DOMException('denied', 'SecurityError'); };
      Storage.prototype.getItem = denied;
      Storage.prototype.setItem = denied;
    });
    await page.goto(`${base}/articles/red-ink-for-state`, { waitUntil: 'networkidle' });
    await page.locator('.bookmark-button').click();
    const state = await page.evaluate(() => ({
      pressed: document.querySelector('.bookmark-button')?.getAttribute('aria-pressed'),
      label: document.querySelector('.bookmark-button')?.textContent,
    }));
    if (state.pressed !== 'true' || !state.label?.includes('Saved')) {
      throw new Error(`bookmark button inert with storage denied: ${JSON.stringify(state)}`);
    }
    await page.goto(`${base}/bookmarks`, { waitUntil: 'networkidle' });
    if (await page.locator('.article-row h3', { hasText: 'Red ink for state' }).count() !== 1) {
      throw new Error('memory fallback bookmark did not render in same tab');
    }
    await page.close();
  });

  await check('unknown path returns genuine 404', async () => {
    const res = await fetch(`${base}/lost-note`);
    const html = await res.text();
    if (res.status !== 404) throw new Error(`status ${res.status}`);
    if (!html.includes('The note is missing')) throw new Error('404 copy missing');
  });
} finally {
  await browser.close();
  server.close();
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

function contentType(file) {
  if (file.endsWith('.css')) return 'text/css';
  if (file.endsWith('.js')) return 'text/javascript';
  if (file.endsWith('.xml')) return 'application/xml';
  if (file.endsWith('.txt')) return 'text/plain';
  return 'text/html; charset=utf-8';
}
