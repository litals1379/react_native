import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
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
  

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const apiUrl = 'http://www.storytimetestsitetwo.somee.com/api/User/login';

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
        router.push({ pathname: '(tabs)/userProfile' });
        await AsyncStorage.setItem('userId', userId.toString());
        await AsyncStorage.setItem('userName', username);
      } else {
        Alert.alert('שגיאה', 'שם משתמש או סיסמה לא נכונים.');
      }
    } catch (error) {
      Alert.alert(
        'שגיאה',
        'הייתה שגיאה בהתחברות, אנא נסה שוב מאוחר יותר.'
      );
    } finally {
      setLoading(false);
    }
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
         <TouchableOpacity style={styles.googleButton} onPress={() => router.push('/googleAuth')}>
            <Image source={require('../assets/images/google-icon.png')} style={styles.googleIcon} />
            <Text style={styles.googleText}>המשך עם Google</Text>
          </TouchableOpacity>

        <Text style={styles.helpText}>שכחתי סיסמה</Text>

        {/* כפתור הרשמה */}
        <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>לא נרשמת? הירשם עכשיו</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8',
    flexDirection: 'column',
    direction: 'rtl',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  form: {
    width: '100%',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#65558F',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    textAlign: 'right',
    writingDirection: 'rtl',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  button: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#65558F',
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  helpText: {
    fontSize: 15,
    color: '#007bff',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 10,
    writingDirection: 'rtl',
  },
  registerContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  registerText: {
    fontSize: 15,
    color: '#007bff',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 10,
    writingDirection: 'rtl',
  },
  registerLink: {
    fontSize: 16,
    color: '#007bff',
    textDecorationLine: 'underline',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AAA',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#555',
  },

  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
});
