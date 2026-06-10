import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { CATEGORIES, MOCK_ARTICLES, CATEGORY_TAGLINES, CATEGORY_COVERS, CATEGORY_TAGS, CATEGORY_ICONS } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const PAGE_SIZE = 3;

const CategoryPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useDidShow(() => {
    console.log('[CategoryPage] 分类页面展示');
  });

  // 动态统计每个分类的文章数
  const catCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    CATEGORIES.forEach(c => {
      map[c.key] = MOCK_ARTICLES.filter(a => a.category === c.key).length;
    });
    return map;
  }, []);

  const allFiltered = useMemo(() => {
    if (!selectedCat) return [];
    return MOCK_ARTICLES.filter((art) => art.category === selectedCat);
  }, [selectedCat]);

  const displayedArticles = useMemo(() => {
    return allFiltered.slice(0, page * PAGE_SIZE);
  }, [allFiltered, page]);

  const hasMore = displayedArticles.length < allFiltered.length;

  const handleArticleClick = (articleId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${articleId}` });
  };

  const handleSelectCat = (key: string) => {
    setSelectedCat(key);
    setPage(1);
  };

  const handleBack = () => {
    setSelectedCat(null);
    setPage(1);
  };

  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((p) => p + 1);
      setIsLoadingMore(false);
    }, 500);
  }, [isLoadingMore, hasMore]);

  // ===== 文章列表视图 =====
  if (selectedCat) {
    const cat = CATEGORIES.find((c) => c.key === selectedCat);
    return (
      <View className={styles.listView}>
        <View className={styles.listHeader}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text>{'←'}</Text>
          </View>
          <Text className={styles.listHeaderTitle}>{cat?.name || selectedCat}</Text>
        </View>
        <ScrollView
          scrollY
          className={styles.listScroll}
          onScrollToLower={handleLoadMore}
          lowerThreshold={100}
        >
          <View className={styles.listArticles}>
            {displayedArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={handleArticleClick}
              />
            ))}
            {allFiltered.length === 0 && (
              <Text className={styles.emptyHint}>暂无相关文章</Text>
            )}
            {isLoadingMore && (
              <Text className={styles.loadMore}>加载中...</Text>
            )}
            {!hasMore && displayedArticles.length > 0 && (
              <Text className={styles.loadMoreEnd}>{'—— 已加载全部 ——'}</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  // ===== 大卡封面视图 =====
  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.pageHeader}>
        <Text className={styles.pageTitle}>分类</Text>
        <Text className={styles.pageSubtitle}>选择你感兴趣的主题，开启 AI 学习之旅</Text>
      </View>

      <View className={styles.cardList}>
        {CATEGORIES.map((cat) => {
          const count = catCountMap[cat.key] || 0;
          const tags = CATEGORY_TAGS[cat.key] || [];
          const cover = CATEGORY_COVERS[cat.key];
          const icon = CATEGORY_ICONS[cat.key] || '✨';
          const tagline = CATEGORY_TAGLINES[cat.key] || '';

          return (
            <View
              key={cat.key}
              className={styles.coverCard}
              onClick={() => handleSelectCat(cat.key)}
            >
              {/* 封面区 */}
              <View className={styles.coverArea}>
                <Image
                  className={styles.coverImg}
                  src={cover}
                  mode="aspectFill"
                  lazyLoad
                />
                <View className={styles.coverOverlay} />
                <View className={styles.coverTop}>
                  <View className={styles.coverTitleRow}>
                    <Text className={styles.coverIcon}>{icon}</Text>
                    <Text className={styles.coverName}>{cat.name}</Text>
                  </View>
                  <View className={styles.coverBadge}>
                    <Text className={styles.coverBadgeText}>{count} 篇</Text>
                  </View>
                </View>
              </View>

              {/* 信息区 */}
              <View className={styles.infoArea}>
                <Text className={styles.tagline}>{tagline}</Text>
                <View className={styles.tagsRow}>
                  {tags.map((tag) => (
                    <Text key={tag} className={styles.tag}>{tag}</Text>
                  ))}
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={{ height: '140rpx' }} />
    </ScrollView>
  );
};

export default CategoryPage;
