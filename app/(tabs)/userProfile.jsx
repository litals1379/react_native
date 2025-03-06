import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';


export default function UserProfile() {
  const userData = {
    firstName: 'ישראל',
    lastName: 'כהן',
    email: 'israel@example.com',
    city: 'תל אביב',
    street: 'דיזנגוף',
    street_number: '100',
    birthDate: '1990-05-20',
    profileImage: 'https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Clipart.png',
    favorite_game: 'https://example.com/game',
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
      <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
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
  link: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
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
  disabledButton: {
    backgroundColor: 'gray',
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
