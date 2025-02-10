import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function register() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [password, setPassword] = useState('');

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                    
                        {/* כותרת ראשית */}
                        <Text style={styles.title}>הרשמה</Text>

                        {/* שדה שם משתמש */}
                        <Text style={styles.label}>שם משתמש:</Text>
                        <TextInput
                            placeholder="הזן את שם המשתמש"
                            style={styles.input}
                        />

                        {/* שדה סיסמה */}
                        <Text style={styles.label}>סיסמה:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="הזן סיסמה"
                                secureTextEntry={!passwordVisible}
                                style={styles.input}
                                value={password}
                                onChangeText={handlePasswordChange}
                            />
                            <TouchableOpacity
                                onPress={() => {
                                    setPasswordVisible(!passwordVisible);
                                }}
                                style={styles.eyeIconContainer}
                            >
                                <Ionicons
                                    name={passwordVisible ? "eye-off" : "eye"}
                                    size={20}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>

                        {/* שדה שם פרטי */}
                        <Text style={styles.label}>שם פרטי:</Text>
                        <TextInput
                            placeholder="הזן את שם הפרטי"
                            style={styles.input}
                        />

                        {/* שדה שם משפחה */}
                        <Text style={styles.label}>שם משפחה:</Text>
                        <TextInput
                            placeholder="הזן את שם המשפחה"
                            style={styles.input}
                        />

                        {/* שדה כתובת מייל */}
                        <Text style={styles.label}>כתובת מייל:</Text>
                        <TextInput
                            placeholder="הזן את כתובת המייל"
                            style={styles.input}
                            keyboardType="email-address"
                        />

                        {/* כפתור הירשם */}
                        <TouchableOpacity style={styles.button} onPress={() => router.push('./login')}>
                            <Text style={styles.buttonText}>הרשמה</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 60,
        height: 50,
        marginRight: 8,
    },
    logoText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#65558F',
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
        writingDirection: 'rtl',
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        backgroundColor: '#EEE',
        paddingHorizontal: 10,
        paddingRight: 40,
        marginBottom: 20,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 10,
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
