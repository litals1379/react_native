import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// הגדרת התנהגות ברירת מחדל להודעות Push
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // האם להציג את ההתראה על המסך
    shouldPlaySound: false, // האם להפעיל צליל עם ההתראה
    shouldSetBadge: false, // האם לשנות את מספר ההתראות באייקון האפליקציה
  }),
});
// פונקציה להרשמה לקבלת הודעות Push
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Constants.isDevice) {
    alert('Must use a physical device for push notifications');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
    console.log('Existing Permission Status:', existingStatus);

    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        console.log('Requested Permission Status:', status);
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        alert('Permission not granted for push notifications!');
        return null;
    }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);

    if (token) {
        sendPushNotification(token);
        return token;
    } else {
        console.error("Failed to get Expo Push Token. Token is null.");
        return null;
    }
} catch (error) {
    console.error("Failed to get Expo Push Token. Error:", error);
    return null;
}
}
// פונקציה לשליחת הודעת Push למכשיר
async function sendPushNotification(expoPushToken) {
  const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Registration Success',
      body: 'You have successfully registered!',
      data: { someData: 'Your custom data' },
  };

  try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(message),
      });

      const responseData = await response.json();
      console.log('Push Notification Response:', responseData); // הדפס את התגובה המלאה

      if (responseData && responseData.data && responseData.data.length > 0 && responseData.data[0].status === 'ok') {
          console.log('Push notification sent successfully!');
      } else {
          console.error('Failed to send push notification. Response:', responseData); // הדפס את התגובה במקרה של כישלון
      }
  } catch (error) {
      console.error('Error sending push notification:', error);
  }
}

export default {
  registerForPushNotificationsAsync,
  sendPushNotification,
};
