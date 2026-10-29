# 曼谷旅遊清單｜GitHub Pages 靜態網站

手機優先的繁體中文旅遊推薦網站，包含景點、住宿、美食分類、關鍵字搜尋、區域篩選與 Google Maps 導航。

## 檔案結構

```text
thailand-travel-guide/
├── index.html
├── data/
│   └── places.json
└── assets/
    ├── app.js
    └── styles.css
```

## 本機預覽

由於網站會用 `fetch()` 讀取 `data/places.json`，不要直接雙擊 `index.html` 用 `file://` 開啟。可以在專案資料夾執行：

```bash
python -m http.server 8000
```

再用瀏覽器開啟 `http://localhost:8000`。

## 部署到 GitHub Pages

1. 登入 GitHub，建立一個新的 repository，例如 `thailand-travel-guide`。
2. 將 `index.html`、`data/`、`assets/` 上傳到 repository 根目錄。不要只上傳 ZIP。
3. 打開 repository 的 **Settings → Pages**。
4. 在 **Build and deployment** 中，Source 選 **Deploy from a branch**。
5. Branch 選 `main`，資料夾選 `/(root)`，按 **Save**。
6. 等待 GitHub Pages 部署完成。網站網址通常會是：
   `https://你的GitHub帳號.github.io/thailand-travel-guide/`
7. 用手機開啟網址測試搜尋、分類與地圖按鈕。

若 repository 名稱不是 `thailand-travel-guide`，網址最後一段會使用實際 repository 名稱。

## 新增或修改推薦項目

編輯 `data/places.json`，新增一個物件。可複製以下格式：

```json
{
  "id": "unique-id",
  "category": "attraction",
  "name": "景點名稱",
  "english": "English Name",
  "area": "所在區域",
  "icon": "📍",
  "color": "#dce8df",
  "description": "簡短介紹與實用建議。",
  "tags": ["特色一", "特色二"],
  "mapQuery": "Place Name Bangkok",
  "officialUrl": "https://example.com"
}
```

- `category` 只能使用 `attraction`（景點）、`hotel`（住宿）或 `food`（美食）。
- `officialUrl` 可以省略；若提供，請使用已確認的官方網站。
- `mapQuery` 用於產生 Google Maps 搜尋連結。請盡量放入英文店名與 Bangkok，避免同名地點造成混淆。
- 不要把會變動的房價、門票或營業時間寫死在資料中。若要補充，請標明查詢日期並連到官方來源。
- JSON 最後一個項目後面不能多放逗號。

## 資訊與圖片說明

這個起始版本不依賴外部照片服務，使用輕量色塊與圖示，避免圖片連結失效或手機載入過慢。地圖按鈕會開啟 Google Maps 搜尋，使用者仍應確認正確分店與最新資訊。網站內容是旅遊整理參考，不保證即時營業狀態。
