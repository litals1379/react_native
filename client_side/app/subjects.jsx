import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {styles} from './Style/subjects'; // סגנונות

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
  const childID = params.childID; // קבלת ה-childID מהעמוד הקודם
  const router = useRouter();

  // הדפסת ה-ID של הילד לבדיקות
  useEffect(() => {
    console.log('ה-ID של הילד:', childID);
  }, [childID]);

  const handleSubjectSelect = (topic) => {
    router.push({ pathname: "./story", params: { childID: childID, topic: topic } });
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
        numColumns={2}
        contentContainerStyle={styles.subjectGrid}
      />
    </View>
  );
}

