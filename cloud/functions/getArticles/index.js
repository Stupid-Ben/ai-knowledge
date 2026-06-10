// 云函数：getArticles
// 列表只返回元信息（不含正文），支持分页和分类筛选
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { category, page = 1, pageSize = 10 } = event;
  const skip = (page - 1) * pageSize;

  try {
    let query = db.collection('articles');
    if (category) {
      query = query.where({ category });
    }

    // 获取总数
    const countRes = await query.count();
    const total = countRes.total;

    // 获取列表（不含 fullHtml）
    const listRes = await query
      .field({
        id: true,
        title: true,
        cover: true,
        summary: true,
        category: true,
        tags: true,
        isPremium: true,
        views: true,
        collects: true,
        readMinutes: true,
        publishedAt: true
      })
      .orderBy('publishedAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();

    return {
      list: listRes.data,
      hasMore: skip + pageSize < total
    };
  } catch (err) {
    console.error('[getArticles] error:', err);
    return { error: err.message };
  }
};
