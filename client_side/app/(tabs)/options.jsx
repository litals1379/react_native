import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Options() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  // שליפת שם משתמש מה-AsyncStorage
  useEffect(() => {
    const getUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      setUserName(storedName);
    };
    getUserName();
  }, []);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header} />
        <Text style={styles.title}>אפשרויות</Text>

        <TouchableOpacity style={styles.optionButton}>
          <Icon name="file-text" size={30} style={styles.optionIcon} />
          <Text style={styles.optionText}>הפקת דוחות קריאה</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push('/addChild')}
        >
          <Icon name="user-plus" size={30} style={styles.optionIcon} />
          <Text style={styles.optionText}>הוספת ילד</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}
          onPress={() => router.push('/editUserDetails')}
        >
          <Icon name="edit" size={30} style={styles.optionIcon} />
          <Text style={styles.optionText}>עריכת פרטים</Text>
        </TouchableOpacity>

        {/* הצג את כפתור המנהל רק אם המשתמש הוא admin */}
        {userName === 'admin' && (
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push('/adminDashboard')}
          >
            <Icon name="user-secret" size={30} style={styles.optionIcon} />
            <Text style={styles.optionText}>מסך מנהל</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: 'rtl', // RTL
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#65558F',
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row-reverse', // RTL
    alignItems: 'center',
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  optionIcon: {
    marginLeft: 10,
    color: '#65558F',
  },
  optionText: {
    fontSize: 18,
    color: '#65558F',
    textAlign: 'right',
    flex: 1,
  },
});
