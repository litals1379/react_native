import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const params = useLocalSearchParams();
  const { userId } = params;
  console.log(params);

  // הגדרת ה-API URL בצורה דינמית
  const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/User/GetUserById/${userId}`;

  useEffect(() => {
    // שליפת נתונים מה-API עם fetch
    const fetchUserData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        setUserData(data); // עדכון הנתונים
      } catch (error) {
        console.error("שגיאה בטעינת נתוני המשתמש:", error);
      }
    };

    fetchUserData();
  }, [apiUrl]); // אם ה-API משתנה, נבצע את הקריאה מחדש

  if (!userData) {
    return <Text>טוען...</Text>; // במקרה שהנתונים לא נטענו
  }

  return (
    <View style={styles.container}>
      {/* תמונת פרופיל */}
      <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      
      {/* שם המשתמש */}
      <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
      
      {/* פרטי המשתמש */}
      <View style={styles.infoContainer}>
        <FontAwesome name="envelope" size={20} color="gray" />
        <Text style={styles.email}>{userData.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="map-marker" size={20} color="gray" />
        <Text style={styles.address}>{`${userData.street} ${userData.street_number}, ${userData.city}`}</Text>
      </View>
      <View style={styles.infoContainer}>
        <FontAwesome name="birthday-cake" size={20} color="gray" />
        <Text style={styles.birthDate}>תאריך לידה: {userData.birthDate}</Text>
      </View>

      {/* כפתורים */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <FontAwesome name="edit" size={16} color="white" />
          <Text style={styles.buttonText}> עדכון פרטים</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
          <FontAwesome name="sign-out" size={16} color="white" />
          <Text style={styles.buttonText}> התנתקות</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginLeft: 5,
  },
  address: {
    fontSize: 16,
    marginLeft: 5,
  },
  birthDate: {
    fontSize: 16,
    marginLeft: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 5,
  },
});
