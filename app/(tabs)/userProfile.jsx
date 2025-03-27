import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams , useRouter  } from 'expo-router';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null); 
  const params = useLocalSearchParams();
  const { userId } = params;
  const router = useRouter(); 
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

  const handleChildSelection = (childId) => {
    setSelectedChildId(childId);
    router.push({ pathname: "/library", params: { childId: childId } }); // ניווט עם childId
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* תמונת פרופיל */}
        <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />

        {/* שם המשתמש */}
        <View style={styles.infoContainer}>
          <Text style={styles.name}>שם משתמש:{userData.username}</Text>
        </View>

        {/* פרטי המשתמש */}
        <View style={styles.infoContainer}>
          <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
          <Text style={styles.email}>אימייל:{userData.email}</Text>
        </View>

        {/* פרטי הורים */}
        {userData.parentDetails && userData.parentDetails.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>פרטי הורים:</Text>
            {userData.parentDetails.map((parent, index) => (
              <View key={index} style={styles.parentContainer}>
                <View style={styles.parentInfoRow}>
                  <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
                  <Text>שם מלא:{parent.firstName} {parent.lastName}</Text>
                </View>
                <View style={styles.parentInfoRow}>
                  <FontAwesome name="phone" size={20} color="gray" style={styles.icon} />
                  <Text>טלפון: {parent.phoneNumber}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* רשימת ילדים */}
       {userData.children && userData.children.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ילדים:</Text>
            {userData.children.map((child, index) => (
              <TouchableOpacity
                key={index}
                style={styles.childContainer}
                onPress={() => handleChildSelection(child.id)} // טיפול בבחירה
              >
                <View style={styles.childInfoRow}>
                  <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
                  <Text>שם: {child.firstName} {child.lastName}</Text>
                </View>
                <View style={styles.childInfoRow}>
                  <FontAwesome name="birthday-cake" size={20} color="gray" style={styles.icon} />
                  <Text>תאריך לידה: {child.birthdate}</Text>
                </View>
                {child.readingLevel && (
                  <View style={styles.childInfoRow}>
                    <FontAwesome name="book" size={20} color="gray" style={styles.icon} />
                    <Text>רמת קריאה: {child.readingLevel}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    direction: 'rtl',
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
  sectionContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  parentContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
  },
  childContainer: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
  },
  parentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  childInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 5,
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