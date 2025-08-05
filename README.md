# papers-db
おれだけの論文データベースをaiで作るンゴよぉ

## 起動
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