export enum PlatformType {
  DOUYIN = 'douyin',
  BILIBILI = 'bilibili',
}

export interface User {
  nickname: string;
  uid: string;
  sec_uid?: string;
  avatar?: string;
}

export interface SearchResult {
  users: any[];
  hasMore: boolean;
}

export interface Platform {
  name: PlatformType;
  displayName: string;
  searchUsers: (keyword: string, page: number, onProgress?: (message: string) => void) => Promise<SearchResult>;
  blockUser: (user: User) => Promise<boolean>;
  isCurrentPlatform: () => boolean;
}
