import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // ייבוא אייקונים
import { styles } from '../Style/userCard'; // סגנונות

// קומפוננטה שמציגה משתמש בודד עם פרטי הורים, ילדים וכפתורי פעולה
export default function UserCard({ user, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {/* שם המשתמש */}
      <Text style={styles.title}>{user.username}</Text>

      {/* אימייל (או טקסט ברירת מחדל אם לא קיים) */}
      <Text style={styles.text}>אימייל: {user.email || 'לא צויין'}</Text>

      {/* פרטי הורים */}
      <Text style={styles.section}> פרטי הורים:👨‍👩‍👧</Text>
      {user.parentDetails?.map((parent, index) => (
        <Text key={index} style={styles.text}>
          - {parent.firstName} {parent.lastName}, {parent.phoneNumber}
        </Text>
      ))}

      {/* פרטי ילדים */}
      <Text style={styles.section}>ילדים:👶</Text>
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
