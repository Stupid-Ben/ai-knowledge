import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

interface FloatingActionsProps {
  isFavorited: boolean;
  fontSizeKey: string;
  onToggleFavorite: () => void;
  onChangeFontSize: (key: string) => void;
  articleTitle: string;
}

const FONT_OPTIONS = [
  { key: 'small', label: '标准' },
  { key: 'medium', label: '大号' },
  { key: 'large', label: '超大' },
];

const FloatingActions: React.FC<FloatingActionsProps> = ({
  isFavorited, fontSizeKey, onToggleFavorite, onChangeFontSize, articleTitle
}) => {
  const [showFontPanel, setShowFontPanel] = useState(false);

  const handleShare = () => {
    Taro.setClipboardData({
      data: `【AI 科普知识库】推荐：《${articleTitle}》`,
      success: () => {
        Taro.showToast({ title: '已复制分享文案', icon: 'success' });
      }
    });
  };

  return (
    <View className={styles.wrapper}>
      <View className={styles.bar}>
        <View className={styles.item} onClick={onToggleFavorite}>
          <Text className={styles.icon}>{isFavorited ? '★' : '☆'}</Text>
          <Text className={classnames(styles.label, isFavorited && styles.labelActive)}>
            {isFavorited ? '已收藏' : '收藏'}
          </Text>
        </View>

        <View className={styles.divider} />

        <Button className={styles.shareBtn} open-type="share">
          <View className={styles.item}>
            <Text className={styles.icon}>{'↗'}</Text>
            <Text className={styles.label}>分享</Text>
          </View>
        </Button>

        <View className={styles.divider} />

        <View className={styles.item} onClick={() => setShowFontPanel(!showFontPanel)}>
          <Text className={styles.iconFont}>Aa</Text>
          <Text className={styles.label}>字号</Text>
        </View>
      </View>

      {/* Font Size Panel */}
      {showFontPanel && (
        <View className={styles.fontPanel}>
          {FONT_OPTIONS.map((opt) => (
            <View
              key={opt.key}
              className={classnames(
                styles.fontOption,
                fontSizeKey === opt.key && styles.fontOptionActive
              )}
              onClick={() => {
                onChangeFontSize(opt.key);
                setShowFontPanel(false);
              }}
            >
              <Text className={classnames(
                styles.fontPreview,
                opt.key === 'small' && styles.fontPreviewSm,
                opt.key === 'medium' && styles.fontPreviewMd,
                opt.key === 'large' && styles.fontPreviewLg
              )}>A</Text>
              <Text className={styles.fontLabel}>{opt.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default FloatingActions;
