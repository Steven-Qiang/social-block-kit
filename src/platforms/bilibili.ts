import type { Platform, SearchResult, User } from './types'

export class BilibiliPlatform implements Platform {
  name = 'bilibili'
  displayName = '哔哩哔哩'
  private blacklist = new Set<string>()

  isCurrentPlatform(): boolean {
    return window.location.hostname.includes('bilibili.com')
  }

  async loadBlacklist(): Promise<void> {
    let page = 1
    let hasMore = true

    while (hasMore) {
      const res = await fetch(`https://api.bilibili.com/x/relation/blacks?re_version=0&pn=${page}&ps=50&jsonp=jsonp&web_location=333.33`, {
        credentials: 'include',
      })
      const data = await res.json()
      const list = data.data?.list || []

      list.forEach((item: any) => this.blacklist.add(item.mid.toString()))

      hasMore = list.length >= 50
      page++
    }
  }

  isBlocked(uid: string): boolean {
    return this.blacklist.has(uid)
  }

  async searchUsers(keyword: string, page: number): Promise<SearchResult> {
    if (page === 0 && this.blacklist.size === 0) {
      await this.loadBlacklist()
    }

    const searchParams = new URLSearchParams({
      keyword,
      page: (page + 1).toString(),
      order: 'totalrank',
      duration: '0',
      tids: '0',
      search_type: 'bili_user',
    })

    const res = await fetch(`https://api.bilibili.com/x/web-interface/search/type?${searchParams}`, {
      method: 'GET',
      headers: {
        accept: 'application/json, text/plain, */*',
        referer: 'https://search.bilibili.com/',
      },
      credentials: 'include',
    })

    const data = await res.json()
    const users = data.data?.result || []

    return {
      users: users.map((item: any) => ({
        user_info: {
          nickname: item.uname,
          uid: item.mid.toString(),
          avatar: item.upic,
          is_blocked: this.isBlocked(item.mid.toString()),
          official_verify: !!item.official_verify?.desc,
        },
      })),
      hasMore: users.length >= 20,
    }
  }

  async blockUser(user: User): Promise<boolean> {
    const csrf = this.getCsrfToken()
    if (!csrf) {
      console.error('未找到CSRF token')
      return false
    }

    const body = `fid=${user.uid}&act=5&re_src=11&gaia_source=web_main&spmid=333.1387.0.0&extend_content=${encodeURIComponent(JSON.stringify({ entity: 'user', entity_id: Number.parseInt(user.uid) }))}&csrf=${csrf}`

    const res = await fetch('https://api.bilibili.com/x/relation/modify?statistics=%7B%22appId%22:100,%22platform%22:5%7D', {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      body,
      credentials: 'include',
    })

    const data = await res.json()
    if (data.code === 0) {
      this.blacklist.add(user.uid)
      return true
    }
    return false
  }

  private getCsrfToken(): string | null {
    const match = document.cookie.match(/bili_jct=([^;]+)/)
    return match ? match[1] : null
  }
}
