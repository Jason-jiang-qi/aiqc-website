# AIQC 公司官网 — 需求规格说明书（v2.0）

> 文档状态：正式版 · 用途：投喂 Cursor（AI 编程）开发公司官网
> 使用方式：将本文件保存为项目根目录 `REQUIREMENTS.md`，或直接复制文末"一句话 Prompt"给 Cursor。
> 最后更新：2026-10-21

---

## 0. 变更记录

| 版本 | 日期 | 变更说明 |
|---|---|---|
| v1.0 | 2026-10-21 | 初版需求文档 |
| v2.0 | 2026-10-21 | ① AIQC 全名标注为后续提供；② 数据库改为 MySQL 8.x，与现有其他项目共用同一实例、使用独立逻辑库 `aiqc`；③ 补充页面级细节、多语言规范、非功能需求与开发里程碑 |

---

## 1. 项目概述

| 项目 | 内容 |
|---|---|
| 项目名称 | AIQC 公司官方网站（含管理后台） |
| 开发方式 | Cursor + AI 编程，全站代码生成 |
| 公司名称 | AIQC（**全名待定，后续提供**；上线前确认英文全称用于 Logo 与版权信息） |
| 网站形态 | 企业品牌展示 + 产品展示 + 信息发布 + 客户互动的响应式官网 |
| 目标访问者 | 沙特本地及海湾地区 B 端客户（政府、园区、企业、物业、物流等） |

---

## 2. 公司背景与内容素材

### 2.1 公司介绍
- **100% 沙特本地公司**，已成立 **4 年**
- 定位：**沙特地区智能设备销售与运营服务商**
- 核心能力：将前沿自动驾驶与机器人设备引入沙特，提供本地化销售、交付、部署与长期运营服务
- 宣传要点（用于文案撰写）：
  - 本地化优势：沙特本地注册、本地团队、本地服务响应
  - 行业经验：4 年深耕智能设备领域
  - 一站式：销售 + 运营 + 维护全链条

### 2.2 核心业务
1. **智能设备销售**：面向 B 端客户销售自动驾驶与机器人设备
2. **运营服务**：设备本地化部署、调试、日常运营、维护保养与技术培训

### 2.3 主要产品线
| 序号 | 产品 | 应用场景 | 备注 |
|---|---|---|---|
| 1 | 无人驾驶扫地车 | 园区、道路、商场清洁 | 主推产品 |
| 2 | 无人驾驶送货车 | 园区、最后一公里配送 | 主推产品 |
| 3 | 无人驾驶卡车 | 短途/干线货运 | 主推产品 |
| 4 | 机器狗 | 巡检、安防、应急 | 科技感展示 |
| 5 | 机器人（通用/服务） | 接待、引导、服务 | 可扩展 |
| 6 | 无人充电车 | 移动充电补能 | 差异化产品 |
| 7 | 其他智能设备 | — | 预留扩展位 |

> 注：产品名称、配图、详细参数由公司后续提供，开发阶段先用占位数据。

---

## 3. 设计风格要求（重点）

### 3.1 视觉方向
- **关键词**：智能、科技、前卫、有视觉冲击力
- **基调**：深色科技风
  - 主背景：深空蓝 / 黑（#050A14 系）
  - 主色：科技蓝 / 青色渐变（#00D4FF、#4F8CFF 系）
  - 点缀：荧光青绿、紫蓝渐变光效
- **Hero 区**：全屏沉浸式主视觉（动态粒子 / 网格 / 光效 / 3D 元素或视频背景）
- **动效**：滚动渐入、卡片悬浮、数字滚动统计、视差滚动、渐变流动
- **字体**：
  - 拉丁文：现代无衬线（Inter / Space Grotesk）
  - 阿拉伯文：适配 RTL 的字体（如 IBM Plex Sans Arabic / Tajawal）
- **视觉层级**：大标题 + 强对比 + 留白，突出科技感

### 3.2 组件与交互动效规范
- 所有动效使用 Framer Motion（滚动、悬浮、入场、过渡）
- 动画流畅无卡顿，禁用突兀跳跃
- 交互元素有 hover / active / focus 状态
- 移动端动效需降级处理（减少重动画）

---

