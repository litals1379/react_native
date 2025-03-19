import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = 'https://localhost:7209/api/User/login'; 

  const usernameRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Email format validation
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password must be at least 8 characters, with at least one letter, one number, and one special character.

  const handleSubmit = async () => {
    if (username && password) {
      // Validate username with regex (email format)
      if (!usernameRegex.test(username)) {
        Alert.alert('שגיאה', 'הזן כתובת אימייל תקנית.');
        return;
      }

      // Validate password with regex (minimum 8 chars, 1 letter, 1 number, 1 special char)
      if (!passwordRegex.test(password)) {
        Alert.alert('שגיאה', 'הסיסמה חייבת לכלול לפחות 8 תווים, אותיות, מספרים, ותו מיוחד.');
        return;
      }

      setLoading(true);
      try {
        console.log("Trying to login with:", username, password);
  
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
  
        console.log("Response status:", response.status);
  
        const data = await response.json();
        console.log("Response data:", data);
  
        if (data.user) {
          router.push(`./userProfile/${data.user.userId}`);
        } else {
          Alert.alert('שגיאה', 'שם משתמש או סיסמה לא נכונים.');
        }
      } catch (error) {
        console.log("Login error:", error);
        Alert.alert('שגיאה', 'הייתה שגיאה בהתחברות, אנא נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות.');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>כניסה</Text>

        <View style={styles.form}>
          <Text style={styles.label}>שם משתמש:</Text>
          <TextInput
            placeholder="הזן את שם המשתמש"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>סיסמה:</Text>
          <TextInput
            placeholder="הזן סיסמה"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.buttonText}>התחבר</Text>
        </TouchableOpacity>

        <Text style={styles.helpText}>שכחתי סיסמה</Text>
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
    direction: 'rtl',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
  },
  form: {
    width: '100%',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#65558F',
    marginBottom: 5,
    textAlign: 'right',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#EEE',
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'right',
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
  },
  helpText: {
    fontSize: 14,
    color: '#65558F',
    textDecorationLine: 'underline',
  },
});
