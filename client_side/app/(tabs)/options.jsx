import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './tabsStyle/options'; // Assuming you have a styles file for this component

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

        {/* <TouchableOpacity style={styles.optionButton}>
          <Icon name="file-text" size={30} style={styles.optionIcon} />
          <Text style={styles.optionText}>הפקת דוחות קריאה</Text>
        </TouchableOpacity> */}

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
          
        <TouchableOpacity style={styles.optionButton}
          onPress={() => router.push('/quiz')}
        >
          {/*אייקון של חידון */ }
          <Icon name="question-circle" size={30} style={styles.optionIcon} />
          <Text style={styles.optionText}>שאלון</Text>
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