## 4. 信息架构（站点地图）

```
AIQC 官网
├── 首页 Home（/）
├── 关于我们 About（/about）
├── 产品中心 Products（/products）
│   └── 产品详情页（/products/[slug]）
├── 成功案例 Cases（/cases）
│   └── 案例详情页（/cases/[slug]）
├── 新闻动态 News（/news）
│   └── 新闻详情页（/news/[slug]）
├── 联系我们 / 留言 Contact（/contact）
└── 管理后台 Admin（/admin，独立于前台）
    ├── 登录
    ├── 仪表盘
    ├── 产品管理
    ├── 新闻管理
    ├── 案例管理
    └── 留言管理
```

---

## 5. 前台页面需求（逐页详述）

### 5.1 首页 Home
| 区块 | 内容 |
|---|---|
| Hero 主视觉 | 品牌 Slogan + 产品大图/视频 + CTA（了解产品 / 联系我们） |
| 公司简介摘要 | 一句话定位 + 4 年本地经验 + "100% 沙特本地公司"徽标 |
| 核心业务 | 销售 / 运营服务两大板块 |
| 数据统计 | 成立年限、服务客户数、设备数量、覆盖城市（数字滚动动效） |
| 产品总览 | 6 大产品卡片（悬浮效果）+ 查看全部 |
| 成功案例精选 | 3 个代表案例卡片 |
| 新闻摘要 | 最新 3 条新闻 |
| CTA 区 | 留言/咨询入口 |
| Footer | 导航、联系方式、多语言切换、版权 |

### 5.2 关于我们 About
- 公司介绍长文（含公司成立、4 年历程、本地化优势）
- 核心价值 / 使命 / 愿景
- 本地化能力展示（本地团队、服务网络）
- 荣誉资质 / 合作机构（如有，后续补充）

### 5.3 产品中心 Products
- **列表页**：产品卡片网格（图 + 标题 + 简介 + 查看详情）
- **详情页**：
  - 产品大图（可多图切换）
  - 产品简介
  - 功能特性（图标列表）
  - 技术参数表
  - 应用场景
  - 咨询 CTA（跳转留言页并预填产品名）

### 5.4 成功案例 Cases
- **列表页**：案例卡片（封面 + 客户/行业 + 成果数据）
- **详情页**：项目背景 → 方案 → 成果数据 → 现场图片

### 5.5 新闻动态 News
- **列表页**：新闻卡片（封面 + 标题 + 日期），支持分页
- **详情页**：封面图 + 正文（富文本渲染）+ 发布日期 + 上一篇/下一篇

### 5.6 联系 / 留言 Contact
- **客户留言表单**：
  - 姓名（必填）
  - 联系电话或邮箱（必填）
  - 公司名称（选填）
  - 意向产品（下拉选择，来自产品库）
  - 留言内容（必填）
  - 提交后显示成功提示
- **联系信息**：电话、邮箱、办公地址（后续提供）
- **地图**（可选）：公司位置地图嵌入

---

## 6. 管理后台需求（/admin）

### 6.1 通用要求
- 登录鉴权：邮箱 + 密码，密码加密存储（bcrypt），Session 管理
- 未登录访问后台一律跳转登录页
- 后台界面同样支持 中 / 英 / 阿 三语切换
- 所有内容条目支持三语分栏填写（中/英/阿 三个输入区）

### 6.2 功能模块
| 模块 | 功能 |
|---|---|
| 仪表盘 | 数据概览：产品数、新闻数、案例数、未处理留言数 |
| 产品管理 | 列表 / 新增 / 编辑 / 删除 / 上下架 / 排序；多图上传；参数表编辑 |
| 新闻管理 | 列表 / 新增 / 编辑 / 删除 / 上下架；封面图；富文本正文；发布日期 |
| 案例管理 | 列表 / 新增 / 编辑 / 删除 / 上下架；封面图；成果数据 |
| 留言管理 | 查看留言、标记已处理 / 未处理、删除、导出 CSV |

### 6.3 富文本编辑器
- 新闻/案例正文支持富文本（建议 Tiptap 或 Markdown 编辑器）
- 支持插入图片、标题、列表、引用

---

## 7. 多语言需求（重点）

