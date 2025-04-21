import React from 'react';
import { View, Text, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import { styles } from '../Style/layout'; 
import { Ionicons } from '@expo/vector-icons';

const colorsList = [
  '#FFB6C1', '#ADD8E6', '#90EE90', '#FFFFE0',
  '#E6E6FA', '#87CEEB', '#FFFFFF',
];

export default function CustomHeader({ showPicker, setShowPicker, selectedColor, setSelectedColor }) {
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: selectedColor }]}>
      <View style={[styles.header, { backgroundColor: selectedColor }]}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.storyText}>Story Time</Text>
        </View>

        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: selectedColor }]}
          onPress={() => setShowPicker(prev => !prev)}
        >
          <Text style={styles.colorButtonText}>🎨</Text>
        </TouchableOpacity>

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
        {/* add an arrow for back to my last page but not yo all of them*/ }
        <TouchableOpacity style={styles.backButton} >
          
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
    </SafeAreaView>
  );
}
