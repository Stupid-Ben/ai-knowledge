import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import styles from './index.module.scss';
import { CATEGORIES, MOCK_ARTICLES, CATEGORY_TAGLINES } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const CategoryPage: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  useDidShow(() => {
    console.log('[CategoryPage] 分类页面展示');
  });

  const handleArticleClick = (articleId: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${articleId}` });
  };

  const handleBack = () => {
    setSelectedCat(null);
  };

  const filteredArticles = useMemo(() => {
    if (!selectedCat) return [];
    return MOCK_ARTICLES.filter((art) => art.category === selectedCat);
  }, [selectedCat]);

  const getCategoryIcon = (icon: string): string => {
    const map: Record<string, string> = {
      Sparkles: '✨', Briefcase: '💼', GraduationCap: '🎓',
      Home: '🏠', Palette: '🎨', Flame: '🔥'
    };
    return map[icon] || '✨';
  };

  // List view for a specific category
  if (selectedCat) {
    const cat = CATEGORIES.find((c) => c.key === selectedCat);
    return (
      <ScrollView className={styles.listView} scrollY>
        <View className={styles.listHeader}>
          <View className={styles.backBtn} onClick={handleBack}>
            <Text>←</Text>
          </View>
          <Text className={styles.listHeaderTitle}>{cat?.name || selectedCat}</Text>
        </View>
        <View className={styles.listArticles}>
          {filteredArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={handleArticleClick}
            />
          ))}
          {filteredArticles.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#999', fontSize: '24rpx', padding: '48rpx 0' }}>
              暂无相关文章
            </Text>
          )}
        </View>
      </ScrollView>
    );
  }

  // Grid view - all categories
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
                onClick={() => setSelectedCat(cat.key)}
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
                <Text className={styles.categoryArrow}>›</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
};

export default CategoryPage;
