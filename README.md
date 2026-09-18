# 東京クルーズログ / Tokyo Cruise Log

ShipSpotting.com に着想を得た、東京寄港クルーズ客船のフォトアーカイブ。
**日本語版（メイン）** と **英語版（/en/）** の2バージョン構成です。

## 言語バージョン / Language versions

| バージョン | URL | 既定言語 |
|-----------|-----|---------|
| 日本語（メイン） | `/index.html` ほか | 日本語（常に固定） |
| English | `/en/index.html` ほか | English (always) |

- 言語は **URL で決定**されます（localStorage 不使用）。ルートは常に日本語、`/en/` は常に英語。
- ヘッダーの「日本語 / English」スイッチは、**同じページの別言語版へリンク**します（クエリ文字列 `?id=` なども引き継ぎ）。
- 両バージョンは `css/` `js/` `data/` `img/` を共有。`en/` の HTML は `../` 経由で参照します。
- 各ページに `hreflang` alternate タグ付き（ja ↔ en）。

## Features

- ShipSpotting 流のフォトアーカイブ: グリッド、写真詳細、IMO リンク、「この船の他の写真」
- 船名 / IMO / 撮影地 / カテゴリ / ターミナル検索
- ダーク基調のプレミアム UI（ガラスパネル、グラデーション、モーション）
- データは JSON（`data/*.json`）駆動

## Pages

| File | 日本語版 | English (`en/`) |
|------|---------|-----------------|
| `index.html` | ホーム | Home |
| `photos.html` | ギャラリー + フィルタ | Gallery + filters |
| `photo.html?id=` | 写真詳細 | Photo detail |
| `ships.html` / `ship.html?id=` | 船舶データベース | Ship database |
| `schedule.html` | 入港スケジュール | Port calls |
| `terminals.html` | ターミナル | Terminals |
| `about.html` | About | About |

## Run locally

```bash
cd tokyo-cruise-log
python3 -m http.server 8080
# 日本語: http://localhost:8080/
# English: http://localhost:8080/en/
```

## 写真の追加 / Adding photos

1. 画像を `img/` に置く / Drop an image into `img/`
2. `data/photos.json` にオブジェクトを追加（`shipId`・`imo`・`location`/`locationJa`・`description`/`descriptionJa` を記入）
3. 両言語版に自動反映されます — no per-language duplication needed.
