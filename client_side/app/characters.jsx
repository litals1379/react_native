import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {styles} from './Style/characters'; // סגנונות


// נתוני דמויות
const charactersData = [
  { id: 1, name: 'חתול', image: require('../assets/images/cati.png') },
  { id: 2, name: 'נבי', image: require('../assets/images/navi.png') },
  { id: 6, name: 'יוני', image: require('../assets/images/yoni.png') },
  { id: 9, name: 'ארנבת', image: require('../assets/images/rabbit.png') },
];

export default function Characters() {

  const router = useRouter();
  const params = useLocalSearchParams();
  const childID = params.childID;

  

const renderCharacter = ({ item }) => (
  <TouchableOpacity
    style={styles.characterButton}
    onPress={() => {
      router.push({
        pathname: './subjects',
        params: {
          childID: childID,
          characterID: item.id
        }
      });
    }}
  >
    <Image source={item.image} style={styles.characterImage} />
    <Text style={styles.characterName}>{item.name}</Text>
  </TouchableOpacity>
);




  return (
    
    <View style={[styles.container]}>
      {/* כותרת */}
      <Text style={styles.title}>בחר דמות</Text>


      {/* רשימת דמויות */}
      <FlatList
        data={charactersData}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // פריסת 2 עמודות
        contentContainerStyle={styles.characterGrid}
      />

    </View>
  );
}


