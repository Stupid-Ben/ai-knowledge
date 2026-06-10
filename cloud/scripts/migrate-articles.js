/**
 * 数据迁移脚本：将 MOCK_ARTICLES 转换为云数据库 JSON 格式
 * 使用方法：node cloud/scripts/migrate-articles.js > cloud/scripts/articles-import.json
 * 然后在微信云开发控制台导入 articles 集合
 */

// 由于 articles.ts 是 TS 模块，这里手动复制关键数据结构
const CATEGORIES = ['扫盲', '提效', '辅助', '生活', '娱乐', '热点'];

function splitHtml(contentHtml) {
  // 以 <!-- MORE --> 分割，如果没有则取前半段
  const moreIndex = contentHtml.indexOf('<!-- MORE -->');
  if (moreIndex !== -1) {
    return {
      previewHtml: contentHtml.substring(0, moreIndex),
      fullHtml: contentHtml
    };
  }
  // 没有 MORE 标记，取前 40% 作为预览
  const paragraphs = contentHtml.split(/(?=<h[1-6])|(?=<p>)/);
  const previewLen = Math.max(2, Math.floor(paragraphs.length * 0.4));
  return {
    previewHtml: paragraphs.slice(0, previewLen).join(''),
    fullHtml: contentHtml
  };
}

// 从 MOCK_ARTICLES 读取数据（此脚本需要在项目根目录运行）
// 实际使用时，将 MOCK_ARTICLES 的数据粘贴到这里或用 require 导入
console.log(`
使用说明：
1. 在微信云开发控制台创建 articles 集合
2. 将 src/data/articles.ts 中的 MOCK_ARTICLES 数据
   转换为以下格式后批量导入：

每条记录格式：
{
  "id": "art-001",
  "title": "...",
  "cover": "...",
  "summary": "...",
  "category": "扫盲",
  "tags": ["..."],
  "isPremium": false,
  "views": 12450,
  "collects": 3840,
  "readMinutes": 3,
  "publishedAt": "2026-06-01",
  "previewHtml": "<h2>...</h2><p>...</p>",
  "fullHtml": "<h2>...</h2><p>...</p>...<p>...</p>"
}

拆分规则：
- 如果 contentHtml 中有 <!-- MORE --> 标记，previewHtml 为标记前的部分
- 否则取前 40% 的段落作为 previewHtml
- fullHtml 为完整内容

提示：也可以直接在云开发控制台的 articles 集合中手动添加测试数据。
`);
