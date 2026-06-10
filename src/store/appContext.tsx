import React, { createContext, useState, useCallback, useContext, ReactNode, useEffect } from 'react';
import Taro from '@tarojs/taro';
import { User, AppContextType } from '@/types';
import { callFn, initCloud } from '@/utils/cloud';

const DEFAULT_USER: User = {
  isMember: false,
  points: 120,
  friends: 2,
  collectedIds: ['art-001'],
  historyIds: ['art-001', 'art-002'],
  unlockedIds: []
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return ctx;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User>(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // 启动时尝试云登录
  useEffect(() => {
    const doLogin = async () => {
      // 确保云开发已初始化
      initCloud();
      try {
        const result = await callFn<{ openid: string; isMember: boolean }>('login');
        if (result && result.openid) {
          setUserState(prev => ({
            ...prev,
            isMember: result.isMember || false
          }));
          setIsLoggedIn(true);
          try {
            Taro.setStorageSync('ai_science_logged_in', 'true');
          } catch (e) { /* ignore */ }
        }
      } catch (err) {
        console.warn('[AppContext] 云登录失败，回退本地模式', err);
        // 回退：从本地存储恢复
        try {
          const savedUser = Taro.getStorageSync('ai_science_user');
          if (savedUser) setUserState(JSON.parse(savedUser));
          const loggedIn = Taro.getStorageSync('ai_science_logged_in');
          setIsLoggedIn(loggedIn === 'true');
        } catch (e) { /* ignore */ }
      }
    };
    doLogin();
  }, []);

  const setUser = useCallback((u: User) => {
    setUserState(u);
    try {
      Taro.setStorageSync('ai_science_user', JSON.stringify(u));
    } catch (e) {
      console.error('[AppContext] 保存用户数据失败', e);
    }
  }, []);

  const login = useCallback(() => {
    setIsLoggedIn(true);
    try {
      Taro.setStorageSync('ai_science_logged_in', 'true');
    } catch (e) {
      console.error('[AppContext] 保存登录状态失败', e);
    }
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserState(DEFAULT_USER);
    try {
      Taro.removeStorageSync('ai_science_logged_in');
      Taro.removeStorageSync('ai_science_user');
    } catch (e) {
      console.error('[AppContext] 清除存储失败', e);
    }
  }, []);

  return (
    <AppContext.Provider value={{ user, isLoggedIn, setUser, login, logout }}>
      {children}
    </AppContext.Provider>
  );
};
