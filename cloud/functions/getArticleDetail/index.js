// 云函数：getArticleDetail
// 含会员校验，返回 previewHtml（总是）+ fullHtml（仅会员）
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { id } = event;
  const { OPENID } = cloud.getWXContext();

  try {
    // 获取文章
    const artRes = await db.collection('articles').where({ id }).get();
    if (artRes.data.length === 0) {
      return { error: '文章不存在' };
    }
    const article = artRes.data[0];

    // 获取用户会员状态
    const userRes = await db.collection('users').where({ _openid: OPENID }).get();
    const isMember = userRes.data.length > 0 && userRes.data[0].isMember;

    // 阅读量 +1
    await db.collection('articles').doc(article._id).update({
      data: { views: _.inc(1) }
    });

    // 写入浏览历史
    await db.collection('history').add({
      data: {
        _openid: OPENID,
        articleId: id,
        lastReadAt: new Date(),
        progress: 0
      }
    });

    const locked = article.isPremium && !isMember;

    return {
      id: article.id,
      title: article.title,
      cover: article.cover,
      summary: article.summary,
      category: article.category,
      tags: article.tags,
      isPremium: article.isPremium,
      views: article.views + 1,
      collects: article.collects,
      readMinutes: article.readMinutes,
      publishedAt: article.publishedAt,
      previewHtml: article.previewHtml,
      fullHtml: locked ? null : article.fullHtml,
      locked
    };
  } catch (err) {
    console.error('[getArticleDetail] error:', err);
    return { error: err.message };
  }
};
