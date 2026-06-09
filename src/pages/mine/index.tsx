import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppContext } from '@/store/appContext';
import { MOCK_ARTICLES } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const FontSizes = [
  { key: 'small', label: '标准' },
  { key: 'medium', label: '大号' },
  { key: 'large', label: '超大' }
];

const MinePage: React.FC = () => {
  const { user, setUser, logout } = useAppContext();
  const [activeSubView, setActiveSubView] = useState<'none' | 'fav' | 'history' | 'fontSize'>('none');
  const [isSignedToday, setIsSignedToday] = useState(false);
  const [fontSizeKey, setFontSizeKey] = useState('medium');

  useDidShow(() => {
    console.log('[MinePage] 我的页面展示');
    // 读取本地字号偏好
    try {
      const saved = Taro.getStorageSync('ai_font_size');
      if (saved) setFontSizeKey(saved);
    } catch (_) {}
  });

  const handleArticleClick = (articleId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${articleId}` });
  };

  const favoritedArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((a) => user.collectedIds.includes(a.id));
  }, [user.collectedIds]);

  const historyArticles = useMemo(() => {
    return MOCK_ARTICLES.filter((a) => user.historyIds.includes(a.id));
  }, [user.historyIds]);

  const handleSignIn = () => {
    if (isSignedToday) return;
    setIsSignedToday(true);
    setUser({ ...user, points: user.points + 20 });
    Taro.showToast({ title: '签到成功 +20积分', icon: 'success' });
  };

  const handleInviteFriend = () => {
    setUser({ ...user, friends: user.friends + 1, points: user.points + 50 });
    Taro.showToast({ title: '邀请成功 +50积分', icon: 'success' });
  };

  const handleClearHistory = () => {
    setUser({ ...user, historyIds: [] });
    Taro.showToast({ title: '已清空阅读记录', icon: 'success' });
  };

  const handleLogout = () => {
    logout();
    Taro.showToast({ title: '已退出登录', icon: 'success' });
  };

  const handleChangeFontSize = (key: string) => {
    setFontSizeKey(key);
    try {
      Taro.setStorageSync('ai_font_size', key);
      Taro.showToast({ title: '字号已保存', icon: 'success' });
    } catch (_) {}
  };

  // ===== 子视图：收藏 =====
  if (activeSubView === 'fav') {
    return (
      <ScrollView className={styles.subView} scrollY>
        <View className={styles.subHeader}>
          <View className={styles.subBack} onClick={() => setActiveSubView('none')}>
            <Text>{'←'}</Text>
          </View>
          <Text className={styles.subTitle}>我的收藏</Text>
        </View>
        {favoritedArticles.length === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>{'⭐'}</Text>
            <Text className={styles.emptyHint}>暂无收藏文章</Text>
            <Text className={styles.emptySubHint}>阅读时点击收藏，文章会出现在这里</Text>
          </View>
        ) : (
          favoritedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
          ))
        )}
      </ScrollView>
    );
  }

  // ===== 子视图：浏览历史 =====
  if (activeSubView === 'history') {
    return (
      <ScrollView className={styles.subView} scrollY>
        <View className={styles.subHeader}>
          <View className={styles.subBack} onClick={() => setActiveSubView('none')}>
            <Text>{'←'}</Text>
          </View>
          <Text className={styles.subTitle}>阅读记录</Text>
        </View>
        {historyArticles.length === 0 ? (
          <View className={styles.emptyWrap}>
            <Text className={styles.emptyIcon}>{'🕐'}</Text>
            <Text className={styles.emptyHint}>暂无阅读记录</Text>
            <Text className={styles.emptySubHint}>快去首页探索文章吧</Text>
          </View>
        ) : (
          <>
            {historyArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
            ))}
            <View className={styles.clearBtn} onClick={handleClearHistory}>
              <Text className={styles.clearBtnText}>清空阅读记录</Text>
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  // ===== 子视图：字体大小 =====
  if (activeSubView === 'fontSize') {
    return (
      <ScrollView className={styles.subView} scrollY>
        <View className={styles.subHeader}>
          <View className={styles.subBack} onClick={() => setActiveSubView('none')}>
            <Text>{'←'}</Text>
          </View>
          <Text className={styles.subTitle}>调整字体大小</Text>
        </View>
        <View className={styles.fontSizeRow}>
          {FontSizes.map((fs) => (
            <View
              key={fs.key}
              className={classnames(styles.fontSizeBtn, fontSizeKey === fs.key && styles.fontSizeBtnActive)}
              onClick={() => handleChangeFontSize(fs.key)}
            >
              <Text>{fs.label}</Text>
            </View>
          ))}
        </View>
        <Text className={styles.fontSizeHint}>该设置将应用到文章详情页面</Text>
      </ScrollView>
    );
  }

  // ===== 主视图 =====
  return (
    <ScrollView className={styles.page} scrollY>
      {/* 用户卡片 */}
      <View className={styles.profileCard}>
        <View className={styles.avatar}>
          <Image
            className={styles.avatarImg}
            src="https://picsum.photos/id/64/200/200"
            mode="aspectFill"
          />
        </View>
        <View className={styles.profileInfo}>
          <Text className={styles.username}>学者用户</Text>
          <Text className={styles.userId}>ID: AI2026</Text>
          {user.isMember ? (
            <Text className={styles.vipTag}>VIP 会员 · 有效期内</Text>
          ) : (
            <Text className={styles.noVipTag}>您还不是会员</Text>
          )}
        </View>
      </View>

      {/* 数据统计 */}
      <View className={styles.statsRow}>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{user.points}</Text>
          <Text className={styles.statLabel}>积分</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{user.friends}</Text>
          <Text className={styles.statLabel}>好友</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{user.collectedIds.length}</Text>
          <Text className={styles.statLabel}>收藏</Text>
        </View>
        <View className={styles.statCard}>
          <Text className={styles.statNum}>{user.historyIds.length}</Text>
          <Text className={styles.statLabel}>已读</Text>
        </View>
      </View>

      {/* 签到 */}
      <View className={styles.signInCard}>
        <View className={styles.signInInfo}>
          <Text className={styles.signInIcon}>{'📅'}</Text>
          <View>
            <Text className={styles.signInTitle}>每日签到</Text>
            <Text className={styles.signInPoints}>签到赚积分，连续签到奖励翻倍</Text>
          </View>
        </View>
        <View
          className={classnames(styles.signInBtn, isSignedToday && styles.signInBtnDone)}
          onClick={handleSignIn}
        >
          <Text className={classnames(styles.signInBtnText, isSignedToday && styles.signInBtnTextDone)}>
            {isSignedToday ? '已签到' : '+20 签到'}
          </Text>
        </View>
      </View>

      {/* 菜单列表 */}
      <View className={styles.menuSection}>
        <View className={styles.menuItem} onClick={() => setActiveSubView('fav')}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>{'⭐'}</Text>
            <Text className={styles.menuLabel}>我的收藏</Text>
          </View>
          <View className={styles.menuItemRight}>
            <Text className={styles.menuValue}>{user.collectedIds.length}篇</Text>
            <Text className={styles.menuArrow}>{'›'}</Text>
          </View>
        </View>
        <View className={styles.menuItem} onClick={() => setActiveSubView('history')}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>{'🕐'}</Text>
            <Text className={styles.menuLabel}>阅读记录</Text>
          </View>
          <View className={styles.menuItemRight}>
            <Text className={styles.menuValue}>{user.historyIds.length}篇</Text>
            <Text className={styles.menuArrow}>{'›'}</Text>
          </View>
        </View>
        <View className={styles.menuItem} onClick={() => Taro.switchTab({ url: '/pages/vip/index' })}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>{'👑'}</Text>
            <Text className={styles.menuLabel}>{user.isMember ? '会员续费' : '开通会员'}</Text>
          </View>
          <View className={styles.menuItemRight}>
            {!user.isMember && <Text className={styles.menuBadge}>限时优惠</Text>}
            <Text className={styles.menuArrow}>{'›'}</Text>
          </View>
        </View>
        <View className={styles.menuItem} onClick={() => setActiveSubView('fontSize')}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>{'🔤'}</Text>
            <Text className={styles.menuLabel}>字体大小</Text>
          </View>
          <Text className={styles.menuArrow}>{'›'}</Text>
        </View>
        <View className={styles.menuItem} onClick={handleInviteFriend}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>{'📤'}</Text>
            <Text className={styles.menuLabel}>邀请好友</Text>
          </View>
          <View className={styles.menuItemRight}>
            <Text className={styles.menuValue}>+50积分</Text>
            <Text className={styles.menuArrow}>{'›'}</Text>
          </View>
        </View>
      </View>

      {/* 退出 */}
      <View className={styles.logoutSection}>
        <View className={styles.logoutBtn} onClick={handleLogout}>
          <Text className={styles.logoutBtnText}>退出登录</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
