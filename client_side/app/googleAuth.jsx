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
// const apiUrlRegister = 'http://www.storytimetestsitetwo.somee.com/api/User/register/';
const apiUrlRegister = 'https://localhost:7209/api/User/register/';
const apiUrlLogin = 'https://localhost:7209/api/User/login/GetUserByEmail/';
//Platform.select בוחרת את הCLIENT_ID המתאים לפי הפלטפורמה
// Android, iOS או Web. זה מאפשר לקוד לפעול בצורה חלקה על כל הפלטפורמות מבלי לשנות את הקוד בכל פעם.
// זה חשוב כי כל פלטפורמה דורשת CLIENT_ID שונה כדי להתחבר לשירותים שלהן.
// לדוגמה, Google דורשת CLIENT_ID שונה לאנדרואיד מאשר ל-iOS או לאינטרנט.
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


  const loginUser = async (userData) => {
    try {
      console.log('🔑 Logging in with email:', userData);
      const res = await fetch(apiUrlLogin + userData.email, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      console.log('✅ User logged in:', data);
      if (data) {
        const userId = data.id;
        router.push({ pathname: '/userProfile' }); // Redirect to home after successful login
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userName', userInfo.name);
      } else {
        console.warn('⚠️ User not found, registering...');
        
      } 
    } catch (err) {
      console.error('❌ Login error:', err);
      // await registerUser(); // Register the user if login fails
    }
  };

  const registerUser = async () => {
    try {
      const res = await fetch(apiUrlRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo),
      });
      const data = await res.json();
      console.log('✅ User registered:', data);
      router.push(pathname = '/addChild'); // Redirect to home after successful registration
    } catch (err) {
      console.error('❌ Registration error:', err);
    }
  }

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log('👤 Web User Info:', user);
      const userData = {
        parentsDetails:[{
          firstName: user.given_name,
          lastName: user.family_name
        }],
        email: user.email,
        profileImage: user.picture,
      };
      setUserInfo(userData);
      await loginUser(userData); // Call loginUser after fetching user info
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

      if (result.data.user) {
        const userData = {
          parentsDetails:[{
            firstName: result.data.user.givenName,
            lastName: result.data.user.familyName}],
          email: result.data.user.email,
          profileImage: result.data.user.photo,
        };
        console.log('✅ Native Sign-In:', userData);
        Alert.alert('התחברות הצליחה', `שלום, ${result.data.user.name}`);
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
