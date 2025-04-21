// // useGoogleAuth.js
// import { useEffect, useState } from 'react';
// import { Platform, Alert } from 'react-native';
// import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useRouter } from 'expo-router';

// WebBrowser.maybeCompleteAuthSession();

// const WEB_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
// const ANDROID_CLIENT_ID = '261514200770-csdl6nnq4e1bafb1a0is32jtnl3oh7is.apps.googleusercontent.com';
// const IOS_CLIENT_ID = '261514200770-9td180ig5jk8sdetoqllfe1lt6r95pni.apps.googleusercontent.com';
// const apiUrlRegister = 'http://www.storytimetestsitetwo.somee.com/api/User/register/';
// const apiUrlLogin = 'http://www.storytimetestsitetwo.somee.com/api/User/GetUserByEmail/';

// const CLIENT_ID = Platform.select({
//   ios: IOS_CLIENT_ID,
//   android: ANDROID_CLIENT_ID,
//   web: WEB_CLIENT_ID,
// });

// const isWeb = Platform.OS === 'web';

// const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: isWeb });

// const discovery = {
//   authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
//   tokenEndpoint: 'https://oauth2.googleapis.com/token',
//   revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
// };

//   const router = useRouter();
//   const [request, response, promptAsync] = AuthSession.useAuthRequest({
//     clientId: CLIENT_ID,
//     redirectUri: REDIRECT_URI,
//     scopes: ['openid', 'profile', 'email'],
//     responseType: 'token',
//     usePKCE: false,
//   }, discovery);

//   useEffect(() => {
//     if (!isWeb) {
//       GoogleSignin.configure({
//         webClientId: WEB_CLIENT_ID,
//         offlineAccess: true,
//         scopes: ['email', 'profile', 'openid'],
//       });
//     }
//   }, []);

//   useEffect(() => {
//     if (isWeb && response?.type === 'success') {
//       const token = response.params.access_token;
//       fetchUserInfo(token);
//     }
//   }, [response]);

//   const loginUser = async (userData) => {
//     try {
//       const res = await fetch(apiUrlLogin + userData.email);
//       if (!res.ok) {
//         await registerUser(userData);
//         return;
//       }
//       const data = await res.json();
//       if (data) {
//         await AsyncStorage.setItem('userId', data.id.toString());
//         router.push('/userProfile');
//       } else {
//         await registerUser(userData);
//       }
//     } catch (err) {
//       console.error('❌ Login error:', err);
//       await registerUser(userData);
//     }
//   };

//   const registerUser = async (userData) => {
//     try {
//       const res = await fetch(apiUrlRegister, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       const data = await res.json();
//       await AsyncStorage.setItem('userEmail', userData.email);
//       router.push('/addChild');
//     } catch (err) {
//       console.error('❌ Registration error:', err);
//     }
//   };

//   const fetchUserInfo = async (token) => {
//     try {
//       const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const user = await res.json();
//       const userData = {
//         parentDetails: [{
//           firstName: user.given_name,
//           lastName: user.family_name,
//         }],
//         email: user.email,
//         profileImage: user.picture,
//       };
//       await loginUser(userData);
//     } catch (err) {
//       console.error('❌ Failed fetching user info:', err);
//     }
//   };

//   const signInWithGoogle = async () => {
//     if (isWeb) {
//       await GoogleSignin.signOut(); // רק למקרה
//       promptAsync({ useProxy: true });
//     } else {
//       try {
//         await GoogleSignin.hasPlayServices();
//         await GoogleSignin.signOut();
//         const result = await GoogleSignin.signIn();
//         if (result?.user) {
//           const userData = {
//             username: result.user.email.split('@')[0],
//             password: Math.random().toString(36).slice(-8),
//             parentDetails: [{
//               firstName: result.user.givenName,
//               lastName: result.user.familyName,
//               phoneNumber: (Math.floor(Math.random() * 1000000000) + 1000000000).toString(),
//             }],
//             email: result.user.email,
//             profileImage: result.user.photo,
//           };
//           Alert.alert('התחברות הצליחה', `שלום, ${result.user.name}`);
//           await loginUser(userData);
//         } else {
//           Alert.alert('שגיאה', 'ההתחברות נכשלה');
//         }
//       } catch (err) {
//         console.error('❌ Native sign-in error:', err);
//         Alert.alert('שגיאה', 'שגיאה בהתחברות עם גוגל');
//       }
//     }
//   };

//   return { signInWithGoogle };
// };
