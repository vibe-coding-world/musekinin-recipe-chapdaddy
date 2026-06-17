# 設計 PC左右バナーフェード

## 構成

```mermaid
flowchart TD
  A[shop-side-banners] --> B[JSON取得]
  B --> C[shuffle]
  C --> D[上枠]
  C --> E[下枠]
  D --> F[fade画像]
  E --> G[fade画像]
  F --> H[CSS animation]
  G --> H
```

## 基本方針

- Swiperは使わない。
- JSでHTMLを生成する。
- CSS animationでフェードする。

## 選択アルゴリズム

```mermaid
flowchart TD
  A[items] --> B[shuffle]
  B --> C[先頭4件を上]
  B --> D[次の4件を下]
  C --> E[上下重複なし]
  D --> E
```

候補が少ない場合。

| 件数 | 対応 |
|---|---|
| 0件 | 列を非表示 |
| 1件 | 1枠だけ表示 |
| 2件以上 | 上下に分ける |
| 4件未満の枠 | 不足分を補充する |

補充時は同じ枠内の重複を避ける。

補充時は同じタイミングの上下重複を避ける。

## HTML生成

```mermaid
flowchart TD
  A[aside] --> B[heading]
  A --> C[slot top]
  A --> D[slot bottom]
  C --> E[複数aを重ねる]
  D --> F[複数aを重ねる]
```

| class | 役割 |
|---|---|
| `.c_side-banners__slot` | 1つの表示枠 |
| `.c_side-banners__fade` | 重ねる親 |
| `.c_side-banners__item` | 商品リンク |
| `.c_side-banners__image` | 商品画像 |

## CSS

```mermaid
flowchart TD
  A[slot] --> B[position relative]
  B --> C[item absolute]
  C --> D[opacity animation]
```

フェード仕様。

| 項目 | 値 |
|---|---|
| 4件周期 | 24秒 |
| 切替 | 6秒ごと |
| フェード | 3秒 |

## reduced motion

```mermaid
flowchart TD
  A[prefers-reduced-motion] --> B[animation停止]
  B --> C[1枚目だけ表示]
```

## 注意

- 上下に同じ商品を出さない。
- 全枠を4件に揃えて切替タイミングを合わせる。
- 左右列は別データなので左右間の重複は見ない。
- 商品リンクは画像ごとに維持する。
- 既存のPC専用表示条件を維持する。