| 项目 | 要求 |
|---|---|
| 语言 | 中文（简体）、英语、阿拉伯语 |
| 覆盖范围 | 前台全站界面文案 + 全部动态内容（产品/新闻/案例/留言表单）+ 后台管理界面 |
| 路由方案 | URL 前缀路由：`/`（中文）、`/en`、`/ar`（利于 SEO 与链接分享） |
| RTL | 切换阿拉伯语时全站镜像排版（文字右对齐、导航与布局反向、图标翻转） |
| 语言切换 | 页面右上角/页脚语言切换器；记忆用户偏好，刷新后保持 |
| 字体 | 阿语使用适配字体，防止乱码 |
| 日期格式 | 按语言本地化显示（如 2026/10/21 vs Oct 21, 2026） |
| 数字格式 | 阿语环境按需本地化 |

---

## 8. 技术架构

### 8.1 技术栈
| 模块 | 技术 |
|---|---|
| 前端框架 | Next.js 14+（App Router）+ TypeScript |
| 样式 | Tailwind CSS + 自定义设计系统 |
| 动效 | Framer Motion |
| 视觉增强 | Canvas / 粒子背景、渐变网格（可选 Three.js） |
| 多语言 | next-intl（原生支持 RTL 与 URL 前缀） |
| 数据库 | **MySQL 8.x** |
| ORM | Prisma |
| 鉴权 | NextAuth.js 或自建 Session |
| 富文本 | Tiptap 或 Markdown |
| 图片上传 | 本地 public 目录或云存储（OSS/S3） |
| 部署 | Vercel（前端+API）+ 托管 MySQL；或自托管 Docker |

### 8.2 数据库连接方案（重要约束）
- **与现有其他项目共用同一 MySQL 实例**，AIQC 使用**独立逻辑库 `aiqc`**
- 连接串示例：
  ```
  mysql://<user>:<password>@<host>:3306/aiqc
  ```
- 初始化（由运维/开发执行一次）：
  ```sql
  CREATE DATABASE aiqc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  ```
- **数据隔离约束**：
  - AIQC 所有表（含 Prisma 迁移表 `_prisma_migrations`）只建在 `aiqc` 库内
  - 不与其他项目的逻辑库做跨库 JOIN / 依赖
  - 建议为 AIQC 分配独立数据库账号，仅授予 `aiqc.*` 权限，避免误操作其他库
  - Prisma `datasource.url` 指向 `aiqc`，迁移只影响该库

### 8.3 项目目录结构
```
app/
  [locale]/              # 多语言路由（zh / en / ar）
    page.tsx             # 首页
    about/               # 关于我们
    products/            # 产品中心（列表+详情）
    cases/               # 成功案例
    news/                # 新闻
    contact/             # 联系/留言
  admin/                 # 管理后台（登录+管理页面）
lib/
  db/                    # 数据库连接与 Prisma Client（连接 aiqc 逻辑库）
  i18n/                  # 多语言配置
components/              # 公共组件
public/                  # 静态资源
prisma/
  schema.prisma          # 数据模型
```

---

## 9. 数据模型（Prisma Schema 草案，MySQL 兼容）

> 以下类型（String/Int/Boolean/DateTime/Json）均为 MySQL 8.x 原生支持。所有表位于 `aiqc` 逻辑库。

