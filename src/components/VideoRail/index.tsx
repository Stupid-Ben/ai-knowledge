import React from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Video } from '@/types';
import styles from './index.module.scss';

interface VideoRailProps {
  videos: Video[];
}

const formatPlays = (v: number): string => {
  if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
  return String(v);
};

const VideoRail: React.FC<VideoRailProps> = ({ videos }) => {
  if (!videos || videos.length === 0) return null;

  const handleTap = (id: string) => {
    Taro.navigateTo({ url: `/pages/video-detail/index?id=${id}` });
  };

  const handleViewAll = () => {
    Taro.switchTab({ url: '/pages/video/index' });
  };

  return (
    <View className={styles.railSection}>
      <View className={styles.railHeader}>
        <Text className={styles.railTitle}>精选视频</Text>
        <View className={styles.railMore} onClick={handleViewAll}>
          <Text className={styles.railMoreText}>查看全部 ›</Text>
        </View>
      </View>
      <ScrollView
        className={styles.railScroll}
        scrollX
        enhanced
        showScrollbar={false}
      >
        <View className={styles.railInner}>
          {videos.map(v => (
            <View key={v.id} className={styles.railCard} onClick={() => handleTap(v.id)}>
              <View className={styles.railCoverWrap}>
                <Image className={styles.railCover} src={v.cover} mode="aspectFill" />
                <View className={styles.railPlayBtn}>
                  <Text className={styles.railPlayIcon}>&#9654;</Text>
                </View>
                <View className={styles.railDuration}>
                  <Text className={styles.railDurationText}>{v.duration}</Text>
                </View>
                {v.isPremium && (
                  <View className={styles.railPremiumBadge}>
                    <Text className={styles.railPremiumText}>会员</Text>
                  </View>
                )}
              </View>
              <Text className={styles.railCardTitle}>{v.title}</Text>
              <Text className={styles.railCardMeta}>👁 {formatPlays(v.plays)}播放</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default VideoRail;
