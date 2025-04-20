import React, { useState } from 'react';
import {
  Modal, ScrollView, View, Text, TextInput, TouchableOpacity,
  Platform, StyleSheet
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditUserModal({ visible, user, setUser, onClose, onSave }) {
  const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.modalContent}>
          <Text style={styles.header}>עריכת משתמש</Text>

          {/* שדות כלליים */}
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

          {/* הורים */}
          <Text style={styles.section}>👨‍👩‍👧 עריכת פרטי הורים:</Text>
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

          {/* ילדים */}
          <Text style={styles.section}>👶 עריכת פרטי ילדים:</Text>
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
                  value={
                    child.birthdate
                      ? new Date(child.birthdate).toISOString().split('T')[0]
                      : ''
                  }
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

          {/* כפתורים */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.btnText}>ביטול</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
              <Text style={styles.btnText}>שמור</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
    textAlign: 'center',
    writingDirection: 'rtl',
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
  actions: {
    flexDirection: 'row-reverse',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  saveBtn: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  cancelBtn: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  btnText: {
    fontSize: 18,
    color: '#65558F',
    fontWeight: 'bold',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
});
