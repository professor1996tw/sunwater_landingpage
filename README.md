# sunwater.me 官網 v3

整合自 `landing-page_v2`（新首頁 0718）+ GitHub 下載版（線上完整版），並完成網址重構。

## 網址結構
| 網址 | 內容 | 檔案 |
|---|---|---|
| `/` | 新首頁：數位成長夥伴 | `index.html` |
| `/game/` | 遊戲交易網首頁（即時報價） | `game/index.html` |
| `/game/kyc/` | 實名認證 | `game/kyc/index.html` |
| `/game/dd373/` | DD373 代購 | `game/dd373/index.html` |
| `/game/legal/` | 法律頁（?page=terms/risk/privacy/aml） | `game/legal/index.html` |
| `/game/news/…` | 最新消息 + 分類 + 文章 | `game/news/…` |

**舊網址轉址跳板**（避免 SEO 404）：根 `kyc.html`、`dd373.html`、`legal.html`、`news/**` → meta refresh 到對應 `/game/*`。

## 重要技術點
- **報價**：`game/index.html` 前端用 Google Sheet SHEET_ID 直抓 CSV，與網址無關，勿動。
- **GA**：全站共用 `G-X6099N611V`（新首頁已補）。
- **資產**：共用圖片/favicon 一律根絕對路徑（`/images/…`、`/favicon.ico`）。
- **後台設定**：`site-elements.json`、`admin-settings.json` 為編輯工具用，線上不讀，保留供編輯。

## 本機預覽
```
python -m http.server 8099 --directory .   # 於本資料夾
# 或 Claude Code： preview_start name="landing-v3"（已設在 code/.claude/launch.json）
```
瀏覽 http://localhost:8099/

## 部署（尚未執行）
GitHub Pages ← repo `professor1996tw/sunwater_landingpage`（CNAME=sunwater.me）。
把本資料夾內容覆蓋到 repo 後 push。**注意**：`admin-backup/`、`.bak`、`sunwater_landingpage-main/` 等勿帶上去。
部署後到 Google Search Console 重送 `sitemap.xml`。
