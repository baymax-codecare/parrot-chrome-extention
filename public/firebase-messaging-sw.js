self.addEventListener('notificationclick', function(event) {
  console.log('notificationclick', event)
  var redirect_url = event.notification.data.click_action;
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({
        type: "window"
      })
      .then(function(clientList) {
        console.log(clientList);
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(redirect_url);
        }
      })
  );
})

importScripts('firebase/firebase-app.js');
importScripts('firebase/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  "apiKey": "AIzaSyBw502t0eGMhhQ-ETUlOMPTju_FvqVBEz0",
  "authDomain": "parrot-sniper.firebaseapp.com",
  "projectId": "parrot-sniper",
  "storageBucket": "parrot-sniper.appspot.com",
  "messagingSenderId": "1822371412",
  "appId": "1:1822371412:web:43697567e5a36d115607c1",
  "measurementId": "G-PHGGL7YWBJ"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
  const data = JSON.parse(payload.data['gcm.notification.data'])
  console.log('New Notifiaction', data)
  const notificationTitle = data.title
  const notificationOptions = {
    body: data.body,
    icon: data.icon,
    data: {
      click_action: data.url
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
