import React, { useState } from 'react';
import { View, Text, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { FALLBACK_IMG } from '@/utils/media';

interface CoverHeaderProps {
  cover: string;
  title: string;
}

const CoverHeader: React.FC<CoverHeaderProps> = ({ cover, title }) => {
  const [imgSrc, setImgSrc] = useState(cover);

  const handleBack = () => {
    Taro.navigateBack({ fail: () => Taro.switchTab({ url: '/pages/index/index' }) });
  };

  const handleError = () => {
    if (imgSrc !== FALLBACK_IMG) {
      setImgSrc(FALLBACK_IMG);
    }
  };

  return (
    <View className={styles.wrapper}>
      <Image
        className={styles.cover}
        src={imgSrc}
        mode="aspectFill"
        lazyLoad
        onError={handleError}
      />
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
