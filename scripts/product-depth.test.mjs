import assert from 'node:assert/strict';
import { articles } from '../src/content/articles.mjs';
import { renderRoute, routes } from '../src/server/render.mjs';
for (const article of articles) {
  const words = article.body.join(' ').trim().split(/\s+/).length;
  assert.ok(words >= 180, `${article.slug}: complete argument required`);
  assert.equal(article.minutes, Math.max(1, Math.ceil(words / 220)));
  assert.ok(article.notes.length >= 2);
}
for (const route of routes) {
  const html = renderRoute(route, { assetPath: '/assets/main.js' });
  assert.ok(!/no trackers/i.test(html), `${route.path}: hosting analytics are not controlled by the publication`);
  assert.ok(html.includes('Read at your own pace.'));
}
console.log('ok substantive essays and derived reading duration');
