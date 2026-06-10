// 云函数：recordIntent
// 会员墙留资/意愿，写 leads + 埋点
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { articleId, contact, planInterest, source } = event;

  try {
    await db.collection('leads').add({
      data: {
        _openid: OPENID,
        articleId,
        contact: contact || '',
        planInterest: planInterest || '',
        source: source || 'paywall',
        createdAt: new Date()
      }
    });

    // 写一条 lead_submit 埋点
    await db.collection('events').add({
      data: {
        _openid: OPENID,
        event: 'lead_submit',
        props: JSON.stringify({ articleId, planInterest }),
        ts: new Date()
      }
    });

    return { ok: true };
  } catch (err) {
    console.error('[recordIntent] error:', err);
    return { error: err.message };
  }
};
