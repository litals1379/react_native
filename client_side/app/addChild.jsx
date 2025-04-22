import React, { useState } from 'react';  
import { Platform, StyleSheet, Text, TextInput, View, TouchableOpacity, ScrollView } from 'react-native';  
import { useRouter } from 'expo-router';  
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';  
import DateTimePicker from '@react-native-community/datetimepicker';
import { styles } from './Style/addChild';  

const addChildApiUrl = 'http://www.storytimetestsitetwo.somee.com/api/User/addChild/'; 

export default function AddChild() {
    const router = useRouter();  
    const [childFirstName, setChildFirstName] = useState('');    
    const [birthDate, setBirthDate] = useState(null);  
    const [readingLevel, setReadingLevel] = useState('1');  
    const [showDatePicker, setShowDatePicker] = useState(false);  
    //validators for the inputs
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        const nameRegex = /^[a-zA-Zא-ת]{1,30}$/; 
        const readingLevelRegex = /^[1-5]$/;   
        const currentDate = new Date();
        if (!childFirstName) {
            newErrors.childFirstName = 'שם פרטי הוא שדה חובה.';  
        } else if (!nameRegex.test(childFirstName)) {
            newErrors.childFirstName = 'שם פרטי לא תקני, חייב להכיל רק אותיות בעברית.';  
        }
        if (!birthDate) {
            newErrors.birthDate = 'תאריך לידה הוא שדה חובה.';  
        } else if (birthDate > currentDate) {
            newErrors.birthDate = 'תאריך לידה לא יכול להיות בעתיד.';  
        } 
        if (!readingLevel) {
            newErrors.readingLevel = 'רמת קריאה היא שדה חובה.';  
        } else if (!readingLevelRegex.test(readingLevel)) {
            newErrors.readingLevel = 'רמת קריאה לא תקנית, חייבת להיות בין 1 ל-5.';  
        }
        setErrors(newErrors);  
        return Object.keys(newErrors).length === 0;  
    };



    const handleAddChild = async () => {
        if (!validate()) return;

        const childData = {
            firstName: childFirstName,
            birthDate: birthDate.toISOString(),  // מוודא שהתאריך יהיה בתצורה נכונה
            readingLevel: readingLevel,  // רמת קריאה
        };
        console.log('Child data:', childData);  // מדפיס את המידע של הילד לקונסולה
        const userEmail = await AsyncStorage.getItem('userEmail');  // משיג את האימייל של המשתמש
        console.log('User email:', userEmail);  // מדפיס את האימייל של המשתמש לקונסולה
        const response = await fetch(addChildApiUrl + userEmail, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(childData),  // שולח את המידע ל-API
        });

        if (response.ok) {
            console.log('Child added:', childData);
            router.push('/(tabs)/userProfile');  // מעביר לעמוד הבא אם ההוספה הצליחה
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
             {errors.childFirstName && <Text style={styles.error}>{errors.childFirstName}</Text>}  
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
             {errors.birthDate && <Text style={styles.error}>{errors.birthDate}</Text>}  

            {/* Reading level input */}
            <Text style={styles.label}>רמת קריאה:</Text>
            <TextInput
                placeholder="הזן רמת קריאה"
                style={styles.input}
                value={readingLevel}
                onChangeText={setReadingLevel}
            />
            {errors.readingLevel && <Text style={styles.error}>{errors.readingLevel}</Text>}  

            {/* Submit button */}
            <TouchableOpacity style={styles.button} onPress={handleAddChild}>
                <Text style={styles.buttonText}>הוסף ילד</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

