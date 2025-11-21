# クイックスタートガイド

このドキュメントでは、papers-db を最速でデプロイする方法を説明します。

## 🚀 最速デプロイ（5分）

### ステップ1: MongoDB Atlas のセットアップ（2分）

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) にアクセス
2. 無料アカウントを作成
3. 無料クラスター（M0 Sandbox）を作成
4. Database Access → Add New Database User
   - ユーザー名: `papers_user`
   - パスワード: 強力なパスワードを設定（記録しておく）
5. Network Access → Add IP Address → "Allow Access from Anywhere" (`0.0.0.0/0`)
6. Database → Connect → Drivers を選択
7. 接続文字列をコピー（例: `mongodb+srv://papers_user:PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`）

### ステップ2: Vercel にデプロイ（3分）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kai336/papers-db&env=DATABASE_URL)

1. 上のボタンをクリック
2. Vercel にログイン（GitHub アカウントで可）
3. プロジェクト名を入力（デフォルトでOK）
4. 環境変数 `DATABASE_URL` に、ステップ1でコピーした接続文字列を入力
   - ⚠️ `PASSWORD` の部分を実際のパスワードに置き換える
   - ⚠️ `/` の後に `papers-db` を追加（例: `.../myFirstDatabase` → `.../papers-db`）
5. "Deploy" をクリック
6. 完了！

デプロイされたアプリのURLが表示されます。

## 📝 デプロイ後の確認

デプロイが完了したら、以下を確認してください：

1. アプリのURLにアクセス
2. 論文追加ページで新しい論文を登録できるか確認
3. 登録した論文が一覧に表示されるか確認

## 🔧 ローカル開発環境のセットアップ

デプロイ後、ローカルでも開発したい場合：

```bash
# リポジトリをクローン
git clone https://github.com/kai336/papers-db.git
cd papers-db

# 依存関係をインストール
npm install

# 環境変数を設定
cp .env.example .env.local
# .env.local を編集して DATABASE_URL を設定

# 開発サーバーを起動
npm run dev
```

http://localhost:3000 でアクセスできます。

## 🎯 次のステップ

- [DEPLOYMENT.md](./DEPLOYMENT.md) で詳しいデプロイ方法を確認
- [README.md](./README.md) でアプリの使い方を確認

## ❓ トラブルシューティング

### デプロイエラーが発生する

- MongoDB の接続文字列が正しいか確認
- パスワードに特殊文字（`@`, `:`, `/` など）が含まれる場合は、URLエンコードが必要

### データベース接続エラー

- MongoDB Atlas の Network Access で `0.0.0.0/0` が設定されているか確認
- 接続文字列のデータベース名が正しいか確認

### ファイルアップロードができない

- Vercel ではファイルアップロードは一時的に動作します
- 永続化が必要な場合は、Vercel Blob または S3 への移行を検討

## 📞 サポート

問題が解決しない場合は、GitHub Issues でお問い合わせください。
