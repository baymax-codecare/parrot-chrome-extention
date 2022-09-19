import storage from "@/chrome/chrome-storage";
import { BACKEND_API } from "@/config";

export const sendNotificationTokenRequest = async ({
  token,
}: {
  token: string | undefined;
}): Promise<any> => {
  if (!token) return

  try {
    const data = await (
      await fetch(
        `${BACKEND_API}/notificationToken`,
        {
          method: 'POST', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({ token })
        }
      )
    ).json();
    console.log('RESULT', data)
    return data
  } catch (error) {
    console.log(error)
    return Promise.reject(error);
  }
};

export const sendRefreshIntervalRequest = async ({
  refreshInterval
}: {
  refreshInterval: number
}): Promise<any> => {
  try {
    const identity = await storage.getUserIdentity()
    if (!identity) return

    const responseData = await (
      await fetch(
        `${BACKEND_API}/refreshInterval`,
        {
          method: 'PUT', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({ identity, refreshInterval })
        }
      )
    ).json();
    console.log('RESULT responseData', responseData)
    return responseData
  } catch (error) {
    console.log(error)
    return Promise.reject(error);
  }
};


export const sendNotificationsRequest = async ({
  data
}: {
  data: any
}): Promise<any> => {
  try {
    const identity = await storage.getUserIdentity()
    if (!identity) return

    const responseData = await (
      await fetch(
        `${BACKEND_API}/notificationList`,
        {
          method: 'POST', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({ identity, data })
        }
      )
    ).json();
    console.log('RESULT responseData', responseData)
    return responseData
  } catch (error) {
    console.log(error)
    return Promise.reject(error);
  }
};
