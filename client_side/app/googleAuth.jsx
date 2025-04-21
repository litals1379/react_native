import React, { useEffect, useState } from 'react';
import { Text, View, Button, ActivityIndicator, Platform, Image, Alert, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Style/googleAuth'; 

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '261514200770-csdl6nnq4e1bafb1a0is32jtnl3oh7is.apps.googleusercontent.com';
const IOS_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
const apiUrlRegister = 'http://www.storytimetestsitetwo.somee.com/api/User/register/';
const apiUrlLogin = 'http://www.storytimetestsitetwo.somee.com/api/User/GetUserByEmail/';
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
      if (!res.ok) {
        console.log('❌ Failed to fetch user data:', res.statusText);
        await registerUser(userData);
        return;
      }
      const data = await res.json();
      console.log('✅ User logged in:', data);
      if (data) {
        const userId = data.id;
        router.push({ pathname: '/userProfile' }); // Redirect to home after successful login
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userEmail', userData.email);
        // await AsyncStorage.setItem('userName', userInfo.name);
      } else {
        console.warn('⚠️ User not found, registering...');
        
      } 
    } catch (err) {
      console.error('❌ Login error:', err);
      await registerUser(userData); // Register the user if login fails
    }
  };

  const registerUser = async (userData) => {
    try {
      const res = await fetch(apiUrlRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      console.log('✅ User registered:', data);
      await AsyncStorage.setItem('userEmail', userData.email);
      router.push('/addChild'); // Redirect to home after successful registration
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
        parentDetails:[{
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
        console.log('👤 Native User Info:', result.data.user);
        const userData = {
          username: result.data.user.email.split('@')[0],
          // add special characters to the password uppercase, lowercase, numbers and special characters
          password: Math.random().toString(36).slice(-8),
          parentDetails:[{
            firstName: result.data.user.givenName,
            lastName: result.data.user.familyName,
            phoneNumber: (Math.floor(Math.random() * 1000000000) + 1000000000).toString(),
          }],
          email: result.data.user.email,
          profileImage: result.data.user.photo,
        };
        console.log('✅ Native Sign-In:', userData);
        Alert.alert('התחברות הצליחה', `שלום, ${result.data.user.name}`);
        loginUser(userData); // Call loginUser after fetching user info
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
      <TouchableOpacity style={styles.googleButton} onPress={handleLogin}>
        <Image
          source={require('../assets/images/google-icon.png')} 
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>התחבר עם חשבון Google</Text>
      </TouchableOpacity>
      )}
    </View>
  );
}


