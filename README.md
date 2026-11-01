# lllirunze Blog

个人技术博客，基于 Astro 构建并输出为静态站点。站点用于整理开发、
云原生、人工智能等方向的文章，也包含图库、技能树、足迹地图、生活记录和
GitHub Trending 等个人页面组件。

线上地址：[https://lllirunze.cn](https://lllirunze.cn)

## 功能

- Markdown / MDX 文章与内容集合校验
- 首页分页、文章归档、分类和标签筛选
- Pagefind 静态全文搜索
- 亮色 / 暗色模式与可调主题色
- 响应式布局、页面过渡和文章目录
- Mermaid、KaTeX、提示块和 GitHub 仓库卡片
- RSS、Sitemap、Open Graph 和 robots.txt
- 图库、技能树、足迹地图、生活面板和交互式终端
- GitHub Trending 定时快照
- 中文、英文、日文、韩文、西班牙文、泰文和繁体中文界面文本

## 技术栈

- [Astro](https://astro.build/) 7
- [Svelte](https://svelte.dev/) 5 与 React 19
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Pagefind](https://pagefind.app/)
- [Swup](https://swup.js.org/)
- Biome、TypeScript 和 pnpm 9

## 项目结构

```text
.
├── api/                       # Vercel API
│   └── github-trending.ts
├── public/                    # 保留固定 URL 的静态资源和数据
├── scripts/                   # 新建文章、资源转换和数据抓取脚本
├── src/
│   ├── assets/                # 由 Astro 导入、处理的图片资源
│   ├── components/            # 页面组件、控件和侧栏部件
│   ├── constants/             # 站点常量与图标配置
│   ├── content/
│   │   ├── posts/             # 博客文章
│   │   └── spec/              # 关于页等特殊内容
│   ├── data/                  # 图库等结构化数据
│   ├── i18n/                  # 界面翻译
│   ├── layouts/               # 基础页面和主网格布局
│   ├── pages/                 # Astro 文件路由
│   ├── plugins/               # Remark / Rehype 扩展
│   ├── styles/                # 全局与功能样式
│   ├── types/                 # TypeScript 类型
│   ├── utils/                 # 内容、日期、URL 等通用逻辑
│   ├── config.ts              # 站点、导航、个人资料和许可配置
│   └── content.config.ts      # Astro 内容集合定义
├── astro.config.mjs           # Astro、Markdown 和构建配置
└── package.json               # 脚本与依赖
```

## 本地开发

项目使用 pnpm 9，安装脚本会检查包管理器并安装 Mermaid 服务端渲染所需的
Chromium。

```bash
pnpm install
pnpm dev
```

开发服务器默认运行在 `http://localhost:4321`。

常用命令：

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动本地开发服务器 |
| `pnpm build` | 构建静态站点并生成 Pagefind 搜索索引 |
| `pnpm preview` | 在本地预览生产构建 |
| `pnpm type-check` | 执行严格 TypeScript 检查 |
| `pnpm lint` | 使用 Biome 检查并整理 `src/` |
| `pnpm format` | 格式化 `src/` 中的文件 |
| `pnpm new-post my-post` | 创建一篇新文章 |

## 编写文章

运行以下命令创建 `src/content/posts/my-post.md`：

```bash
pnpm new-post my-post
```

文章使用下面的 Frontmatter：

```yaml
---
title: 文章标题
published: 2026-01-01
updated: 2026-01-02
description: 文章摘要
image: '../../assets/images/posts/example/cover.webp'
tags: ['astro', 'web']
category: 'Development'
draft: false
lang: 'zh-CN'
---
```

其中 `title` 和 `published` 是必填字段。`draft: true` 的文章在开发环境中可见，
生产构建时会被过滤。文章文件名会成为 URL slug，建议使用小写英文和连字符。

图片通常放在 `src/assets/images/posts/` 下并通过相对路径引用。必须保留公开路径、
无需 Astro 处理的文件放在 `public/` 下。

## 配置

在 `src/config.ts` 中修改：

- 站点标题、语言和主题色
- 横幅图片与署名
- 文章目录
- 导航链接
- 头像、个人简介和社交链接
- 文章许可协议

站点域名、Astro 集成、Markdown 插件和构建行为位于
`astro.config.mjs`。调整部署域名时，应同步修改其中的 `site`。

## 构建与部署

```bash
pnpm type-check
pnpm lint
pnpm build
pnpm preview
```

`pnpm build` 会先更新 `public/data/github-trending.json`，再生成 Astro 静态文件和
Pagefind 索引。抓取失败且已有有效快照时，构建会继续使用旧数据；首次构建没有
快照时则需要能够访问数据源。

仓库内的 GitHub Actions 工作流会在推送到 `master`、手动触发或每 12 小时定时
运行时构建并部署到 GitHub Pages。`vercel.json` 也提供了 Vercel 的安装配置。

## 许可

源代码沿用 [MIT License](./LICENSE)。博客文章及站点内容按页面中标注的
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
协议发布，另有说明的内容除外。

上游 Fuwari 模板的多语言说明仍保留在 `README.*.md` 文件中。
