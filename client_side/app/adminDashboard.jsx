import React, { useContext, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal,
  TextInput, StyleSheet, ScrollView,Platform
} from 'react-native';
import { UserContext } from './Context/userContextProvider'; // נניח שפה מאוחסן הסטייט
import DateTimePicker from '@react-native-community/datetimepicker';  


export default function AdminDashboard() {
  const { users, DeleteUser, EditUser } = useContext(UserContext);
  const [editingUser, setEditingUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState({});
  const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);
  console.log(users);

  const handleEdit = (user) => {
    console.log(user);
    setEditingUser(user);
    setUpdatedUserData({
      ...user,
      ParentDetails: user.parentDetails || [],
      Children: user.children || [],
    });
  };

  const handleSave = () => {
    EditUser(updatedUserData);
    setEditingUser(null);
  };

  const renderUser = ({ item }) => {
    // if (item.username?.toLowerCase() === 'admin') return null;

    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.username}</Text>
        <Text>אימייל: {item.email || 'לא צויין'}</Text>

        <Text style={styles.section}>👨‍👩‍👧 פרטי הורים:</Text>
        {item.parentDetails?.map((parent, index) => (
          <Text key={index}>- {parent.firstName} {parent.lastName}, {parent.phoneNumber}</Text>
        ))}

        <Text style={styles.section}>👶 ילדים:</Text>
        {item.children?.map((child, index) => (
          <Text key={index}>- {child.firstName}, רמה: {child.readingLevel}</Text>
        ))}

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
            <Text style={styles.btnText}>ערוך</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => DeleteUser(item.id)} style={styles.deleteBtn}>
            <Text style={styles.btnText}>מחק</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>משתמשים רשומים</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        ListEmptyComponent={<Text>לא נמצאו משתמשים</Text>}
      />

      {/* טופס עריכה */}
      <Modal visible={!!editingUser} animationType="slide">
        <ScrollView style={styles.modalContent}>
          <Text style={styles.header}>עריכת משתמש</Text>
          <TextInput
            style={styles.input}
            placeholder="שם משתמש"
            value={updatedUserData.username}
            onChangeText={(text) => setUpdatedUserData({ ...updatedUserData, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="אימייל"
            value={updatedUserData.email}
            onChangeText={(text) => setUpdatedUserData({ ...updatedUserData, email: text })}
          />
          <Text style={styles.section}>👨‍👩‍👧 עריכת פרטי הורים:</Text>
          {updatedUserData.ParentDetails?.map((parent, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <TextInput
                style={styles.input}
                placeholder="שם פרטי"
                value={parent.firstName}
                onChangeText={(text) => {
                  const updated = [...updatedUserData.ParentDetails];
                  updated[index].firstName = text;
                  setUpdatedUserData({ ...updatedUserData, ParentDetails: updated });
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="שם משפחה"
                value={parent.lastName}
                onChangeText={(text) => {
                  const updated = [...updatedUserData.ParentDetails];
                  updated[index].lastName = text;
                  setUpdatedUserData({ ...updatedUserData, ParentDetails: updated });
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="טלפון"
                value={parent.phoneNumber}
                onChangeText={(text) => {
                  const updated = [...updatedUserData.ParentDetails];
                  updated[index].phoneNumber = text;
                  setUpdatedUserData({ ...updatedUserData, ParentDetails: updated });
                }}
              />
            </View>
          ))}

          <Text style={styles.section}>👶 עריכת פרטי ילדים:</Text>
          {updatedUserData.Children?.map((child, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
            <TextInput
              style={styles.input}
              placeholder="שם פרטי"
              value={child.firstName}
              onChangeText={(text) => {
                const updated = [...updatedUserData.Children];
                updated[index].firstName = text;
                setUpdatedUserData({ ...updatedUserData, Children: updated });
              }}
            />
            <TextInput
              style={styles.input}
              placeholder="רמת קריאה"
              keyboardType="numeric"
              value={child.readingLevel?.toString()}
              onChangeText={(text) => {
                const updated = [...updatedUserData.Children];
                updated[index].readingLevel = parseInt(text) || 0;
                setUpdatedUserData({ ...updatedUserData, Children: updated });
              }}
            />
          
            {/* תאריך לידה - מותאם למובייל ו-Web */}
            {Platform.OS === 'web' ? (
              <TextInput
                style={styles.input}
                placeholder="תאריך לידה"
                value={
                  child.birthdate
                    ? new Date(child.birthdate).toISOString().split('T')[0]
                    : ''
                }
                onChangeText={(text) => {
                  const updated = [...updatedUserData.Children];
                  updated[index].birthdate = new Date(text).toISOString();
                  setUpdatedUserData({ ...updatedUserData, Children: updated });
                }}
                keyboardType="default"
                type="date" // רק ב-Web עובד
              />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => setShowDatePickerIndex(index)}
                  style={[styles.input, { justifyContent: 'center' }]}
                >
                  <Text>
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
                        const updated = [...updatedUserData.Children];
                        updated[index].birthdate = selectedDate.toISOString();
                        setUpdatedUserData({ ...updatedUserData, Children: updated });
                      }
                      setShowDatePickerIndex(null);
                    }}
                  />
                )}
              </>
            )}
          </View>
          
          
          ))}


          <View style={styles.actions}>
            <TouchableOpacity onPress={() => setEditingUser(null)} style={styles.cancelBtn}>
              <Text style={styles.btnText}>ביטול</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
              <Text style={styles.btnText}>שמור</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  section: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  editBtn: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: '#dc3545',
    padding: 8,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 6,
    marginTop: 20,
    flex: 1,
    marginLeft: 5,
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    padding: 10,
    borderRadius: 6,
    marginTop: 20,
    flex: 1,
    marginRight: 5,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContent: {
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
});
