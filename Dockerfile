FROM node:20-alpine AS base


FROM base AS deps
WORKDIR /app


RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build


FROM base AS runner
WORKDIR /app


RUN npm install -g pnpm

ENV NODE_ENV=production


COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/data-source.ts ./src/data-source.ts
COPY --from=builder /app/src/entities ./src/entities

EXPOSE 3000

CMD ["node", "dist/main"]


