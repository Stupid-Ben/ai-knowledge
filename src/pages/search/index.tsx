import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { MOCK_ARTICLES, CATEGORIES } from '@/data/articles';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';

const HOT_WORDS = [
  'ChatGPT', 'Midjourney', 'AGI', '提示词',
  'AI 绘画', '英语口语', '辅导作业', '周报'
];

const SearchPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useDidShow(() => {
    console.log('[SearchPage] 搜索页面展示');
  });

  // 实时联想
  const suggestions = useMemo(() => {
    if (!keyword.trim()) return [];
    const kw = keyword.trim().toLowerCase();
    return MOCK_ARTICLES
      .filter((a) =>
        a.title.toLowerCase().includes(kw) ||
        a.tags.some((t) => t.toLowerCase().includes(kw)) ||
        a.summary.toLowerCase().includes(kw)
      )
      .slice(0, 5);
  }, [keyword]);

  // 搜索结果
  const results = useMemo(() => {
    if (!submitted || !keyword.trim()) return [];
    const kw = keyword.trim().toLowerCase();
    let list = MOCK_ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(kw) ||
      a.tags.some((t) => t.toLowerCase().includes(kw)) ||
      a.summary.toLowerCase().includes(kw)
    );
    if (activeCategory) {
      list = list.filter((a) => a.category === activeCategory);
    }
    return list;
  }, [keyword, submitted, activeCategory]);

  // 结果中涉及的分类
  const resultCategories = useMemo(() => {
    if (!submitted || !keyword.trim()) return [];
    const kw = keyword.trim().toLowerCase();
    const matched = MOCK_ARTICLES.filter((a) =>
      a.title.toLowerCase().includes(kw) ||
      a.tags.some((t) => t.toLowerCase().includes(kw)) ||
      a.summary.toLowerCase().includes(kw)
    );
    const catKeys = [...new Set(matched.map((a) => a.category))];
    return CATEGORIES.filter((c) => catKeys.includes(c.key));
  }, [keyword, submitted]);

  const handleSubmit = useCallback(() => {
    if (!keyword.trim()) return;
    setSubmitted(true);
    setActiveCategory('');
  }, [keyword]);

  const handleSuggestionTap = (article: Article) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${article.id}` });
  };

  const handleHotWordTap = (word: string) => {
    setKeyword(word);
    setSubmitted(true);
    setActiveCategory('');
  };

  const handleResultClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/detail/index?id=${id}` });
  };

  const handleClear = () => {
    setKeyword('');
    setSubmitted(false);
    setActiveCategory('');
  };

  const getCategoryIcon = (icon: string): string => {
    const map: Record<string, string> = {
      Sparkles: '✨', Briefcase: '💼', GraduationCap: '🎓',
      Home: '🏠', Palette: '🎨', Flame: '🔥'
    };
    return map[icon] || '✨';
  };

  // ===== 结果视图 =====
  if (submitted) {
    return (
      <View className={styles.page}>
        {/* 搜索栏 */}
        <View className={styles.searchBar}>
          <View className={styles.searchInputWrap}>
            <Text className={styles.searchIcon}>{'🔍'}</Text>
            <Input
              className={styles.searchInput}
              value={keyword}
              onInput={(e) => {
                setKeyword(e.detail.value);
                if (!e.detail.value) setSubmitted(false);
              }}
              onConfirm={handleSubmit}
              confirmType="search"
              placeholder="搜索文章、标签..."
              focus
            />
            {keyword ? (
              <Text className={styles.clearBtn} onClick={handleClear}>{'✕'}</Text>
            ) : null}
          </View>
          <Text className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>取消</Text>
        </View>

        {/* 分类筛选 Chips */}
        {resultCategories.length > 0 && (
          <ScrollView scrollX className={styles.chipsRow} enhanced showScrollbar={false}>
            <View
              className={classnames(styles.chip, !activeCategory && styles.chipActive)}
              onClick={() => setActiveCategory('')}
            >
              <Text className={classnames(styles.chipText, !activeCategory && styles.chipTextActive)}>全部</Text>
            </View>
            {resultCategories.map((cat) => (
              <View
                key={cat.key}
                className={classnames(styles.chip, activeCategory === cat.key && styles.chipActive)}
                onClick={() => setActiveCategory(cat.key)}
              >
                <Text className={classnames(styles.chipText, activeCategory === cat.key && styles.chipTextActive)}>
                  {getCategoryIcon(cat.icon)} {cat.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        {/* 结果列表 */}
        <ScrollView scrollY className={styles.resultList}>
          {results.length > 0 ? (
            <>
              <Text className={styles.resultCount}>找到 {results.length} 篇相关文章</Text>
              {results.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={handleResultClick}
                />
              ))}
            </>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>{'📭'}</Text>
              <Text className={styles.emptyTitle}>未找到相关文章</Text>
              <Text className={styles.emptyTip}>换个关键词试试吧</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // ===== 搜索输入视图 =====
  return (
    <View className={styles.page}>
      {/* 搜索栏 */}
      <View className={styles.searchBar}>
        <View className={styles.searchInputWrap}>
          <Text className={styles.searchIcon}>{'🔍'}</Text>
          <Input
            className={styles.searchInput}
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            onConfirm={handleSubmit}
            confirmType="search"
            placeholder="搜索文章、标签..."
            focus
          />
          {keyword ? (
            <Text className={styles.clearBtn} onClick={handleClear}>{'✕'}</Text>
          ) : null}
        </View>
        <Text className={styles.cancelBtn} onClick={() => Taro.navigateBack()}>取消</Text>
      </View>

      {/* 实时联想 */}
      {keyword.trim() && suggestions.length > 0 && (
        <View className={styles.suggestions}>
          {suggestions.map((article) => (
            <View
              key={article.id}
              className={styles.suggestItem}
              onClick={() => handleSuggestionTap(article)}
            >
              <Text className={styles.suggestIcon}>{'📄'}</Text>
              <View className={styles.suggestInfo}>
                <Text className={styles.suggestTitle}>{article.title}</Text>
                <Text className={styles.suggestTags}>
                  {article.tags.slice(0, 2).join(' · ')}
                </Text>
              </View>
              {article.isPremium && (
                <Text className={styles.suggestBadge}>会员</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* 热门搜索词（空输入时兜底） */}
      {!keyword.trim() && (
        <View className={styles.hotSection}>
          <Text className={styles.hotTitle}>热门搜索</Text>
          <View className={styles.hotTags}>
            {HOT_WORDS.map((word) => (
              <View
                key={word}
                className={styles.hotTag}
                onClick={() => handleHotWordTap(word)}
              >
                <Text className={styles.hotTagText}>{word}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchPage;
