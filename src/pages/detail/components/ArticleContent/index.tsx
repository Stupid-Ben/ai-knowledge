import React, { useMemo } from 'react';
import { View, RichText } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

interface ArticleContentProps {
  paragraphs: string[];
  fontSizeKey: string;
  /** 是否上墙截断 */
  showPaywall: boolean;
}

const ArticleContent: React.FC<ArticleContentProps> = ({
  paragraphs, fontSizeKey, showPaywall
}) => {
  const halfIndex = useMemo(() => {
    return Math.ceil(paragraphs.length / 2);
  }, [paragraphs.length]);

  const visibleParagraphs = showPaywall
    ? paragraphs.slice(0, halfIndex)
    : paragraphs;

  return (
    <View className={classnames(
      styles.wrapper,
      fontSizeKey === 'small' && styles.fontSmall,
      fontSizeKey === 'medium' && styles.fontMedium,
      fontSizeKey === 'large' && styles.fontLarge
    )}>
      {visibleParagraphs.map((html, idx) => (
        <RichText key={idx} nodes={html} />
      ))}
    </View>
  );
};

export default ArticleContent;
