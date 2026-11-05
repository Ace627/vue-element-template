import { StorageCache } from './storage-cache'

/** 写入 accessToken（短时凭证，每次请求通过 Authorization 头携带） */
export function setAccessToken(token: string): boolean {
  return StorageCache.set('accessToken', token)
}

/** 读取 accessToken；未存储时返回 null */
export function getAccessToken(): string | null {
  return StorageCache.get<string>('accessToken')
}

/** 清除 accessToken（登出或收到 401 时调用） */
export function removeAccessToken(): void {
  return StorageCache.remove('accessToken')
}

/** 写入 refreshToken（长时凭证，用于向服务端换取新的 accessToken） */
export function setRefreshToken(refreshToken: string): boolean {
  return StorageCache.set('refreshToken', refreshToken)
}

/** 读取 refreshToken；未存储时返回 null */
export function getRefreshToken(): string | null {
  return StorageCache.get<string>('refreshToken')
}

/** 清除 refreshToken（登出或收到 401 时调用） */
export function removeRefreshToken(): void {
  StorageCache.remove('refreshToken')
}
