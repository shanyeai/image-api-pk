import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadPayload, publicUrl, validatePayload, validateRepository } from '../scripts/public-data.mjs';
const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const fixture = () => structuredClone(loadPayload(root));

test('published quotes never restore excluded channels', () => {
  const data = fixture();
  assert.deepEqual(validatePayload(data), []);
  data.quotes[0].provider = data.exclusions[0].provider;
  assert.ok(validatePayload(data).some(error => error.includes('Excluded provider')));
});
test('missing prices remain missing and cannot become comparable zero-cost offers', () => {
  const data = fixture();
  const quote = data.quotes.find(quote => quote.qualifications.some(item => item.state === 'comparable'));
  quote.price.amount = null;
  assert.ok(validatePayload(data).some(error => error.includes('unsupported comparable quote')));
});
test('verified prices require a dated public source', () => {
  const data = fixture();
  const quote = data.quotes.find(quote => quote.audit.status === 'verified');
  quote.audit.checkedAt = null;
  assert.ok(validatePayload(data).some(error => error.includes('verified without dated source')));
});
test('empty source snapshots are rejected instead of wiping a previous catalog', () => {
  const data = fixture();
  data.quotes = [];
  assert.ok(validatePayload(data).some(error => error.includes('Empty catalog')));
});
test('private URLs and credentials cannot be published as provenance', () => {
  for (const url of ['http://127.0.0.1:3000/', 'https://example.com/?api_key=private', 'https://user:pass@example.com/', 'https://192.168.0.2/']) assert.equal(publicUrl(url), false);
  assert.equal(publicUrl('https://example.com/pricing'), true);
  const data = fixture();
  data.quotes[0].audit.sources = ['https://example.com/?access_token=private'];
  assert.ok(validatePayload(data).some(error => error.includes('non-public URL')));
});
test('private fields cannot enter an otherwise public data snapshot', () => {
  const data = fixture();
  data.quotes[0].apiKey = 'private-value';
  assert.ok(validatePayload(data).some(error => error.includes('private field')));
});
test('published documents and all image previews retain valid links and hashes', () => {
  assert.deepEqual(validateRepository(root).errors, []);
});
