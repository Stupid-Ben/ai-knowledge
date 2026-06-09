import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface CoverHeaderProps {
  cover: string;
  title: string;
}

const CoverHeader: React.FC<CoverHeaderProps> = ({ cover, title }) => {
  const handleBack = () => {
    Taro.navigateBack({ fail: () => Taro.switchTab({ url: '/pages/index/index' }) });
  };

  return (
    <View className={styles.wrapper}>
      <Image className={styles.cover} src={cover} mode="aspectFill" />
      <View className={styles.overlay} />
      <View className={styles.backBtn} onClick={handleBack}>
        <Text className={styles.backIcon}>{'←'}</Text>
      </View>
      <View className={styles.titleWrap}>
        <Text className={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

export default CoverHeader;
