import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { VideoSeries } from '@/types';
import styles from './index.module.scss';

interface SeriesCardProps {
  series: VideoSeries;
  onClick: (key: string) => void;
}

const SeriesCard: React.FC<SeriesCardProps> = ({ series, onClick }) => {
  return (
    <View className={styles.card} onClick={() => onClick(series.key)}>
      <View className={styles.coverWrap}>
        <Image className={styles.cover} src={series.cover} mode="aspectFill" />
        <View className={styles.totalBadge}>
          <Text className={styles.totalText}>共{series.total}集</Text>
        </View>
      </View>
      <View className={styles.info}>
        <Text className={styles.name}>{series.name}</Text>
        <Text className={styles.desc}>{series.desc}</Text>
      </View>
    </View>
  );
};

export default SeriesCard;