```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL") // 指向 mysql://user:pass@host:3306/aiqc
}

generator client {
  provider = "prisma-client-js"
}

model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hash
  createdAt DateTime @default(now())
}

model Product {
  id          String   @id @default(cuid())
  slug        String   @unique
  cover       String?
  images      Json?    // 多图 URL 数组
  isPublished Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  zhTitle     String
  enTitle     String
  arTitle     String
  zhDesc      String?
  enDesc      String?
  arDesc      String?
  zhBody      String?  // 详情（富文本/Markdown）
  enBody      String?
  arBody      String?
  specs       Json?    // 参数表 [{ "label": {...}, "value": {...} }]
}

model News {
  id          String   @id @default(cuid())
  slug        String   @unique
  cover       String?
  isPublished Boolean  @default(true)
  publishDate DateTime @default(now())
  zhTitle     String
  enTitle     String
  arTitle     String
  zhBody      String?
  enBody      String?
  arBody      String?
}

model Case {
  id           String   @id @default(cuid())
  slug         String   @unique
  cover        String?
  isPublished  Boolean  @default(true)
  zhTitle      String
  enTitle      String
  arTitle      String
  zhDesc       String?
  enDesc       String?
  arDesc       String?
  resultMetric String?  // 成果数据，如 "节省30%运营成本"
}

model Message {
  id        String   @id @default(cuid())
  name      String
  contact   String   // 电话或邮箱
  company   String?
  product   String?  // 意向产品 slug
  content   String
  isHandled Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 10. 非功能需求

| 类别 | 要求 |
|---|---|
| 响应式 | 桌面 / 平板 / 手机全适配 |
| 性能 | 首屏 LCP < 2.5s；图片懒加载；动效 GPU 加速 |
| SEO | 每页独立 title/meta；sitemap.xml；三语 URL 结构化 |
| 安全 | 表单防注入（Prisma 参数化）；留言表单加基础校验与频率限制；后台强密码 + Session；上传文件类型校验 |
| 可访问性 | 语义化标签、键盘可操作、对比度达标 |
| 可维护性 | 组件化开发、代码注释、环境变量集中管理（.env） |

---

## 11. 开发里程碑（建议分 4 阶段）

| 阶段 | 内容 | 验收 |
|---|---|---|
| M1 骨架 | 项目初始化、三语路由、RTL、设计系统、页面框架 | 三语切换正常，阿语镜像排版 |
| M2 前台 | 首页/关于/产品/案例/新闻/联系全部页面 + 动效 | 页面完整、视觉达标、响应式正常 |
| M3 后台 | 数据库模型、登录、产品/新闻/案例/留言管理 | 后台可登录、增删改查可用、三语录入正常 |
| M4 联调交付 | 留言提交链路、数据初始化、部署配置、文档 | 全流程可用、可部署上线 |

---

## 12. 验收标准（Checklist）

- [ ] 前台 6 大板块全部完成，深色科技风视觉统一、动效流畅
- [ ] 三语（中/英/阿）前台 + 后台均可用，阿语 RTL 排版正确
- [ ] 管理后台可登录，产品/新闻/案例增删改查，三语内容分栏填写
- [ ] 客户留言前台可提交，后台可见并标记处理
- [ ] 数据存 MySQL 逻辑库 `aiqc`，刷新/重启不丢失，不影响共用实例下其他项目
- [ ] 本地可运行，部署说明清晰
- [ ] 移动端适配良好
- [ ] SEO 基础项（title/meta/sitemap）到位

---

## 13. 开放问题（待用户确认）

1. **公司英文全称**：后续提供，上线前确认
2. **产品图文素材**：正式产品图、参数、应用场景图片，开发阶段用占位
3. **联系信息**：电话、邮箱、地址（用于 Footer 与联系页）
4. **域名与部署环境**：目标域名、是否已有托管 MySQL 实例
5. **初始新闻/案例**：是否有首批发布内容（无则用占位示例）

---

## 14. 给 Cursor 的一句话 Prompt

> 请帮我用 Next.js 14 (App Router) + TypeScript + Tailwind CSS 搭建 AIQC 公司官网。公司是 100% 沙特本地公司、成立 4 年，主营业务为沙特地区智能设备销售与运营服务商，产品包括无人驾驶扫地车、无人驾驶送货车、无人驾驶卡车、机器狗、机器人、无人充电车等。要求：① 深色科技风、前卫有视觉冲击力，动效流畅；② 包含首页/关于我们/产品中心(含详情)/成功案例/新闻动态/联系留言页面；③ 带管理后台(/admin)可登录，支持产品、新闻、成功案例的增删改和客户留言管理；④ 前后台均支持中文、英语、阿拉伯语三语，阿语 RTL 布局；⑤ 使用 **MySQL 8.x 数据库**（与现有其他项目共用同一数据库实例，AIQC 使用**独立逻辑库 `aiqc`**，互不影响），用 Prisma 管理数据并附初始化占位数据；⑥ 给出本地运行与部署说明。请先输出完整项目结构和 Prisma Schema，再逐步实现。
