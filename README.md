# AutoTweet

AI活用型Xエンゲージメント自動化ツール

---

## 概要

**AutoTweet**は、Grok AIを活用してXでのエンゲージメントを効率化するツールです。リプライ対象のポストを自動で選定し、AI生成の文面案を提示。人間の最終判断を挟むことで、品質を保ちながら効率的にインプレッションを向上させます。

## 目的

### ビジネスゴール
- Xでアクティブな仲間（日頃から「いいね」や「リプ」をくれる人）を増やす
- 普段のツイートのインプレッションを向上させる
- 自社サービスへの流入を増やす

### 解決する課題
- 手動でのリプライ作業が負担
- 日頃からリプを頑張るのは辛い
- そもそもあまりXを開かない
- 他人に興味が持てない
- でも売上を増やすチャネルとしてインプレッションを持っておきたい

## 主な機能

### POC版
1. **ポスト検索・選定**（スクレイピング）
   - X検索URL: https://x.com/search?q=受託開発&f=live
   - Playwrightで検索結果を取得
   - Grok AIで経営者のポストと思われるものを10件選定

2. **AIリプライ生成**（Grok API）
   - 選定された各ポストに対してリプライ文面を自動生成
   - プロンプト: 「@account_nameになりきってリプライ作成」
   - 自然で人間らしい文面

3. **ユーザー判断**（ブラウザUI）
   - Next.js製のブラウザUIで提案を確認
   - アクション選択:
     - ✅ そのまま実行
     - ✏️ 文面を修正して実行
     - ❌ スキップ

4. **リプライ実行**（スクレイピング）
   - Playwrightで決定した文面をリプライ投稿
   - いいねも同時実行

### POC要件
- **X連携**: Playwright（スクレイピング）
  - テストアカウント使用推奨
  - POC検証目的
- **ユーザー判断**: ブラウザUI（Next.js）
- **提案数**: 1日20件

### 将来の拡張（本番化時）
- **X API移行**（$100/月）
  - 規約遵守、安定性向上
  - メインアカウント保護
- **Slack連携**
  - Slack上で通知 + ユーザー判断
  - Interactive Components実装
- **バッチ処理・定期実行**
  - 1時間ごとに数件ずつ提案
  - botっぽくならないよう分散
- **拡張機能**
  - 複数検索クエリ対応
  - ハイブリッド型（新規開拓 + 既存関係強化）
  - リプライ履歴管理・分析

---

## 技術スタック

### フロントエンド
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS

### バックエンド
- Node.js + Express
- TypeScript
- RESTful API

### AI
- Grok API
  - 経営者ポスト判定
  - リプライ文面生成

### X連携
- **POC**: Playwright（スクレイピング）
  - X検索結果取得
  - リプライ投稿・いいね実行
  - Cookie管理でログイン状態保持
- **本番化**: X API Basic（$100/月）
  - 規約遵守、安定性向上
  - メインアカウント保護

### 開発環境
- Docker Compose

### データベース
- **POC**: 不要（一時データのみ）
- **本番化**: MongoDB or PostgreSQL
  - 実行履歴管理
  - 設定管理

### テスト
- Jest（ユニットテスト）
- React Testing Library（コンポーネントテスト）
- Playwright Test（E2Eテスト、スクレイピングテスト）

---

## プロジェクト構造

```
/AutoTweet
├── docs/              # ドキュメント（将来）
├── src/               # ソースコード（技術スタック決定後）
├── tests/             # テスト（技術スタック決定後）
├── claude.md          # Claude Code連携ルール
├── TODO.md            # 開発タスクリスト
├── NOTES.md           # 開発ログ・学習記録
├── quickstart.md      # セッション開始ガイド
└── README.md          # このファイル
```

---

## 開発状況

- ✅ Phase 0: プロジェクト構想整理
- ✅ Phase 0: 技術スタック決定
- ✅ Phase 1: 環境構築
- ⏳ Phase 2: コア機能実装（次回）

進捗の詳細は [TODO.md](./TODO.md) を参照してください。

---

## セットアップ

### 前提条件
- Docker Desktop がインストールされていること

### 環境構築手順

```bash
# 1. リポジトリのクローン
git clone git@github.com:Kuriyama301/AutoTweet.git
cd AutoTweet

# 2. Docker Composeでサービスを起動
docker compose up -d

# 3. サービスの起動確認
docker compose ps
# すべてのサービスが "Up" になっていることを確認

# 4. 動作確認
# フロントエンド: http://localhost:3000
# バックエンド: http://localhost:4000/health
```

### サービスの停止

```bash
docker compose down
```

---

## 開発コマンド

**技術スタック決定後に記載予定**

---

## ドキュメント

- [TODO.md](./TODO.md) - 開発タスクリスト
- [NOTES.md](./NOTES.md) - 開発ログ・学習記録
- [claude.md](./claude.md) - Claude Code連携ルール
- [quickstart.md](./quickstart.md) - セッション開始ガイド

## 開発ルール

### Git コミットメッセージ
- **形式**: `type: subject`（単文でシンプルに）
- **Type**: feat, fix, refactor, test, docs, style, chore
- **注意**: Claude Codeフッター不要（🤖 Generated with... は含めない）

詳細は [claude.md](./claude.md) を参照

---

## ライセンス

このプロジェクトは個人開発プロジェクトです。

---

## 作者

k.kuriyama

---

**最終更新**: 2025-11-03
