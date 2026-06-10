import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useLoad, usePageScroll, useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { useAppContext } from '@/store/appContext';
import { MOCK_ARTICLES } from '@/data/articles';
import { track } from '@/utils/track';

import CoverHeader from './components/CoverHeader';
import ArticleMeta from './components/ArticleMeta';
import ArticleContent from './components/ArticleContent';
import Paywall from './components/Paywall';
import PlanSheet from './components/PlanSheet';
import RelatedList from './components/RelatedList';
import FloatingActions from './components/FloatingActions';

const DetailPage: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [articleId, setArticleId] = useState<string>('');
  const [fontSizeKey, setFontSizeKey] = useState('medium');
  const [showPlanSheet, setShowPlanSheet] = useState(false);

  // dev 演示用：模拟会员/非会员切换
  const [devIsMember, setDevIsMember] = useState(false);

  const hasTrackedReadComplete = useRef(false);

  useLoad((options) => {
    const id = options?.id || 'art-003';
    setArticleId(id);
    // 从本地恢复字号设置
    try {
      const saved = Taro.getStorageSync('ai_font_size');
      if (saved) setFontSizeKey(saved);
    } catch (_) {}
  });

  // 埋点：article_open
  useDidShow(() => {
    if (articleId) {
      const art = MOCK_ARTICLES.find(a => a.id === articleId);
      if (art) {
        track('article_open', { articleId: art.id, category: art.category, isPremium: art.isPremium });
      }
    }
  });

  // 埋点：article_read_complete（滚到底部触发一次）
  usePageScroll((e) => {
    if (hasTrackedReadComplete.current) return;
    if (e.scrollTop > 800) {
      hasTrackedReadComplete.current = true;
      track('article_read_complete', { articleId });
    }
  });

  const article = useMemo(() => {
    return MOCK_ARTICLES.find((a) => a.id === articleId) || MOCK_ARTICLES[0];
  }, [articleId]);

  // 核心逻辑：是否上墙
  const isMemberOrDev = user.isMember || devIsMember;
  const isUnlocked = user.unlockedIds.includes(article.id);
  const showPaywall = article.isPremium && !isMemberOrDev && !isUnlocked;

  // 收藏状态
  const isFavorited = user.collectedIds.includes(article.id);

  // 加入浏览历史
  useEffect(() => {
    if (article.id && !user.historyIds.includes(article.id)) {
      setUser({
        ...user,
        historyIds: [article.id, ...user.historyIds].slice(0, 50)
      });
    }
  }, [article.id]);

  // 埋点：paywall_impression（首次展示会员墙时上报一次）
  const hasTrackedPaywall = useRef(false);
  useEffect(() => {
    if (showPaywall && !hasTrackedPaywall.current) {
      hasTrackedPaywall.current = true;
      track('paywall_impression', { articleId: article.id });
    }
  }, [showPaywall, article.id]);

  const toggleFavorite = () => {
    const newIds = isFavorited
      ? user.collectedIds.filter((id) => id !== article.id)
      : [...user.collectedIds, article.id];
    setUser({ ...user, collectedIds: newIds });
    Taro.showToast({
      title: isFavorited ? '已取消收藏' : '已加入收藏',
      icon: isFavorited ? 'none' : 'success'
    });
  };

  const handleChangeFontSize = (key: string) => {
    setFontSizeKey(key);
    try {
      Taro.setStorageSync('ai_font_size', key);
    } catch (_) {}
  };

  // 解锁回调（单篇解锁，非全局会员）
  const handleUnlock = () => {
    setShowPlanSheet(false);
    track('lead_submit', { articleId: article.id, category: article.category });
    if (!user.unlockedIds.includes(article.id)) {
      setUser({
        ...user,
        unlockedIds: [...user.unlockedIds, article.id]
      });
    }
  };

  const handleToggleDevMember = () => {
    setDevIsMember(!devIsMember);
    Taro.showToast({
      title: devIsMember ? '已切换为非会员' : '已切换为会员',
      icon: 'none'
    });
  };

  return (
    <View className={styles.page}>
      {/* Dev 演示开关 */}
      <View className={styles.devToggle} onClick={handleToggleDevMember}>
        <Text className={styles.devLabel}>DEV</Text>
        <Text className={styles.devValue}>{devIsMember ? '会员' : '非会员'}</Text>
      </View>

      {/* 1. 封面大图 + 返回 */}
      <CoverHeader cover={article.cover} title={article.title} />

      {/* 2. 文章元信息 */}
      <ArticleMeta
        tags={article.tags}
        views={article.views}
        readMinutes={article.readMinutes}
        publishedAt={article.publishedAt}
        collects={article.collects}
        isPremium={article.isPremium}
      />

      {/* 3. 正文渲染 */}
      <ArticleContent
        paragraphs={article.paragraphs}
        fontSizeKey={fontSizeKey}
        showPaywall={showPaywall}
      />

      {/* 4. 付费遮罩 + CTA */}
      {showPaywall && (
        <Paywall onUnlock={() => {
          track('unlock_click', { articleId: article.id, category: article.category });
          setShowPlanSheet(true);
        }} />
      )}

      {/* 5. 相关推荐 */}
      <RelatedList articleId={article.id} category={article.category} />

      {/* 6. 底部悬浮操作栏 */}
      <FloatingActions
        isFavorited={isFavorited}
        fontSizeKey={fontSizeKey}
        onToggleFavorite={toggleFavorite}
        onChangeFontSize={handleChangeFontSize}
        articleTitle={article.title}
      />

      {/* 7. 套餐弹层 */}
      {showPlanSheet && (
        <PlanSheet
          onClose={() => setShowPlanSheet(false)}
          onUnlock={handleUnlock}
        />
      )}
    </View>
  );
};

export default DetailPage;
