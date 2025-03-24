import React, { useState } from 'react';  
import { Platform, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';  
import { useRouter } from 'expo-router';  
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import DateTimePicker from '@react-native-community/datetimepicker';  

const addChildApiUrl = 'https://localhost:7209/api/User/addChild/'; 

export default function AddChild() {
    const router = useRouter();  
    const [childFirstName, setChildFirstName] = useState('');    
    const [childUsername, setChildUsername] = useState('');  
    const [childPassword, setChildPassword] = useState('');  
    const [birthDate, setBirthDate] = useState(null);  
    const [readingLevel, setReadingLevel] = useState('1');  
    const [showDatePicker, setShowDatePicker] = useState(false);  

    const handleAddChild = async () => {
        const childData = {
            firstName: childFirstName,
            birthDate: birthDate.toISOString(),  // מוודא שהתאריך יהיה בתצורה נכונה
            readingLevel: readingLevel,  // רמת קריאה
        };
        const userEmail = await AsyncStorage.getItem('userEmail');  // משיג את האימייל של המשתמש
        const response = await fetch(addChildApiUrl + userEmail, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(childData),  // שולח את המידע ל-API
        });

        if (response.ok) {
            console.log('Child added:', childData);
            router.push('/login');  // מעביר לעמוד הבא אם ההוספה הצליחה
        } else {
            console.error("Failed to add child");
        }
    };

    const onDateChange = (event, selectedDate) => {
        if (selectedDate) {
            setBirthDate(selectedDate);  
        }
        setShowDatePicker(false);  // נסגר את בורר התאריך אחרי הבחירה
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>הוספת ילד</Text>

            {/* Name input */}
            <Text style={styles.label}>שם פרטי:</Text>
            <TextInput
                placeholder="הזן את שם הילד"
                style={styles.input}
                value={childFirstName}
                onChangeText={setChildFirstName}  
            />
            {/* Birth date picker */}
            <Text style={styles.label}>תאריך לידה:</Text>

            {/* Web date input */}
            {Platform.OS === 'web' ? (
                <input
                    type="date"
                    style={styles.input}
                    value={birthDate ? birthDate.toISOString().split('T')[0] : ''}  // מוודא שהתאריך בפורמט תקני עבור input type="date"
                    onChange={(e) => setBirthDate(new Date(e.target.value))}  // מעדכן את התאריך עבור הדפדפן
                />
            ) : (
                <>
                    {/* Touchable to show date picker for mobile */}
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Ionicons name="calendar-outline" size={24} color="#65558F" /> 
                        <Text style={styles.buttonText}>
                            {birthDate ? birthDate.toLocaleDateString() : "בחר תאריך"}
                        </Text>
                    </TouchableOpacity>

                    {/* Date picker for mobile */}
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

            {/* Reading level input */}
            <Text style={styles.label}>רמת קריאה:</Text>
            <TextInput
                placeholder="הזן רמת קריאה"
                style={styles.input}
                value={readingLevel}
                onChangeText={setReadingLevel}
            />

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={handleAddChild}>
                <Text style={styles.buttonText}>הוסף ילד</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

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
    },
    dateButton: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#65558F',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        flexDirection: 'row',  
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
