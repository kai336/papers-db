# papers-db
おれだけの論文データベースをaiで作るンゴよぉ

## 起動
windowsのdocker desktopを起動
```bash
docker compose up --build
```

## ディレクトリ構成
```
paper-db/
 ├─ docker-compose.yml
 ├─ Dockerfile
 ├─ package.json（Next.js作成後に生成される）
 ├─ prisma/
 │   └─ schema.prisma
 ├─ pages/
 │   ├─ index.tsx
 │   ├─ add.tsx
 │   ├─ api/
 │   │    └─ papers.ts
 ├─ uploads/（PDF保存先）
```

# 論文データベース開発・環境構築の流れまとめ

## 1. 目的・概要
- 読んだ論文を整理・検索できるWebデータベースアプリを作成
- PDFファイルのアップロード・管理も可能
- クラウド同期や今後の拡張も視野に

## 2. 技術選定
- **Next.js**：フロントエンド＆APIサーバー
- **Prisma + SQLite**：論文情報を管理するDB
- **Docker**：誰でも同じ環境で開発・実行
- **Multer**：PDFファイルのアップロード処理

## 3. ディレクトリ構成の基本
- `pages/` … フロント画面とAPI（`/api/papers`など）
- `prisma/` … DBスキーマ定義、データベースファイル
- `public/uploads/` … アップロードしたPDFファイルの保存先

## 4. 構築・運用の主な流れ

1. **プロジェクト準備**
   - 必要ツール（Node.js、Docker等）をインストール
   - npmパッケージをセットアップ

2. **DBスキーマ定義 & 反映**
   - Prismaでスキーマを定義し、コマンドでDB作成

3. **APIとアップロード機能実装**
   - 論文情報とPDFの登録・取得APIを用意

4. **Dockerで統一的な開発環境を作成**
   - Dockerfile、docker-compose.ymlを設定
   - `docker compose up --build` でサーバー起動

5. **フロントで一覧・PDFダウンロードリンク表示**
   - PDFファイルは `/uploads/ファイル名` でアクセス可能

6. **依存・スキーマ変更時はコマンドで反映**
   - 例: `npx prisma db push` など

## 5. 運用・開発のポイント
- 必要なフォルダ（DB、PDF）をDocker volumeでマウント
- `public/uploads` 配下のファイルはWebから直接アクセス可能
- 生成物・DB（例: `/generated`, `dev.db`）はGit管理しない
- PDFは安全なファイル名で保存（重複・上書き防止）
- スキーマ変更後は必ずDBへ反映コマンド実行

## 6. 注意・つまずきやすい点
- PDFの保存先・URL対応（`/public`はURLに含めない）
- Prismaスキーマ追加時はDB反映が必須
- Docker volumeやキャッシュで挙動が変わる場合は、down＋rebuild

## 7. 現在地・今後
- 基本的な登録・閲覧は実装済み
- 検索・タグ・クラウド同期などの拡張も見据えて開発中

---

## Cloudflare Pages へのデプロイ

このアプリケーションは Cloudflare Pages にデプロイできます。

### 前提条件

1. Cloudflareアカウント（無料で作成可能）
2. MongoDB Atlas などのクラウドデータベース（MongoDBを使用）
3. オブジェクトストレージ（PDF保存用、Cloudflare R2 推奨）

### デプロイ手順

#### 1. MongoDB の準備

このアプリケーションは MongoDB を使用しています。Cloudflare Pages にデプロイする前に、MongoDB Atlas などのクラウドデータベースを用意してください。

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) でアカウント作成
2. 無料クラスターを作成
3. データベースユーザーを作成
4. ネットワークアクセスで `0.0.0.0/0` を許可（本番環境では適切に制限してください）
5. 接続文字列 (CONNECTION_STRING) を取得

#### 2. Cloudflare Pages プロジェクトの作成

1. Cloudflare ダッシュボードにログイン
2. **Pages** セクションに移動
3. **Create a project** をクリック
4. GitHub リポジトリを連携
5. このリポジトリ (`kai336/papers-db`) を選択

#### 3. ビルド設定

Cloudflare Pages のビルド設定で以下を指定：

- **フレームワークプリセット**: `Next.js`
- **ビルドコマンド**: `npm run pages:build`
- **ビルド出力ディレクトリ**: `.vercel/output/static`
- **Node.js バージョン**: `20.x` 以上

#### 4. 環境変数の設定

Cloudflare Pages の設定画面で以下の環境変数を追加：

```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/papers-db?retryWrites=true&w=majority
```

※ MongoDB Atlas から取得した接続文字列を設定してください。

#### 5. デプロイ

設定が完了したら、**Save and Deploy** をクリックしてデプロイを開始します。

### ローカルでのプレビュー

Cloudflare Pages 環境をローカルでテストするには：

```bash
# 環境変数を設定
export DATABASE_URL="your-mongodb-connection-string"

# プレビュー実行
npm run preview
```

### 手動デプロイ

Wrangler CLI を使って手動でデプロイすることもできます：

```bash
# Wrangler にログイン
npx wrangler login

# デプロイ
npm run deploy
```

### 重要な注意事項

#### ファイルアップロードについて

現在のコードは、PDFファイルをローカルファイルシステムに保存していますが、Cloudflare Pages は永続的なファイルシステムを提供していません。本番環境では以下のいずれかの対応が必要です：

1. **Cloudflare R2** を使用してPDFファイルを保存
2. **AWS S3** などの外部オブジェクトストレージを使用
3. ファイルアップロード機能を無効化

#### 推奨される改修

本番環境で完全に動作させるには、以下の改修を推奨します：

1. **ファイルストレージの移行**
   - `pages/api/papers.ts` の Multer 実装を R2 SDK に置き換え
   - PDF保存先を Cloudflare R2 に変更

2. **環境変数の管理**
   - `.env.local` を作成して開発環境用の環境変数を管理
   - 本番環境は Cloudflare Pages ダッシュボードで設定

3. **エラーハンドリングの強化**
   - データベース接続エラーの適切な処理
   - ファイルアップロードエラーの処理

### トラブルシューティング

#### ビルドエラーが発生する場合

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# ビルドを試行
npm run build
```

#### データベース接続エラー

- `DATABASE_URL` が正しく設定されているか確認
- MongoDB Atlas のネットワークアクセス設定を確認
- 接続文字列に特殊文字が含まれる場合は URL エンコードが必要

### 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [MongoDB Atlas ドキュメント](https://www.mongodb.com/docs/atlas/)
- [Cloudflare R2 ドキュメント](https://developers.cloudflare.com/r2/)
