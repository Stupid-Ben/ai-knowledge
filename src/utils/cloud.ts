import Taro from '@tarojs/taro';

const CLOUD_ENV = 'cloud1-d7gznw92195fc5fef';

export function initCloud() {
  if (!Taro.cloud) {
    console.error('[cloud] 当前环境不支持云开发');
    return;
  }
  Taro.cloud.init({
    env: CLOUD_ENV,
    traceUser: true
  });
}

export async function callFn<T = any>(name: string, data?: Record<string, any>): Promise<T> {
  try {
    const res = await Taro.cloud.callFunction({ name, data });
    const result = res.result as any;
    if (result && result.error) {
      console.error(`[cloud] ${name} 业务错误:`, result.error);
      throw new Error(result.error);
    }
    return result as T;
  } catch (err: any) {
    console.error(`[cloud] ${name} 调用失败:`, err);
    throw err;
  }
}
