import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
// import { registerForPushNotificationsAsync } from '../pushNotifications';
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
    const [errors, setErrors] = useState({});
    // const [expoPushToken, setExpoPushToken] = useState('');
    // const [notification, setNotification] = useState(undefined);
    // const notificationListener = useRef();
    // const responseListener = useRef();

//    useEffect(() => {
//     // רושם את המכשיר לקבלת התראות ומקבל את הטוקן הייחודי של Expo
//     registerForPushNotificationsAsync()
//         .then(token => setExpoPushToken(token ?? '')) // שומר את הטוקן (או מחרוזת ריקה במקרה של שגיאה)
//         .catch(error => setExpoPushToken(`${error}`)); // שומר שגיאה אם יש בעיה בקבלת הטוקן

//     // מאזין לקבלת התראה בזמן אמת ושומר את הנתונים של ההתראה
//     notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//         setNotification(notification);
//     });

//     // מאזין לתגובה של המשתמש על התראה (למשל, אם המשתמש לחץ על ההתראה)
//     responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//         console.log(response); // מדפיס את התגובה של המשתמש לקונסול
//     });

//     // פונקציה שמנקה את המאזינים כאשר הקומפוננטה יוצאת מהזיכרון
//     return () => {
//         notificationListener.current && Notifications.removeNotificationSubscription(notificationListener.current);
//         responseListener.current && Notifications.removeNotificationSubscription(responseListener.current);
//     };
//     }, []); // [] אומר שהאפקט ירוץ רק פעם אחת כשהקומפוננטה נטענת


    const validate = () => {
        const newErrors = {};

        const nameRegex = /^[א-ת]{2,30}$/;  // for names (first name, last name in Hebrew)
        const phoneRegex = /^[0-9]{10}$/;  // for phone number (assuming 10 digits)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/;  // for email (basic)
        const usernameRegex = /^[a-zA-Z0-9]{5,15}$/;  // for username (alphanumeric, 5-15 chars)
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/;  // for password (6-12 chars with at least 1 number, 1 uppercase, and 1 lowercase)

        if (!firstName) {
            newErrors.firstName = 'שם פרטי הוא שדה חובה.';
        } else if (!nameRegex.test(firstName)) {
            newErrors.firstName = 'שם פרטי לא תקני.';
        }

        if (!lastName) {
            newErrors.lastName = 'שם משפחה הוא שדה חובה.';
        } else if (!nameRegex.test(lastName)) {
            newErrors.lastName = 'שם משפחה לא תקני.';
        }

        if (!phoneNumber) {
            newErrors.phoneNumber = 'מספר טלפון הוא שדה חובה.';
        } else if (!phoneRegex.test(phoneNumber)) {
            newErrors.phoneNumber = 'מספר טלפון לא תקני.';
        }

        if (!email) {
            newErrors.email = 'כתובת מייל היא שדה חובה.';
        } else if (!emailRegex.test(email)) {
            newErrors.email = 'כתובת מייל לא תקינה.';
        }

        if (!username) {
            newErrors.username = 'שם משתמש הוא שדה חובה.';
        } else if (!usernameRegex.test(username)) {
            newErrors.username = 'שם משתמש יכול להכיל רק אותיות ומספרים, בין 5 ל-15 תווים.';
        }

        if (!password) {
            newErrors.password = 'סיסמה היא שדה חובה.';
        } else if (!passwordRegex.test(password)) {
            newErrors.password = 'סיסמה חייבת לכלול לפחות 1 אות גדולה, 1 אות קטנה ו-1 מספר, בין 6 ל-12 תווים.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;  // return true if no errors
    };

    

    const handleRegister = async () => {
        if (!validate()) return;

        const apiUrl = 'http://www.storytimetestsitetwo.somee.com/api/User/register/'; 

        const userData = {
            parentDetails: [
                {
                    firstName,
                    lastName,
                    phoneNumber
                }
            ],
            email,
            username,
            password,
            children: [],
            // expoPushToken, // הוספת האסימון
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log(userData.email);
                console.log("Registration successful");
                await AsyncStorage.setItem('userEmail', userData.email);
                // שליחת הודעת Push לאחר ההרשמה
                // sendPushNotification(expoPushToken);
                router.push('./addChild');
            } else {
                console.error("Registration failed");
            }
        } catch (error) {
            console.error("Network request failed:", error);
        }
    };

    // פונקציה לשליחת הודעת Push
    // const sendPushNotification = async (expoPushToken) => {
    //     // יצירת הודעת הפוש שכוללת:
    //     // - הטוקן של המכשיר שאליו תישלח ההתראה
    //     // - צליל ברירת מחדל
    //     // - כותרת וגוף ההודעה
    //     // - נתונים נוספים שניתן לשלוח עם ההתראה
    //     const message = {
    //         to: expoPushToken, // טוקן המכשיר שאליו תישלח ההתראה
    //         sound: 'default', // השמעת צליל ברירת מחדל בעת קבלת ההתראה
    //         title: 'הרשמה הצליחה!', // כותרת ההודעה
    //         body: 'המשתמש נרשם בהצלחה למערכת.', // גוף ההודעה
    //         data: { extraData: 'some data' }, // נתונים נוספים שניתן להעביר עם ההתראה
    //     };
    
    //     try {
    //         // שליחת בקשה לשרת של Expo כדי לשלוח את ההתראה
    //         const response = await fetch('https://exp.host/--/api/v2/push/send', {
    //             method: 'POST', // שליחת הנתונים בשיטת POST
    //             headers: {
    //                 'Content-Type': 'application/json', // ציון סוג התוכן כ-JSON
    //             },
    //             body: JSON.stringify(message), // המרת האובייקט JSON למחרוזת כדי לשלוח אותו בבקשה
    //         });
    
    //         // קבלת התגובה מהשרת ופענוח הנתונים שלה
    //         const responseData = await response.json();
    //         console.log('Push Notification response:', responseData); // הדפסת התגובה בקונסול
    //     } catch (error) {
    //         // טיפול בשגיאות במידה ושליחת ההתראה נכשלת
    //         console.error('Error sending push notification:', error);
    //     }
    // };
    

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.container}>
                        <Text style={styles.title}>הרשמה</Text>
                        
                        {/* First name */}
                        <Text style={styles.label}>שם פרטי:</Text>
                        <TextInput
                            placeholder="הזן את שם הפרטי"
                            style={styles.input}
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                        {/* Last name */}
                        <Text style={styles.label}>שם משפחה:</Text>
                        <TextInput
                            placeholder="הזן את שם המשפחה"
                            style={styles.input}
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

                        {/* Phone number */}
                        <Text style={styles.label}>מספר טלפון:</Text>
                        <TextInput
                            placeholder="הזן את מספר הטלפון"
                            style={styles.input}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                        />
                        {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

                        {/* Email */}
                        <Text style={styles.label}>כתובת מייל:</Text>
                        <TextInput
                            placeholder="הזן את כתובת המייל"
                            style={styles.input}
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />
                        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        {/* Username */}
                        <Text style={styles.label}>שם משתמש:</Text>
                        <TextInput
                            placeholder="הזן את שם המשתמש"
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                        />
                        {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

                        {/* Password */}
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
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        {errors.passwordMatch && <Text style={styles.errorText}>{errors.passwordMatch}</Text>}

                        {errors.children && <Text style={styles.errorText}>{errors.children}</Text>}

                        <TouchableOpacity style={styles.button} onPress={handleRegister}>
                            <Text style={styles.buttonText}>הרשמה</Text>
                            {/* {notification && <Text>📢 התקבלה התראה: {notification.request.content.body}</Text>} */}
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
    passwordContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    eyeIconContainer: {
        position: 'absolute',
        left: 10,
        top: 10,
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    optionIcon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        color: '#333',
    },
});
