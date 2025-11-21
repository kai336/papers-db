# デプロイメントガイド

このドキュメントでは、papers-db アプリケーションをクラウドプラットフォームにデプロイする方法を説明します。

## 🎯 クイックスタート

最も簡単なデプロイ方法は **Vercel** を使用することです：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kai336/papers-db)

1. 上のボタンをクリック
2. MongoDB Atlas の接続文字列を環境変数 `DATABASE_URL` に設定
3. デプロイ完了！

## 📋 前提条件

どのプラットフォームでも、以下が必要です：

### 1. MongoDB データベース

**推奨**: MongoDB Atlas（無料プランあり）

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) でアカウント作成
2. 無料クラスター（M0）を作成
3. Database User を作成（ユーザー名とパスワードを設定）
4. Network Access で `0.0.0.0/0` を追加（全IPアドレスを許可）
5. "Connect" → "Connect your application" から接続文字列を取得

接続文字列の例：
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/papers-db?retryWrites=true&w=majority
```

### 2. 環境変数

すべてのプラットフォームで以下の環境変数が必要です：

```bash
DATABASE_URL="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/papers-db"
```

## 🚀 デプロイ先の選択

### Vercel（最推奨）⭐⭐⭐⭐⭐

**利点**:
- Next.js との完全な互換性
- ファイルアップロード機能が動作
- 無料プランが充実
- 設定が最も簡単

**手順**:
1. [Vercel](https://vercel.com) にサインアップ
2. GitHub リポジトリをインポート
3. 環境変数 `DATABASE_URL` を設定
4. Deploy ボタンをクリック

**所要時間**: 約5分

---

### Railway ⭐⭐⭐⭐

**利点**:
- データベースも一緒にホスティング可能
- 無料プランあり（月 $5 分のクレジット）
- Git プッシュで自動デプロイ

**手順**:
1. [Railway](https://railway.app) にサインアップ
2. "New Project" → "Deploy from GitHub repo"
3. リポジトリを選択
4. 環境変数を設定
5. 自動デプロイ開始

**所要時間**: 約5-10分

---

### Render ⭐⭐⭐⭐

**利点**:
- 無料プランあり
- シンプルな設定
- 自動 SSL 証明書

**手順**:
1. [Render](https://render.com) にサインアップ
2. "New" → "Web Service"
3. GitHub リポジトリを接続
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. 環境変数 `DATABASE_URL` を設定

**所要時間**: 約10分

---

### Cloudflare Pages ⭐⭐⭐

**注意**: 現在のバージョンでは **ファイルアップロード機能が制限されます**。

**利点**:
- 高速な CDN
- 無料プランが充実
- Cloudflare Workers との統合

**制限事項**:
- Multer によるファイルアップロードは動作しません
- Cloudflare R2 への移行が必要

**手順**:
1. [Cloudflare](https://dash.cloudflare.com) にサインアップ
2. Pages → "Create a project"
3. GitHub リポジトリを連携
4. Framework preset: `Next.js`
5. Build command: `npm run pages:build`
6. Build output directory: `.vercel/output/static`
7. 環境変数を設定

**所要時間**: 約10-15分
**追加作業**: ファイルアップロードを R2 に移行する必要あり

---

## 🔧 デプロイ後の設定

### 初回セットアップ

デプロイ後、以下を確認してください：

1. **データベース接続**: アプリケーションがMongoDBに接続できるか確認
2. **環境変数**: `DATABASE_URL` が正しく設定されているか確認
3. **動作確認**: 論文の追加・表示ができるか確認

### データベースの初期化

Prisma を使用している場合、データベーススキーマを同期する必要はありません（MongoDB の場合、スキーマは自動的に作成されます）。

### アップロード先の設定

**重要**: 本番環境では PDF ファイルの保存先を適切に設定してください。

現在の実装では `public/uploads/` にファイルを保存していますが、クラウド環境では以下のいずれかに変更することを推奨します：

1. **Cloudflare R2**（Cloudflare Pages を使用する場合）
2. **AWS S3**
3. **Vercel Blob**（Vercel を使用する場合）

## 📊 比較表

| プラットフォーム | 無料プラン | セットアップ難易度 | ファイルアップロード | カスタムドメイン | 推奨度 |
|--------------|-----------|-----------------|-------------------|---------------|--------|
| Vercel | ✅ 充実 | ⭐ 簡単 | ✅ 動作 | ✅ 無料 | ⭐⭐⭐⭐⭐ |
| Railway | ✅ $5/月 | ⭐⭐ やや簡単 | ✅ 動作 | ✅ Pro プラン | ⭐⭐⭐⭐ |
| Render | ✅ あり | ⭐⭐ やや簡単 | ✅ 動作 | ✅ 無料 | ⭐⭐⭐⭐ |
| Cloudflare Pages | ✅ 充実 | ⭐⭐⭐ 中級 | ⚠️ 要改修 | ✅ 無料 | ⭐⭐⭐ |

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install
npm run build
```

### データベース接続エラー

- MongoDB Atlas のネットワークアクセス設定を確認
- 接続文字列が正しいか確認
- パスワードに特殊文字が含まれる場合は URL エンコード

### ファイルアップロードエラー

- `public/uploads` ディレクトリの存在を確認
- 書き込み権限を確認
- クラウド環境では永続ストレージへの移行を検討

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)

## 💡 ヒント

1. **開発環境と本番環境の分離**: 別々のMongoDBクラスターを使用することを推奨
2. **環境変数の管理**: `.env.local` をGitにコミットしない
3. **定期的なバックアップ**: MongoDB Atlas の自動バックアップを有効化
4. **監視**: 各プラットフォームの監視機能を活用
