<p align="center"><img src="docs/assets/github-social.png" alt="APIpk · 生图模型与图片 API 中转站对比" width="880" /></p>

# APIpk · 生图模型与图片 API 中转站对比

哪里可以免费 AI 生图？哪个模型效果好？每月生成一批图片要花多少钱，卖什么价格才有利润？APIpk 整理免费生图网站与模型额度、能力排行、同题样图和图片 API 渠道报价，并提供成本与定价计算工具。覆盖 GPT Image、Nano Banana、Seedream、Grok 等型号。

[访问网站](https://apipk.site) · [免费生图](https://apipk.site/free-channels) · [能力排行](https://apipk.site/image-model-rankings) · [图片对比](https://apipk.site/model-test) · [成本与定价](https://apipk.site/pricing)

## 从你的需求开始

| 想解决什么 | 去哪里看 |
| --- | --- |
| 找免费生图网站、GPT Image / Nano Banana 免费入口 | [免费生图目录](https://apipk.site/free-channels) / [免费规则与资格](docs/free-channels.md) |
| 了解模型能力排名，缩小选型范围 | [生图模型能力排行榜](https://apipk.site/image-model-rankings) |
| 直观看模型生成效果 | [图片矩阵](https://apipk.site/model-test) / [逐张样图与完整提示词](docs/samples.md) |
| 比较同型号、同尺寸的渠道报价 | 下方价格摘要 / [全部模型](docs/models.md) / [渠道索引](docs/providers.md) |
| 看月度生成量是否在预算内 | [月度预算](https://apipk.site/pricing?mode=budget)，比较预计消耗与首次付款 |
| 按目标毛利率定价，或按售价找有利润的渠道 | [测算售价](https://apipk.site/pricing?mode=margin) / [测算利润](https://apipk.site/pricing?mode=sale) |
| 检查自己的 Key 能否调用 | [API 测试页](https://apipk.site/model-test)，由所选渠道计费 |
| 选择 Nano Banana 或了解接入 | [使用指南](docs/guides.md) |

## 哪里可以免费 AI 生图？

想先试效果、暂时不想充值，可以从[免费生图目录](https://apipk.site/free-channels)找入口。当前公开快照收录 **30 个渠道**，支持按渠道或模型查找，查看 GPT Image、Nano Banana、Seedream 等型号的免费规则。

| 选免费入口时要看什么 | 网站提供什么 |
| --- | --- |
| 我想用的模型，哪里能免费生成？ | 搜索渠道或模型，查看对应入口与公开来源 |
| 免费额度多久刷新？ | 分开显示每日、每周、每月与一次性额度 |
| 能生成多少张、支持什么规格？ | 对照规格与每张积分消耗，按已核实规则计算可生成张数 |
| 网页能用，API 也免费吗？ | 分别标注网页与 API 的免费资格，并显示未确认状态 |

不同模型可能共用同一份额度，免费张数不能直接相加。免费资格、张数和支持规格以页面所列来源及核对日期为准。

![免费生图渠道、模型规格与可生成张数](docs/assets/free-channels.webp)

[打开免费生图目录](https://apipk.site/free-channels) · [查看完整规则与资格](docs/free-channels.md)

## 能力排行：先选适合自己的模型

[生图模型能力排行榜](https://apipk.site/image-model-rankings)整理 [Arena Text-to-Image 榜单](https://arena.ai/leaderboard/text-to-image)的前 20 名，展示模型版本、分数、票数、分数不确定范围与排名区间，并标注来源更新时间和核对日期。已收录型号可继续打开价格对比；能匹配具体规格时优先查看同规格价格。

可以先用排行选出候选模型，再用下面的同题样图判断风格、细节和提示词遵循情况，最后比较渠道报价。**能力排行来自外部 Arena，图片展示是公开样图**；两者来源与用途不同，模型排名也不能证明某个中转站的稳定性。

![生图模型能力排行、分数、票数与价格入口](docs/assets/model-rankings.webp)

## 成本与定价：预算够不够，售价怎么定？

[成本与定价工具](https://apipk.site/pricing)适合做图片产品、接入生图 API，或估算批量生成成本。先选择模型、分辨率与质量档，再比较渠道；支持人民币和美元视图。

| 计算方式 | 输入什么 | 能得到什么 |
| --- | --- | --- |
| [月度预算](https://apipk.site/pricing?mode=budget) | 预计每月生成张数、目标毛利率或售价 | 预计月消耗、有效单价、首次需付款、建议售价与单张毛利润 |
| [测算售价](https://apipk.site/pricing?mode=margin) | 目标毛利率，例如 30% | 各渠道达到目标毛利率的建议售价，按分向上取整 |
| [测算利润](https://apipk.site/pricing?mode=sale) | 既定售价，例如 ¥0.10 / 张 | 单张毛利润与毛利率，筛选成本低于售价的渠道 |

例如，**假设 API 成本为 ¥0.03 / 张**：每月生成 1,000 张，API 消耗约 ¥30；目标毛利率 30% 时，按“成本 ÷（1 − 毛利率）”计算并向上取整到分，建议售价为 ¥0.05 / 张；若售价为 ¥0.10 / 张，单张毛利润为 ¥0.07，毛利率为 70%。这个算例未计支付手续费、重试和运营成本。

有预算和利润目标时，可以按“**能力排行选候选 → 样图看效果 → 切换候选模型与规格算成本 → 对照预算及目标毛利**”的顺序，找到合适的模型与渠道。当前工具按所选模型计算；月度预算通过预计张数估算消耗，尚未提供输入总预算后自动推荐全部模型的功能。

月度消耗与首次需付款分开显示：最低充值、整包购买或年付可能让首次付款高于当月消耗，未使用的余额不算已消耗成本。

![成本与定价工具的模型、规格、毛利率与渠道计算结果](docs/assets/cost-pricing.webp)

## 同规格价格摘要

按网站默认场景展示每个型号的部分官网报价，渠道按标识排序；这不是最低价榜或推荐排名。规格、套餐条件和其他渠道请打开模型详情，质量未指定的报价不外推到特定质量档。

| 型号 | 默认规格 | 已核对报价示例 · 核对日期 |
| --- | --- | --- |
| [Nano Banana 2](docs/models/nano-banana-2.md) | 文生图 · 1K · 1 张 | AtlasCloud · Developer：$0.028 / 张（2026-10-05，[来源](<https://www.atlascloud.ai/zh/pricing/models?type=image>)）<br>fal.ai · Standard：$0.08 / 张（2026-09-29，[来源](<https://fal.ai/models/fal-ai/nano-banana-2>)） |
| [Nano Banana Pro](docs/models/nano-banana-pro.md) | 文生图 · 1K · 1 张 | AtlasCloud · Developer：$0.049 / 张（2026-10-05，[来源](<https://www.atlascloud.ai/zh/pricing/models?type=image>)）<br>fal.ai · Standard：$0.15 / 张（2026-09-29，[来源](<https://fal.ai/models/fal-ai/nano-banana-pro>)） |
| [GPT Image 2](docs/models/gpt-image-2.md) | 文生图 · 1024×1024 · Medium | ImgAPI · 官网标准报价：¥0.06 / 张（2026-10-09，[来源](<https://imgapi.vip/models>)）<br>WaveSpeedAI · Standard · 官网5%优惠：$0.057 / 张（2026-10-06，[来源](<https://wavespeed.ai/pricing>)） |
| [GPT Image 2.5 Sunburst](docs/models/gpt-image-2.5-sunburst.md) | 1K · medium | BudgetPixel · 充值包 · $10 / 10,000 积分（无需订阅）：$0.04 / 张（2026-10-05，[来源](<https://docs.budgetpixel.com/api-reference/openai/generate-image-with-gpt-image-25-sunburst>)）<br>ImgAPI · 默认渠道 · 按张计费：¥0.12 / 张（2026-10-09，[来源](<https://imgapi.vip/models>)） |
| [GPT Image 2.5 Flare](docs/models/gpt-image-2.5-flare.md) | 1K · 画质未指定 | GetAPI · GPT稳定分组：¥0.16 / 张（2026-10-06，[来源](<https://www.getapi.one/pricing>)）<br>ImgAPI · 官网标准报价：¥0.1 / 张（2026-10-09，[来源](<https://imgapi.vip/models>)） |
| [GPT Image 2.5](docs/models/gpt-image-2.5.md) | 1K | Grsai · 最低充值档 · ¥10：¥0.06 / 张（2026-10-06，[来源](<https://grsai.com/zh/dashboard/models>)）<br>ImgAPI · 默认渠道 · 按张计费：¥0.03 / 张（2026-10-09，[来源](<https://imgapi.vip/models>)） |
| [Banana 2.1](docs/models/nano-banana-2.1.md) | 1K | fal.ai · 官网标准报价：$0.08 / 张（2026-10-08，[来源](<https://fal.ai/nano-banana-2.1>)）<br>Grsai · 标准 · ¥10充值档：¥0.12 / 张（2026-10-08，[来源](<https://grsai.com/zh/dashboard/models>)） |
| [Grok Image](docs/models/grok-image.md) | 默认规格 | AIMLAPI · 官网标准报价：$0.026 / 张（2026-10-06，[来源](<https://aimlapi.com/models/grok-imagine-image>)）<br>Replicate · 官网标准报价：$0.02 / 张（2026-10-06，[来源](<https://replicate.com/xai/grok-imagine-image/readme>)） |
| [Seedream 5.0 Pro](docs/models/seedream-5.0-pro.md) | 1K | AtlasCloud · 官网价格页 · 标准生成：$0.036 / 张（2026-10-06，[来源](<https://www.atlascloud.ai/zh/pricing/models?type=image>)）<br>ImgAPI · 官网标准报价：¥0.08 / 张（2026-10-08，[来源](<https://imgapi.vip/models>)） |

报价来自公开资料，不代表实际扣费或接口稳定性；按 Token、订阅套餐与缺少完整规格的资料不转换成固定单张价格。网页标价、免费资格和真实调用各自保留证据。

![网站同规格渠道报价](docs/assets/model-prices.webp)

## 全模型生图效果对比

同一提示词，直观看不同模型的生成效果。

![全模型生图效果对比](docs/assets/model-comparison.webp)

[在网站打开原图](https://apipk.site/model-test) · [查看逐张预览、提示词与来源](docs/samples.md)

## 当前收录范围

本快照有 **9 个生图型号分组、22 个报价渠道、759 条规格记录、30 个免费规则渠道**。图片为 **3 个场景 × 6 个展示型号，共 18 张**。

| 型号 | 报价渠道数 | 完整交互入口 |
| --- | --- | --- |
| [Nano Banana 2](docs/models/nano-banana-2.md) | 17 | [网站详情](https://apipk.site/models/nano-banana-2) |
| [Nano Banana Pro](docs/models/nano-banana-pro.md) | 17 | [网站详情](https://apipk.site/models/nano-banana-pro) |
| [GPT Image 2](docs/models/gpt-image-2.md) | 17 | [网站详情](https://apipk.site/models/gpt-image-2) |
| [GPT Image 2.5 Sunburst](docs/models/gpt-image-2.5-sunburst.md) | 18 | [网站详情](https://apipk.site/models/gpt-image-2.5-sunburst) |
| [GPT Image 2.5 Flare](docs/models/gpt-image-2.5-flare.md) | 17 | [网站详情](https://apipk.site/models/gpt-image-2.5-flare) |
| [GPT Image 2.5](docs/models/gpt-image-2.5.md) | 5 | [网站详情](https://apipk.site/models/gpt-image-2.5) |
| [Banana 2.1](docs/models/nano-banana-2.1.md) | 14 | [网站详情](https://apipk.site/models/nano-banana-2.1) |
| [Grok Image](docs/models/grok-image.md) | 7 | [网站详情](https://apipk.site/models/grok-image) |
| [Seedream 5.0 Pro](docs/models/seedream-5.0-pro.md) | 10 | [网站详情](https://apipk.site/models/seedream-5.0-pro) |

型号与质量档以记录为准；渠道自定义名称不自动等同于厂商独立型号。当前图片来自同一渠道的公开样图，尚无跨渠道重复生成批次、人工盲评胜率或 Elo 排名。

## 数据时间与更新

- 最近公开内容变更：2026-10-09。这是导出内容的变更时间。
- 报价核对日期范围：2026-09-29 至 2026-10-09；免费规则：2026-10-08；样图采集：2026-09-30。
- 最近变更内容：models、providers、quotes、free-channels、samples、exclusions。没有内容变化不会刷新测评日期。
- [数据快照与摘要](data/metadata.json) · [有效变更记录](docs/changelog.md) · [待核实与移出说明](docs/exclusions.md)。

公开资料由网站静态目录按字段清单导出，再生成本 README 和详情文档。已提供导出、生成和校验脚本；当前未配置每日来源采集或自动推送。

## 使用指南与参与完善

[Nano Banana 选型、免费入口与 API 接入](docs/guides.md) · [常见问题](docs/faq.md) · [比较方法](docs/methodology.md) · [关系披露](docs/disclosures.md)

![APIpk 首页与模型入口](docs/assets/home.webp)

通过 [Issue](https://github.com/shanyeai/image-api-pk/issues/new/choose) 补充渠道、纠正价格或报告待核实问题。请提供精确型号、规格、公开来源与日期，不提交 Key 或个人账单。[贡献说明](CONTRIBUTING.md)

维护者操作见[数据维护](docs/maintenance.md)。原创内容未授予开放复用许可证，第三方图片与数据保留各自来源和权利，见[版权说明](COPYRIGHT.md)。
