import React from 'react';
import { View, Text, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../Style/layout'; 
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  

const colorsList = [
  '#FFB6C1', '#ADD8E6', '#90EE90', '#FFFFE0',
  '#E6E6FA', '#87CEEB', '#FFFFFF',
];

export default function CustomHeader({ showPicker, setShowPicker, selectedColor, setSelectedColor }) {
  const router = useRouter();  
  
  const handleBackPress = () => {
    router.back();  // חוזר לדף הקודם
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: selectedColor }]}>
      <View style={[styles.header, { backgroundColor: selectedColor }]}>
        {/* כפתור חזור */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.storyText}>Story Time</Text>
        </View>

        {/* כפתור לבחור צבע */}
        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: selectedColor }]}
          onPress={() => setShowPicker(prev => !prev)}
        >
          <Text style={styles.colorButtonText}>🎨</Text>
        </TouchableOpacity>

        {/* אפשרויות בחירת צבע */}
        {showPicker && (
          <FlatList
            data={colorsList}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.colorsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: item }]}
                onPress={() => {
                  setSelectedColor(item);
                  setShowPicker(false);
                }}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
