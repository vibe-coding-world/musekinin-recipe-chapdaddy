# 設計 Cloudflareパンくず修正

## 構成

```mermaid
flowchart TD
  A[app-breadcrumb.js] --> B[getCurrentPage]
  B --> C[normalizePath]
  C --> D[detail判定]
  C --> E[list判定]
  D --> F[詳細パンくず]
  E --> G[一覧パンくず]
```

## 基本方針

URL判定を正規化する。

`.html` あり・なしの両方に対応する。

## 正規化

```mermaid
flowchart TD
  A[pathname] --> B[末尾slash削除]
  B --> C[末尾.html削除]
  C --> D[最後のpath名を見る]
```

例。

| pathname | page |
|---|---|
| `/detail.html` | `detail` |
| `/detail` | `detail` |
| `/list.html` | `list` |
| `/list` | `list` |
| `/` | `index` |
| `/index.html` | `index` |

## 判定

```mermaid
flowchart TD
  A[getCurrentPage] --> B{page}
  B -->|detail| C[isDetailPage true]
  B -->|list| D[isListPage true]
  B -->|index| E[default]
```

`createItems` は既存構成を維持する。

## 詳細タイトル

`detail-loader.js` のイベントを使う。

```mermaid
flowchart LR
  A[detail-loader] --> B[recipe-detail:loaded]
  B --> C[app-breadcrumb]
  C --> D[詳細名に更新]
```

## リンク方針

既存リンクを維持する。

| リンク | 値 |
|---|---|
| HOME | `index.html` |
| 一覧 | `list.html` |

CloudflareでもHTMLファイルにアクセスできるため、リンクは変えない。

## 注意

- `pathname.endsWith('/detail.html')` に依存しない。
- `/detail?id=...` のqueryは判定に使わない。
- 既存の `recipe-detail:loaded` を壊さない。
