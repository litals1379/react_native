import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { useRouter } from 'expo-router';

const router = useRouter();
export default function Options() {
  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <Text style={styles.title}>אפשרויות</Text>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="file-text" size={30} style={styles.optionIcon} />
        <Text style={styles.optionText}>הפקת דוחות קריאה</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton} onPress={() => router.push('../addChild')}>
        <Icon name="user-plus" size={30} style={styles.optionIcon} />
        <Text style={styles.optionText}>הוספת ילד</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="eye" size={30} style={styles.optionIcon} />
        <Text style={styles.optionText}>צפיה בפרטים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="pencil-square-o" size={30} style={styles.optionIcon} />
        <Text style={styles.optionText}>עדכון פרטים</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Icon name="users" size={30} style={styles.optionIcon} />
        <Text style={styles.optionText}>משתמשי ילדים</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#65558F',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  optionIcon: {
    marginLeft: 10,
    color: '#65558F', // צבע האייקון
  },
  optionText: {
    fontSize: 18,
    color: '#65558F', // צבע הטקסט
  },
});
