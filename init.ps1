# プロジェクト作成
npx create-next-app@latest paper-db --typescript
cd paper-db

# 必要パッケージ追加
npm install @prisma/client prisma sqlite3 tailwindcss @tailwindcss/forms multer
npx prisma init
npx tailwindcss init -p
