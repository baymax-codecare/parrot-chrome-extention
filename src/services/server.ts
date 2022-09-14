import { BACKEND_API } from "@/config";

export const setNotificationToken = async ({
  token,
}: {
  token: string | undefined;
}): Promise<any> => {
  if (!token) return new Promise((resolve) => resolve({}));

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

export const onFirebaseMessage = async ({
  registrationId,
  data
}: {
  registrationId: string | undefined;
  data: any
}): Promise<any> => {
  if (!registrationId) return new Promise((resolve) => resolve({}));

  try {

    const responseData = await (
      await fetch(
        `${BACKEND_API}/message`,
        {
          method: 'POST', headers: {
            'Content-Type': 'application/json'
          }, body: JSON.stringify({ registrationId, data })
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
