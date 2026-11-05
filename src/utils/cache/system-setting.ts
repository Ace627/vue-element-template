import { StorageCache } from './storage-cache'
import { type SystemSetting, defaultSettings } from '@/defaultSettings'

export function setSystemSetting(config: SystemSetting) {
  StorageCache.set('systemSetting', config)
}

export function getSystemSetting(): SystemSetting {
  return StorageCache.getWithDefault('systemSetting', defaultSettings)
}

export function removeSystemSetting() {
  StorageCache.remove('systemSetting')
}
