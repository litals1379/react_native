import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [pushToken, setPushToken] = useState(null);
  const [notification, setNotification] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  useEffect(() => {
    const getPushToken = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        const token = await Notifications.getExpoPushTokenAsync();
        setPushToken(token.data);
        console.log('Expo Push Token:', token.data);
      } else {
        console.log('הרשאה לא ניתנה');
      }
    };
  
    // קריאה לפונקציה
    getPushToken();
  
    // ✅ האזנה להודעות נכנסות
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 התקבלה הודעת פוש:', notification);
      setNotification(notification);
    });
  
    return () => {
      subscription.remove(); // מנקה את ההאזנה ביציאה מהמסך
    };
  }, []);

  const sendPushNotification = async (expoPushToken) => {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'שלום!',
      body: 'זו הודעה ניסיונית.',
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
      const data = await response.json();
      console.log('Response:', data);
      setMessageSent(true);
    } catch (error) {
      console.error('Error sending notification:', error);
      setMessageSent(false);
    }
  };

  const handleSendMessage = () => {
    if (pushToken) {
      sendPushNotification(pushToken);
    } else {
      alert('ה-Token לא נמצא, אנא המתן עד שהרשאות יינתנו');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Expo Push Notifications</Text>

      {pushToken ? (
        <Text selectable style={styles.token}>ה-Token שלך: {pushToken}</Text>
      ) : (
        <Text>מחכים להרשאות...</Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="שלח הודעת פוש" onPress={handleSendMessage} />
      </View>

      {messageSent && (
        <Text style={styles.success}>ההודעה נשלחה בהצלחה!</Text>
      )}

      {notification && (
        <View style={styles.notification}>
          <Text style={styles.subtitle}>הודעה שהתקבלה:</Text>
          <Text>{JSON.stringify(notification, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  token: {
    fontSize: 14,
    direction: 'ltr',
  },
  buttonContainer: {
    marginTop: 20,
  },
  success: {
    color: 'green',
    marginTop: 20,
  },
  notification: {
    marginTop: 30,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
