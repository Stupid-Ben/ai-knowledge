import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { MOCK_ARTICLES } from '@/data/articles';
import { Article } from '@/types';
import ArticleCard from '@/components/ArticleCard';

interface RelatedListProps {
  articleId: string;
  category: string;
}

const RelatedList: React.FC<RelatedListProps> = ({ articleId, category }) => {
  const related: Article[] = MOCK_ARTICLES
    .filter((a) => a.id !== articleId && a.category === category)
    .slice(0, 3);

  if (related.length === 0) {
    // 如果同分类不足，从其他分类补齐
    const others = MOCK_ARTICLES
      .filter((a) => a.id !== articleId)
      .slice(0, 3);
    if (others.length === 0) return null;
    return (
      <View className={styles.wrapper}>
        <Text className={styles.heading}>接着看</Text>
        {others.map((art) => (
          <ArticleCard
            key={art.id}
            article={art}
            onClick={(id) => Taro.redirectTo({ url: `/pages/detail/index?id=${id}` })}
          />
        ))}
      </View>
    );
  }

  return (
    <View className={styles.wrapper}>
      <Text className={styles.heading}>接着看</Text>
      {related.map((art) => (
        <ArticleCard
          key={art.id}
          article={art}
          onClick={(id) => Taro.redirectTo({ url: `/pages/detail/index?id=${id}` })}
        />
      ))}
    </View>
  );
};

export default RelatedList;
