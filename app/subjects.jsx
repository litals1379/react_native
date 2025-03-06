import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,FlatList} from 'react-native';
import { useRouter } from 'expo-router';

// נתוני נושאים
const subjectsData = [
    { id: 1, name: 'חלל', image: require('../assets/images/space.png') },
    { id: 2, name: 'אגדות', image: require('../assets/images/fairytale.png') },
    { id: 3, name: 'ספורט', image: require('../assets/images/sport.png') },
    { id: 4, name: 'גיבורי על', image: require('../assets/images/hero.png') },
    { id: 5, name: 'חיות', image: require('../assets/images/animals.png') },
    { id: 6, name: 'הרפתקאות', image: require('../assets/images/adventure.png') },
    { id: 7, name: 'רפואה', image: require('../assets/images/medical.png') },
    { id: 8, name: 'משפחה', image: require('../assets/images/family.png') },
    { id: 9, name: 'אוכל', image: require('../assets/images/food.png') },
];

export default function Subjects() {
  const router = useRouter();
  
  const renderSubject = ({ item }) => (
    <TouchableOpacity style={styles.subjectButton}>
      <Image source={item.image} style={styles.subjectImage} />
      <Text style={styles.subjectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      {/* כותרת */}
      <Text style={styles.title}>בחר נושא לסיפור</Text>


      {/* רשימת נושאים */}
      <FlatList
        data={subjectsData}
        renderItem={renderSubject}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3} // פריסת 3 עמודות
        contentContainerStyle={styles.subjectGrid}
      />
      <TouchableOpacity style={styles.button} onPress={() => router.push('./story')}>
        <Text style={styles.buttonText}>צור סיפור</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
  },
  subjectGrid: {
    flexGrow: 1,
  },
  subjectButton: {
    width: 100,
    height: 100,
    margin: 10,
    alignItems: 'center',
  },
  subjectImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  subjectName: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#65558F',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
