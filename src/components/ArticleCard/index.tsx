import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { Article } from '@/types';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const handleClick = () => {
    onClick(article.id);
  };

  const formatViews = (v: number): string => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return String(v);
  };

  return (
    <View className={styles.card} onClick={handleClick}>
      <View className={styles.coverWrap}>
        <Image
          className={styles.cover}
          src={article.cover}
          mode="aspectFill"
        />
      </View>
      <View className={styles.info}>
        <View>
          <Text className={styles.title}>{article.title}</Text>
          <Text className={styles.summary}>{article.summary}</Text>
        </View>
        <View>
          <View className={styles.tagRow}>
            {article.tags.slice(0, 2).map((tag) => (
              <Text key={tag} className={styles.tag}>{tag}</Text>
            ))}
            {article.isPremium && (
              <Text className={styles.premiumTag}>会员专享</Text>
            )}
          </View>
          <View className={styles.meta}>
            <Text className={styles.metaItem}>{formatViews(article.views)} 阅读</Text>
            <Text className={styles.metaItem}>{article.readMinutes} 分钟</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ArticleCard;
