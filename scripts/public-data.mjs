import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export const payloadNames = ['models', 'providers', 'quotes', 'free-channels', 'samples', 'exclusions'];
export const hash = value => createHash('sha256').update(value).digest('hex');
export const readJson = file => JSON.parse(readFileSync(file, 'utf8'));
export const json = value => JSON.stringify(value, null, 2) + '\n';
export const stable = value => JSON.stringify(value);
export const cell = value => String(value ?? '—').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('|', '&#124;').replace(/\r?\n/g, ' ');
export const date = value => value ? cell(value.slice(0, 10)) : '未提供';

export function publicUrl(value) {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) return false;
    if (/^(localhost|127\.|0\.|10\.|192\.168\.|\[?::1\]?)/i.test(url.hostname)) return false;
    if (/^172\.(1[6-9]|2\d|3[01])\./.test(url.hostname) || !url.hostname.includes('.')) return false;
    return ![...url.searchParams.keys()].some(key => /^(api[-_]?key|access[-_]?token|token|secret|password|authorization|signature)$/i.test(key));
  } catch { return false; }
}

export function filesBelow(root) {
  return readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    if (['.git', 'node_modules'].includes(entry.name)) return [];
    const file = path.join(root, entry.name);
    if (entry.isSymbolicLink()) throw new Error('Publication cannot include symlinks');
    return entry.isDirectory() ? filesBelow(file) : [file];
  });
}

