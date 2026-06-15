# AI 科普知识库 - 微信小程序

一款面向大众的 AI 科普学习小程序，基于 Taro 4 + React + TypeScript + 微信云开发。

## 功能概览

- **推荐首页**：轮播 Banner、视频课横滑推荐、热门榜单、文章信息流（无限下滑加载）
- **分类浏览**：6 大主题封面大卡，点击进入分类文章列表
- **视频课**：精选系列横滑、分类筛选、视频播放（试看 + 会员墙）
- **会员体系**：VIP 伴学页面、测意愿版会员墙（留资而非真支付）
- **个人中心**：收藏、浏览历史、字号设置
- **云开发后端**：微信登录、云数据库读文章、埋点上报

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | Taro 4.1.9 + React 18 + TypeScript |
| 样式 | SCSS 模块化 |
| 后端 | 微信云开发（云函数 + 云数据库 + 云存储） |
| 构建工具 | Webpack 5 |

## 快速开始

### 前置条件

- Node.js >= 16
- 微信开发者工具（最新稳定版）
- 微信小程序账号（已开通云开发）

### 1. 安装依赖

```bash
npm install
```

### 2. 云函数安装依赖

```bash
cd cloud/functions/login && npm install
cd ../getArticles && npm install
cd ../getArticleDetail && npm install
cd ../recordIntent && npm install
cd ../trackEvent && npm install
```

### 3. 编译

```bash
npm run build:weapp
```

编译后会自动将云函数同步到 `dist/cloud/functions/`。

### 4. 在微信开发者工具中打开

1. 打开微信开发者工具
2. 导入项目，选择 `dist/` 目录（项目根目录下的 dist 文件夹）
3. AppID 填写你自己的小程序 AppID

### 5. 部署云函数

在微信开发者工具中：

1. 左侧资源管理器展开 `cloud/functions/`
2. 对每个云函数文件夹右键 → **上传并部署：云端安装依赖**
3. 需要部署的云函数：`login`、`getArticles`、`getArticleDetail`、`recordIntent`、`trackEvent`

### 6. 创建云数据库集合

在云开发控制台 → 数据库中创建以下集合：

| 集合名 | 用途 |
|--------|------|
| `articles` | 文章数据 |
| `users` | 用户档案 |
| `collects` | 收藏记录 |
| `history` | 浏览历史 |
| `leads` | 留资/意愿 |
| `events` | 埋点事件 |

### 7. 导入文章数据

在云开发控制台 → 数据库 → `articles` 集合 → 导入：

- 文件：`cloud/scripts/articles-seed.jsonl`
- 格式：**JSON Lines**

## 项目结构

```
├── src/
│   ├── app.ts                 # 应用入口（云初始化）
│   ├── app.config.ts          # 路由 & TabBar 配置
│   ├── components/            # 公共组件
│   │   ├── ArticleCard/       # 文章卡片
│   │   ├── VideoCard/         # 视频卡片
│   │   ├── VideoRail/         # 首页视频横滑
│   │   └── SeriesCard/        # 系列卡片
│   ├── pages/
│   │   ├── index/             # 推荐首页
│   │   ├── category/          # 分类页
│   │   ├── video/             # 视频课 Tab
│   │   ├── video-detail/      # 视频详情
│   │   ├── detail/            # 文章详情
│   │   ├── vip/               # VIP 伴学
│   │   ├── mine/              # 个人中心
│   │   └── search/            # 搜索
│   ├── store/                 # 全局状态（AppContext）
│   ├── utils/
│   │   ├── cloud.ts           # 云函数调用封装
│   │   ├── track.ts           # 埋点封装
│   │   └── media.ts           # 媒体资源工具（fileID 转换）
│   ├── data/                  # 本地 mock 数据（回退用）
│   ├── types/                 # TypeScript 类型
│   └── styles/                # 全局样式变量
├── cloud/
│   ├── functions/             # 云函数
│   │   ├── login/             # 登录
│   │   ├── getArticles/       # 文章列表
│   │   ├── getArticleDetail/  # 文章详情
│   │   ├── recordIntent/      # 留资上报
│   │   └── trackEvent/        # 埋点上报
│   └── scripts/
│       ├── articles-seed.jsonl # 种子数据
│       └── migrate-articles.js # 数据迁移说明
├── scripts/
│   └── sync-cloud.js          # 编译后同步云函数
└── project.config.json        # 微信开发者工具配置
```

## 云函数接口

| 函数 | 说明 | 参数 |
|------|------|------|
| `login` | 登录/注册用户 | 无 |
| `getArticles` | 文章列表（分页） | `{ category?, page?, pageSize? }` |
| `getArticleDetail` | 文章详情（含会员校验） | `{ id }` |
| `recordIntent` | 会员墙留资 | `{ articleId, contact?, planInterest?, source }` |
| `trackEvent` | 埋点上报 | `{ event, props }` |

## 埋点事件

| 事件 | 触发时机 | 参数 |
|------|----------|------|
| `article_open` | 进入文章详情 | articleId, category, isPremium |
| `article_read_complete` | 滚动阅读超过阈值 | articleId |
| `paywall_impression` | 会员墙首次展示 | articleId |
| `unlock_click` | 点击解锁按钮 | articleId, category |
| `lead_submit` | 提交留资表单 | articleId, category |

## 配置说明

### 云环境 ID

在 `src/utils/cloud.ts` 中修改：

```ts
const CLOUD_ENV = 'your-env-id';  // 替换为你的云环境 ID
```

### AppID

在 `project.config.json` 中修改：

```json
{
  "appid": "your-appid"
}
```

## 本地开发

```bash
# 开发模式（监听文件变化）
npm run dev:weapp
```

在微信开发者工具中打开 `dist/` 目录即可实时预览。

## 数据迁移说明

当前项目支持两种数据模式：

1. **云数据库**（推荐）：文章数据存在云数据库 `articles` 集合中
2. **本地回退**：云函数不可用时自动回退到 `src/data/articles.ts` 中的 mock 数据

### 将文章迁移到云数据库

1. 准备 JSON Lines 格式的数据文件（参考 `cloud/scripts/articles-seed.jsonl`）
2. 在云开发控制台导入
3. 注意拆分 `previewHtml`（免费前半段）和 `fullHtml`（完整正文）

## 注意事项

- `fullHtml`（付费正文）只在服务端判定会员后才下发，前端永远不会从列表接口获取
- 测意愿阶段没有真支付，所有 `isPremium` 文章都会触发会员墙
- 埋点上报失败不会阻塞 UI（静默失败）
- 图片支持 cloud fileID 和 https URL 两种格式

## License

MIT
