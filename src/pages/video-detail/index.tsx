import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Video, ScrollView } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import { useAppContext } from '@/store/appContext';
import { MOCK_VIDEOS, VIDEO_SERIES } from '@/data/videos';
import VideoCard from '@/components/VideoCard';
import styles from './index.module.scss';

const TRIAL_SECONDS = 60;

const VideoDetailPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoggedIn, login } = useAppContext();

  const videoId = router.params.id || 'vid-001';
  const [currentId, setCurrentId] = useState(videoId);
  const [trialEnded, setTrialEnded] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [collected, setCollected] = useState(false);

  // 从 VIP 页返回时刷新会员状态
  useDidShow(() => {
    setTrialEnded(false);
  });

  const currentVideo = useMemo(
    () => MOCK_VIDEOS.find(v => v.id === currentId),
    [currentId]
  );

  const seriesVideos = useMemo(() => {
    if (!currentVideo) return [];
    return MOCK_VIDEOS
      .filter(v => v.seriesKey === currentVideo.seriesKey)
      .sort((a, b) => a.episode - b.episode);
  }, [currentVideo]);

  const seriesName = useMemo(() => {
    if (!currentVideo) return '';
    return VIDEO_SERIES.find(s => s.key === currentVideo.seriesKey)?.name || '';
  }, [currentVideo]);

  const relatedVideos = useMemo(() => {
    if (!currentVideo) return [];
    return MOCK_VIDEOS
      .filter(v => v.category === currentVideo.category && v.id !== currentId)
      .slice(0, 4);
  }, [currentVideo, currentId]);

  const showPaywall = currentVideo?.isPremium && !user.isMember && trialEnded;

  const handleTimeUpdate = useCallback((e: any) => {
    if (!currentVideo?.isPremium || user.isMember) return;
    const currentTime = e.detail?.currentTime || 0;
    if (currentTime >= TRIAL_SECONDS && !trialEnded) {
      setTrialEnded(true);
      const ctx = Taro.createVideoContext('detailVideo');
      ctx.pause();
    }
  }, [currentVideo, user.isMember, trialEnded]);

  const handleEnded = useCallback(() => {
    // 播放结束，如果有下一集自动提示
    if (!currentVideo) return;
    const nextEp = seriesVideos.find(v => v.episode === currentVideo.episode + 1);
    if (nextEp) {
      Taro.showModal({
        title: '播放完毕',
        content: `即将播放第${nextEp.episode}集「${nextEp.title}」？`,
        confirmText: '下一集',
        cancelText: '留在这里',
        success: (res) => {
          if (res.confirm) {
            setCurrentId(nextEp.id);
            setTrialEnded(false);
            setDescExpanded(false);
          }
        }
      });
    }
  }, [currentVideo, seriesVideos]);

  const handleEpisodeTap = (video: typeof MOCK_VIDEOS[0]) => {
    if (video.isPremium && !user.isMember) {
      Taro.showModal({
        title: '会员专享',
        content: '这集是进阶付费内容，开通会员即可畅看全部',
        confirmText: '去开通',
        success: (res) => {
          if (res.confirm) {
            Taro.switchTab({ url: '/pages/vip/index' });
          }
        }
      });
      return;
    }
    setCurrentId(video.id);
    setTrialEnded(false);
    setDescExpanded(false);
  };

  const handleGoVip = () => {
    Taro.switchTab({ url: '/pages/vip/index' });
  };

  const handleCollect = () => {
    setCollected(!collected);
    Taro.showToast({
      title: collected ? '已取消收藏' : '收藏成功',
      icon: 'success'
    });
  };

  const handleRelatedTap = (id: string) => {
    setCurrentId(id);
    setTrialEnded(false);
    setDescExpanded(false);
    // 滚动到顶部
    Taro.pageScrollTo({ scrollTop: 0, duration: 300 });
  };

  const formatPlays = (v: number): string => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return String(v);
  };

  if (!currentVideo) {
    return (
      <View className={styles.emptyPage}>
        <Text className={styles.emptyText}>视频不存在或已被删除</Text>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      {/* 播放器区域 */}
      <View className={styles.playerWrap}>
        <Video
          id="detailVideo"
          className={styles.video}
          src={currentVideo.url}
          poster={currentVideo.cover}
          controls
          autoplay
          showFullscreenBtn
          showPlayBtn
          showCenterPlayBtn
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        {/* 试看蒙层 */}
        {showPaywall && (
          <View className={styles.trialOverlay}>
            <View className={styles.trialCard}>
              <Text className={styles.trialTitle}>试看已结束</Text>
              <Text className={styles.trialSub}>已试看 {TRIAL_SECONDS} 秒 · 开通会员畅看全部进阶课</Text>
              <View className={styles.trialBtn} onClick={handleGoVip}>
                <Text className={styles.trialBtnText}>开通会员解锁完整视频</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <ScrollView className={styles.scrollBody} scrollY enhanced showScrollbar={false}>
        {/* 信息区 */}
        <View className={styles.infoSection}>
          <Text className={styles.title}>{currentVideo.title}</Text>
          <View className={styles.metaRow}>
            <Text className={styles.metaText}>{formatPlays(currentVideo.plays)}次播放</Text>
            <Text className={styles.metaDot}>·</Text>
            <Text className={styles.metaText}>{currentVideo.duration}</Text>
            <Text className={styles.metaDot}>·</Text>
            <Text className={styles.metaText}>{currentVideo.publishedAt}</Text>
          </View>
          {seriesName && (
            <View className={styles.seriesTag}>
              <Text className={styles.seriesTagText}>{seriesName}</Text>
            </View>
          )}
        </View>

        {/* 简介 */}
        <View className={styles.descSection}>
          <Text className={`${styles.desc} ${descExpanded ? styles.descExpanded : ''}`}>
            {currentVideo.desc}
          </Text>
          <Text className={styles.descToggle} onClick={() => setDescExpanded(!descExpanded)}>
            {descExpanded ? '收起' : '展开'}
          </Text>
        </View>

        {/* 操作栏 */}
        <View className={styles.actionBar}>
          <View className={styles.actionItem} onClick={handleCollect}>
            <Text className={styles.actionIcon}>{collected ? '❤️' : '🤍'}</Text>
            <Text className={styles.actionText}>{collected ? '已收藏' : '收藏'}</Text>
          </View>
          <View className={styles.actionItem}>
            <Text className={styles.actionIcon}>↗️</Text>
            <Text className={styles.actionText}>分享</Text>
          </View>
        </View>

        {/* 选集列表 */}
        {seriesVideos.length > 1 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>选集</Text>
            <ScrollView scrollX className={styles.episodeScroll} enhanced showScrollbar={false}>
              <View className={styles.episodeInner}>
                {seriesVideos.map(ep => {
                  const isCurrent = ep.id === currentId;
                  const isLocked = ep.isPremium && !user.isMember;
                  return (
                    <View
                      key={ep.id}
                      className={`${styles.episodeCard} ${isCurrent ? styles.episodeActive : ''}`}
                      onClick={() => handleEpisodeTap(ep)}
                    >
                      <Text className={`${styles.episodeNum} ${isCurrent ? styles.episodeNumActive : ''}`}>
                        {isLocked ? '🔒' : ''} 第{ep.episode}集
                      </Text>
                      <Text className={`${styles.episodeTitle} ${isCurrent ? styles.episodeTitleActive : ''}`}>
                        {ep.title}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* 相关推荐 */}
        {relatedVideos.length > 0 && (
          <View className={styles.section}>
            <Text className={styles.sectionTitle}>相关推荐</Text>
            {relatedVideos.map(v => (
              <VideoCard key={v.id} video={v} onClick={handleRelatedTap} />
            ))}
          </View>
        )}

        <View className={styles.bottomSafe} />
      </ScrollView>
    </View>
  );
};

export default VideoDetailPage;
