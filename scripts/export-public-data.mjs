import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { hash, json, payloadNames, readJson, stable, validatePayload } from './public-data.mjs';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const arg = process.argv.indexOf('--source');
if (arg < 0 || !process.argv[arg + 1]) throw new Error('Use npm run export -- --source /absolute/path/to/APIpk');
const source = path.resolve(process.argv[arg + 1]);
if (source === root) throw new Error('Source must be the maintained website checkout');
const load = file => import(pathToFileURL(path.join(source, file)).href);
const { seedData } = await load('data/model-api-seed.ts');
const { applyPriceAudit } = await load('lib/model-api/price-audit.ts');
const { publishedCatalog, removedProviders } = await load('lib/model-api/published-catalog.ts');
const { quoteEligibility, quoteMatchesScenario } = await load('lib/quote-eligibility.ts');
const fx = readJson(path.join(source, 'data/display-exchange-rate.json'));
const catalog = publishedCatalog(applyPriceAudit(seedData));
const pick = (value, keys) => Object.fromEntries(keys.map(key => [key, value?.[key] ?? null]));
const models = catalog.modelFamilies.filter(model => model.mediaType === 'image').map(model => ({ ...pick(model, ['key', 'name', 'description', 'defaultScenarioKey']), scenarios: model.scenarios.map(scenario => pick(scenario, ['key', 'name', 'description', 'capability', 'specs'])) }));
const families = new Map(models.map(model => [model.key, model]));
const quotes = catalog.skus.filter(sku => families.has(sku.familyKey)).map(sku => {
  const billing = sku.billing;
  const audit = billing.audit;
  const fallbackSources = catalog.evidence.filter(evidence => sku.sourceEvidenceIds.includes(evidence.id) && evidence.access === 'public').map(evidence => evidence.url);
  const terms = billing.commercial;
  return {
    ...pick(sku, ['id', 'familyKey', 'provider', 'providerName', 'modelId', 'channelName', 'skuName', 'routeType', 'capability', 'scenarioKey', 'specs', 'billingGroup', 'mappingStatus', 'availabilityStatus', 'reviewStatus', 'conflictNote']),
    price: pick(billing.rawQuote, ['amount', 'currency', 'unit', 'originalText', 'formula', 'quoteKind']),
    audit: { status: audit?.status ?? 'unverified', checkedAt: audit?.checkedAt ?? null, note: audit?.note ?? null, sources: [...new Set(audit?.sources?.length ? audit.sources : fallbackSources)], components: (audit?.components ?? []).map(component => pick(component, ['label', 'amount', 'currency', 'unit'])) },
    qualityPricing: billing.qualityPricing ? pick(billing.qualityPricing, ['mode', 'qualities', 'checkedAt', 'sources']) : null,
    commercial: terms ? { ...pick(terms, ['subscription', 'minimumFirstPayment', 'minimumTopup', 'period', 'creditExpiry', 'condition', 'sources', 'checkedAt', 'promotionEndsAt', 'qualificationNote']), failedCharge: terms.failedCharge ? pick(terms.failedCharge, ['rule', 'source', 'checkedAt']) : null, package: terms.package ? pick(terms.package, ['annualFee', 'monthlyFee', 'monthlyAlternativeFee', 'monthlyCredits', 'creditsPerImage', 'currency']) : null } : null,
    qualifications: families.get(sku.familyKey).scenarios.filter(scenario => scenario.key === sku.scenarioKey || quoteMatchesScenario(sku, scenario)).map(scenario => ({ scenarioKey: scenario.key, ...quoteEligibility(sku, scenario, fx.rate) })),
    actualBilledCost: null, generationTestedAt: null,
  };
}).sort((a, b) => a.id.localeCompare(b.id));
const providers = [...new Set(quotes.map(quote => quote.provider))].sort().map(id => ({ id, name: quotes.find(quote => quote.provider === id).providerName, modelKeys: [...new Set(quotes.filter(quote => quote.provider === id).map(quote => quote.familyKey))].sort(), sources: [...new Set(quotes.filter(quote => quote.provider === id).flatMap(quote => quote.audit.sources))].sort() }));
const free = readJson(path.join(source, 'data/free-channel-models.json'));
const freeChannels = {
  checkedAt: free.checkedAt,
  channels: free.channels.map(channel => ({
    ...pick(channel, ['id', 'name', 'url', 'dailyCredits', 'quota', 'unit', 'feature', 'checkedAt']),
    models: channel.models.map(model => ({ ...pick(model, ['name', 'modelKey', 'costs', 'use', 'access', 'source', 'costVerified']), accessMode: model.accessMode ? pick(model.accessMode, ['web', 'api', 'source', 'checkedAt', 'note']) : null, specifications: (model.specifications ?? []).map(spec => pick(spec, ['resolution', 'quality', 'capability', 'outputs', 'cost'])) })),
  })).sort((a, b) => a.id.localeCompare(b.id)),
};
const originalSamples = readJson(path.join(source, 'data/model-sample-comparison.json'));
const samples = {
  source: originalSamples.source, retrievedAt: originalSamples.retrievedAt,
  evidenceType: 'provider_public_examples', crossProviderBenchmark: false,
  scenes: originalSamples.scenes.map(scene => ({ ...pick(scene, ['id', 'label', 'prompt']), samples: scene.samples.map(sample => {
    const filename = path.basename(sample.src).replace(/\.png$/, '.webp');
    const thumb = path.join(source, 'public/samples/thumbs', filename);
    return { model: sample.model, name: sample.name, preview: 'public/samples/' + filename, previewSha256: hash(readFileSync(thumb)), originalSource: sample.source, originalSha256: sample.sha256, originalWidth: sample.width, originalHeight: sample.height };
  }) })),
};
const exclusions = [...removedProviders].sort().map(provider => ({ provider, scope: 'price_catalog', status: 'removed_by_maintainer', reason: '已由维护者移出网站公开价格比较；未提供可公开的详细原因，不据此判断服务质量。', removedAt: null }));
const payload = { models, providers, quotes, 'free-channels': freeChannels, samples, exclusions };
const errors = validatePayload(payload);
if (errors.length) throw new Error('Export validation failed; previous snapshot preserved: ' + errors.join('; '));
const contentHashes = Object.fromEntries(payloadNames.map(name => [name, hash(stable(payload[name]))]));
const previousFile = path.join(root, 'data/metadata.json');
const previous = existsSync(previousFile) ? readJson(previousFile) : null;
const contentChanged = !previous || stable(contentHashes) !== stable(previous.contentHashes);
const snapshotAt = contentChanged ? new Date().toISOString() : previous.lastContentChangedAt;
const changedDatasets = payloadNames.filter(name => !previous || previous.contentHashes[name] !== contentHashes[name]);
const dates = quotes.map(quote => quote.audit.checkedAt).filter(Boolean).sort();
const metadata = {
  schemaVersion: 1, lastContentChangedAt: snapshotAt,
  catalogSource: 'reviewed website static catalog; runtime database and user submissions excluded',
  sourceCheckedAt: { oldestQuote: dates[0] ?? null, latestQuote: dates.at(-1) ?? null, freeRules: free.checkedAt, sampleCollection: originalSamples.retrievedAt },
  referenceFx: pick(fx, ['base', 'quote', 'rate', 'asOf', 'checkedAt', 'source', 'note']),
  contentHashes, latestContentChanges: contentChanged ? { date: snapshotAt, datasets: changedDatasets } : previous.latestContentChanges,
  measurements: { paidCrossProviderBatches: 0, humanBlindVotes: 0, eloRanking: false },
};
const historyFile = path.join(root, 'data/history.json');
const history = existsSync(historyFile) ? readJson(historyFile) : [];
if (contentChanged) history.push({ date: snapshotAt, datasets: changedDatasets, kind: previous ? 'public_data_changed' : 'initial_public_snapshot' });
// Validate the entire candidate before writing any data or copying assets. No network, secrets or paid calls are used.
mkdirSync(path.join(root, 'data'), { recursive: true });
mkdirSync(path.join(root, 'public/samples'), { recursive: true });
for (const scene of samples.scenes) for (const sample of scene.samples) {
  copyFileSync(path.join(source, 'public/samples/thumbs', path.basename(sample.preview)), path.join(root, sample.preview));
}
for (const name of payloadNames) writeFileSync(path.join(root, 'data', name + '.json'), name === 'quotes' ? '[\n' + payload.quotes.map(quote => JSON.stringify(quote)).join(',\n') + '\n]\n' : json(payload[name]));
writeFileSync(previousFile, json(metadata));
writeFileSync(historyFile, json(history));
console.log(JSON.stringify({ contentChanged, changedDatasets, models: models.length, providers: providers.length, quotes: quotes.length, freeChannels: freeChannels.channels.length, samples: samples.scenes.reduce((total, scene) => total + scene.samples.length, 0), lastContentChangedAt: snapshotAt }));
