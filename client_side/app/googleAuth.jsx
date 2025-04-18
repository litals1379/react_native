import React, { useEffect, useState } from 'react';
import { Text, View, Button, StyleSheet, ActivityIndicator, Platform } from 'react-native';
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
  native: 'myapp://redirect',
  useProxy: false,
});

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export default function GoogleAuthScreen() {
  const router = useRouter();
  const [authCode, setAuthCode] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📲 Mobile: configure Google Sign-In once
  useEffect(() => {
    if (!isWeb) {
      GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  // 🌐 Web Auth Request
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    isWeb
      ? {
          clientId: CLIENT_ID,
          redirectUri: REDIRECT_URI,
          scopes: ['openid', 'profile', 'email'],
          responseType: 'token',
          usePKCE: false,
        }
      : null,
    discovery
  );

  // 🌐 Web: handle token response
  useEffect(() => {
    if (isWeb && response?.type === 'success') {
      const token = response.params.access_token;
      fetchUserInfo(token);
    }
  }, [response]);

  // 📱 Mobile: exchange auth code (if needed – not used here)
  useEffect(() => {
    if (!authCode || isWeb || !request) return;

    const getToken = async () => {
      try {
        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId: CLIENT_ID,
            code: authCode,
            redirectUri: REDIRECT_URI,
            extraParams: {
              code_verifier: request.codeVerifier,
            },
          },
          discovery
        );

        console.log('✅ Access Token:', tokenResult.accessToken);
        fetchUserInfo(tokenResult.accessToken);
      } catch (err) {
        console.error('❌ Error exchanging code:', err);
      }
    };

    getToken();
  }, [authCode]);

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      console.log('👤 User Info:', user);
      setUserInfo(user);
      router.replace('/tabs/userProfile');
    } catch (err) {
      console.error('❌ Failed fetching user info:', err);
    }
  };

  const signInWithGoogleNative = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();

      if (result?.user) {
        const userData = {
          name: result.user.name,
          email: result.user.email,
          picture: result.user.photo,
        };
        console.log('✅ Native Sign-In:', userData);
        setUserInfo(userData);
        router.replace('/tabs/userProfile');
      } else {
        console.warn('⚠️ Native sign-in cancelled or failed');
      }
    } catch (err) {
      console.error('❌ Native sign-in error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (isWeb) {
      promptAsync({ useProxy: true });
    } else {
      signInWithGoogleNative();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התחברות עם Google</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="התחבר עם חשבון Google" onPress={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
