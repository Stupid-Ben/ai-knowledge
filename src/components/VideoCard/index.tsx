import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { Video } from '@/types';
import styles from './index.module.scss';

interface VideoCardProps {
  video: Video;
  onClick: (id: string) => void;
}

const SERIES_NAME_MAP: Record<string, string> = {
  'ai-intro': 'AI 零基础入门',
  'ai-efficiency': 'AI 办公提效',
  'ai-creative': 'AI 创意绘画',
};

const formatPlays = (v: number): string => {
  if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
  return String(v);
};

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  return (
    <View className={styles.card} onClick={() => onClick(video.id)}>
      <View className={styles.coverWrap}>
        <Image className={styles.cover} src={video.cover} mode="aspectFill" />
        <View className={styles.playBtn}>
          <Text className={styles.playIcon}>&#9654;</Text>
        </View>
        <View className={styles.duration}>
          <Text className={styles.durationText}>{video.duration}</Text>
        </View>
        <View className={styles.plays}>
          <Text className={styles.playsText}>{formatPlays(video.plays)}次播放</Text>
        </View>
        {video.isPremium && (
          <View className={styles.premiumBadge}>
            <Text className={styles.premiumBadgeText}>会员</Text>
          </View>
        )}
      </View>
      <View className={styles.info}>
        <Text className={styles.title}>{video.title}</Text>
        <Text className={styles.series}>
          {SERIES_NAME_MAP[video.seriesKey] || video.seriesKey} · 第{video.episode}集
        </Text>
        <Text className={styles.meta}>{video.publishedAt}</Text>
      </View>
    </View>
  );
};

export default VideoCard;
