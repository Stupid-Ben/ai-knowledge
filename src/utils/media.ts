import Taro from '@tarojs/taro';

const urlCache = new Map<string, string>();

// 将 cloud fileID 转为 https 临时链接（主要给视频用，image 可直接用 fileID）
export async function resolveTempUrl(fileID: string): Promise<string> {
  if (!fileID) return '';
  if (!fileID.startsWith('cloud://')) return fileID; // 已经是 https，直接返回
  if (urlCache.has(fileID)) return urlCache.get(fileID)!;

  try {
    const res = await Taro.cloud.getTempFileURL({ fileList: [fileID] });
    const url = (res.fileList?.[0] && res.fileList[0].tempFileURL) || '';
    if (url) urlCache.set(fileID, url);
    return url;
  } catch (err) {
    console.error('[media] getTempFileURL failed:', err);
    return '';
  }
}

// 兜底图路径
export const FALLBACK_IMG = '/assets/img-fallback.png';

// 判断是否为 cloud fileID
export function isCloudFileID(src: string): boolean {
  return !!src && src.startsWith('cloud://');
}
