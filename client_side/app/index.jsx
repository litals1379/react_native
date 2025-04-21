import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Audio, Video } from 'expo-av';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Style/index';

WebBrowser.maybeCompleteAuthSession();

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const [imageIndex, setImageIndex] = useState(0);
  const [textIndex, setTextIndex] = useState(0);
  const unicornImages = [
    require('../assets/images/unicorn1.png'),
    require('../assets/images/unicorn2.png'),
    require('../assets/images/unicorn3.png')
  ];
  const texts = ['ללמוד', 'לקרוא', 'להנות!'];
  const [showLogo, setShowLogo] = useState(false);
  const [showMainImage, setShowMainImage] = useState(false);
  const [showStoryTime, setShowStoryTime] = useState(false);
  const video = useRef(null);
  const [status, setStatus] = useState({});

  const WEB_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
  const ANDROID_CLIENT_ID = '261514200770-csdl6nnq4e1bafb1a0is32jtnl3oh7is.apps.googleusercontent.com';
  const IOS_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
  const apiUrlRegister = 'http://www.storytimetestsitetwo.somee.com/api/User/register/';
  const apiUrlLogin = 'http://www.storytimetestsitetwo.somee.com/api/User/GetUserByEmail/';

  const CLIENT_ID = Platform.select({
    ios: IOS_CLIENT_ID,
    android: ANDROID_CLIENT_ID,
    web: WEB_CLIENT_ID,
  });

  const isWeb = Platform.OS === 'web';

  const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: isWeb });

  const discovery = {
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest({
    clientId: CLIENT_ID,
    redirectUri: REDIRECT_URI,
    scopes: ['openid', 'profile', 'email'],
    responseType: 'token',
    usePKCE: false,
  }, discovery);

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
      const res = await fetch(apiUrlLogin + userData.email);
      if (!res.ok) {
        await registerUser(userData);
        return;
      }
      const data = await res.json();
      if (data) {
        await AsyncStorage.setItem('userId', data.id.toString());
        await AsyncStorage.setItem('userEmail', userData.email);
        router.push('/userProfile');
      } else {
        await registerUser(userData);
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      await registerUser(userData);
    }
  };

  const registerUser = async (userData) => {
    console.log('🔑 Registering user:', userData);
    try {
      const res = await fetch(apiUrlRegister, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      console.log('🔑 Registration response:', res);
      loginUser(userData);
    } catch (err) {
      console.error('❌ Registration error:', err);
    }
  };

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await res.json();
      const userData = {
        parentDetails: [{
          firstName: user.given_name,
          lastName: user.family_name,
        }],
        email: user.email,
        profileImage: user.picture,
      };
      await loginUser(userData);
    } catch (err) {
      console.error('❌ Failed fetching user info:', err);
    }
  };

  const handleGoogleLogin = async () => {
    if (isWeb) {
      await promptAsync({ useProxy: true });
    } else {
      try {
        await GoogleSignin.hasPlayServices();
        await GoogleSignin.signOut();
        const result = await GoogleSignin.signIn();
        
        if (result?.data?.user) {
          const userData = {
            username: result.data.user.email.split('@')[0],
            password: Math.random().toString(36).slice(-8),
            parentDetails: [{
              firstName: result.data.user.givenName,
              lastName: result.data.user.familyName,
              phoneNumber: (Math.floor(Math.random() * 1000000000) + 1000000000).toString(),
            }],
            email: result.data.user.email,
            profileImage: result.data.user.photo,
          };

          Alert.alert('התחברות הצליחה', `שלום, ${result.data.user.givenName}`);
          await loginUser(userData);
        } else {
          Alert.alert('שגיאה', 'ההתחברות נכשלה');
        }
      } catch (err) {
        console.error('❌ Native sign-in error:', err);
        Alert.alert('שגיאה', 'שגיאה בהתחברות עם גוגל');
      }
    }
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < unicornImages.length) {
        setImageIndex(index);
        setTextIndex(index);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setShowLogo(true);
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }).start(() => {
            setShowMainImage(true);
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }).start(() => {
              setShowStoryTime(true);
            });
          });
        }, 750);
      }
    }, 750);

    async function playLaugh() {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/kids-laugh.mp3')
      );
      await sound.playAsync();
    }

    playLaugh();

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={require('../assets/videos/background_video.mp4')}
        useNativeControls={false}
        resizeMode="cover"
        isLooping
        shouldPlay
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />

      {!showLogo ? (
        <>
          <Image source={unicornImages[imageIndex]} style={styles.unicornImage} />
          <Text style={styles.title}>{texts[textIndex]}</Text>
        </>
      ) : (
        <Animated.View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          {showStoryTime && <Text style={styles.storyTimeText}>Story Time</Text>}
        </Animated.View>
      )}

      {showMainImage && (
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Image source={require('../assets/images/HomePage.png')} style={styles.image} />
        </Animated.View>
      )}

      {showLogo && (
        <>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
            <Text style={styles.buttonText}>התחבר</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>לא נרשמת? הירשם עכשיו</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
            <Image source={require('../assets/images/google-icon.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>המשך עם Google</Text>
          </TouchableOpacity>

        </>
      )}
    </View>
  );
}
