FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 复制依赖描述文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/server/package.json apps/server/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY packages/ packages/
COPY apps/server/ apps/server/

# 生成 Prisma Client
RUN cd apps/server && pnpm db:generate

# 编译 TypeScript
RUN cd apps/server && pnpm build

# 生产阶段
FROM node:20-alpine
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/server/node_modules ./apps/server/node_modules
COPY --from=base /app/apps/server/dist ./apps/server/dist
COPY --from=base /app/apps/server/package.json ./apps/server/
COPY --from=base /app/apps/server/prisma ./apps/server/prisma
COPY --from=base /app/packages ./packages

WORKDIR /app/apps/server

EXPOSE 3001
CMD ["node", "dist/index.js"]
