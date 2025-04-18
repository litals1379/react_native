import React, { useState } from 'react';
import {
    Modal, ScrollView, View, Text, TextInput, TouchableOpacity,
    Platform, StyleSheet
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditUserModal({ visible, user, setUser, onClose, onSave }) {
    const [showDatePickerIndex, setShowDatePickerIndex] = useState(null);

    return (
        <Modal visible={visible} animationType="slide">
            <ScrollView style={styles.modalContent}>
                <Text style={styles.header}>עריכת משתמש</Text>

                <TextInput
                    style={styles.input}
                    placeholder="שם משתמש"
                    value={user.username}
                    onChangeText={(text) => setUser({ ...user, username: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="אימייל"
                    value={user.email}
                    onChangeText={(text) => setUser({ ...user, email: text })}
                />

                {/* הורים */}
                <Text style={styles.section}>👨‍👩‍👧 עריכת פרטי הורים:</Text>
                {user.parentDetails?.map((parent, index) => (
                    <View key={index} style={{ marginBottom: 10 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="שם פרטי"
                            value={parent.firstName}
                            onChangeText={(text) => {
                                const updated = [...user.parentDetails];
                                updated[index].firstName = text;
                                setUser({ ...user, parentDetails: updated });
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="שם משפחה"
                            value={parent.lastName}
                            onChangeText={(text) => {
                                const updated = [...user.parentDetails];
                                updated[index].lastName = text;
                                setUser({ ...user, parentDetails: updated });
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="טלפון"
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
                    <View key={index} style={{ marginBottom: 10 }}>
                        <TextInput
                            style={styles.input}
                            placeholder="שם פרטי"
                            value={child.firstName}
                            onChangeText={(text) => {
                                const updated = [...user.children];
                                updated[index].firstName = text;
                                setUser({ ...user, children: updated });
                            }}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="רמת קריאה"
                            keyboardType="numeric"
                            value={child.readingLevel?.toString()}
                            onChangeText={(text) => {
                                const updated = [...user.children];
                                updated[index].readingLevel = parseInt(text) || 0;
                                setUser({ ...user, children: updated });
                            }}
                        />

                        {/* תאריך לידה */}
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

                <View style={styles.actions}>
                    <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                        <Text style={styles.btnText}>ביטול</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
                        <Text style={styles.btnText}>שמור</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContent: { padding: 16, backgroundColor: '#fff' },
    header: { fontSize: 22, textAlign: 'center', marginVertical: 12 },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        marginBottom: 12,
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    section: { marginTop: 8, fontWeight: 'bold' },
    actions: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
    },
    saveBtn: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 6,
        flex: 1,
        marginLeft: 5,
    },
    cancelBtn: {
        backgroundColor: '#6c757d',
        padding: 10,
        borderRadius: 6,
        flex: 1,
        marginRight: 5,
    },
    btnText: { color: '#fff', textAlign: 'center' },
});
