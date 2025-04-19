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

  const handleSave = () => {
    if (!user) return;
    EditUser(user);
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
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={child.readingLevel?.toString()}
            onChangeText={(text) => {
              const updated = [...user.children];
              updated[index].readingLevel = parseInt(text) || 0;
              setUser({ ...user, children: updated });
            }}
          />

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

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    textAlign: 'right',
    marginVertical: 12,
  },
  section: {
    marginTop: 16,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'right',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
    textAlign: 'right',
  },
  inputText: {
    textAlign: 'right',
  },
  group: {
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 6,
    marginTop: 24,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
