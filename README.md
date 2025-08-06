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
