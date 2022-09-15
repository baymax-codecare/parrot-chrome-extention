import { DEFAULT_REFRESH_INTERVAL } from "@/config";

const storagePrefix = "CHROME_PARROT_PREFIX";

const storage = {
  set: (key: string, value: string) => {
    return chrome.storage.local.set({
      [`${storagePrefix}-${key}`]: value
    })
  },

  get: async (key: string):Promise<string | null> => {
    const keyWithPrefix = `${storagePrefix}-${key}`
    const value = await chrome.storage.local.get(keyWithPrefix)
    if(!value || !value[keyWithPrefix]) return null

    return value[keyWithPrefix]
  },

  setRefreshInterval: async (interval: number) => {
    return storage.set('refresh-interval', interval.toString())
  },
  getRefreshInterval: async () => {
    return Number((await storage.get('refresh-interval')) || DEFAULT_REFRESH_INTERVAL)
  },
  /**
   * @description store json string of listing notifications
   * @param notifications json string of notifications
   */
  setListingNotifications: async (notifications: string) => {
    return storage.set('listing-notifications', notifications)
  },
  /**
   *
   * @returns json string of listing notifications
   */
  getListingNotifications: async () => {
    return (await storage.get('listing-notifications')) || '[]'
  },
  /**
   * @description store json string of floor price notifications
   * @param notifications json string of notifications
   */
  setFPNotifications: async (notifications: string) => {
    return storage.set('fp-notifications', notifications)
  },
  /**
   *
   * @returns json string of floor price notifications
   */
  getFPNotifications: async () => {
    return (await storage.get('fp-notifications')) || '[]'
  },

  setNotificationToken: async (token: string) => {
    return storage.set('notification-token', token)
  },

  getNotificationToken: async () => {
    return (await storage.get('notification-token')) || ''
  },

  setUserIdentity: async (identity: string) => {
    return storage.set('user-identity', identity)
  },

  getUserIdentity: async () => {
    return (await storage.get('user-identity')) || ''
  },
};

export default storage;
