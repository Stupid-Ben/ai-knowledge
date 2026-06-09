import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Swiper, SwiperItem } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppContext } from '@/store/appContext';
import { Article } from '@/types';
import { MOCK_ARTICLES, CATEGORIES, RANKING_LISTS } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const BANNERS = [
  {
    id: 'b-1',
    title: '零基础 AI 扫盲手册已上线',
    subtitle: '教您用大白话跟 AI 提问聊天，拒绝技术焦虑！',
    articleId: 'art-001',
    bannerClass: 'bannerGreen',
    // 如需换图片，取消下面注释并填入图片地址，渐变遮罩会自动叠加
    // bgImage: 'D:\code\ai-knowledge\src\pages\index\s1.png',
    buttonText: '极速学习'
  },
  {
    id: 'b-2',
    title: '抢占时代先机！开通高级会员',
    subtitle: '无限次数解锁进阶精品科普，多达1000款开箱提示词。',
    isVipLink: true,
    bannerClass: 'bannerGold',
   // bgImage: 'D:\code\ai-knowledge\src\pages\index\s2.png',
    buttonText: '开通VIP'
  }
];

const IndexPage: React.FC = () => {
  const { isLoggedIn, login } = useAppContext();

  const [feedArticles, setFeedArticles] = useState<Article[]>(() => MOCK_ARTICLES.slice(0, 4));
  const [activeRankingTab, setActiveRankingTab] = useState<'hot' | 'collect' | 'newbie'>('hot');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useDidShow(() => {
    console.log('[IndexPage] 首页展示');
  });

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  const handleSearch = () => {
    console.log('[IndexPage] 搜索框被点击，准备跳转');
    Taro.navigateTo({
      url: '/pages/search/index',
      fail: (err) => {
        console.error('[IndexPage] 跳转搜索页失败:', err);
        Taro.showToast({ title: '跳转失败: ' + err.errMsg, icon: 'none' });
      }
    });
  };

  const handleBannerTap = (banner: typeof BANNERS[0]) => {
    if (banner.isVipLink) {
      Taro.switchTab({ url: '/pages/vip/index' });
    } else if (banner.articleId) {
      Taro.navigateTo({ url: `/pages/detail/index?id=${banner.articleId}` });
    }
  };

  const handleCategoryTap = (catKey: string) => {
    Taro.switchTab({ url: `/pages/category/index?category=${catKey}` });
  };

  const handleArticleClick = (articleId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${articleId}` });
  };

  const handleRankingArticleClick = (articleId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${articleId}` });
  };

  // Scroll to load more
  const handleScrollToLower = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const currentLength = feedArticles.length;
      if (currentLength >= MOCK_ARTICLES.length) {
        setHasMore(false);
      } else {
        setFeedArticles((prev) => [...prev, ...MOCK_ARTICLES.slice(currentLength, currentLength + 3)]);
        if (currentLength + 3 >= MOCK_ARTICLES.length) {
          setHasMore(false);
        }
      }
      setIsLoadingMore(false);
    }, 800);
  };

  const currentRankingArticles = useMemo(() => {
    const map = RANKING_LISTS.find((list) => list.key === activeRankingTab);
    if (!map) return [];
    return MOCK_ARTICLES.filter((art) => map.articleIds.includes(art.id));
  }, [activeRankingTab]);

  const formatViews = (v: number): string => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return String(v);
  };

  const getCategoryIcon = (icon: string): string => {
    const map: Record<string, string> = {
      Sparkles: '✨', Briefcase: '💼', GraduationCap: '🎓',
      Home: '🏠', Palette: '🎨', Flame: '🔥'
    };
    return map[icon] || '✨';
  };

  // Unlogged welcome screen
  if (!isLoggedIn) {
    return (
      <View className={styles.welcomeBg}>
        <View className={styles.welcomeLogo}>
          <Text className={styles.welcomeLogoText}>✨</Text>
        </View>
        <Text className={styles.welcomeTitle}>AI 科普知识库</Text>
        <Text className={styles.welcomeSubtitle}>—— 让大忙人也能 5 分钟通透 AI 精髓 ——</Text>

        <View className={styles.welcomeFeatures}>
          <Text className={styles.featureTitle}>安全绿色阅读环境</Text>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text>一句话大白话，无门槛学习AI，拥抱新生活。</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text>不接入第三方隐私泄露通道，不获取敏感数据。</Text>
          </View>
          <View className={styles.featureItem}>
            <Text className={styles.featureCheck}>✓</Text>
            <Text>独家首创高级会员体验，支持 1 天试学。</Text>
          </View>
        </View>

        <View className={styles.loginBtn} onClick={handleLogin}>
          <Text className={styles.loginBtnText}>微信一键安全授权登录</Text>
        </View>
        <Text className={styles.loginTip}>点击即代表您同意《绿色科普使用协议》与《隐私保障服务书》</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className={styles.page}
      scrollY
      onScrollToLower={handleScrollToLower}
      lowerThreshold={100}
    >
      {/* Search Bar */}
      <View className={styles.searchBar}>
        <View className={styles.searchInner} onClick={handleSearch}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Text className={styles.searchPlaceholder}>想了解什么 AI 概念？</Text>
        </View>
      </View>

      {/* Banner Carousel */}
      <View className={styles.bannerWrap}>
        <Swiper
          className={styles.bannerSwiper}
          indicatorDots
          autoplay
          circular
          indicatorColor="rgba(255,255,255,0.3)"
          indicatorActiveColor="#ffffff"
        >
          {BANNERS.map((banner) => (
            <SwiperItem key={banner.id}>
              <View
                className={`${styles.bannerItem} ${styles[banner.bannerClass]}`}
                style={banner.bgImage ? { backgroundImage: `url(${banner.bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                onClick={() => handleBannerTap(banner)}
              >
                {banner.bgImage && <View className={styles.bannerOverlay} />}
                <Text className={styles.bannerTitle}>{banner.title}</Text>
                <Text className={styles.bannerSubtitle}>{banner.subtitle}</Text>
                <View className={styles.bannerBtn}>
                  <Text className={styles.bannerBtnText}>{banner.buttonText}</Text>
                </View>
              </View>
            </SwiperItem>
          ))}
        </Swiper>
      </View>

      {/* 6 Categories Grid */}
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>科普专题分类</Text>
      </View>
      <View className={styles.categoryGrid}>
        {CATEGORIES.map((cat) => {
          const count = MOCK_ARTICLES.filter((a) => a.category === cat.key).length;
          return (
            <View
              key={cat.key}
              className={styles.categoryCard}
              onClick={() => handleCategoryTap(cat.key)}
            >
              <View className={styles.categoryIcon}>
                <Text className={styles.categoryIconText}>{getCategoryIcon(cat.icon)}</Text>
              </View>
              <View>
                <Text className={styles.categoryName}>{cat.name}</Text>
                <Text className={styles.categoryCount}>{count} 篇科普</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Ranking Tabs */}
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>热门榜单</Text>
      </View>
      <View className={styles.rankingTabs}>
        {(['hot', 'collect', 'newbie'] as const).map((key) => {
          const name = key === 'hot' ? '本周最热' : key === 'collect' ? '收藏最多' : '新手最爱';
          return (
            <Text
              key={key}
              className={classnames(styles.rankingTab, activeRankingTab === key && styles.rankingTabActive)}
              onClick={() => setActiveRankingTab(key)}
            >
              {name}
            </Text>
          );
        })}
      </View>
      <View className={styles.rankingList}>
        {currentRankingArticles.map((art, idx) => (
          <View key={art.id} className={styles.rankingItem} onClick={() => handleRankingArticleClick(art.id)}>
            <View className={classnames(styles.rankingIndex, idx < 3 ? styles.rankingIndexTop : styles.rankingIndexNormal)}>
              <Text>{idx + 1}</Text>
            </View>
            <Text className={styles.rankingTitle}>{art.title}</Text>
            <Text className={styles.rankingView}>{formatViews(art.views)}</Text>
          </View>
        ))}
      </View>

      {/* Article Feed List */}
      <View className={styles.feedSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>推荐阅读</Text>
        </View>
        <View className={styles.feedList}>
          {feedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={handleArticleClick}
            />
          ))}
          {isLoadingMore && (
            <Text className={styles.loadMore}>加载中...</Text>
          )}
          {!hasMore && (
            <Text className={classnames(styles.loadMore, styles.loadMoreEnd)}>—— 已加载全部文章 ——</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default IndexPage;
