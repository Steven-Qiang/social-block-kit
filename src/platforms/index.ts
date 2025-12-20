import type { Platform } from './types';
import { BilibiliPlatform } from './bilibili';
import { DouyinPlatform } from './douyin';

const platforms: Platform[] = [
  new DouyinPlatform(),
  new BilibiliPlatform(),
];

export function getCurrentPlatform(): Platform | null {
  return platforms.find((platform) => platform.isCurrentPlatform()) || null;
}

export { BilibiliPlatform, DouyinPlatform };
export type { Platform, SearchResult, User } from './types';
export { PlatformType } from './types';
export { LogColors, LogUtils, PlatformUtils } from './utils';
