import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { cell, date, loadPayload, readJson, validatePayload } from './public-data.mjs';

const root = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const data = loadPayload(root);
const errors = validatePayload(data);
if (errors.length) throw new Error('Generation stopped: ' + errors.join('; '));
const metadata = readJson(path.join(root, 'data/metadata.json'));
const history = readJson(path.join(root, 'data/history.json'));
const sourceLink = url => `[来源](<${url}>)`;
const modelLink = model => `[${cell(model.name)}](docs/models/${model.key}.md)`;
const amount = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 6, useGrouping: false });
const stateLabels = { comparable: '可比官网报价', needs_usage: '需按用量计算', reference: '仅作参考', unavailable: '不可比 / 待重新核对' };
const auditLabels = { verified: '官网报价已核对', reference: '参考资料', unverified: '待核实', conflict: '存在冲突' };
const accessLabels = { confirmed: '已确认', unconfirmed: '未确认', unavailable: '不可用', paid: '付费', free: '免费规则', trial: '试用' };
const priceText = quote => quote.price.amount === null ? (quote.billingGroup === 'input_output_usage' ? '按输入 / 输出用量' : '暂无明确单价') : `${quote.price.currency === 'CNY' ? '¥' : quote.price.currency === 'USD' ? '$' : cell(quote.price.currency) + ' '}${amount(quote.price.amount)} / ${quote.price.unit === 'image' ? '张' : quote.price.unit === 'request' ? '次' : cell(quote.price.unit)}`;
const condition = quote => [quote.channelName, quote.commercial?.condition, quote.audit.note].filter(Boolean).map(cell).join('；');
const write = (relative, text) => { mkdirSync(path.dirname(path.join(root, relative)), { recursive: true }); writeFileSync(path.join(root, relative), text.trim() + '\n'); };
const samples = data.samples.scenes.reduce((total, scene) => total + scene.samples.length, 0);
const pricingRows = data.models.map(model => {
  const scenario = model.scenarios.find(scenario => scenario.key === model.defaultScenarioKey);
  const examples = data.quotes.filter(quote => quote.familyKey === model.key && quote.qualifications.some(qualification => qualification.scenarioKey === scenario.key && qualification.state === 'comparable')).sort((a, b) => a.provider.localeCompare(b.provider) || a.id.localeCompare(b.id)).filter((quote, index, rows) => rows.findIndex(candidate => candidate.provider === quote.provider) === index).slice(0, 2);
  const entries = examples.map(quote => `${cell(quote.providerName)} · ${cell(quote.channelName)}：${priceText(quote)}（${date(quote.audit.checkedAt)}，${sourceLink(quote.audit.sources[0])}）`).join('<br>') || '当前没有满足默认规格条件的固定单价；查看用量费率与待核实资料';
  return `| ${modelLink(model)} | ${cell(scenario.name)} | ${entries} |`;
}).join('\n');
const modelRows = data.models.map(model => `| ${modelLink(model)} | ${data.providers.filter(provider => provider.modelKeys.includes(model.key)).length} | [网站详情](https://apipk.site/models/${model.key}) |`).join('\n');
const latest = history.at(-1);

