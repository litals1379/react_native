import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // ייבוא אייקונים

// קומפוננטה שמציגה משתמש בודד עם פרטי הורים, ילדים וכפתורי פעולה
export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {/* שם המשתמש */}
      <Text style={styles.title}>{user.username}</Text>

      {/* אימייל (או טקסט ברירת מחדל אם לא קיים) */}
      <Text style={styles.text}>אימייל: {user.email || 'לא צויין'}</Text>

      {/* פרטי הורים */}
      <Text style={styles.section}>👨‍👩‍👧 פרטי הורים:</Text>
      {user.parentDetails?.map((parent, index) => (
        <Text key={index} style={styles.text}>
          - {parent.firstName} {parent.lastName}, {parent.phoneNumber}
        </Text>
      ))}

      {/* פרטי ילדים */}
      <Text style={styles.section}>👶 ילדים:</Text>
      {user.children?.map((child, index) => (
        <Text key={index} style={styles.text}>
          - {child.firstName}, רמה: {child.readingLevel}
        </Text>
      ))}

      {/* כפתורי פעולה */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(user)} style={styles.actionBtn}>
          <Icon name="edit" size={20} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(user.id)} style={styles.actionBtn}>
          <Icon name="trash" size={20} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    direction: 'rtl', // עיצוב RTL כללי
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#65558F',
    textAlign: 'right',
  },
  section: {
    marginTop: 8,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  text: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  actions: {
    flexDirection: 'row-reverse', // RTL: אייקונים בצד ימין
    marginTop: 10,
    justifyContent: 'flex-start',
    gap: 10,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
  },
});
