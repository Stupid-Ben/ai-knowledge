import React from 'react';
import { AppProvider } from '@/store/appContext';
import { initCloud } from '@/utils/cloud';
import './app.scss';

// 模块加载时立即初始化云开发，确保在任何组件挂载前完成
initCloud();

function App(props: { children?: React.ReactNode }) {
  return (
    <AppProvider>
      {props.children}
    </AppProvider>
  );
}

export default App;
