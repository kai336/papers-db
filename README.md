# papers-db
おれだけの論文データベースをaiで作るンゴよぉ
1. 全体構成（ローカルサーバー運用）
scss
コピーする
編集する
[ブラウザ/スマホ] --(HTTPS)--> [ノートPCサーバー]
        ↑                       ↑
   Next.js(フロント)      PostgreSQL + Storage(PDF)
                          Node.js(バックエンドAPI)
ノートPCを Linuxサーバー化（Ubuntu推奨）

PostgreSQL で論文メタデータ管理

Node.js + Express（またはNext.js API Routes）でAPI提供

PDFはローカルディスクに保存（パスをDBで管理）

外出先アクセス用に ポート開放 or VPN（Tailscale）

2. 利点・欠点
メリット

無料で大容量利用可能

好きなだけカスタマイズ可能

セキュリティ・プライバシーを完全管理

デメリット

ノートPCの電源を常時ONにする必要あり

ネット回線と自宅IPに依存（固定IPがない場合はDDNS設定）

バックアップは自分で管理

3. 必要な技術セット
OS
Ubuntu Server（安定・情報豊富）

もしくは既存Windowsに WSL2 + Docker で構築

サーバーソフト
PostgreSQL（DB）

Node.js / Express（API）

Next.js（フロントエンド）

NGINX（リバースプロキシ、HTTPS対応）

Let’s Encrypt（無料SSL証明書）

外部アクセス手段
固定IPがある場合 → ルーターのポート開放

固定IPがない場合 → DuckDNS / No-IP などのDDNS

セキュリティを重視するなら → Tailscale（VPN、設定超簡単）

4. 運用パターン
パターン	外部アクセス	難易度	セキュリティ
自宅LAN内のみ	不可	簡単	高
ポート開放 + DDNS	可能	中	中（ファイアウォール必須）
Tailscale VPN	可能	中	高（外部からも安全）
