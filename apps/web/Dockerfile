FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 复制依赖描述文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/web/package.json apps/web/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY packages/ packages/
COPY apps/web/ apps/web/

# 构建 Nuxt
ARG NUXT_PUBLIC_API_BASE=http://server:3001/api
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
RUN cd apps/web && pnpm build

# 生产阶段
FROM node:20-alpine
WORKDIR /app

COPY --from=base /app/apps/web/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
