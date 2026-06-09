import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import styles from './index.module.scss';

interface TabItem {
  pagePath: string;
  text: string;
  icon: string;
  selectedIcon: string;
}

const TABS: TabItem[] = [
  { pagePath: 'pages/index/index', text: '推荐', icon: '🏠', selectedIcon: '🏡' },
  { pagePath: 'pages/category/index', text: '分类', icon: '📂', selectedIcon: '📁' },
  { pagePath: 'pages/video/index', text: '视频', icon: '▶️', selectedIcon: '⏯️' },
  { pagePath: 'pages/vip/index', text: 'VIP', icon: '👑', selectedIcon: '💎' },
  { pagePath: 'pages/mine/index', text: '我的', icon: '👤', selectedIcon: '🧑' },
];

const CustomTabBar: React.FC = () => {
  const router = useRouter();

  const currentPath = useMemo(() => {
    return router.path || 'pages/index/index';
  }, [router.path]);

  const handleTap = (tab: TabItem) => {
    if (currentPath === tab.pagePath) return;
    Taro.switchTab({ url: `/${tab.pagePath}` });
  };

  return (
    <View className={styles.tabBar}>
      <View className={styles.tabBarInner}>
        {TABS.map((tab) => {
          const isActive = currentPath === tab.pagePath;
          return (
            <View
              key={tab.pagePath}
              className={styles.tabItem}
              onClick={() => handleTap(tab)}
            >
              <View className={`${styles.iconWrap} ${isActive ? styles.iconWrapActive : ''}`}>
                <Text className={styles.icon}>{isActive ? tab.selectedIcon : tab.icon}</Text>
              </View>
              <Text className={`${styles.label} ${isActive ? styles.labelActive : ''}`}>
                {tab.text}
              </Text>
              {isActive && <View className={styles.dot} />}
            </View>
          );
        })}
      </View>
      <View className={styles.safeArea} />
    </View>
  );
};

export default CustomTabBar;
