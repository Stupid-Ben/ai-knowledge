// 云函数：login
// 首次进入调用，upsert users，返回用户档案
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext();
  const now = new Date();

  try {
    // 查询用户是否存在
    const userRes = await db.collection('users').where({ _openid: OPENID }).get();
    let isMember = false;
    let memberExpireAt = null;

    if (userRes.data.length === 0) {
      // 新用户，插入
      await db.collection('users').add({
        data: {
          _openid: OPENID,
          nickName: '',
          avatar: '',
          isMember: false,
          memberExpireAt: null,
          createdAt: now,
          lastActiveAt: now
        }
      });
    } else {
      // 已有用户，更新 lastActiveAt
      const user = userRes.data[0];
      isMember = user.isMember || false;
      memberExpireAt = user.memberExpireAt || null;
      await db.collection('users').doc(user._id).update({
        data: { lastActiveAt: now }
      });
    }

    return { openid: OPENID, isMember, memberExpireAt };
  } catch (err) {
    console.error('[login] error:', err);
    return { error: err.message };
  }
};
