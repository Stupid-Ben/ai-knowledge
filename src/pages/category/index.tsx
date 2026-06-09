import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { CATEGORIES, MOCK_ARTICLES, CATEGORY_TAGLINES } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const PAGE_SIZE = 3;

const CategoryPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useDidShow(() => {
    console.log('[CategoryPage] 分类页面展示');
  });

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

  const getCategoryIcon = (icon: string): string => {
    const map: Record<string, string> = {
      Sparkles: '✨', Briefcase: '💼', GraduationCap: '🎓',
      Home: '🏠', Palette: '🎨', Flame: '🔥'
    };
    return map[icon] || '✨';
  };

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

  // ===== 分类宫格视图 =====
  return (
    <ScrollView className={styles.page} scrollY>
      <View className={styles.gridView}>
        <View className={styles.gridHeader}>
          <Text className={styles.gridTitle}>科普专题分类</Text>
          <Text className={styles.gridSubtitle}>零基础精挑细选的专属学习路线，点击查看详情</Text>
        </View>

        <View className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const count = MOCK_ARTICLES.filter((a) => a.category === cat.key).length;
            return (
              <View
                key={cat.key}
                className={styles.categoryCard}
                onClick={() => handleSelectCat(cat.key)}
              >
                <View className={styles.categoryIcon}>
                  <Text className={styles.categoryIconText}>{getCategoryIcon(cat.icon)}</Text>
                </View>
                <View className={styles.categoryInfo}>
                  <Text className={styles.categoryName}>{cat.name}</Text>
                  <Text className={styles.categoryTagline}>
                    {CATEGORY_TAGLINES[cat.key] || '精品资料持续整理中'}
                  </Text>
                  <Text className={styles.categoryCount}>{count} 篇科普</Text>
                </View>
                <Text className={styles.categoryArrow}>{'›'}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default CategoryPage;