write('README.md', `
<p align="center"><img src="docs/assets/github-social.png" alt="APIpk · 生图模型与图片 API 中转站对比" width="880" /></p>

# APIpk · 生图模型与图片 API 中转站对比

按相同规格查生图 API 价格，用同一提示词直观看不同模型的图片效果。收录 GPT Image、Nano Banana、Seedream、Grok 等型号的渠道报价、免费入口和使用指南。

[访问网站](https://apipk.site) · [模型图片对比](https://apipk.site/model-test) · [免费生图入口](https://apipk.site/free-channels) · [比较方法](docs/methodology.md) · [最近变更](docs/changelog.md)

## 从你的需求开始

| 想解决什么 | 去哪里看 |
| --- | --- |
| 直观看模型生成效果 | [图片矩阵](https://apipk.site/model-test) / [逐张样图与完整提示词](docs/samples.md) |
| 比较同型号、同尺寸的渠道报价 | 下方价格摘要 / [全部模型](docs/models.md) / [渠道索引](docs/providers.md) |
| 找免费额度，区分网页与 API | [免费规则与资格](docs/free-channels.md) / [网站筛选](https://apipk.site/free-channels) |
| 检查自己的 Key 能否调用 | [API 测试页](https://apipk.site/model-test)，由所选渠道计费 |
| 选择 Nano Banana 或了解接入 | [使用指南](docs/guides.md) |

## 同规格价格摘要

按网站默认场景展示每个型号的部分官网报价，渠道按标识排序；这不是最低价榜或推荐排名。规格、套餐条件和其他渠道请打开模型详情，质量未指定的报价不外推到特定质量档。

| 型号 | 默认规格 | 已核对报价示例 · 核对日期 |
| --- | --- | --- |
${pricingRows}

报价来自公开资料，不代表实际扣费或接口稳定性；按 Token、订阅套餐与缺少完整规格的资料不转换成固定单张价格。网页标价、免费资格和真实调用各自保留证据。

![网站同规格渠道报价](docs/assets/model-prices.webp)

## 全模型生图效果对比

同一提示词，直观看不同模型的生成效果。

![全模型生图效果对比](docs/assets/model-comparison.webp)

[在网站打开原图](https://apipk.site/model-test) · [查看逐张预览、提示词与来源](docs/samples.md)

## 当前收录范围

本快照有 **${data.models.length} 个生图型号分组、${data.providers.length} 个报价渠道、${data.quotes.length} 条规格记录、${data['free-channels'].channels.length} 个免费规则渠道**。图片为 **${data.samples.scenes.length} 个场景 × ${data.samples.scenes[0].samples.length} 个展示型号，共 ${samples} 张**。

| 型号 | 报价渠道数 | 完整交互入口 |
| --- | --- | --- |
${modelRows}

型号与质量档以记录为准；渠道自定义名称不自动等同于厂商独立型号。当前图片来自同一渠道的公开样图，尚无跨渠道重复生成批次、人工盲评胜率或 Elo 排名。

## 数据时间与更新

- 最近公开内容变更：${date(metadata.lastContentChangedAt)}。这是导出内容的变更时间。
- 报价核对日期范围：${date(metadata.sourceCheckedAt.oldestQuote)} 至 ${date(metadata.sourceCheckedAt.latestQuote)}；免费规则：${date(metadata.sourceCheckedAt.freeRules)}；样图采集：${date(metadata.sourceCheckedAt.sampleCollection)}。
- 最近变更内容：${cell(latest.datasets.join('、'))}。没有内容变化不会刷新测评日期。
- [数据快照与摘要](data/metadata.json) · [有效变更记录](docs/changelog.md) · [待核实与移出说明](docs/exclusions.md)。

公开资料由网站静态目录按字段清单导出，再生成本 README 和详情文档。已提供导出、生成和校验脚本；当前未配置每日来源采集或自动推送。

## 使用指南与参与完善

[Nano Banana 选型、免费入口与 API 接入](docs/guides.md) · [常见问题](docs/faq.md) · [比较方法](docs/methodology.md) · [关系披露](docs/disclosures.md)

![APIpk 首页与模型入口](docs/assets/home.webp)

通过 [Issue](https://github.com/shanyeai/image-api-pk/issues/new/choose) 补充渠道、纠正价格或报告待核实问题。请提供精确型号、规格、公开来源与日期，不提交 Key 或个人账单。[贡献说明](CONTRIBUTING.md)

维护者操作见[数据维护](docs/maintenance.md)。原创内容未授予开放复用许可证，第三方图片与数据保留各自来源和权利，见[版权说明](COPYRIGHT.md)。
`);

write('docs/models.md', `# 生图模型目录\n\n按默认规格和其他规格分开查阅；各页保留来源、核对日期和证据状态。\n\n| 型号 | 规格记录数 |\n| --- | --- |\n${data.models.map(model => `| [${cell(model.name)}](models/${model.key}.md) | ${data.quotes.filter(quote => quote.familyKey === model.key).length} |`).join('\n')}\n\n[返回仓库首页](../README.md)`);
for (const model of data.models) {
  const rows = data.quotes.filter(quote => quote.familyKey === model.key).map(quote => {
    const scenario = model.scenarios.find(scenario => scenario.key === quote.scenarioKey);
    const state = quote.qualifications.find(qualification => qualification.scenarioKey === quote.scenarioKey)?.state ?? 'reference';
    const sources = quote.audit.sources.map(sourceLink).join(' ');
    return `| ${cell(quote.providerName)} · ${cell(quote.modelId)} | ${cell(scenario?.name ?? quote.skuName)} | ${priceText(quote)} | ${auditLabels[quote.audit.status] ?? cell(quote.audit.status)}；${stateLabels[state] ?? cell(state)} | ${date(quote.audit.checkedAt)} | ${sources || '待补充'} | ${condition(quote)} |`;
  }).join('\n');
  write(`docs/models/${model.key}.md`, `# ${model.name}\n\n[网站交互比较](https://apipk.site/models/${model.key}) · [全部模型](../models.md) · [比较方法](../methodology.md)\n\n下表为来源记录中的渠道型号及报价。核对价格不证明接口可用或模型身份；默认规格与其他规格分开记录。实际扣费记录尚未纳入本公开快照。\n\n| 渠道 · 请求型号 | 规格 | 报价 | 证据与可比状态 | 核对日期 | 来源 | 适用条件与说明 |\n| --- | --- | --- | --- | --- | --- | --- |\n${rows}\n\n完整字段见 [报价 JSON](../../data/quotes.json)。此页面由数据生成。`);
}

