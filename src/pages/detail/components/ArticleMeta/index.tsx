import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ArticleMetaProps {
  tags: string[];
  views: number;
  readMinutes: number;
  publishedAt: string;
  collects: number;
  isPremium: boolean;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  tags, views, readMinutes, publishedAt, collects, isPremium
}) => {
  const formatNum = (v: number): string => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return String(v);
  };

  return (
    <View className={styles.wrapper}>
      <View className={styles.tagRow}>
        {isPremium && <Text className={styles.premiumBadge}>会员专享</Text>}
        {tags.map((tag) => (
          <Text key={tag} className={styles.tag}>{tag}</Text>
        ))}
      </View>
      <View className={styles.statsRow}>
        <Text className={styles.stat}>{formatNum(views)} 阅读</Text>
        <Text className={styles.dot}>·</Text>
        <Text className={styles.stat}>{readMinutes} 分钟</Text>
        <Text className={styles.dot}>·</Text>
        <Text className={styles.stat}>{formatNum(collects)} 收藏</Text>
        <Text className={styles.dot}>·</Text>
        <Text className={styles.stat}>{publishedAt}</Text>
      </View>
    </View>
  );
};

export default ArticleMeta;
