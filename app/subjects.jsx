import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// נתוני נושאים
const subjectsData = [
  { id: 1, name: 'חלל', image: require('../assets/images/space.png') },
  { id: 2, name: 'אגדות', image: require('../assets/images/fairytale.png') },
  { id: 3, name: 'ספורט', image: require('../assets/images/sport.png') },
  { id: 4, name: 'גיבורי על', image: require('../assets/images/hero.png') },
  { id: 5, name: 'הרפתקאות', image: require('../assets/images/adventure.png') },
  { id: 6, name: 'משפחה', image: require('../assets/images/family.png') },
];

export default function Subjects() {
  const params = useLocalSearchParams();
  const { userId } = params;
  const router = useRouter();

  useEffect(() => {
    // כאן תוכל להוסיף את הקוד שיביא את פרטי הילד לפי ה- userId
    console.log('ה-ID של הילד:', userId);
    // לדוגמה: שליחת בקשה ל-API כדי להביא את פרטי הילד
  }, [userId]);

  const handleSubjectSelect = (topic) => {
    router.push(`./story/${userId}/${encodeURIComponent(topic)}`);
  };

  const renderSubject = ({ item }) => (
    <TouchableOpacity
      style={styles.subjectButton}
      onPress={() => handleSubjectSelect(item.name)}
    >
      <View style={styles.subjectImageContainer}>
        <Image source={item.image} style={styles.subjectImage} />
      </View>
      <Text style={styles.subjectName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>בחר נושא לסיפור</Text>
      <FlatList
        data={subjectsData}
        renderItem={renderSubject}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // שינוי ל-2 עמודות
        contentContainerStyle={styles.subjectGrid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
    textAlign: 'center',
  },
  subjectGrid: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  subjectButton: {
    width: 150, // הגדלת רוחב הכפתור
    height: 150, // הגדלת גובה הכפתור
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  subjectImageContainer: {
    width: 100, // הגדלת גודל התמונה
    height: 100, // הגדלת גודל התמונה
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 8,
  },
  subjectImage: {
    width: '100%',
    height: '100%',
  },
  subjectName: {
    fontSize: 18, // הגדלת גודל הטקסט
    color: '#333',
    textAlign: 'center',
  },
});