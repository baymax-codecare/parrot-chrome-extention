// Firebase Cloud Messaging Configuration File. 
// Read more at https://firebase.google.com/docs/cloud-messaging/js/client && https://firebase.google.com/docs/cloud-messaging/js/receive

import { firebaseConfig, vapidKey } from '@/chrome/credentials';
import { setNotificationToken } from '@/services/server';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

initializeApp(firebaseConfig);

const messaging = getMessaging();

export const requestPermission = () => {
  console.log('Requesting permission...');
  return new Promise((resolve, reject) => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        resolve(true)
      } else resolve(false)
    }).catch(() => resolve(false))
  })
}

export const requestForToken = async () => {
  const granted = await requestPermission()
  if (!granted) return

  return getToken(messaging, { vapidKey })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        setNotificationToken({ token: currentToken })
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

// Handle incoming messages. Called when:
// - a message is received while the app has focus
// - the user clicks on an app notification created by a service worker `messaging.onBackgroundMessage` handler.
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });


