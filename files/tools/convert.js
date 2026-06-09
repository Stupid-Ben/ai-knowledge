// convert.js — 把 Notion 导出的「文章内容库」转成小程序用的 articles.json
// 依赖：npm i csv-parse marked
// 用法：node convert.js ./你的导出文件夹

const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse/sync");
const { marked } = require("marked");

const dir = process.argv[2] || ".";

// 1) 读取导出的 CSV（包含所有属性）
const csvName = fs.readdirSync(dir).find(f => f.endsWith(".csv"));
const rows = parse(fs.readFileSync(path.join(dir, csvName)), { columns: true });

// 2) 递归收集所有 .md 文件（每篇文章正文一个）
function findMd(d) {
  let out = [];
  for (const name of fs.readdirSync(d)) {
    const p = path.join(d, name);
    if (fs.statSync(p).isDirectory()) out = out.concat(findMd(p));
    else if (name.endsWith(".md")) out.push(p);
  }
  return out;
}
const mdFiles = findMd(dir);

// 3) 字段映射 + 正文转 HTML
const articles = rows.map((r, idx) => {
  // Notion 导出的 md 文件名是「标题 + 一串哈希.md」，按标题前缀匹配
  const mdPath = mdFiles.find(p => path.basename(p).startsWith(r["标题"]));
  let body = mdPath ? fs.readFileSync(mdPath, "utf8") : "";
  // 去掉顶部标题行和属性区，从第一个二级标题开始才是正文
  const start = body.indexOf("## ");
  if (start >= 0) body = body.slice(start);

  return {
    id: "a" + (idx + 1),
    title: r["标题"] || "",
    cover: r["封面图"] || "",
    summary: r["摘要"] || "",
    category: r["分类"] || "",
    tags: (r["标签"] || "").split(",").map(s => s.trim()).filter(Boolean),
    isPremium: r["精品付费"] === "Yes" || r["精品付费"] === "是",
    readMinutes: Number(r["阅读时长"] || 0),
    views: Number(r["阅读量"] || 0),
    collects: Number(r["收藏数"] || 0),
    publishedAt: r["发布时间"] || "",
    ranking: (r["榜单"] || "").split(",").map(s => s.trim()).filter(Boolean),
    contentHtml: marked.parse(body),
  };
});

// 4) 写出 articles.json
fs.writeFileSync("articles.json", JSON.stringify(articles, null, 2));
console.log("已生成 articles.json，共 " + articles.length + " 篇");