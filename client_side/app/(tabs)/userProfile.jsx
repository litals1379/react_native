import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../tabsStyle/userProfile';
import AlertModal from '../Components/AlertModal';
import { API_SOMEE_USER_UPDATE_PROFILE_IMAGE, API_SOMEE_USER_GET_BY_ID } from '../Config/config';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalEmoji, setModalEmoji] = useState('');
  const [modalType, setModalType] = useState('success');

  const uploadApiUrl = API_SOMEE_USER_UPDATE_PROFILE_IMAGE;
  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const apiUrl = `${API_SOMEE_USER_GET_BY_ID}${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      setUserData(data); // עדכון הנתונים
    } catch (error) {
      console.error("שגיאה בטעינת נתוני המשתמש:", error);
    }
  };

  useEffect(() => {
    getUserId();
  }, []);

  const logoutButton = async () => {
    await AsyncStorage.clear();
    router.replace({ pathname: "login" });
  };

  if (!userData) {
    return <Text>טוען...</Text>;
  }

  const handleChildSelection = (child) => {
    router.push({
      pathname: "/characters",
      params: { childID: child.id, childReadingLevel: child.readingLevel, child: JSON.stringify(child) },
    });
  };

  // פונקציה לשינוי התמונה של פרופיל המשתמש
  const pickImage = async () => {
    console.log('pickImage called');
    try {
      // Request camera roll permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setModalMessage('אנא אפשר גישה למצלמה ולגלריה.');
        setModalEmoji('⚠️');
        setModalType('error');
        setModalVisible(true);
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      // console.log('ImagePicker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        uploadImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error in pickImage:', error);
      setModalMessage('אירעה שגיאה בעת בחירת התמונה.');
      setModalEmoji('❌');
      setModalType('error');
      setModalVisible(true);
    }
  };

  const uploadImage = async (imageAsset) => {
    // console.log('uploadImage called with:', imageAsset);
    if (!imageAsset) {
      setModalMessage('בחר תמונה להעלאה.');
      setModalEmoji('⚠️');
      setModalType('error');
      setModalVisible(true);
      return;
    }

    const formData = new FormData();
    formData.append('userId', userData.id);
    formData.append('image', {
      uri: imageAsset.uri,
      type: 'image/jpeg',
      name: 'profileImage.jpg',
    });

    console.log(formData);

    try {
      const response = await fetch(uploadApiUrl, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setModalMessage('התמונה עודכנה בהצלחה!');
        setModalEmoji('✅');
        setModalType('success');
        setModalVisible(true);
        // userData.profileImage = response.imageUrl; // עדכון התמונה ב-state

        const updatedUserData = {
          ...userData,
          profileImage: result.imageUrl
        };
        setUserData(updatedUserData);
        // fetchUserData(); // or trigger a refresh
      } else {
        setModalMessage(result.message || 'העלאת התמונה נכשלה.');
        setModalEmoji('❌');
        setModalType('error');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setModalMessage('אירעה שגיאה בעת העלאת התמונה.');
      setModalEmoji('❌');
      setModalType('error');
      setModalVisible(true);
    }
  };

  const formatBirthdate = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };
  console.log('userData:', userData);
  console.log('children:', userData.children);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          {userData.profileImage ? (
            <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />) : (
            <AntDesign name="plus" size={40} color="#65558F" />
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
          <Text style={styles.name}>שם משתמש:{userData.username}</Text>
        </View>

        <View style={styles.infoContainer}>
          <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
          <Text style={styles.email}>אימייל:{userData.email}</Text>
        </View>

        {userData.children && userData.children.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ילדים:</Text>
            {userData.children.map((child, index) => (
              <View key={index} style={styles.childCard}>
                <TouchableOpacity
                  style={styles.childCardContent}
                  onPress={() => handleChildSelection(child)}
                >
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
                      <Text>תאריך לידה: {formatBirthdate(child.birthdate)}</Text>
                    </View>
                    {child.readingLevel && (
                      <View style={styles.childInfoRow}>
                        <FontAwesome name="book" size={20} color="gray" style={styles.icon} />
                        <Text>רמת קריאה: {child.readingLevel}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.reportButton}
                  onPress={() =>
                    router.push({
                      pathname: '/allReports',
                      params: { childId: child.id, childName: child.firstName, userId: userData.id },
                    })
                  }
                >
                  <Text style={styles.reportButtonText}>📄 צפה בהתקדמות</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={() => router.push('/editUserDetails')}>
            <FontAwesome name="edit" size={16} color="white" />
            <Text style={styles.buttonText}> עדכון פרטים</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={logoutButton}>

            <FontAwesome name="sign-out" size={16} color="white" />
            <Text style={styles.buttonText}> התנתקות</Text>
          </TouchableOpacity>
        </View>
        <AlertModal
          visible={modalVisible}
          onClose={() => {
            setModalVisible(false)
            setModalMessage('');
            setModalEmoji('');
            setModalType('success');
          }} message={modalMessage}
          emoji={modalEmoji}
          type={modalType}
        />
      </View>
    </ScrollView>
  );
}

