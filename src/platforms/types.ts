export interface User {
  nickname: string
  uid: string
  sec_uid?: string
  avatar?: string
}

export interface SearchResult {
  users: any[]
  hasMore: boolean
}

export interface Platform {
  name: string
  displayName: string
  searchUsers: (keyword: string, page: number) => Promise<SearchResult>
  blockUser: (user: User) => Promise<boolean>
  isCurrentPlatform: () => boolean
}
