import { DEFAULT_REFRESH_INTERVAL } from "@/config";

const storagePrefix = "CHROME_PARROT_PREFIX";

const storage = {
  setRefreshInterval: async (interval: number) => {
    await chrome.storage.local.set({
      [`${storagePrefix}-refresh-interval`]: interval.toString(),
    });
  },
  getRefreshInterval: async () => {
    const data = await chrome.storage.local.get(
      `${storagePrefix}-refresh-interval`
    );

    if (data && parseInt(data[`${storagePrefix}-refresh-interval`]))
      return parseInt(data[`${storagePrefix}-refresh-interval`]);

    await chrome.storage.local.set({
      [`${storagePrefix}-refresh-interval`]: DEFAULT_REFRESH_INTERVAL,
    });

    return DEFAULT_REFRESH_INTERVAL;
  },
  /**
   * @description store json string of listing notifications
   * @param notifications json string of notifications
   */
  setListingNotifications: async (notifications: string) => {
    await chrome.storage.local.set({
      [`${storagePrefix}-listing-notifications`]: notifications,
    });
  },
  /**
   *
   * @returns json string of listing notifications
   */
  getListingNotifications: async () => {
    const data = await chrome.storage.local.get(
      `${storagePrefix}-listing-notifications`
    );

    if (!data) return JSON.stringify([]);

    return data[`${storagePrefix}-listing-notifications`];
  },
  /**
   * @description store json string of floor price notifications
   * @param notifications json string of notifications
   */
  setFPNotifications: async (notifications: string) => {
    await chrome.storage.local.set({
      [`${storagePrefix}-fp-notifications`]: notifications,
    });
  },
  /**
   *
   * @returns json string of floor price notifications
   */
  getFPNotifications: async () => {
    const data = await chrome.storage.local.get(
      `${storagePrefix}-fp-notifications`
    );

    if (!data) return JSON.stringify([]);

    return data[`${storagePrefix}-fp-notifications`];
  },
};

export default storage;
