# VPS 剩余价值计算器

二手 VPS / 独服交易时的剩余价值在线计算工具：按续费价格、付款周期与剩余天数折算机器剩余价值，支持卖家溢价双向反推、Push 费与中介费分摊，并可生成精美分享图片发给交易对方核对。

在线演示：https://tools.514517.xyz

## 功能

- 11 种币种（USD / CNY / EUR / GBP / JPY / HKD / TWD / CAD / KRW / SGD / AUD）实时汇率（Frankfurter 开放接口），支持自定义汇率
- 实付卖家金额 ↔ 卖家溢价双向反推
- Push 手续费（多币种）与 5% 中介担保费，买家付 / 卖家付 / AA 分摊
- 到期日按付款周期自动推算，可精确到时分
- 买家总支出 / 卖家实际到手 / 官方日均 / 综合日均
- URL 参数分享链接（一键复现计算现场）
- 分享图片：1200×630 卡片，30 天有效图片链接
- 今日 / 累计计算次数统计

## 一键部署（Cloudflare Workers）

1. 在 Cloudflare Workers 新建一个 Worker，把 `worker.js` 的全部内容粘贴进去
2. 新建一个 KV 命名空间（如 `vps-calc-count`），在 Worker 设置里绑定变量名 `CALC_KV`
3. 点击部署，绑定自己的域名即可

不写 KV 绑定也能跑，只是计数和分享图片接口不可用。

## 本地开发

前端源码在 `index.html`，Worker 封装（含分享图 SVG 模板）在 `build.js` 里：

```bash
node build.js   # 重新生成 worker.js（部署用）
```

## API

| 接口 | 说明 |
| ---- | ---- |
| `GET /` | 计算器页面 |
| `GET /api/count` / `POST /api/count` | 今日 / 累计计算次数 |
| `POST /api/share` | 提交计算结果 JSON，返回 `{ id }`，图片存 KV 30 天 |
| `GET /s/:id` | 分享图片（SVG） |

分享链接参数示例：`https://tools.514517.xyz/#a=49.99&cur=USD&cyc=365&buy=2026-09-30&exp=2027-09-29&pay=400`

## License

MIT
