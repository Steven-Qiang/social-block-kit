import type { Platform } from './types';
import { PlatformType } from './types';

/**
 * 平台工具类
 */
export class PlatformUtils {
  /**
   * 检查是否为抖音平台
   */
  static isDouyin(platform: Platform | null): boolean {
    return platform?.name === PlatformType.DOUYIN;
  }

  /**
   * 检查是否为B站平台
   */
  static isBilibili(platform: Platform | null): boolean {
    return platform?.name === PlatformType.BILIBILI;
  }

  /**
   * 检查用户是否已被拉黑
   */
  static isUserBlocked(platform: Platform, userInfo: any): boolean {
    if (this.isDouyin(platform)) {
      return userInfo.user_tags?.some((tag: any) => tag.type === 'blocked_label');
    }
    if (this.isBilibili(platform)) {
      return userInfo.is_blocked;
    }
    return false;
  }

  /**
   * 检查用户是否为认证用户（仅B站）
   */
  static isVerifiedUser(platform: Platform, userInfo: any): boolean {
    if (this.isBilibili(platform)) {
      return !!userInfo.official_verify;
    }
    return false;
  }

  /**
   * 获取平台显示名称映射
   */
  static getPlatformDisplayName(platformType: PlatformType): string {
    const displayNames = {
      [PlatformType.DOUYIN]: '抖音',
      [PlatformType.BILIBILI]: '哔哩哔哩',
    };
    return displayNames[platformType] || '未知平台';
  }
}

/**
 * 日志颜色常量
 */
export enum LogColors {
  PRIMARY = '#667eea',
  SUCCESS = '#4caf50',
  ERROR = '#ff5722',
  WARNING = '#ff9800',
  INFO = '#2196F3',
  MUTED = '#999',
}

/**
 * 日志工具类
 */
export class LogUtils {
  /**
   * 格式化时间戳
   */
  static formatTime(): string {
    return new Date().toLocaleTimeString();
  }

  /**
   * 创建日志条目
   */
  static createLogEntry(msg: string, color: string = LogColors.MUTED) {
    return {
      msg,
      color,
      time: this.formatTime(),
    };
  }
}