write('docs/providers.md', `# 图片 API 渠道索引\n\n收录表示存在公开资料，不代表长期稳定性或推荐星级。\n\n| 渠道 | 型号分组 | 公开来源 |\n| --- | --- | --- |\n${data.providers.map(provider => `| ${cell(provider.name)} | ${provider.modelKeys.map(key => `[${cell(data.models.find(model => model.key === key).name)}](models/${key}.md)`).join('、')} | ${provider.sources.slice(0, 2).map(sourceLink).join(' ')} |`).join('\n')}\n\n[渠道 JSON](../data/providers.json) · [关系披露](disclosures.md) · [返回首页](../README.md)`);

write('docs/free-channels.md', `# 免费生图入口与资格\n\n规则核对时间：${date(data['free-channels'].checkedAt)}。网页免费与免费 API 分开记录；试用、积分和免费额度均不等于无限调用。这里没有重新执行生成或兑付测试。\n\n| 渠道 | 公开额度说明 | 收录型号与资格 | 核对日期 |\n| --- | --- | --- | --- |\n${data['free-channels'].channels.map(channel => `| [${cell(channel.name)}](<${channel.url}>) | ${cell(channel.quota)} | ${channel.models.map(model => `${cell(model.name)}：${accessLabels[model.access] ?? cell(model.access)}，网页 ${accessLabels[model.accessMode?.web] ?? '未确认'} / API ${accessLabels[model.accessMode?.api] ?? '未确认'}（${sourceLink(model.source)}）`).join('<br>')} | ${date(channel.checkedAt)} |`).join('\n')}\n\n额度、每张消耗、适用规格和来源原文见 [免费规则 JSON](../data/free-channels.json)。[网站筛选](https://apipk.site/free-channels) · [返回首页](../README.md)`);

const firstScene = data.samples.scenes[0];
write('docs/samples.md', `# 全模型生图效果对比\n\n同一提示词，直观看不同模型的生成效果。\n\n<table>\n<tr><th>型号</th>${data.samples.scenes.map(scene => `<th>${cell(scene.label)}</th>`).join('')}</tr>\n${firstScene.samples.map(sample => `<tr><th>${cell(sample.name)}</th>${data.samples.scenes.map(scene => { const item = scene.samples.find(item => item.model === sample.model); return `<td><a href="${item.originalSource}"><img src="../${item.preview}" width="210" alt="${cell(scene.label)} · ${cell(item.name)}" /></a></td>`; }).join('')}</tr>`).join('\n')}\n</table>\n\n## 完整提示词\n\n${data.samples.scenes.map(scene => `### ${cell(scene.label)}\n\n${scene.prompt.replace(/\r\n/g, '\n')}`).join('\n\n')}\n\n## 来源与证据\n\n样图采集于 ${date(data.samples.retrievedAt)}，来自 ${sourceLink(data.samples.source)}；点击预览链接访问来源原图。此处保留提示词、原图尺寸与 SHA-256，预览另存哈希，见 [样图 JSON](../data/samples.json)。这些是公开展示样图，未重新生成，也不构成不同渠道的实测结果。[比较方法](methodology.md) · [版权说明](../COPYRIGHT.md)`);

write('docs/changelog.md', `# 有效内容变更\n\n只记录公开内容变化；导出任务无变化时保留原记录。变更日期不替代来源核对或实际测试日期。\n\n${[...history].reverse().map(entry => `## ${date(entry.date)}\n\n${entry.kind === 'initial_public_snapshot' ? '首次整理公开数据快照' : '公开数据更新'}：${cell(entry.datasets.join('、'))}。未新增付费跨渠道批次或人类盲评记录。`).join('\n\n')}\n\n[快照摘要](../data/metadata.json) · [返回首页](../README.md)`);
write('docs/exclusions.md', `# 待核实与移出说明\n\n## 价格记录待核实\n\n当前有 ${data.quotes.filter(quote => quote.audit.status !== 'verified').length} 条价格记录尚未标记为官网报价已核对；详见各型号的证据、规格和适用条件。这不等于判定服务商不可靠。\n\n## 已移出公开价格比较的渠道\n\n以下沿用网站现有公开过滤规则，保留移出状态，不恢复历史报价。移出原因尚未获得可公开的详细说明，原移出日期未提供；此列表不是跑路或安全黑名单。免费入口目录使用其自身的公开范围。\n\n| 渠道标识 | 范围 | 说明 |\n| --- | --- | --- |\n${data.exclusions.map(record => `| ${cell(record.provider)} | 网站及本仓库价格目录 | ${cell(record.reason)} |`).join('\n')}\n\n如需更正或恢复，请通过[待核实反馈表单](https://github.com/shanyeai/image-api-pk/issues/new/choose)提供公开证据。[状态 JSON](../data/exclusions.json)`);
console.log(JSON.stringify({ generatedModels: data.models.length, snapshotDate: metadata.lastContentChangedAt, historyEntries: history.length }));
