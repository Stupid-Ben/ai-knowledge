import React, { useState } from 'react';
import { View, Text, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { MEMBER_PLANS } from '@/data/articles';
import { MemberPlan } from '@/types';

interface PlanSheetProps {
  onClose: () => void;
  onUnlock: () => void;
}

const PlanSheet: React.FC<PlanSheetProps> = ({ onClose, onUnlock }) => {
  const [selectedKey, setSelectedKey] = useState<string>('year');
  const [payStep, setPayStep] = useState<'selection' | 'paying' | 'done'>('selection');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  const selectedPlan = MEMBER_PLANS.find((p) => p.key === selectedKey) || MEMBER_PLANS[2];

  const handleConfirmPay = () => {
    setPayStep('paying');
    setTimeout(() => {
      setPayStep('done');
      setTimeout(() => {
        onUnlock();
        Taro.showToast({ title: '已解锁全文', icon: 'success' });
      }, 1200);
    }, 1500);
  };

  const handleCodeActivation = () => {
    if (!activationCode.trim()) {
      Taro.showToast({ title: '请输入激活码', icon: 'none' });
      return;
    }
    setPayStep('paying');
    setTimeout(() => {
      setPayStep('done');
      setTimeout(() => {
        onUnlock();
        Taro.showToast({ title: '激活成功，已解锁全文', icon: 'success' });
      }, 1000);
    }, 1200);
  };

  return (
    <View className={styles.overlay} onClick={onClose}>
      <View className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <View className={styles.handle} />

        {payStep === 'selection' && (
          <View className={styles.content}>
            <Text className={styles.sheetTitle}>开通会员解锁全文</Text>

            <View className={styles.plans}>
              {MEMBER_PLANS.map((plan: MemberPlan) => (
                <View
                  key={plan.key}
                  className={classnames(
                    styles.planCard,
                    plan.key === selectedKey && styles.planCardSelected,
                    plan.recommended && styles.planCardRecommended
                  )}
                  onClick={() => setSelectedKey(plan.key)}
                >
                  {plan.recommended && (
                    <View className={styles.badge}>
                      <Text className={styles.badgeText}>推荐</Text>
                    </View>
                  )}
                  <View className={styles.planLeft}>
                    <Text className={styles.planName}>{plan.name}</Text>
                    <Text className={styles.planPeriod}>{plan.period}</Text>
                  </View>
                  <View className={styles.planRight}>
                    <Text className={styles.planPrice}>¥{plan.price}</Text>
                    <View className={classnames(
                      styles.radio,
                      plan.key === selectedKey && styles.radioSelected
                    )} />
                  </View>
                </View>
              ))}
            </View>

            <View className={styles.confirmBtn} onClick={handleConfirmPay}>
              <Text className={styles.confirmText}>立即开通（微信支付）</Text>
            </View>

            <View className={styles.otherMethods}>
              <Text
                className={styles.codeToggle}
                onClick={() => setShowCodeInput(!showCodeInput)}
              >
                其他方式：卡密激活
              </Text>
            </View>

            {showCodeInput && (
              <View className={styles.codeRow}>
                <Input
                  className={styles.codeInput}
                  value={activationCode}
                  onInput={(e) => setActivationCode(e.detail.value)}
                  placeholder="请输入激活码"
                  maxlength={20}
                />
                <View className={styles.codeBtn} onClick={handleCodeActivation}>
                  <Text className={styles.codeBtnText}>兑换</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {payStep === 'paying' && (
          <View className={styles.processing}>
            <View className={styles.fingerprintWrap}>
              <View className={styles.fingerprint}>
                <View className={styles.ridge} style={{ transform: 'rotate(0deg)' }} />
                <View className={styles.ridge} style={{ transform: 'rotate(30deg)' }} />
                <View className={styles.ridge} style={{ transform: 'rotate(60deg)' }} />
                <View className={styles.ridge} style={{ transform: 'rotate(90deg)' }} />
                <View className={styles.ridge} style={{ transform: 'rotate(120deg)' }} />
                <View className={styles.ridge} style={{ transform: 'rotate(150deg)' }} />
              </View>
              <View className={styles.scanLine} />
            </View>
            <Text className={styles.processingTitle}>正在支付...</Text>
            <Text className={styles.processingTip}>安全连接微信支付中</Text>
          </View>
        )}

        {payStep === 'done' && (
          <View className={styles.processing}>
            <Text className={styles.doneIcon}>{'✅'}</Text>
            <Text className={styles.processingTitle}>支付成功！</Text>
            <Text className={styles.processingTip}>全文已解锁，尽情阅读吧</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default PlanSheet;
