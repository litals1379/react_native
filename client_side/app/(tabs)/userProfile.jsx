import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams , useRouter  } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const params = useLocalSearchParams();
  const { userId } = params;
  const router = useRouter();
  console.log(params);

  // הגדרת ה-API URL בצורה דינמית
  const apiUrl = `http://www.storytimetestsitetwo.somee.com/api/User/GetUserById/${userId}`;
  const uploadApiUrl = 'http://www.storytimetestsitetwo.somee.com/api/User/UpdateProfileImage'; // Replace with your actual backend upload endpoint

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

  const handleChildSelection = (child) => {
    router.push({
      pathname: "/library",
      params: { child: JSON.stringify(child) }, // המרה למחרוזת JSON
    });
  };

  // פונקציה לשינוי התמונה של פרופיל המשתמש עדיין לא עובדת
  const pickImage = async () => {
    // Request camera roll permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Please grant permission to access your photo library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Keep aspect ratio for profile image
      quality: 0.7, // Adjust as needed
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      // Immediately try to upload after selecting
      uploadImage(result.assets[0]);
    }
  };

  const uploadImage = async (imageAsset) => {
    if (!imageAsset) {
      Alert.alert('No image selected', 'Please select an image to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId); // Assuming your backend needs the userId to associate the image
    formData.append('image', {
      uri: imageAsset.uri,
      type: imageAsset.type || 'image/jpeg', // Ensure type is included
      name: 'profileImage.jpg', // Or generate a unique name
    });

    try {
      const response = await fetch(uploadApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      body: formData,
      });

      if (response.ok) {
        Alert.alert('הצלחה', 'התמונה עודכנה בהצלחה!');
        // After successful upload, refresh user data to display the new image
        fetchUserData();
        } else {
        Alert.alert('שגיאה', 'העלאת התמונה נכשלה.');
        const errorData = await response.text(); // Or response.json() if your backend sends JSON error
        console.error('שגיאה בהעלאת התמונה:', errorData);
      }
      } catch (error) {
      Alert.alert('שגיאת רשת', 'אירעה שגיאת רשת בעת העלאת התמונה.');
      console.error('שגיאת העלאה:', error);
      } finally {
      setImageUri(null); // Clear the local preview after upload attempt
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        {/* תמונת פרופיל */}
        {userData.profileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />) : (
            <TouchableOpacity style={styles.plusIconContainer} onPress={pickImage}>
              <AntDesign name="plus" size={24} color="#65558F" />
            </TouchableOpacity>
          )}

        {/* שם המשתמש */}
        <View style={styles.infoContainer}>
          <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
          <Text style={styles.name}>שם משתמש:{userData.username}</Text>
        </View>

        {/* אימייל המשתמש */}
        <View style={styles.infoContainer}>
          <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
          <Text style={styles.email}>אימייל:{userData.email}</Text>
        </View>

        {/* פרטי הורים */}
        {/*
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
        */}

        {/* רשימת ילדים */}
        {userData.children && userData.children.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ילדים:</Text>
            {userData.children.map((child, index) => (
              <TouchableOpacity
                key={index}
                style={styles.childCard}
                onPress={() => handleChildSelection(child)} // שליחת אובייקט הילד
              >
                <View style={styles.childCardContent}>
                  {/* עיגול לתמונה */}
                  <View style={styles.childImagePlaceholder}>
                    {child.profileImage ? (
                      <Image source={{ uri: child.profileImage }} style={styles.childImage} />
                    ) : (
                      <FontAwesome name="user-circle" size={30} color="gray" />
                    )}
                  </View>
                  <View style={styles.childInfo}>
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
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* כפתורים */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton}>
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
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    direction: 'rtl',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#65558F',
  },
  plusIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#65558F',
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: {
    fontSize: 15,
    marginBottom: 8,
    color: '#65558F',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  email: {
    fontSize: 15,
    color: '#65558F',
    marginLeft: 8,
  },
  sectionContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#65558F',
  },
  parentCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 5,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  childCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  childCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  childImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden', // כדי שהתמונה תישאר בתוך העיגול
  },
  childImage: {
    width: '100%',
    height: '100%',
  },
  childInfo: {
    flex: 1,
  },
  parentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  childInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  parentText: {
    fontSize: 15,
    color: '#65558F',
    marginLeft: 8,
  },
  childText: {
    fontSize: 15,
    color: '#65558F',
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
    marginLeft: 8,
    color: '#65558F',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff', // צבע כחול בולט
    paddingVertical: 12, // קצת יותר ריווח אנכי
    paddingHorizontal: 18, // קצת יותר ריווח אופקי
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4, // קצת יותר בולט
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});