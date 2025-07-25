import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Style/login'; // Assuming you have a styles file for this component
import * as AuthSession from 'expo-auth-session';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as WebBrowser from 'expo-web-browser';
import AlertModal from './Components/AlertModal';
import { API_SOMEE_USER_LOGIN, API_SOMEE_USER_REGISTER, API_SOMEE_USER_GET_BY_EMAIL } from './Config/config';


export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalEmoji, setModalEmoji] = useState('');
  const [modalType, setModalType] = useState('success');
  const [shouldNavigate, setShouldNavigate] = useState(false);


  const apiUrl = API_SOMEE_USER_LOGIN;

  const WEB_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
  const ANDROID_CLIENT_ID = '261514200770-csdl6nnq4e1bafb1a0is32jtnl3oh7is.apps.googleusercontent.com';
  const IOS_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
  const apiUrlRegister = API_SOMEE_USER_REGISTER;
  const apiUrlLogin = API_SOMEE_USER_GET_BY_EMAIL;

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
      console.log('🔑 Login response:', data);
      if (data) {
        await AsyncStorage.setItem('userId', data.id.toString());
        await AsyncStorage.setItem('userEmail', userData.email);

        const firstName = data.parentDetails?.[0]?.firstName || userData.username || 'משתמש';

        console.log('🔑 First name:', firstName);
        await handleLoginSuccess(data.id, userData.email, userData.email.split('@')[0], firstName);

        // router.push('/userProfile');
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

          await loginUser(userData);
        } else {
          setModalMessage('ההתחברות נכשלה');
          setModalEmoji('❌');
          setModalType('error');
          setModalVisible(true);
        }
      } catch (err) {
        console.error('❌ Native sign-in error:', err);
        setModalMessage('שגיאה בהתחברות עם גוגל');
        setModalEmoji('❌');
        setModalType('error');
        setModalVisible(true);
      }
    }
  };

  const validate = () => {
    const newErrors = {};
    const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;

    if (!username) {
      newErrors.username = 'שם משתמש הוא שדה חובה.';
    } else if (!usernameRegex.test(username)) {
      newErrors.username =
        'שם משתמש יכול להכיל רק אותיות ומספרים, בין 5 ל-15 תווים.';
    }

    if (!password) {
      newErrors.password = 'סיסמה היא שדה חובה.';
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        'סיסמה חייבת לכלול לפחות 1 אות גדולה, 1 אות קטנה ו-1 מספר, בין 6 ל-12 תווים.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.user) {
        const userId = data.user.id;
        const userEmail = data.user.email;
        const userFirstName = data.user.parentDetails?.[0]?.firstName || 'משתמש';

        handleLoginSuccess(userId, userEmail, data.user.username, userFirstName);
      } else {
        setModalMessage('שם משתמש או סיסמה לא נכונים.');
        setModalEmoji('❌');
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      setModalMessage('הייתה שגיאה בהתחברות, אנא נסה שוב מאוחר יותר.');
      setModalEmoji('❌');
      setModalType('error');
      setModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = async (userId, userEmail, userName, userFirstName) => {
    await AsyncStorage.setItem('userId', userId.toString());
    await AsyncStorage.setItem('userEmail', userEmail);
    await AsyncStorage.setItem('userName', userName);

    setModalMessage(`שלום, ${userFirstName || userName}`);
    setModalEmoji('👋');
    setModalType('success');
    setModalVisible(true);
    setShouldNavigate(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>כניסה</Text>

        <View style={styles.form}>
          <Text style={styles.label}>שם משתמש:</Text>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="#65558F" style={styles.icon} />
            <TextInput
              placeholder="הזן את שם המשתמש"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
            />
          </View>
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

          <Text style={styles.label}>סיסמה:</Text>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#65558F" style={styles.icon} />
            <TextInput
              placeholder="הזן סיסמה"
              secureTextEntry={!passwordVisible}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={24}
                color="#65558F"
              />
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>התחבר</Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#65558F"
            style={styles.loadingIndicator}
          />
        )}
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Image source={require('../assets/images/google-icon.png')} style={styles.googleIcon} />
          <Text style={styles.googleText}>המשך עם Google</Text>
        </TouchableOpacity>

        {/* כפתור הרשמה */}
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>לא נרשמת? הירשם עכשיו</Text>
        </TouchableOpacity>
      </ScrollView>
      <AlertModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false)
          setModalMessage('');
          setModalEmoji('');
          setModalType('success');

          if (shouldNavigate) {
            setShouldNavigate(false);
            router.push('/userProfile');
          }
        }}
        message={modalMessage}
        emoji={modalEmoji}
        type={modalType}
      />
    </KeyboardAvoidingView>
  );
}

