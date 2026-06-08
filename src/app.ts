import React from 'react';
import { useLaunch } from '@tarojs/taro';
import { AppProvider } from '@/store/appContext';
import './app.scss';

function App(props: { children?: React.ReactNode }) {
  useLaunch(() => {
    console.log('[App] 启动');
  });

  return (
    <AppProvider>
      {props.children}
    </AppProvider>
  );
}

export default App;
