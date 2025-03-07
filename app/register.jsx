import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Register() {
    const router = useRouter();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [children, setChildren] = useState([]);

    const handleRegister = async () => {
        const userData = {
            parentDetails: {
                firstName,
                lastName,
                phoneNumber
            },
            email,
            username,
            password,
            children
        };

        try {
            const response = await fetch('https://localhost:7209/api/User/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                router.push('./login');
            } else {
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAddChild = (childData) => {
        setChildren(prevChildren => [...prevChildren, childData]);
        router.push('/register');  // חוזר למסך הרשמה אחרי הוספת הילד
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                        <Text style={styles.title}>הרשמה</Text>
                        {/* פרטי ההורה */}
                        <Text style={styles.label}>שם פרטי:</Text>
                        <TextInput
                            placeholder="הזן את שם הפרטי"
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                        />

                        <Text style={styles.label}>שם משפחה:</Text>
                        <TextInput
                            placeholder="הזן את שם המשפחה"
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                        />

                        <Text style={styles.label}>מספר טלפון:</Text>
                        <TextInput
                            placeholder="הזן את מספר הטלפון"
                            style={styles.input}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />

                        <Text style={styles.label}>כתובת מייל:</Text>
                        <TextInput
                            placeholder="הזן את כתובת המייל"
                            style={styles.input}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Text style={styles.label}>שם משתמש:</Text>
                        <TextInput
                            placeholder="הזן את שם המשתמש"
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                        />

                        <Text style={styles.label}>סיסמה:</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="הזן סיסמה"
                                secureTextEntry={!passwordVisible}
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setPasswordVisible(!passwordVisible)}
                                style={styles.eyeIconContainer}
                            >
                                <Ionicons
                                    name={passwordVisible ? "eye-off" : "eye"}
                                    size={20}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.optionButton} onPress={() => router.push('./addChild')}>
                            <Icon name="user-plus" size={30} color="#333" style={styles.optionIcon} />
                            <Text style={styles.optionText}>הוספת ילד</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
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
    optionButton: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 }, // iOS shadow
        shadowOpacity: 0.2, // iOS shadow
        shadowRadius: 2, // iOS shadow
      },
      optionIcon: {
        marginRight: 10,
      },
      optionText: {
        fontSize: 18,
        color: '#333',
      },
});
