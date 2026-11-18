# AIQC 公司官网

沙特本地智能设备销售与运营服务商官网（含管理后台）。需求依据：`AIQC官网需求文档.md`（v2.0）。

- 前台：首页 / 关于我们 / 产品中心 / 成功案例 / 新闻动态 / 联系留言，**中文（`/`）、英语（`/en`）、阿拉伯语（`/ar`，RTL）三语**
- 后台：`/admin` 登录后管理产品、新闻、案例（三语分栏 + 富文本 + 图片上传）与客户留言（状态标记、CSV 导出），后台界面也可三语切换
- 视觉：深色科技风（深空蓝 `#050A14` + 青蓝渐变），Canvas 粒子 Hero、滚动渐入、数字滚动

## 技术栈

Next.js 16 (App Router) + TypeScript · Tailwind CSS 4 · next-intl · Framer Motion · Tiptap · Prisma 6 + **MySQL 8.x** · JWT Cookie 会话（jose + bcrypt）

## 数据库（重要）

与现有项目**共用同一 MySQL 实例**，AIQC 使用**独立逻辑库 `aiqc`**，不与其他项目共库/跨库关联：

```sql
CREATE DATABASE aiqc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 建议为 AIQC 分配仅 aiqc.* 权限的独立账号（运维执行）
```

> 注意：两个使用 Prisma 的项目不能共用同一个逻辑库——各自 `db push` 会清理对方的表（已实测）。同实例、分逻辑库是安全方案。

## 快速开始

```bash
# 1. 在 MySQL 上创建空库 aiqc（见上）
# 2. 配置环境变量（DATABASE_URL 指向 ...:3306/aiqc，生产改 AUTH_SECRET）
cp .env.example .env
npm install
npm run db:setup   # 建表 + 种子（6 产品 / 3 案例 / 3 新闻三语占位数据）
npm run dev        # http://localhost:3000
```

- 官网：http://localhost:3000 （英文 `/en`、阿语 `/ar`）
- 后台：http://localhost:3000/admin —— 初始账号 `admin@aiqc.local` / `admin123456`（**上线前务必修改**：改 `prisma/seed.ts` 后重跑 `npm run db:seed`，或直接改库中 bcrypt 哈希）
- 占位说明：产品图、参数、统计数字、联系方式、公司英文全称均为占位（需求 §13 开放问题），正式素材在后台替换或改 `src/lib/site-config.ts`

## 常用命令

| 命令 | 用途 |
|---|---|
| `npm run dev / build / start` | 开发 / 构建 / 生产启动 |
| `npm run db:push` | 同步数据模型到 `aiqc` 库 |
| `npm run db:seed` | 写入种子数据 |
| `npm run db:studio` | 数据库可视化 |
| `npm run lint` | 代码检查 |

## 目录结构

```
prisma/                 # schema.prisma（Admin/Product/News/Case/Message）+ seed.ts
src/
  app/
    [locale]/           # 前台三语路由：首页/关于/产品/案例/新闻/联系
    admin/              # 后台：login + (dashboard) 仪表盘/产品/新闻/案例/留言
    api/                # messages 留言提交、admin/upload 图片上传、admin/messages/export CSV、products/news JSON
    sitemap.ts robots.ts
  components/
    site/               # 页头页脚/语言切换/粒子 Hero/卡片/图库/留言表单
    motion/             # 滚动渐入 Reveal、数字滚动 CountUp
    rich/               # 富文本消毒渲染
    admin/              # 三语分栏/Tiptap/图片上传/三大编辑器与列表
  i18n/                 # routing/request/navigation + 后台字典与语言 cookie
  messages/             # 前台三语字典 zh/en/ar.json
  lib/                  # db/data 查询、auth 会话、validators 校验、i18n-content 三语字段解析、site-config 占位配置
  proxy.ts              # 三语路由 + /admin 未登录拦截（Next 16 proxy）
public/uploads/         # 后台上传图片（已 gitkeep；生产需持久化/换 OSS）
```

## 部署提示

- 环境变量：`DATABASE_URL`（指向共用 MySQL 的 `aiqc` 库）、`AUTH_SECRET`（随机长串）、`NEXT_PUBLIC_SITE_URL`（正式域名，用于 sitemap）
- 部署方式与现有项目合并在一台服务时：同一台服务器跑两个 Next 进程或后续合并代码库均可，数据库只需保证 `aiqc` 库存在；`public/uploads` 需持久化目录或改云存储
- 上线检查：改管理员密码、填正式联系方式/公司全称（`src/lib/site-config.ts`）、换正式产品图与文案、配域名 HTTPS 与备案

## 需求验收对照（需求文档 §12）

- [x] 前台 6 大板块完成，深色科技风、动效流畅（移动端降级）
- [x] 三语前台 + 后台，阿语 RTL 镜像排版
- [x] 后台可登录，产品/新闻/案例增删改查 + 上下架，三语分栏填写，富文本与图片上传
- [x] 客户留言可提交（校验 + 频率限制），后台可见、标记已处理、CSV 导出
- [x] 数据存 MySQL 逻辑库 `aiqc`，与共用实例下其他项目隔离
- [x] 本地可运行，移动端响应式适配
- [x] SEO：每页 title/meta、三语 sitemap.xml、robots
