FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# 复制依赖描述文件
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./
COPY apps/admin/package.json apps/admin/
COPY packages/types/package.json packages/types/
COPY packages/utils/package.json packages/utils/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY packages/ packages/
COPY apps/admin/ apps/admin/

# 构建
RUN cd apps/admin && pnpm build-only

# Nginx 托管静态文件
FROM nginx:alpine
COPY --from=base /app/apps/admin/dist /usr/share/nginx/html
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
