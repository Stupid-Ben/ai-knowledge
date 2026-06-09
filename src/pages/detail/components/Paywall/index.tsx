import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface PaywallProps {
  onUnlock: () => void;
}

const Paywall: React.FC<PaywallProps> = ({ onUnlock }) => {
  return (
    <View className={styles.wrapper}>
      <View className={styles.mask} />
      <View className={styles.cta}>
        <Text className={styles.icon}>{'🔒'}</Text>
        <Text className={styles.title}>开通会员，解锁全文</Text>
        <Text className={styles.subtitle}>解锁全部进阶精品 + 去广告 + 专属词典</Text>
        <View className={styles.btn} onClick={onUnlock}>
          <Text className={styles.btnText}>解锁全文</Text>
        </View>
      </View>
    </View>
  );
};

export default Paywall;
