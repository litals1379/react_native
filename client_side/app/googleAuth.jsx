import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, ActivityIndicator, Platform, Image, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '261514200770-csdl6nnq4e1bafb1a0is32jtnl3oh7is.apps.googleusercontent.com';
const IOS_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';

const CLIENT_ID = Platform.select({
  ios: IOS_CLIENT_ID,
  android: ANDROID_CLIENT_ID,
  web: WEB_CLIENT_ID,
});

const isWeb = Platform.OS === 'web';

const REDIRECT_URI = AuthSession.makeRedirectUri({
  useProxy: isWeb,
});

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export default function GoogleAuthScreen() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const authRequestConfig = isWeb
    ? {
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scopes: ['openid', 'profile', 'email'],
        responseType: 'token',
        usePKCE: false,
      }
    : {
        clientId: 'placeholder',
        redirectUri: 'placeholder://redirect',
        scopes: ['openid'],
        responseType: 'token',
        usePKCE: false,
      };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(authRequestConfig, discovery);

  useEffect(() => {
    if (!isWeb) {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
        scopes: ['email', 'profile', 'openid'],
      });
    }
  }, []);

  useEffect(() => {
    if (isWeb && response?.type === 'success') {
      const token = response.params.access_token;
      fetchUserInfo(token);
    }
  }, [response]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log('👤 Web User Info:', user);
      setUserInfo(user);
    } catch (err) {
      console.error('❌ Failed fetching user info:', err);
    }
  };

  const signInWithGoogleNative = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut(); // מאפשר החלפת חשבון
      const result = await GoogleSignin.signIn();


      if (result?.user) {
        const userData = {
          name: result.user.name,
          email: result.user.email,
          picture: result.user.photo,
        };
        console.log('✅ Native Sign-In:', userData);
        Alert.alert('התחברות הצליחה', `שלום, ${userData.name}`);
        setUserInfo(userData);
      } else {
        console.warn('⚠️ Native sign-in cancelled or failed');
        Alert.alert('שגיאה', ' אנא נסה שוב.');
      }
    } catch (err) {
      console.error('❌ Native sign-in error:', err);
      Alert.alert('שגיאה', 'ההתחברות נכשלה. אנא נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (isWeb) {
      await handleLogout(); // מאפשר החלפת חשבון בווב
      promptAsync({ useProxy: true });
    } else {
      signInWithGoogleNative();
    }
  };

  const handleLogout = async () => {
    try {
      if (!isWeb) {
        await GoogleSignin.signOut();
      }
      setUserInfo(null);
      console.log('🚪 Logged out');
    } catch (err) {
      console.error('❌ Error during logout:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התחברות עם Google</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : userInfo ? (
        <View style={styles.profile}>
          {userInfo.picture && (
            <Image source={{ uri: userInfo.picture }} style={styles.avatar} />
          )}
          <Text>שלום, {userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
          <Button title="התנתק" onPress={handleLogout} />
        </View>
      ) : (
        <Button title="התחבר עם חשבון Google" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  profile: { alignItems: 'center', gap: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
});