export function validatePayload(payload) {
  const errors = [];
  const models = new Map(payload.models.map(model => [model.key, model]));
  const providers = new Set(payload.providers.map(provider => provider.id));
  const unique = (rows, field, label) => {
    if (new Set(rows.map(row => row[field])).size !== rows.length) errors.push(`${label}: duplicate ${field}`);
  };
  unique(payload.models, 'key', 'models'); unique(payload.providers, 'id', 'providers'); unique(payload.quotes, 'id', 'quotes');
  if (!models.size || !providers.size || !payload.quotes.length) errors.push('Empty catalog; preserve previous data instead');
  const checkUrls = (value, location) => {
    if (typeof value === 'string' && /^https?:\/\//i.test(value) && !publicUrl(value)) errors.push(`${location}: non-public URL`);
    else if (Array.isArray(value)) value.forEach((child, i) => checkUrls(child, `${location}[${i}]`));
    else if (value && typeof value === 'object') Object.entries(value).forEach(([key, child]) => {
      if (/^(api[-_]?key|access[-_]?token|secret|password|cookie|authorization|accountEmail|orderId)$/i.test(key)) errors.push(`${location}: private field ${key}`);
      checkUrls(child, `${location}.${key}`);
    });
  };
  for (const quote of payload.quotes) {
    const model = models.get(quote.familyKey);
    if (!model || !providers.has(quote.provider)) errors.push(`${quote.id}: unknown model/provider`);
    if (quote.price.amount !== null && (!Number.isFinite(quote.price.amount) || quote.price.amount < 0)) errors.push(`${quote.id}: invalid price`);
    if (quote.audit.status === 'verified' && (!quote.audit.checkedAt || !quote.audit.sources.length)) errors.push(`${quote.id}: verified without dated source`);
    for (const qualification of quote.qualifications) {
      if (!model?.scenarios.some(scenario => scenario.key === qualification.scenarioKey)) errors.push(`${quote.id}: unknown scenario`);
      if (qualification.state === 'comparable' && (quote.audit.status !== 'verified' || quote.price.amount === null || !['USD', 'CNY'].includes(quote.price.currency))) errors.push(`${quote.id}: unsupported comparable quote`);
    }
  }
  const excluded = new Set(payload.exclusions.map(record => record.provider));
  if (payload.quotes.some(quote => excluded.has(quote.provider))) errors.push('Excluded provider appeared in price catalog');
  unique(payload.samples.scenes, 'id', 'sample scenes');
  for (const scene of payload.samples.scenes) {
    unique(scene.samples, 'model', scene.id);
    for (const sample of scene.samples) {
      if (!/^public\/samples\/[a-z0-9.-]+\.webp$/.test(sample.preview) || !/^[a-f0-9]{64}$/.test(sample.previewSha256) || !/^[a-f0-9]{64}$/.test(sample.originalSha256)) errors.push(`${scene.id}/${sample.model}: invalid image provenance`);
    }
  }
  payloadNames.forEach(name => checkUrls(payload[name], name));
  const text = JSON.stringify(payload);
  if (/(?:sk-(?:proj-)?[a-zA-Z0-9_-]{20,}|gh[pousr]_[a-zA-Z0-9]{25,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|[A-Z]:\\(?:Users|CodexData)|\/Users\/|\/home\/[a-z])/i.test(text)) errors.push('Sensitive value or local path found');
  return errors;
}

export function loadPayload(root) {
  return Object.fromEntries(payloadNames.map(name => [name, readJson(path.join(root, 'data', name + '.json'))]));
}

export function validateRepository(root) {
  const payload = loadPayload(root);
  const errors = validatePayload(payload);
  const metadata = readJson(path.join(root, 'data/metadata.json'));
  for (const name of payloadNames) {
    if (metadata.contentHashes[name] !== hash(stable(payload[name]))) errors.push(`${name}: snapshot hash mismatch`);
  }
  for (const scene of payload.samples.scenes) for (const sample of scene.samples) {
    const file = path.join(root, sample.preview);
    try {
      const bytes = readFileSync(file);
      if (hash(bytes) !== sample.previewSha256) errors.push(`${sample.preview}: image hash mismatch`);
      if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') errors.push(`${sample.preview}: invalid WebP`);
    } catch { errors.push(`${sample.preview}: missing preview`); }
  }
  const relativeLinks = /(?:!?\[[^\]]*\]\(|\b(?:src|href)=")([^ )"\s]+)(?:\)|")/g;
  const allowed = /^(?:README\.md|CONTRIBUTING\.md|COPYRIGHT\.md|package(?:-lock)?\.json|\.gitignore|data\/[a-z0-9.-]+\.json|scripts\/[a-z0-9.-]+\.mjs|tests\/[a-z0-9.-]+\.mjs|docs\/[a-z0-9.-]+\.md|docs\/github-about\.json|docs\/models\/[a-z0-9.-]+\.md|docs\/assets\/[a-z0-9.-]+\.(?:svg|webp|png)|public\/samples\/[a-z0-9.-]+\.webp|\.github\/ISSUE_TEMPLATE\/[a-z0-9.-]+\.yml|\.github\/workflows\/[a-z0-9.-]+\.yml)$/;
  for (const file of filesBelow(root)) {
    const relative = path.relative(root, file).replaceAll('\\', '/');
    if (!allowed.test(relative)) errors.push(`${relative}: outside public allowlist`);
    if (statSync(file).size > 2_000_000) errors.push(`${relative}: file exceeds 2 MB`);
    if (!/\.(?:md|json|mjs|yml)$/.test(file)) continue;
    const text = readFileSync(file, 'utf8');
    if (/(?:sk-(?:proj-)?[a-zA-Z0-9_-]{20,}|gh[pousr]_[a-zA-Z0-9]{25,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/.test(text)) errors.push(`${relative}: possible credential`);
    if (file.endsWith('.md')) for (const match of text.matchAll(relativeLinks)) {
      const reference = match[1].replace(/^<|>$/g, '');
      if (/^(?:https?:|#|mailto:)/.test(reference)) continue;
      const target = path.resolve(path.dirname(file), decodeURIComponent(reference.split('#')[0]));
      if (!target.startsWith(path.resolve(root) + path.sep) || !statSafe(target)) errors.push(`${relative}: missing/escaping relative link ${match[1]}`);
    }
  }
  return { errors, counts: { models: payload.models.length, providers: payload.providers.length, quotes: payload.quotes.length, freeChannels: payload['free-channels'].channels.length, scenes: payload.samples.scenes.length, samples: payload.samples.scenes.reduce((total, scene) => total + scene.samples.length, 0) } };
}

function statSafe(file) { try { return statSync(file).isFile() || statSync(file).isDirectory(); } catch { return false; } }
