import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';


// נתוני דמויות
const charactersData = [
  { id: 1, name: 'חתול', image: require('../assets/images/cat.png') },
  { id: 2, name: 'חד קרן', image: require('../assets/images/unicorn.png') },
  { id: 3, name: 'נמר', image: require('../assets/images/tiger.png') },
  { id: 4, name: 'קוף', image: require('../assets/images/monkey.png') },
  { id: 5, name: 'ילד גיבור', image: require('../assets/images/superhero.png') },
  { id: 6, name: 'כלב', image: require('../assets/images/dog.png') },
  { id: 7, name: 'פנדה', image: require('../assets/images/panda.png') },
  { id: 8, name: 'ילדה', image: require('../assets/images/girl.png') },
  { id: 9, name: 'ארנבת', image: require('../assets/images/rabbit.png') },
];

const colorsList = [
    '#FFB6C1', // ורוד פסטל (במקום אדום)
    '#ADD8E6', // כחול פסטל (במקום כחול)
    '#90EE90', // ירוק פסטל (במקום ירוק)
    '#FFFFE0', // צהוב פסטל (במקום צהוב)
    '#E6E6FA', // לבנדר (במקום ורוד מקורי)
    '#87CEEB', // תכלת (נשאר)
    '#D3D3D3', // אפור פסטל (במקום שחור)
    '#FFFFFF', // לבן (נשאר)
  ];

export default function Characters() {

  const router = useRouter();
    
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [showPicker, setShowPicker] = useState(false); // מציג/מסתיר את פלטת הצבעים

  const renderCharacter = ({ item }) => (
    <TouchableOpacity style={styles.characterButton}>
      <Image source={item.image} style={styles.characterImage} />
      <Text style={styles.characterName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderColorOption = (color) => (
    <TouchableOpacity
      style={[styles.colorOption, { backgroundColor: color }]}
      onPress={() => setSelectedColor(color)}
    />
  );

  return (
    
    <View style={[styles.container, { backgroundColor: selectedColor }]}>
      {/* כותרת */}
      <Text style={styles.title}>בחר דמות</Text>

      {/* כפתור לפתיחת פלטת הצבעים */}
      <TouchableOpacity
        style={styles.colorButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Text style={styles.colorButtonText}>
          {showPicker ? "סגור פלטת צבעים 🎨" : "בחר צבע רקע 🎨"}
        </Text>
      </TouchableOpacity>

      {/* פלטת צבעים */}
      {showPicker && (
        <FlatList
          data={colorsList}
          renderItem={({ item }) => renderColorOption(item)}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          contentContainerStyle={styles.colorsList}
        />
      )}

      {/* רשימת דמויות */}
      <FlatList
        data={charactersData}
        renderItem={renderCharacter}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3} // פריסת 3 עמודות
        contentContainerStyle={styles.characterGrid}
      />

      {/* כפתור הבא */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('./subjects')}>
        <Text style={styles.buttonText}>הבא</Text>
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
  colorButton: {
    backgroundColor: '#65558F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  colorButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  colorsList: {
    marginBottom: 20,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  characterGrid: {
    flexGrow: 1,
  },
  characterButton: {
    width: 100,
    height: 100,
    margin: 10,
    alignItems: 'center',
  },
  characterImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  characterName: {
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
