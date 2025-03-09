import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useChildContext } from './childContext';

export default function AddChild() {
    const router = useRouter();
    const { handleAddChild } = useChildContext(); // לקבל את הפונקציה מתוך הקונטקסט
    const [childFirstName, setChildFirstName] = useState('');
    const [childLastName, setChildLastName] = useState('');
    const [childUsername, setChildUsername] = useState('');
    const [childPassword, setChildPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [readingLevel, setReadingLevel] = useState('1');

    const handleAdd = () => {
        handleAddChild({
            firstName: childFirstName,
            lastName: childLastName,
            username: childUsername,
            password: childPassword,
            birthDate,
            readingLevel,
        });
        router.push('/register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>הוספת ילד</Text>
            <Text style={styles.label}>שם פרטי:</Text>
            <TextInput
                placeholder="הזן את שם הילד"
                style={styles.input}
                value={childFirstName}
                onChangeText={setChildFirstName}
            />
            <Text style={styles.label}>שם משפחה:</Text>
            <TextInput
                placeholder="הזן את שם הילד"
                style={styles.input}
                value={childLastName}
                onChangeText={setChildLastName}
            />
            <Text style={styles.label}>שם משתמש:</Text>
            <TextInput
                placeholder="הזן את שם המשתמש"
                style={styles.input}
                value={childUsername}
                onChangeText={setChildUsername}
            />
            <Text style={styles.label}>סיסמה:</Text>
            <TextInput
                placeholder="הזן סיסמה"
                style={styles.input}
                secureTextEntry={true}
                value={childPassword}
                onChangeText={setChildPassword}
            />
            <Text style={styles.label}>תאריך לידה:</Text>
            <TextInput
                placeholder="הזן את תאריך הלידה"
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <Text style={styles.label}>רמת קריאה:</Text>
            <TextInput
                placeholder="הזן רמת קריאה"
                style={styles.input}
                value={readingLevel}
                onChangeText={setReadingLevel}
            />
            <TouchableOpacity style={styles.button} onPress={handleAdd}>
                <Text style={styles.buttonText}>הוסף ילד</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
