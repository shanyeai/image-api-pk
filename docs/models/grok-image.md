# Grok Image

[网站交互比较](https://apipk.site/models/grok-image) · [全部模型](../models.md) · [比较方法](../methodology.md)

下表为来源记录中的渠道型号及报价。核对价格不证明接口可用或模型身份；默认规格与其他规格分开记录。实际扣费记录尚未纳入本公开快照。

| 渠道 · 请求型号 | 规格 | 报价 | 证据与可比状态 | 核对日期 | 来源 | 适用条件与说明 |
| --- | --- | --- | --- | --- | --- | --- |
| AIMLAPI · x-ai/grok-imagine-image | 默认规格 | $0.026 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://aimlapi.com/models/grok-imagine-image>) | 官网标准报价；官网标准报价；官网每次生成 $0.026，单次输出；未公布分辨率价格，限默认规格。 |
| AtlasCloud · xai/grok-imagine-image/text-to-image | 1K | $0.02 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://www.atlascloud.ai/zh/pricing/models?type=image>) | 官网价格页 · 标准生成；官网价格页 · 标准生成；直接解析官网价格页内嵌的当前 price_rows：Standard 每张 $0.02，estimated=false；1K/2K 由官方 schema 确认。总费用乘输出张数，未实测调用。 |
| AtlasCloud · xai/grok-imagine-image/text-to-image | 2K | $0.02 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://www.atlascloud.ai/zh/pricing/models?type=image>) | 官网价格页 · 标准生成；官网价格页 · 标准生成；直接解析官网价格页内嵌的当前 price_rows：Standard 每张 $0.02，estimated=false；1K/2K 由官方 schema 确认。总费用乘输出张数，未实测调用。 |
| fal.ai · xai/grok-imagine-image | 1K | $0.02 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://fal.ai/models/xai/grok-imagine-image>) | 官网标准报价；官网标准报价；官网标准版按输出图片计费；1K 与 2K 同价。图生图端点另收每张输入图 $0.002；不含 Quality、2.0。 |
| fal.ai · xai/grok-imagine-image | 2K | $0.02 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://fal.ai/models/xai/grok-imagine-image>) | 官网标准报价；官网标准报价；官网标准版按输出图片计费；1K 与 2K 同价。图生图端点另收每张输入图 $0.002；不含 Quality、2.0。 |
| GetAPI · grok-imagine-image | 默认规格 | 暂无明确单价 | 待核实；仅作参考 | 2026-10-06 | [来源](<https://www.getapi.one/api/pricing>) [来源](<https://www.getapi.one/api/status>) | 官网标准报价；官网标准报价；币种冲突：公开接口配置为 USD，官网价格页既有显示为人民币；本次价格页读取超时，未取得当前 Grok 价格及币种的同页证据，暂不显示价格。 |
| Replicate · xai/grok-imagine-image | 默认规格 | $0.02 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://replicate.com/xai/grok-imagine-image/readme>) | 官网标准报价；官网标准报价；官网标准版每张输出 $0.02；未单独列分辨率价格，仅默认规格，不含 Quality 或 2.0。 |
| Vercel AI Gateway · spacexai/grok-imagine-image | 默认规格 | $0.02 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://vercel.com/ai-gateway/models/grok-imagine-image>) [来源](<https://ai-gateway.vercel.sh/v1/models>) | 官网标准报价；官网标准报价；官网标准版每张 $0.02，官方模型目录 image=0.02；未展开分辨率价格，限默认规格。 |
| WaveSpeedAI · x-ai/grok-imagine-image/text-to-image | 默认规格 | $0.022 / 张 | 官网报价已核对；可比官网报价 | 2026-10-06 | [来源](<https://wavespeed.ai/models/x-ai/grok-imagine-image/text-to-image>) | 官网标准报价；官网标准报价；按量预充值；官网价格表每张 $0.022，总费用乘生成张数；未列分辨率档位，仅默认规格。 |

完整字段见 [报价 JSON](../../data/quotes.json)。此页面由数据生成。
