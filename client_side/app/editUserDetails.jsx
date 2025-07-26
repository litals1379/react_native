import React, { useCallback,useEffect,useContext, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { UserContext } from './Context/userContextProvider';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {styles} from './Style/editUserDetails'; // Assuming you have a styles file for this component
import { router } from 'expo-router';

export default function EditUserDetailsScreen() {
  const { users, EditUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);

  // שליפת המשתמש מתוך AsyncStorage והשוואה למשתמשים ב-Context
  useEffect(() => {
    const loadUser = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (userId && users.length > 0) {
        const foundUser = users.find((u) => u.id === userId);
        if (foundUser) setUser({ ...foundUser });
      }
    };
    loadUser();
  }, []);

  // Helper function to update child reading level
  const updateChildReadingLevel = (childIndex, increment) => {
    setUser(prevUser => {
      const updatedChildren = [...prevUser.children];
      const currentLevel = updatedChildren[childIndex].readingLevel || 1;
      const newLevel = increment 
        ? Math.min(4, currentLevel + 1) 
        : Math.max(1, currentLevel - 1);
      
      updatedChildren[childIndex] = {
        ...updatedChildren[childIndex],
        readingLevel: newLevel
      };
      
      return {
        ...prevUser,
        children: updatedChildren
      };
    });
  };

  const handleSave = () => {
    if (!user) return;
    EditUser(user);
    router.push({ pathname: '/userProfile' });
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.header}>טוען נתוני משתמש...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>עריכת פרטי משתמש</Text>

      <Text style={styles.label}>שם משתמש</Text>
      <TextInput
        style={styles.input}
        value={user.username}
        onChangeText={(text) => setUser({ ...user, username: text })}
      />

      <Text style={styles.label}>אימייל</Text>
      <TextInput
        style={styles.input}
        value={user.email}
        onChangeText={(text) => setUser({ ...user, email: text })}
      />

      <Text style={styles.section}>👨‍👧‍👦 פרטי הורים</Text>
      {user.parentDetails?.map((parent, index) => (
        <View key={index} style={styles.group}>
          <Text style={styles.label}>שם פרטי</Text>
          <TextInput
            style={styles.input}
            value={parent.firstName}
            onChangeText={(text) => {
              const updated = [...user.parentDetails];
              updated[index].firstName = text;
              setUser({ ...user, parentDetails: updated });
            }}
          />
          <Text style={styles.label}>שם משפחה</Text>
          <TextInput
            style={styles.input}
            value={parent.lastName}
            onChangeText={(text) => {
              const updated = [...user.parentDetails];
              updated[index].lastName = text;
              setUser({ ...user, parentDetails: updated });
            }}
          />
          <Text style={styles.label}>טלפון</Text>
          <TextInput
            style={styles.input}
            value={parent.phoneNumber}
            onChangeText={(text) => {
              const updated = [...user.parentDetails];
              updated[index].phoneNumber = text;
              setUser({ ...user, parentDetails: updated });
            }}
          />
        </View>
      ))}

      <Text style={styles.section}>👶 פרטי ילדים</Text>
      {user.children?.map((child, index) => (
        <View key={index} style={styles.group}>
          <Text style={styles.label}>שם פרטי</Text>
          <TextInput
            style={styles.input}
            value={child.firstName}
            onChangeText={(text) => {
              const updated = [...user.children];
              updated[index].firstName = text;
              setUser({ ...user, children: updated });
            }}
          />
          <Text style={styles.label}>רמת קריאה</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => updateChildReadingLevel(index, false)}
            >
              <Text style={styles.stepperText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.readingLevelText}>
              {child.readingLevel || 1}
            </Text>

            <TouchableOpacity
              style={styles.stepperButton}
              onPress={() => updateChildReadingLevel(index, true)}
            >
              <Text style={styles.stepperText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>תאריך לידה</Text>
          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              value={child.birthdate ? new Date(child.birthdate).toISOString().split('T')[0] : ''}
              onChangeText={(text) => {
                const updated = [...user.children];
                updated[index].birthdate = new Date(text).toISOString();
                setUser({ ...user, children: updated });
              }}
              type="date"
            />
          ) : (
            <>
              <TouchableOpacity
                onPress={() => setShowDatePickerIndex(index)}
                style={[styles.input, { justifyContent: 'center' }]}
              >
                <Text style={styles.inputText}>
                  {child.birthdate
                    ? new Date(child.birthdate).toLocaleDateString('he-IL')
                    : 'בחר תאריך לידה'}
                </Text>
              </TouchableOpacity>

              {showDatePickerIndex === index && (
                <DateTimePicker
                  mode="date"
                  value={child.birthdate ? new Date(child.birthdate) : new Date()}
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      const updated = [...user.children];
                      updated[index].birthdate = selectedDate.toISOString();
                      setUser({ ...user, children: updated });
                    }
                    setShowDatePickerIndex(null);
                  }}
                />
              )}
            </>
          )}
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.btnText}>שמור שינויים</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}