# TopTutor — 大学生家教网站

## 项目概览

连接大学生家教与学生的在线平台，提供教师搜索、预约管理、评价等核心功能。

## 技术栈

| 层次 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 |
| 运行时 | Node.js 24 / npm 11 |
| 包管理 | npm |

## 项目结构

```
src/
  app/           # App Router 页面和布局
  components/    # 可复用 UI 组件
  lib/           # 工具函数、API 客户端等
  types/         # TypeScript 类型定义
public/          # 静态资源
```

## 开发命令

```bash
npm run dev      # 启动开发服务器 (localhost:3000)
npm run build    # 生产构建
npm run start    # 启动生产服务器
npm run lint     # ESLint 检查
```

## 编码规范

### TypeScript
- 所有新文件使用 `.tsx`（含 JSX）或 `.ts`（纯逻辑）
- 禁止使用 `any`，优先使用明确类型或 `unknown`
- 接口名使用 PascalCase，如 `TutorProfile`
- 类型定义统一放在 `src/types/` 目录

### React / Next.js
- 优先使用 Server Components（默认），仅在需要交互/浏览器 API 时加 `'use client'`
- 页面文件：`src/app/<route>/page.tsx`
- 布局文件：`src/app/<route>/layout.tsx`
- 组件文件：`src/components/<ComponentName>.tsx`（PascalCase）
- 使用 `next/image` 替代 `<img>`，使用 `next/link` 替代 `<a>`

### Tailwind CSS
- 使用 Tailwind utility classes，避免自定义 CSS（特殊情况除外）
- 响应式断点：移动优先（`sm:` `md:` `lg:` `xl:`）
- 颜色/间距统一使用 Tailwind 设计系统，不硬编码像素值

### 文件与命名
- 组件：PascalCase（`TutorCard.tsx`）
- 页面/路由目录：kebab-case（`tutor-profile/`）
- 工具函数：camelCase（`formatDate.ts`）
- 常量：SCREAMING_SNAKE_CASE

### Git
- 分支命名：`feat/<功能>`、`fix/<修复>`、`chore/<杂项>`
- Commit 信息简洁明确

## 注意事项

- API Key 等敏感信息通过 `.env.local` 管理，禁止提交到 Git
- 使用 App Router（非 Pages Router）
