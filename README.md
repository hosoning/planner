# v6 更新

见 [SPEC-V6.md](SPEC-V6.md)：可选纪念昵称、全天 00:00–23:59、跨日最多 48 小时，以及按轮随机 ID 锁定同分候选顺序。当前数据和流程尚未达到 v6 完整发布门槛：仅 Vancouver 有少数可执行场地；美团 API 凭证缺失；逐站 A/B/C 与二次确认尚未接通。

# v4 更新

见 [SPEC-V4.md](SPEC-V4.md)。不需要出发点；六档出门时间由牌决定。全站简体，姓名仅供预约资料。正式 159 张＋校准 3 张。

验证：`node --import tsx --test tests/core.test.ts`、`node --import tsx tests/reliability-v4.ts`、`node tests/http-v4.mjs`。

以下是上一版技术说明，出发点、张数与 UI 以 v4 为准。

# Arcana · 私人約會

以兩人名字帶入的手機優先 Tarot 約會網站。無 AI / LLM 執行依賴。

## v3
- 50 題校準池、78 張完整正逆位 ontology；每題 3 張，細節題 6 張（2 主 + 4 輔）；共 159 張，題內不重複、題間獨立洗牌。整輪在回答前預抽及雜湊鎖定。
- 校準先顯示答案，再問是否正確；失敗整輪作廢。
- 真實官方 Vancouver 地點／餐單。免 Google 金鑰：FOSSGIS OSRM 足行路網、Open-Meteo 天氣，官方資料核實至 2026-10-14。公共交通與其他城市尚未支援。
- 去程、站間、回程路線計入時間。查詢失敗、不可達、閉店、天氣不適合、超預算均不排入。
- 一鍵存入站內「我的約會」，可重開／移除；手機 ICS 為可選匯出。網頁關閉不推播。
- 朋友只需處理預約，訂金本人支付。網站自動產生雙人紀念卡，沒有實體禮物配送。

## 執行
Node 22.13+，npm ci，npm run build。依序把 drizzle/*.sql 套用至本機 D1 後 npm start，預覽 http://127.0.0.1:8787。

## 驗證
`npx tsc --noEmit`
`node --import tsx --test tests/core.test.ts`
`node tests/http-v3.mjs`（本機服務啟動後；會查詢公開資料）

舊 `tests/http.mjs` 是 v2 示範模式測試，已不適用。lib/tarot/demo.ts 僅供單元測試 fixture；正式 API 不提供虛構模式。

## 資料與限制
實際核實來源包含商戶自有網站、Vancouver Art Gallery、Vancouver Public Library。403 網站使用本次人工研究核實的短期結構化快照並在來源區明示，資料到期後停止排入。價格是官方列价加 35% 稅／小費／緩衝的預算，不是成交報價；庫存、臨時營業異動與售票名額需商戶確認。免金鑰版適用私有、低流量、非商業使用。OSRM 每秒最多一請求且每日設上限；天氣、商戶資料與路線有短期快取，不使用生成式資料。

資料供應：
- https://routing.openstreetmap.de/about.html
- https://open-meteo.com/en/docs
- https://www.meatandbread.com/robson
- https://www.meatandbread.com/cambie
- https://nookrestaurants.com/coal-harbour/
- https://www.vanartgallery.bc.ca/visit/
- https://www.vpl.ca/branches/central

登入 callback 由 Sites 平台管理。已發現手機 /callback 404 的平台路由問題；不得自製 callback 或繞過認證。網站保持僅擁有者可見。
