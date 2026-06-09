import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useAppContext } from '@/store/appContext';
import { MOCK_VIDEOS, VIDEO_SERIES } from '@/data/videos';
import { CATEGORIES } from '@/data/articles';
import VideoCard from '@/components/VideoCard';
import SeriesCard from '@/components/SeriesCard';
import styles from './index.module.scss';

const ALL_FILTER = '全部';

const VideoPage: React.FC = () => {
  const { isLoggedIn, login } = useAppContext();
  const [selectedCat, setSelectedCat] = useState(ALL_FILTER);

  const chips = useMemo(() => [ALL_FILTER, ...CATEGORIES.map(c => c.name)], []);

  const filteredVideos = useMemo(() => {
    const list = selectedCat === ALL_FILTER
      ? MOCK_VIDEOS
      : MOCK_VIDEOS.filter(v => {
          const catObj = CATEGORIES.find(c => c.name === selectedCat);
          return catObj && v.category === catObj.key;
        });
    return [...list].sort((a, b) => b.plays - a.plays);
  }, [selectedCat]);

  const handleLogin = () => {
    login();
    Taro.showToast({ title: '登录成功', icon: 'success' });
  };

  const handleSeriesTap = (key: string) => {
    const firstEp = MOCK_VIDEOS
      .filter(v => v.seriesKey === key)
      .sort((a, b) => a.episode - b.episode)[0];
    if (firstEp) {
      Taro.navigateTo({ url: `/pages/video-detail/index?id=${firstEp.id}` });
    }
  };

  const handleVideoTap = (id: string) => {
    Taro.navigateTo({ url: `/pages/video-detail/index?id=${id}` });
  };

  // 未登录引导页
  if (!isLoggedIn) {
    return (
      <View className={styles.loginGate}>
        <Text className={styles.loginIcon}>🎬</Text>
        <Text className={styles.loginTitle}>视频课专区</Text>
        <Text className={styles.loginSub}>登录后即可免费观看 AI 入门系列视频</Text>
        <View className={styles.loginBtn} onClick={handleLogin}>
          <Text className={styles.loginBtnText}>微信一键登录</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <ScrollView
        className={styles.scrollBody}
        scrollY
        enhanced
        showScrollbar={false}
      >
        {/* 精选系列横向滑动 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>精选系列</Text>
          <ScrollView
            className={styles.seriesScroll}
            scrollX
            enhanced
            showScrollbar={false}
          >
            <View className={styles.seriesInner}>
              {VIDEO_SERIES.map(s => (
                <SeriesCard key={s.key} series={s} onClick={handleSeriesTap} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 分类筛选 chips */}
        <View className={styles.chipsRow}>
          <ScrollView scrollX className={styles.chipsScroll} enhanced showScrollbar={false}>
            <View className={styles.chipsInner}>
              {chips.map(name => (
                <View
                  key={name}
                  className={`${styles.chip} ${selectedCat === name ? styles.chipActive : ''}`}
                  onClick={() => setSelectedCat(name)}
                >
                  <Text className={selectedCat === name ? styles.chipTextActive : styles.chipText}>
                    {name}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 热门视频列表 */}
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>
            {selectedCat === ALL_FILTER ? '热门视频' : selectedCat}
          </Text>
          {filteredVideos.length === 0 ? (
            <View className={styles.empty}>
              <Text className={styles.emptyIcon}>📺</Text>
              <Text className={styles.emptyText}>这个分类还没有视频哦，敬请期待~</Text>
            </View>
          ) : (
            filteredVideos.map(v => (
              <VideoCard key={v.id} video={v} onClick={handleVideoTap} />
            ))
          )}
        </View>

        <View className={styles.bottomSafe} />
      </ScrollView>
    </View>
  );
};

export default VideoPage;
