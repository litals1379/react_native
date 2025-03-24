import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

// הגדרת התנהגות ברירת מחדל להודעות Push
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// פונקציה לשליחת הודעת Push למכשיר
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Registration Success',
    body: 'You have successfully registered for Push notifications!',
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

    if (responseData.data && responseData.data[0].status === 'ok') {
      console.log('Push notification sent successfully!');
    } else {
      console.error('Failed to send push notification');
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

// פונקציה להרשמה להודעות Push
export async function registerForPushNotificationsAsync() {
  // הגדרת ערוץ עבור Android
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // בדיקה אם אנחנו על מכשיר פיזי
  if (!Constants.isDevice) {
    alert('Must use a physical device for push notifications');
    return null;
  }

  // קבלת הרשאות
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Permission not granted for push notifications!');
    return null;
  }

  // קבלת הטוקן של המשתמש
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token);
  
  // שליחת הודעת Push למכשיר
  sendPushNotification(token);

  return token;
}
