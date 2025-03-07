import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function AddChild({ route }) {
    const { handleAddChild } = useLocalSearchParams(); // מקבל את הפונקציה מהפרמטרים
    const router = useRouter();
    const [childFirstName, setChildFirstName] = useState('');
    const [childLastName, setChildLastName] = useState('');
    const [childUsername, setChildUsername] = useState('');
    const [childPassword, setChildPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [readingLevel, setReadingLevel] = useState('');
    const [readingHistory, setReadingHistory] = useState([]);

    const handleAdd = () => {
      if (handleAddChild) {
          handleAddChild({
              firstName: childFirstName,
              lastName: childLastName,
              username: childUsername,
              password: childPassword,
              birthDate,
              readingLevel: 1,
              readingHistory: []
          });
      } else {
          console.error("handleAddChild לא הועבר כפרמטר");
      }
  };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>הוספת ילד</Text>
            <Text style={styles.label}>שם פרטי:</Text>
            <TextInput
                placeholder="הזן את שם הילד"
                style={styles.input}
                value={childFirstName}
                onChangeText={setChildFirstName}
            />

            <Text style={styles.label}>שם משפחה:</Text>
            <TextInput
                placeholder="הזן את שם המשפחה"
                style={styles.input}
                value={childLastName}
                onChangeText={setChildLastName}
            />

            <Text style={styles.label}>שם משתמש:</Text>
            <TextInput
                placeholder="הזן את שם המשתמש"
                style={styles.input}
                value={childUsername}
                onChangeText={setChildUsername}
            />

            <Text style={styles.label}>סיסמה:</Text>
            <TextInput
                placeholder="הזן סיסמה"
                secureTextEntry
                style={styles.input}
                value={childPassword}
                onChangeText={setChildPassword}
            />

            <Text style={styles.label}>תאריך לידה:</Text>
            <TextInput
                placeholder="yyyy-mm-dd"
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
            />

            <Text style={styles.label}>רמת קריאה:</Text>
            <TextInput
                placeholder="הזן רמת קריאה"
                style={styles.input}
                value={readingLevel}
                keyboardType="numeric"
                onChangeText={setReadingLevel}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddChild}>
                <Text style={styles.buttonText}>הוסף ילד</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    color: '#65558F', 
    marginBottom: 5,
    marginRight: 10, 
    textAlign: 'right',
    width: '100%', 
    writingDirection: 'rtl',
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
    width: '100%', 
    alignItems: 'center', 
  },
  buttonText: {
    fontSize: 18,
    color: '#65558F', 
    fontWeight: 'bold',
  },
});
