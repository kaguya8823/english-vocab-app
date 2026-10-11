# english-vocab-app

chat GPT に相談して、英語学習アプリをつくる
https://chatgpt.com/share/6ac49e4b-4a4c-83e8-a490-c3258c16857b

## prisma をインストールする際の注意(重要)
https://chatgpt.com/share/6ac797b5-0860-83e8-be60-6b58d6db19ee

## prisma studio
backend 内で、npx prisma studio コマンドを入力すると、prisma studio というDB を管理できるページに行ける

## 起動
backend 内で npm run dev
docker で docker compose up -d
backend 内で npx prisma studio これで Prisma studio を起動
frontend 内で npm run dev

## 現状の問題
ポート3002が npm run dev で自動でつながらない