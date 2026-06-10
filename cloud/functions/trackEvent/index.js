// 云函数：trackEvent
// 埋点上报
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const { event: eventName, props } = event;

  try {
    await db.collection('events').add({
      data: {
        _openid: OPENID,
        event: eventName,
        props: props ? JSON.stringify(props) : '{}',
        ts: new Date()
      }
    });
    return { ok: true };
  } catch (err) {
    console.error('[trackEvent] error:', err);
    return { error: err.message };
  }
};
