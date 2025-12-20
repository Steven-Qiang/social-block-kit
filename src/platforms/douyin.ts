import type { Platform, SearchResult, User } from './types';
import { PlatformType } from './types';

export class DouyinPlatform implements Platform {
  name = PlatformType.DOUYIN;
  displayName = '抖音';

  isCurrentPlatform(): boolean {
    return window.location.hostname.includes('douyin.com');
  }

  async searchUsers(keyword: string, page: number, onProgress?: (message: string) => void): Promise<SearchResult> {
    const offset = page * 10;
    const searchParams = `device_platform=webapp&aid=6383&channel=channel_pc_web&search_channel=aweme_user_web&search_source=normal_search&query_correct_type=1&is_filter_search=0&disable_rs=0&offset=${offset}&count=10&keyword=${encodeURIComponent(keyword)}&need_filter_settings=1&list_type=single&pc_search_top_1_params={"enable_ai_search_top_1":1}&update_version_code=170400&pc_client_type=1&pc_libra_divert=Windows&support_h265=1&support_dash=1&cpu_core_num=16&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=${window.screen.width}&screen_height=${window.screen.height}&browser_language=${navigator.language}&browser_platform=${navigator.platform}&browser_name=${navigator.appName}&browser_version=${navigator.appVersion}&browser_online=${navigator.onLine}&engine_name=Blink&engine_version=142.0.0.0&os_name=Windows&os_version=10&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50`;

    const res = await fetch(`https://www.douyin.com/aweme/v1/web/discover/search/?${searchParams}`, {
      method: 'GET',
      headers: { accept: 'application/json, text/plain, */*' },
      credentials: 'include',
    });

    const data = await res.json();
    const users = data.user_list || [];

    onProgress?.(`搜索到 ${users.length} 个用户`);

    return {
      users,
      hasMore: data.has_more === 1,
    };
  }

  async blockUser(user: User): Promise<boolean> {
    const blockUrlParams = `device_platform=webapp&aid=6383&channel=channel_pc_web&pc_client_type=1&pc_libra_divert=Windows&update_version_code=170400&support_h265=1&support_dash=1&version_code=170400&version_name=17.4.0&cookie_enabled=true&screen_width=2560&screen_height=1440&browser_language=zh-CN&browser_platform=Win32&browser_name=Chrome&browser_version=142.0.0.0&browser_online=true&engine_name=Blink&engine_version=142.0.0.0&os_name=Windows&os_version=10&cpu_core_num=16&device_memory=8&platform=PC&downlink=10&effective_type=4g&round_trip_time=50`;
    const blockBody = `block_type=1&source=0&user_id=${user.uid}&sec_user_id=${user.sec_uid}`;

    const res = await fetch(`https://www-hj.douyin.com/aweme/v1/web/user/block/?${blockUrlParams}`, {
      method: 'POST',
      headers: {
        'accept': 'application/json, text/plain, */*',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'referrer': 'https://www.douyin.com/',
      },
      body: blockBody,
      credentials: 'include',
    });

    const data = await res.json();
    return data.status_code === 0;
  }
}
