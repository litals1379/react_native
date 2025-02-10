import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Image } from 'react-native';

export default function addChild() {
  return (
    <View style={styles.container}>
      {/* לוגו עם כותרת */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>Story Time</Text>
      </View>

      {/* כותרת ראשית */}
      <Text style={styles.title}>הוספת ילד</Text>

     {/* שדה שם פרטי */}
      <Text style={styles.label}>שם פרטי:</Text>
      <TextInput
        placeholder="הזן את שם הפרטי"
        style={styles.input}
      />
      {/* שדה שם משתמש */}
      <Text style={styles.label}>שם משתמש:</Text>
      <TextInput
        placeholder="הזן את שם המשתמש"
        style={styles.input}
      />
      {/* שדה סיסמה */}
      <Text style={styles.label}>סיסמה:</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="הזן סיסמה"
          secureTextEntry
          style={styles.input}
        />
      </View>
      {/* Birthdate input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>תאריך לידה:</Text>
        <TextInput
          placeholder="dd/mm/yyyy"
          style={styles.input}
        />
      </View>
      {/* כפתור הירשם */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>הוסף</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F8F8', // Light gray background
    direction: 'rtl', 
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 50,
    marginRight: 8,
  },
  logoText: {
    fontSize: 16, // Slightly larger logo text
    fontWeight: 'bold',
    color: '#65558F', // Purple color
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#65558F', // Purple color
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start', // Align labels to the right
    fontSize: 16,
    color: '#65558F', // Purple color
    marginBottom: 5,
    marginRight: 10, // Add some space between label and input
    textAlign: 'right',
    width: '100%', // Make sure labels take full width
    writingDirection: 'rtl',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    backgroundColor: '#EEE', // Light gray background for inputs
    paddingHorizontal: 10,
    marginBottom: 20,
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#B3E7F2', // Light blue button
    borderWidth: 1,
    borderColor: '#65558F', // Purple border
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
    width: '100%', // Make button full width
    alignItems: 'center', // Center text horizontally in button
  },
  buttonText: {
    fontSize: 18,
    color: '#65558F', // Purple text
    fontWeight: 'bold',
  },
});