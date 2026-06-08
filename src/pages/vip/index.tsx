import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppContext } from '@/store/appContext';
import { MEMBER_PLANS, LIVE_NOTIFICATIONS } from '@/data/articles';

const VipPage: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [selectedPlan, setSelectedPlan] = useState<string>('year');
  const [tickerIndex, setTickerIndex] = useState(0);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [activationCode, setActivationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  useDidShow(() => {
    console.log('[VipPage] VIP页面展示');
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % LIVE_NOTIFICATIONS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activePlan = useMemo(() => MEMBER_PLANS.find((p) => p.key === selectedPlan), [selectedPlan]);

  const handlePayTrigger = () => {
    if (user.isMember) return;
    setPaymentStep('checkout');
    setShowPayModal(true);
  };

  const executeMockPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        setUser({ ...user, isMember: true });
        setShowPayModal(false);
        Taro.showToast({ title: '支付成功，已开通会员', icon: 'success' });
      }, 1500);
    }, 1800);
  };

  const handleCodeActivation = () => {
    if (!activationCode.trim()) {
      Taro.showToast({ title: '请输入激活码', icon: 'none' });
      return;
    }
    setPaymentStep('processing');
    setShowPayModal(true);
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        setUser({ ...user, isMember: true });
        setShowPayModal(false);
        setActivationCode('');
        setShowCodeInput(false);
        Taro.showToast({ title: '激活成功，已开通会员', icon: 'success' });
      }, 1200);
    }, 1500);
  };

  return (
    <ScrollView className={styles.page} scrollY>
      {/* Member Status Card */}
      <View className={classnames(styles.statusCard, user.isMember ? styles.statusCardVip : styles.statusCardFree)}>
        <View className={styles.statusContent}>
          {user.isMember ? (
            <>
              <Text className={styles.vipBadge}>PREMIUM VIP</Text>
              <Text className={styles.vipTitle}>至尊伴学VIP会员</Text>
              <Text className={styles.vipDesc}>尊享全库无限解锁 · 专属通道已就绪</Text>
            </>
          ) : (
            <>
              <Text className={styles.freeBadge}>大众免费版</Text>
              <Text className={styles.freeTitle}>开通「探秘伴学会员卡」</Text>
              <Text className={styles.freeDesc}>解锁全部深度 AI 科普资料，走进硅谷前沿思维世界</Text>
            </>
          )}
        </View>
        <View className={styles.statusDecor} />
      </View>

      {/* Live notification ticker */}
      <View className={styles.ticker}>
        <Text className={styles.tickerText}>🎉 {LIVE_NOTIFICATIONS[tickerIndex]}</Text>
      </View>

      {/* Plan Selection */}
      <View className={styles.sectionHeader}>
        <Text className={styles.sectionTitle}>选择您的专属会员方案</Text>
      </View>
      <View className={styles.plansGrid}>
        {MEMBER_PLANS.map((plan) => (
          <View
            key={plan.key}
            className={classnames(
              styles.planCard,
              selectedPlan === plan.key && styles.planCardActive,
              plan.recommended && styles.planCardRecommended
            )}
            onClick={() => !user.isMember && setSelectedPlan(plan.key)}
          >
            {plan.recommended && <Text className={styles.planBadge}>推荐</Text>}
            <Text className={styles.planName}>{plan.name}</Text>
            <View className={styles.planPriceRow}>
              <Text className={styles.planPriceSymbol}>¥</Text>
              <Text className={styles.planPrice}>{plan.price}</Text>
            </View>
            <Text className={styles.planPeriod}>{plan.period}</Text>
          </View>
        ))}
      </View>

      {/* Benefits */}
      <View className={styles.benefits}>
        <Text className={styles.sectionTitle}>会员专属权益</Text>
        <View className={styles.benefitList}>
          {[
            '全部进阶科普文章无限畅读',
            '1000+ 开箱即用 AI 提示词库',
            '硅谷前沿科技洞察简报',
            '专属社群优先答疑通道',
            '新功能内测抢先体验'
          ].map((item, i) => (
            <View key={i} className={styles.benefitItem}>
              <Text className={styles.benefitCheck}>✓</Text>
              <Text className={styles.benefitText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pay Button */}
      <View className={styles.bottomActions}>
        {!user.isMember && (
          <View className={styles.payBtn} onClick={handlePayTrigger}>
            <Text className={styles.payBtnText}>
              立即开通 ¥{activePlan?.price}
            </Text>
          </View>
        )}
        {!user.isMember && (
          <View className={styles.codeLink} onClick={() => setShowCodeInput(!showCodeInput)}>
            <Text className={styles.codeLinkText}>已有激活码？点此兑换</Text>
          </View>
        )}
        {showCodeInput && !user.isMember && (
          <View className={styles.codeInputWrap}>
            <Input
              className={styles.codeInput}
              value={activationCode}
              onInput={(e) => setActivationCode(e.detail.value)}
              placeholder="请输入激活码"
              maxlength={20}
            />
            <View className={styles.codeSubmitBtn} onClick={handleCodeActivation}>
              <Text className={styles.codeSubmitText}>兑换</Text>
            </View>
          </View>
        )}
      </View>

      {/* Payment Modal */}
      {showPayModal && (
        <View className={styles.modalOverlay}>
          <View className={styles.modal}>
            {paymentStep === 'checkout' && (
              <>
                <Text className={styles.modalTitle}>确认支付</Text>
                <Text className={styles.modalPlan}>
                  {activePlan?.name} ¥{activePlan?.price}
                </Text>
                <Text className={styles.modalTip}>模拟微信支付流程，不会产生真实扣费</Text>
                <View className={styles.modalConfirmBtn} onClick={executeMockPayment}>
                  <Text className={styles.modalConfirmText}>微信支付 ¥{activePlan?.price}</Text>
                </View>
                <View className={styles.modalCancelBtn} onClick={() => setShowPayModal(false)}>
                  <Text className={styles.modalCancelText}>取消</Text>
                </View>
              </>
            )}
            {paymentStep === 'processing' && (
              <View className={styles.modalProcessing}>
                <Text className={styles.modalSpinner}>⏳</Text>
                <Text className={styles.modalTitle}>支付处理中...</Text>
                <Text className={styles.modalTip}>正在与微信支付服务器确认</Text>
              </View>
            )}
            {paymentStep === 'success' && (
              <View className={styles.modalProcessing}>
                <Text className={styles.modalSpinner}>✅</Text>
                <Text className={styles.modalTitle}>支付成功！</Text>
                <Text className={styles.modalTip}>会员已激活，欢迎畅享全部内容</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default VipPage;
