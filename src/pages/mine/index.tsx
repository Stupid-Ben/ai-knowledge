import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppContext } from '@/store/appContext';
import { MOCK_ARTICLES } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const FontSizes = [
  { key: 'small', label: '小号', cls: 'text-sm' },
  { key: 'medium', label: '标准', cls: 'text-base' },
  { key: 'large', label: '大号', cls: 'text-lg' }
];

const MinePage: React.FC = () => {
  const { user, setUser, logout } = useAppContext();
  const [activeSubView, setActiveSubView] = useState<'none' | 'fav' | 'history' | 'fontSize'>('none');
  const [isSignedToday, setIsSignedToday] = useState(false);
  const [fontSizeKey, setFontSizeKey] = useState('medium');

  useDidShow(() => {
    console.log('[MinePage] 我的页面展示');
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

  // Sub views
  if (activeSubView === 'fav') {
    return (
      <ScrollView className={styles.subView} scrollY>
        <View className={styles.subHeader}>
          <View className={styles.subBack} onClick={() => setActiveSubView('none')}>
            <Text>←</Text>
          </View>
          <Text className={styles.subTitle}>我的收藏</Text>
        </View>
        {favoritedArticles.length === 0 ? (
          <Text className={styles.emptyHint}>暂无收藏文章</Text>
        ) : (
          favoritedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
          ))
        )}
      </ScrollView>
    );
  }

  if (activeSubView === 'history') {
    return (
      <ScrollView className={styles.subView} scrollY>
        <View className={styles.subHeader}>
          <View className={styles.subBack} onClick={() => setActiveSubView('none')}>
            <Text>←</Text>
          </View>
          <Text className={styles.subTitle}>阅读记录</Text>
        </View>
        {historyArticles.length === 0 ? (
          <Text className={styles.emptyHint}>暂无阅读记录</Text>
        ) : (
          <>
            {historyArticles.map((article) => (
              <ArticleCard key={article.id} article={article} onClick={handleArticleClick} />
            ))}
            <View className={styles.logoutBtn} style={{ marginTop: '32rpx' }} onClick={handleClearHistory}>
              <Text className={styles.logoutBtnText}>清空阅读记录</Text>
            </View>
          </>
        )}
      </ScrollView>
    );
  }

  if (activeSubView === 'fontSize') {
    return (
      <ScrollView className={styles.subView} scrollY>
        <View className={styles.subHeader}>
          <View className={styles.subBack} onClick={() => setActiveSubView('none')}>
            <Text>←</Text>
          </View>
          <Text className={styles.subTitle}>调整字体大小</Text>
        </View>
        <View className={styles.fontSizeRow}>
          {FontSizes.map((fs) => (
            <View
              key={fs.key}
              className={classnames(styles.fontSizeBtn, fontSizeKey === fs.key && styles.fontSizeBtnActive)}
              onClick={() => setFontSizeKey(fs.key)}
            >
              <Text>{fs.label}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: '24rpx', color: '#999', marginTop: '16rpx' }}>
          该设置将应用到文章详情页面
        </Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className={styles.page} scrollY>
      {/* Profile */}
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
          {user.isMember && (
            <Text className={styles.vipTag}>VIP 会员</Text>
          )}
        </View>
      </View>

      {/* Stats */}
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

      {/* Sign In */}
      <View className={styles.signInCard}>
        <View className={styles.signInInfo}>
          <Text className={styles.signInIcon}>📅</Text>
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

      {/* Menu */}
      <View className={styles.menuSection}>
        <View className={styles.menuItem} onClick={() => setActiveSubView('fav')}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>⭐</Text>
            <Text className={styles.menuLabel}>我的收藏</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', gap: '8rpx' }}>
            <Text className={styles.menuValue}>{user.collectedIds.length}篇</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
        <View className={styles.menuItem} onClick={() => setActiveSubView('history')}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>🕐</Text>
            <Text className={styles.menuLabel}>阅读记录</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', gap: '8rpx' }}>
            <Text className={styles.menuValue}>{user.historyIds.length}篇</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
        <View className={styles.menuItem} onClick={() => setActiveSubView('fontSize')}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>🔤</Text>
            <Text className={styles.menuLabel}>字体大小</Text>
          </View>
          <Text className={styles.menuArrow}>›</Text>
        </View>
        <View className={styles.menuItem} onClick={handleInviteFriend}>
          <View className={styles.menuItemLeft}>
            <Text className={styles.menuIcon}>📤</Text>
            <Text className={styles.menuLabel}>邀请好友</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', gap: '8rpx' }}>
            <Text className={styles.menuValue}>+50积分</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <View className={styles.logoutSection}>
        <View className={styles.logoutBtn} onClick={handleLogout}>
          <Text className={styles.logoutBtnText}>退出登录</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MinePage;
