## バックエンド用の Dockerfile
FROM node:22

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy --config prisma7.config.ts && exec npm run dev"]