import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function UserCard({ user, onEdit, onDelete }) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{user.username}</Text>
            <Text>אימייל: {user.email || 'לא צויין'}</Text>

            <Text style={styles.section}>👨‍👩‍👧 פרטי הורים:</Text>
            {user.parentDetails?.map((parent, index) => (
                <Text key={index}>- {parent.firstName} {parent.lastName}, {parent.phoneNumber}</Text>
            ))}

            <Text style={styles.section}>👶 ילדים:</Text>
            {user.children?.map((child, index) => (
                <Text key={index}>- {child.firstName}, רמה: {child.readingLevel}</Text>
            ))}

            <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit(user)} style={styles.editBtn}>
                    <Text style={styles.btnText}>ערוך</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(user.id)} style={styles.deleteBtn}>
                    <Text style={styles.btnText}>מחק</Text>
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
    },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 6 },
    section: { marginTop: 8, fontWeight: 'bold' },
    actions: { flexDirection: 'row', marginTop: 10, justifyContent: 'space-between' },
    editBtn: { backgroundColor: '#007bff', padding: 8, borderRadius: 6 },
    deleteBtn: { backgroundColor: '#dc3545', padding: 8, borderRadius: 6 },
    btnText: { color: '#fff', textAlign: 'center' },
});
