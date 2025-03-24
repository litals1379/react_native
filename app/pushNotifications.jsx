import * as Notifications from 'expo-notifications'; // ייבוא מודול ההתראות של Expo
import Constants from 'expo-constants'; // ייבוא מודול שמספק מידע על המכשיר והאפליקציה
import { Platform, Alert } from 'react-native'; 

// הגדרת התנהגות ברירת מחדל להודעות Push
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // האם להציג את ההתראה על המסך
    shouldPlaySound: false, // האם להפעיל צליל עם ההתראה
    shouldSetBadge: false, // האם לשנות את מספר ההתראות באייקון האפליקציה
  }),
});

// פונקציה לשליחת הודעת Push למכשיר
async function sendPushNotification(expoPushToken) {
  // יצירת הודעת הפוש שכוללת:
  // - טוקן המכשיר שאליו תישלח ההתראה
  // - צליל ברירת מחדל
  // - כותרת וגוף ההודעה
  // - נתונים נוספים שניתן לשלוח עם ההתראה
  const message = {
    to: expoPushToken, // הטוקן הייחודי של המכשיר שאליו תישלח ההתראה
    sound: 'default', // צליל ברירת מחדל
    title: 'Registration Success', // כותרת ההודעה
    body: 'You have successfully registered!', // גוף ההודעה
    data: { someData: 'Your custom data' }, // נתונים נוספים שיישלחו עם ההתראה
  };

  try {
    // שליחת בקשה לשרת של Expo כדי לשלוח את ההתראה
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST', // שליחת הנתונים בשיטת POST
      headers: {
        Accept: 'application/json', // קביעת סוג הנתונים שהשרת מצפה לקבל
        'Content-Type': 'application/json', // ציון סוג התוכן כ-JSON
      },
      body: JSON.stringify(message), // המרת אובייקט ההודעה למחרוזת JSON
    });

    // קבלת התגובה מהשרת ופענוח הנתונים שלה
    const responseData = await response.json();

    // בדיקה אם ההתראה נשלחה בהצלחה
    if (responseData.data && responseData.data[0].status === 'ok') {
      console.log('Push notification sent successfully!'); // הצגת הודעה בקונסול על הצלחה
    } else {
      console.error('Failed to send push notification'); // הדפסת שגיאה במקרה של כשל
    }
  } catch (error) {
    console.error('Error sending push notification:', error); // טיפול בשגיאות במקרה של כשל
  }
}

// פונקציה להרשמה לקבלת הודעות Push
export async function registerForPushNotificationsAsync() {
  // יצירת ערוץ התראות עבור מכשירי אנדרואיד (לא רלוונטי ל-iOS)
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default', // שם הערוץ
      importance: Notifications.AndroidImportance.MAX, // רמת חשיבות גבוהה ביותר להתראות
      vibrationPattern: [0, 250, 250, 250], // דפוס רטט
      lightColor: '#FF231F7C', // צבע אור LED בהתראה
    });
  }

  // בדיקה אם האפליקציה פועלת על מכשיר פיזי (ולא על אמולטור)
  if (!Constants.isDevice) {
    alert('Must use a physical device for push notifications'); // הצגת הודעה למשתמש
    return null; // יציאה מהפונקציה
  }

  // בדיקה האם יש הרשאות קיימות להתראות Push
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  // אם ההרשאה לא ניתנה, מבקשים אותה מהמשתמש
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  // אם המשתמש לא נתן הרשאה - מציגים הודעה ומפסיקים את הפעולה
  if (finalStatus !== 'granted') {
    alert('Permission not granted for push notifications!');
    return null;
  }

  // קבלת טוקן Expo של המשתמש
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Expo Push Token:', token); // הדפסת הטוקן בקונסול

  // שליחת הודעת Push למכשיר לבדיקה
  sendPushNotification(token);

  return token; // החזרת הטוקן
}
