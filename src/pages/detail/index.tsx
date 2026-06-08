import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image, RichText, Input } from '@tarojs/components';
import Taro, { useLoad } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useAppContext } from '@/store/appContext';
import { MOCK_ARTICLES, MEMBER_PLANS } from '@/data/articles';
import ArticleCard from '@/components/ArticleCard';

const FontSizes = [
  { key: 'small', label: '标准', cls: 'text-base' },
  { key: 'medium', label: '大号', cls: 'text-lg' },
  { key: 'large', label: '超大', cls: 'text-xl' }
];

const DetailPage: React.FC = () => {
  const { user, setUser } = useAppContext();
  const [articleId, setArticleId] = useState<string>('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [showPayDrawer, setShowPayDrawer] = useState(false);
  const [payStep, setPayStep] = useState<'selection' | 'paying' | 'done'>('selection');
  const [fontSizeKey, setFontSizeKey] = useState('medium');
  const [activationCode, setActivationCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  useLoad((options) => {
    const id = options?.id || '';
    console.log('[DetailPage] 文章ID:', id);
    setArticleId(id);
  });

  const article = useMemo(() => {
    return MOCK_ARTICLES.find((a) => a.id === articleId) || MOCK_ARTICLES[0];
  }, [articleId]);

  const isPremiumLocked = article.isPremium && !user.isMember;

  useEffect(() => {
    if (article.id) {
      setIsFavorited(user.collectedIds.includes(article.id));
      if (!user.historyIds.includes(article.id)) {
        setUser({
          ...user,
          historyIds: [article.id, ...user.historyIds].slice(0, 30)
        });
      }
    }
  }, [articleId, user.collectedIds]);

  const recommendations = useMemo(() => {
    return MOCK_ARTICLES.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 2);
  }, [article]);

  const handleBack = () => {
    Taro.navigateBack();
  };

  const toggleFavorite = () => {
    const isFavNow = user.collectedIds.includes(article.id);
    let newFavs: string[];
    if (isFavNow) {
      newFavs = user.collectedIds.filter((id) => id !== article.id);
      setIsFavorited(false);
      Taro.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      newFavs = [...user.collectedIds, article.id];
      setIsFavorited(true);
      Taro.showToast({ title: '已加入收藏', icon: 'success' });
    }
    setUser({ ...user, collectedIds: newFavs });
  };

  const handleShare = () => {
    Taro.setClipboardData({
      data: `【AI 科普知识库】向您推荐：《${article.title}》。快来看看吧！`,
      success: () => {
        Taro.showToast({ title: '已复制分享文案', icon: 'success' });
      }
    });
  };

  const handleUnlockPay = () => {
    setShowPayDrawer(true);
    setPayStep('selection');
  };

  const executePayment = () => {
    setPayStep('paying');
    setTimeout(() => {
      setPayStep('done');
      setTimeout(() => {
        setUser({ ...user, isMember: true });
        setShowPayDrawer(false);
        Taro.showToast({ title: '已解锁全文', icon: 'success' });
      }, 1500);
    }, 2000);
  };

  const handleCodeActivation = () => {
    if (!activationCode.trim()) {
      Taro.showToast({ title: '请输入激活码', icon: 'none' });
      return;
    }
    setPayStep('paying');
    setShowPayDrawer(true);
    setTimeout(() => {
      setPayStep('done');
      setTimeout(() => {
        setUser({ ...user, isMember: true });
        setShowPayDrawer(false);
        setActivationCode('');
        setShowCodeInput(false);
        Taro.showToast({ title: '激活成功，已解锁全文', icon: 'success' });
      }, 1200);
    }, 1500);
  };

  const handleRelatedArticle = (id: string) => {
    Taro.redirectTo({ url: `/pages/detail/index?id=${id}` });
  };

  const formatViews = (v: number): string => {
    if (v >= 10000) return `${(v / 10000).toFixed(1)}万`;
    return String(v);
  };

  // Rich text content - Taro RichText needs nodes or string
  // We'll use View/Text with dangerouslySetInnerHTML replacement
  const contentHtml = article.contentHtml;
  const hasMore = contentHtml.includes('<!-- MORE -->');
  const contentParts = contentHtml.split('<!-- MORE -->');

  return (
    <View className={styles.page}>
      {/* Header */}
      <View className={styles.header}>
        <View className={styles.backBtn} onClick={handleBack}>
          <Text>←</Text>
        </View>
        <Text className={styles.title}>{article.title}</Text>
        <View className={styles.meta}>
          <Text className={styles.metaText}>{formatViews(article.views)} 阅读</Text>
          <Text className={styles.metaText}>{article.readMinutes} 分钟</Text>
          <Text className={styles.metaText}>{article.publishedAt}</Text>
          {article.tags.slice(0, 2).map((tag) => (
            <Text key={tag} className={styles.tag}>{tag}</Text>
          ))}
        </View>
      </View>

      {/* Cover Image */}
      <Image className={styles.cover} src={article.cover} mode="aspectFill" />

      {/* Content */}
      <ScrollView scrollY className={styles.content}>
        <View className={classnames(
          styles.contentHtml,
          fontSizeKey === 'small' && styles.contentSmall,
          fontSizeKey === 'medium' && styles.contentMedium,
          fontSizeKey === 'large' && styles.contentLarge
        )}>
          <RichText nodes={isPremiumLocked && hasMore ? contentParts[0] : contentHtml.replace('<!-- MORE -->', '')} />
        </View>
      </ScrollView>

      {/* Paywall for premium content - Frosted Glass Gradient */}
      {isPremiumLocked && hasMore && (
        <View className={styles.paywall}>
          <View className={styles.paywallBlur} />
          <View className={styles.paywallContent}>
            <Text className={styles.paylockIcon}>🔒</Text>
            <Text className={styles.paywallText}>开通会员，解锁全文</Text>
            <Text className={styles.paywallPrice}>终身伴学年卡 ¥99</Text>
            <View className={styles.paywallBtn} onClick={handleUnlockPay}>
              <Text className={styles.paywallBtnText}>立即解锁全文</Text>
            </View>
            <View className={styles.codeSwitch} onClick={() => setShowCodeInput(!showCodeInput)}>
              <Text className={styles.codeSwitchText}>已有激活码？点此兑换</Text>
            </View>
            {showCodeInput && (
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
        </View>
      )}

      {/* Recommendations */}
      {!isPremiumLocked && recommendations.length > 0 && (
        <View className={styles.recommendSection}>
          <Text className={styles.recommendTitle}>相关推荐</Text>
          {recommendations.map((art) => (
            <ArticleCard key={art.id} article={art} onClick={handleRelatedArticle} />
          ))}
        </View>
      )}

      {/* Bottom Toolbar */}
      <View className={styles.toolbar}>
        <View className={styles.toolBtn} onClick={handleBack}>
          <Text className={styles.toolBtnIcon}>🏠</Text>
          <Text className={styles.toolBtnLabel}>返回</Text>
        </View>
        <View className={styles.toolBtn} onClick={toggleFavorite}>
          <Text className={styles.toolBtnIcon}>{isFavorited ? '⭐' : '☆'}</Text>
          <Text className={classnames(styles.toolBtnLabel, isFavorited && styles.toolBtnActive)}>
            {isFavorited ? '已收藏' : '收藏'}
          </Text>
        </View>
        <View className={styles.toolBtn} onClick={handleShare}>
          <Text className={styles.toolBtnIcon}>📤</Text>
          <Text className={styles.toolBtnLabel}>分享</Text>
        </View>
        <View className={styles.toolBtn} onClick={() => setFontSizeKey(
          fontSizeKey === 'small' ? 'medium' : fontSizeKey === 'medium' ? 'large' : 'small'
        )}>
          <Text className={styles.toolBtnIcon}>Aa</Text>
          <Text className={styles.toolBtnLabel}>
            {fontSizeKey === 'small' ? '标准' : fontSizeKey === 'medium' ? '大号' : '超大'}
          </Text>
        </View>
      </View>

      {/* Payment Drawer - Slide from bottom */}
      {showPayDrawer && (
        <View className={styles.drawerOverlay} onClick={() => setShowPayDrawer(false)}>
          <View className={styles.drawer} onClick={(e) => e.stopPropagation()}>
            <View className={styles.drawerHandle} />
            
            {payStep === 'selection' && (
              <View className={styles.drawerContent}>
                <Text className={styles.drawerTitle}>开通会员解锁全文</Text>
                <View className={styles.plansList}>
                  {MEMBER_PLANS.map((plan) => (
                    <View
                      key={plan.key}
                      className={classnames(styles.planItem, plan.recommended && styles.planItemRecommended)}
                    >
                      <View className={styles.planInfo}>
                        <Text className={styles.planName}>{plan.name}</Text>
                        <Text className={styles.planPrice}>¥{plan.price}</Text>
                      </View>
                      <View className={classnames(styles.planCheck, plan.recommended && styles.planCheckRecommended)} />
                    </View>
                  ))}
                </View>
                <View className={styles.drawerConfirm} onClick={executePayment}>
                  <Text className={styles.drawerConfirmText}>安全确认支付</Text>
                </View>
                <View className={styles.drawerCancel} onClick={() => setShowPayDrawer(false)}>
                  <Text className={styles.drawerCancelText}>取消</Text>
                </View>
              </View>
            )}
            
            {payStep === 'paying' && (
              <View className={styles.drawerProcessing}>
                <View className={styles.fingerprintContainer}>
                  <View className={styles.fingerprint}>
                    <View className={styles.fprintRidge} style={{ transform: 'rotate(0deg)' }} />
                    <View className={styles.fprintRidge} style={{ transform: 'rotate(30deg)' }} />
                    <View className={styles.fprintRidge} style={{ transform: 'rotate(60deg)' }} />
                    <View className={styles.fprintRidge} style={{ transform: 'rotate(90deg)' }} />
                    <View className={styles.fprintRidge} style={{ transform: 'rotate(120deg)' }} />
                    <View className={styles.fprintRidge} style={{ transform: 'rotate(150deg)' }} />
                  </View>
                  <View className={styles.fingerprintScan} />
                </View>
                <Text className={styles.processingTitle}>正在支付...</Text>
                <Text className={styles.processingTip}>安全连接微信支付中</Text>
              </View>
            )}
            
            {payStep === 'done' && (
              <View className={styles.drawerProcessing}>
                <Text className={styles.doneIcon}>✅</Text>
                <Text className={styles.processingTitle}>支付成功！</Text>
                <Text className={styles.processingTip}>全文已解锁，尽情阅读吧</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default DetailPage;
