import type { Platform, SearchResult, User } from './types';
import UAParser from 'ua-parser-js';
import { PlatformType } from './types';

export class DouyinPlatform implements Platform {
  name = PlatformType.DOUYIN;
  displayName = '抖音';
  private lastSearchId: string | null = null;

  isCurrentPlatform(): boolean {
    return window.location.hostname.includes('douyin.com');
  }

  private commonParams(): Record<string, string> {
    const parser = new UAParser();
    const result = parser.getResult();
    const nav = navigator as any;

    return {
      cookie_enabled: navigator.cookieEnabled,
      screen_width: screen.width,
      screen_height: screen.height,
      browser_language: navigator.language,
      browser_platform: navigator.platform,
      browser_name: result.browser?.name || '',
      browser_version: result.browser?.version || '',
      browser_online: navigator.onLine,
      engine_name: result.engine?.name || '',
      engine_version: result.engine?.version || '',
      os_name: result.os?.name || '',
      os_version: result.os?.version || '',
      cpu_core_num: navigator.hardwareConcurrency || '',
      device_memory: nav.deviceMemory || '',
      platform: this.detectPlatform(),
      downlink: nav.connection?.downlink || '',
      effective_type: nav.connection?.effectiveType || '',
      round_trip_time: nav.connection?.rtt || ''
    } as any;
  }

  private detectPlatform(): string {
    const userAgent = navigator.userAgent || '';
    const platforms = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    for (const platform of platforms) {
      if (userAgent.includes(platform)) {
        return platform;
      }
    }
    return 'PC';
  }

  private getUifid(): string | null {
    const match = document.cookie.match(/UIFID=([^;]+)/);
    return match ? match[1] : null;
  }

  private getWebid(): string | null {
    const e = document.getElementById('RENDER_DATA');
    if (!e) return '';
    try {
      const d = JSON.parse(decodeURIComponent(e.textContent));
      return d?.app?.odin?.user_unique_id || '';
    } catch {
      return '';
    }
  }

  async searchUsers(keyword: string, page: number, onProgress?: (message: string) => void): Promise<SearchResult> {
    const offset = page * 10;
    const common = this.commonParams();
    const params: Record<string, string> = {
      device_platform: 'webapp',
      aid: '6383',
      channel: 'channel_pc_web',
      search_channel: 'aweme_user_web',
      keyword,
      search_source: 'normal_search',
      query_correct_type: '1',
      is_filter_search: '0',
      from_group_id: '',
      disable_rs: '0',
      offset: offset.toString(),
      count: '10',
      need_filter_settings: '0',
      list_type: 'single',
      pc_search_top_1_params: '{"enable_ai_search_top_1":1}',
      update_version_code: '170400',
      pc_client_type: '1',
      pc_libra_divert: 'Windows',
      support_h265: '1',
      support_dash: '1',
      version_code: '170400',
      version_name: '17.4.0',
      ...common
    };

    const webid = this.getWebid();
    if (webid) {
      params.webid = webid;
    }

    const uifid = this.getUifid();
    if (uifid) {
      params.uifid = uifid;
    }

    if (page > 0 && this.lastSearchId) {
      params.search_id = this.lastSearchId;
    }

    const searchParams = new URLSearchParams(params);

    const res = await fetch(`https://www.douyin.com/aweme/v1/web/discover/search/?${searchParams}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
      },
      credentials: 'include',
    });

    const data = await res.json();
    const users = data.user_list || [];

    if (data.extra?.logid) {
      this.lastSearchId = data.extra.logid;
    }

    onProgress?.(`搜索到 ${users.length} 个用户`);

    return {
      users,
      hasMore: data.has_more === 1,
    };
  }

  async blockUser(user: User): Promise<boolean> {
    const common = this.commonParams();
    const blockUrlParams = new URLSearchParams({
      device_platform: 'webapp',
      aid: '6383',
      channel: 'channel_pc_web',
      pc_client_type: '1',
      pc_libra_divert: 'Windows',
      update_version_code: '170400',
      support_h265: '1',
      support_dash: '1',
      version_code: '170400',
      version_name: '17.4.0',
      ...common
    });

    const blockBody = new URLSearchParams({
      block_type: '1',
      source: '0',
      user_id: user.uid,
      sec_user_id: user.sec_uid,
    } as Record<string, string>);

    const res = await fetch(`https://www-hj.douyin.com/aweme/v1/web/user/block/?${blockUrlParams}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'referrer': 'https://www.douyin.com/',
      },
      body: blockBody.toString(),
      credentials: 'include',
    });

    const data = await res.json();
    return data.status_code === 0;
  }
}
