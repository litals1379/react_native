/*import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Button } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function googleAuth() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "25521014533-9qaq8q5m7lbb1n8qjuq56lmkj7aupe70.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      getUserInfo(response.authentication.accessToken);
    }
  }, [response]);

  async function getUserInfo(token) {
    try {
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      setUserInfo(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View>
          <Text style={styles.welcomeText}>שלום, {userInfo.name}!</Text>
          <Image source={{ uri: userInfo.picture }} style={styles.profileImage} />
          <Button title="התנתק" onPress={() => setUserInfo(null)} />
        </View>
      ) : (
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Image source={require('../assets/images/google-icon.png')} style={styles.googleIcon} />
          <Text style={styles.googleText}>המשך עם Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  googleButton: { flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderRadius: 8 },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  googleText: { fontSize: 16, color: '#555' },
  welcomeText: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
});*/
