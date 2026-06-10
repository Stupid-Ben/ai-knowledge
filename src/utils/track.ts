import { callFn } from './cloud';

export function track(event: string, props?: Record<string, any>) {
  callFn('trackEvent', { event, props }).catch(() => {
    // 静默失败，不阻塞 UI
  });
}
