import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
export default function Options() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        
      </View>

      <Text style={styles.title}>אפשרויות</Text>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="file-text" size={30} color="#333" style={styles.optionIcon} />
        <Text style={styles.optionText}>הפקת דוחות קריאה</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="user-plus" size={30} color="#333" style={styles.optionIcon} />
        <Text style={styles.optionText}>הוספת ילד</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="eye" size={30} color="#333" style={styles.optionIcon} />
        <Text style={styles.optionText}>צפיה בפרטים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="pencil-square-o" size={30} color="#333" style={styles.optionIcon} />
        <Text style={styles.optionText}>עדכון פרטים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="users" size={30} color="#333" style={styles.optionIcon} />
        <Text style={styles.optionText}>משתמשי ילדים</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // רקע אפור בהיר
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200, // התאימו לרוחב הרצוי
    height: 50, // התאימו לגובה הרצוי
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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