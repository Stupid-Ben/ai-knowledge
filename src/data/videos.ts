import { VideoSeries, Video } from '@/types';

export const VIDEO_SERIES: VideoSeries[] = [
  {
    key: 'ai-intro',
    name: 'AI 零基础入门系列',
    cover: 'https://picsum.photos/id/20/960/540',
    desc: '从零开始认识人工智能，用最通俗的语言带你走进 AI 世界',
    total: 5,
    category: '扫盲'
  },
  {
    key: 'ai-efficiency',
    name: 'AI 办公提效系列',
    cover: 'https://picsum.photos/id/60/960/540',
    desc: '用 AI 让你的工作效率翻倍，周报、PPT、邮件一键搞定',
    total: 4,
    category: '提效'
  },
  {
    key: 'ai-creative',
    name: 'AI 创意绘画系列',
    cover: 'https://picsum.photos/id/80/960/540',
    desc: '零基础也能画出惊艳大片，Midjourney 手把手教学',
    total: 3,
    category: '娱乐'
  }
];

export const MOCK_VIDEOS: Video[] = [
  // === AI 零基础入门系列 ===
  {
    id: 'vid-001',
    title: '什么是人工智能？3分钟看懂 AI 的前世今生',
    cover: 'https://picsum.photos/id/21/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '03:15',
    seriesKey: 'ai-intro',
    episode: 1,
    category: '扫盲',
    isPremium: false,
    desc: '从图灵测试到深度学习，用大白话帮你快速了解人工智能的发展历程。看完这一集，你就能在朋友面前聊 AI 了！',
    plays: 15200,
    collects: 3800,
    publishedAt: '2026-05-20'
  },
  {
    id: 'vid-002',
    title: 'ChatGPT 到底是怎么"思考"的？',
    cover: 'https://picsum.photos/id/22/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '05:42',
    seriesKey: 'ai-intro',
    episode: 2,
    category: '扫盲',
    isPremium: false,
    desc: '揭秘大语言模型的工作原理：它并不是真的在"想"，而是在做超级复杂的概率计算。本集用厨房做菜的比喻让你秒懂！',
    plays: 12800,
    collects: 3100,
    publishedAt: '2026-05-25'
  },
  {
    id: 'vid-003',
    title: '大模型 vs 小模型：傻傻分不清楚？',
    cover: 'https://picsum.photos/id/23/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '04:30',
    seriesKey: 'ai-intro',
    episode: 3,
    category: '扫盲',
    isPremium: false,
    desc: 'GPT-4、Claude、Gemini……这么多模型到底有什么区别？本集帮你理清不同 AI 模型之间的关系和特点。',
    plays: 9800,
    collects: 2400,
    publishedAt: '2026-06-01'
  },
  {
    id: 'vid-004',
    title: '提示词工程入门：和 AI 高效对话的秘密',
    cover: 'https://picsum.photos/id/24/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '07:20',
    seriesKey: 'ai-intro',
    episode: 4,
    category: '扫盲',
    isPremium: false,
    desc: '为什么你跟 AI 聊天总是答非所问？关键在于提示词！本集教你"角色+任务+限制"三步公式，让 AI 瞬间听话。',
    plays: 22000,
    collects: 6500,
    publishedAt: '2026-06-05'
  },
  {
    id: 'vid-005',
    title: '进阶：多轮对话与上下文管理技巧',
    cover: 'https://picsum.photos/id/25/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '12:30',
    seriesKey: 'ai-intro',
    episode: 5,
    category: '扫盲',
    isPremium: true,
    desc: '学会管理对话上下文，让 AI 记住你的需求、保持一致性。进阶必学，适用于复杂任务和长对话场景。',
    plays: 8500,
    collects: 4200,
    publishedAt: '2026-06-08'
  },

  // === AI 办公提效系列 ===
  {
    id: 'vid-006',
    title: '10秒写完周报：AI 职场汇报魔法',
    cover: 'https://picsum.photos/id/61/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '06:10',
    seriesKey: 'ai-efficiency',
    episode: 1,
    category: '提效',
    isPremium: false,
    desc: '教你把"这周修了个Bug"秒变成高大上的工作成果汇报。告别周五加班写周报的痛苦！',
    plays: 31000,
    collects: 9200,
    publishedAt: '2026-05-22'
  },
  {
    id: 'vid-007',
    title: 'AI 帮你做 PPT：从大纲到成品全流程',
    cover: 'https://picsum.photos/id/62/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '09:45',
    seriesKey: 'ai-efficiency',
    episode: 2,
    category: '提效',
    isPremium: false,
    desc: '从主题确定、大纲生成到内容填充，用 AI 全自动帮你搞定一份专业级 PPT。再也不用熬夜赶演示了！',
    plays: 25600,
    collects: 7100,
    publishedAt: '2026-05-28'
  },
  {
    id: 'vid-008',
    title: '邮件润色大师：3步写出高情商工作邮件',
    cover: 'https://picsum.photos/id/63/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '05:30',
    seriesKey: 'ai-efficiency',
    episode: 3,
    category: '提效',
    isPremium: false,
    desc: '催进度、推方案、回复投诉……职场中各种棘手邮件场景，AI 帮你写出得体又有温度的回复。',
    plays: 18300,
    collects: 5400,
    publishedAt: '2026-06-02'
  },
  {
    id: 'vid-009',
    title: '高阶：用 AI 搭建个人知识管理系统',
    cover: 'https://picsum.photos/id/64/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '15:20',
    seriesKey: 'ai-efficiency',
    episode: 4,
    category: '提效',
    isPremium: true,
    desc: '结合 AI 助手搭建你自己的第二大脑：笔记整理、知识关联、定期复盘全自动。这是拉开差距的进阶技能！',
    plays: 7600,
    collects: 3800,
    publishedAt: '2026-06-07'
  },

  // === AI 创意绘画系列 ===
  {
    id: 'vid-010',
    title: 'Midjourney 第一次画图：5分钟出壁纸',
    cover: 'https://picsum.photos/id/81/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '08:15',
    seriesKey: 'ai-creative',
    episode: 1,
    category: '娱乐',
    isPremium: false,
    desc: '手把手教你注册 Midjourney、输入第一段提示词，见证一张惊艳壁纸的诞生过程。零基础也能上手！',
    plays: 42000,
    collects: 12800,
    publishedAt: '2026-05-18'
  },
  {
    id: 'vid-011',
    title: '风格切换大法：赛博朋克、水墨、吉卜力随心变',
    cover: 'https://picsum.photos/id/82/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '10:40',
    seriesKey: 'ai-creative',
    episode: 2,
    category: '娱乐',
    isPremium: false,
    desc: '同一个主题，换个风格修饰词就能变幻出截然不同的画风。本集教你掌握10种最常用的艺术风格关键词。',
    plays: 28500,
    collects: 8900,
    publishedAt: '2026-05-26'
  },
  {
    id: 'vid-012',
    title: '进阶：AI 绘画商业变现完全指南',
    cover: 'https://picsum.photos/id/83/960/540',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '18:00',
    seriesKey: 'ai-creative',
    episode: 3,
    category: '娱乐',
    isPremium: true,
    desc: '头像定制、壁纸售卖、自媒体配图……学会这些变现路径，把兴趣变成收入。会员专享进阶内容。',
    plays: 6200,
    collects: 3500,
    publishedAt: '2026-06-06'
  }
];
