# english-vocab-app

chat GPT に相談して、英語学習アプリをつくる
https://chatgpt.com/share/6ac49e4b-4a4c-83e8-a490-c3258c16857b

## prisma をインストールする際の注意(重要)
https://chatgpt.com/share/6ac797b5-0860-83e8-be60-6b58d6db19ee

## prisma studio
backend 内で、npx prisma studio コマンドを入力すると、prisma studio というDB を管理できるページに行ける

## 前起動
backend 内で npm run dev
docker で docker compose up -d
frontend 内で npm run dev
↓
## 今起動
docker compose up -d  で一括起動可能
backend 内で npx prisma studio これで Prisma studio を起動

## Docker コマンド
• 起動（バックグラウンド）: docker compose up -d
• ログの確認: docker compose logs -f
• 停止と削除: docker compose down
• バージョンの確認: docker compose version

## Playwright
npm init playwright@lates でインストール
これも、 prisma どうよう、膨大な量なので、 .gitignore に記述する必要がある。
だが、上記のコマンドでインストールしたら、自動で .gitignore に記述されていたので問題ないっぽい

## E2E テストするためのコマンド
cd frontend 内で、
npx playwright test tests/vocabulary.spec.ts