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
   * 检查用户是否为认证用户
   */
  static isVerifiedUser(platform: Platform, userInfo: any): boolean {
    if (this.isBilibili(platform)) {
      return !!userInfo.official_verify;
    }
    if (this.isDouyin(platform)) {
      try {
        const certInfo = userInfo.account_cert_info ? JSON.parse(userInfo.account_cert_info) : null;
        return certInfo && certInfo.label_style > 0;
      } catch {
        return false;
      }
    }
    return false;
  }

  /**
   * 获取用户认证类型文本（仅抖音）
   */
  static getVerifyType(platform: Platform, userInfo: any): string | null {
    if (this.isDouyin(platform)) {
      try {
        const certInfo = userInfo.account_cert_info ? JSON.parse(userInfo.account_cert_info) : null;
        return certInfo?.label_text || null;
      } catch {
        return null;
      }
    }
    return null;
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
