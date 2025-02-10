import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native';

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

const colorsList = [
  '#FF0000', // אדום
  '#0000FF', // כחול
  '#008000', // ירוק
  '#FFFF00', // צהוב
  '#FFC0CB', // ורוד
  '#87CEEB', // תכלת
  '#000000', // שחור
  '#FFFFFF', // לבן
];

export default function Subjects() {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [showPicker, setShowPicker] = useState(false); // מציג/מסתיר את פלטת הצבעים

  const renderSubject = ({ item }) => (
    <TouchableOpacity style={styles.subjectButton}>
      <Image source={item.image} style={styles.subjectImage} />
      <Text style={styles.subjectName}>{item.name}</Text>
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
      <Text style={styles.title}>בחר נושא לסיפור</Text>

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

      {/* רשימת נושאים */}
      <FlatList
        data={subjectsData}
        renderItem={renderSubject}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3} // פריסת 3 עמודות
        contentContainerStyle={styles.subjectGrid}
      />

      {/* כפתור הבא */}
      <TouchableOpacity style={styles.button}>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
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
