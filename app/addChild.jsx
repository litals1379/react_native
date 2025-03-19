import React, { useState } from 'react';  
import { Platform, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';  
import { useRouter } from 'expo-router';  
import { useChildContext } from './childContext';  
import DateTimePicker from '@react-native-community/datetimepicker';  
import { Ionicons } from '@expo/vector-icons';  

export default function AddChild() {
    const router = useRouter();  
    const { handleAddChild } = useChildContext();  
    const [childFirstName, setChildFirstName] = useState('');    
    const [childUsername, setChildUsername] = useState('');  
    const [childPassword, setChildPassword] = useState('');  
    const [birthDate, setBirthDate] = useState(null);  
    const [readingLevel, setReadingLevel] = useState('1');  
    const [showDatePicker, setShowDatePicker] = useState(false);  

    // פונקציה להוספת ילד
    const handleAdd = () => {
        // בדיקה אם נבחר תאריך לידה
        if (!birthDate) {
            alert("אנא בחר תאריך לידה");
            return;
        }

        // קריאה לפונקציה להוספת ילד מהקונטקסט
        handleAddChild({
            firstName: childFirstName,
            username: childUsername,
            password: childPassword,
            birthDate,
            readingLevel,
        });

        // מעבר למסך הרישום אחרי ההוספה
        router.push('/register');
    };

    // פונקציה לטיפול בבחירת תאריך
    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setBirthDate(selectedDate);  
        }
        setShowDatePicker(false);  
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>הוספת ילד</Text>

            {/* טופס להזנת שם פרטי */}
            <Text style={styles.label}>שם פרטי:</Text>
            <TextInput
                placeholder="הזן את שם הילד"
                style={styles.input}
                value={childFirstName}
                onChangeText={setChildFirstName}  
            />

            {/* טופס להזנת שם משתמש */}
            <Text style={styles.label}>שם משתמש:</Text>
            <TextInput
                placeholder="הזן את שם המשתמש"
                style={styles.input}
                value={childUsername}
                onChangeText={setChildUsername}
            />

            {/* טופס להזנת סיסמה */}
            <Text style={styles.label}>סיסמה:</Text>
            <TextInput
                placeholder="הזן סיסמה"
                style={styles.input}
                secureTextEntry={true}  
                value={childPassword}
                onChangeText={setChildPassword}
            />

            {/* בחירת תאריך לידה */}
            <Text style={styles.label}>תאריך לידה:</Text>

            {/* Input לתאריך עבור פלטפורמת web */}
            {Platform.OS === 'web' ? (
                <input
                    type="date"
                    style={styles.input}
                    value={birthDate ? birthDate.toISOString().split('T')[0] : ''}  
                    onChange={(e) => setBirthDate(new Date(e.target.value))}  
                />
            ) : (
                <>
                    {/* כפתור להצגת בורר תאריך */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Ionicons name="calendar-outline" size={24} color="#65558F" /> 
                        <Text style={styles.buttonText}>
                        {birthDate ? birthDate.toLocaleDateString() : "בחר תאריך"}
                        </Text>
                    </TouchableOpacity>

                    {/* בורר תאריך עבור מכשירים ניידים */}
                    {showDatePicker && (
                        <DateTimePicker
                            value={birthDate || new Date()}  
                            mode="date"  
                            display="default"  
                            onChange={onDateChange}  
                        />
                    )}
                </>
            )}

            {/* טופס להזנת רמת קריאה */}
            <Text style={styles.label}>רמת קריאה:</Text>
            <TextInput
                placeholder="הזן רמת קריאה"
                style={styles.input}
                value={readingLevel}
                onChangeText={setReadingLevel}
            />

            {/* כפתור לשליחת הטופס */}
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>הוסף ילד</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

// סגנונות עבור הרכיבים
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F8F8F8',
        direction: 'rtl',  
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#65558F',
        marginBottom: 20,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        color: '#65558F',
        marginBottom: 5,
        textAlign: 'right',  
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        backgroundColor: '#EEE',
        paddingHorizontal: 10,
        marginBottom: 20,
        textAlign: 'right',  
    },
    dateButton: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#65558F',
        borderRadius: 8,
        backgroundColor: '##EEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',  
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#B3E7F2',
        borderWidth: 1,
        borderColor: '#65558F',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginVertical: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#65558F',
        fontWeight: 'bold',
    },
});
