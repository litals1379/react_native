import React, { useRef, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, FlatList, TouchableOpacity, Animated } from 'react-native';
import { styles } from '../Style/layout';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';

const colorsList = [
  '#FFB6C1', '#ADD8E6', '#90EE90', '#FFFFE0',
  '#E6E6FA', '#87CEEB', '#FFFFFF',
];

export default function CustomHeader({ showPicker, setShowPicker, selectedColor, setSelectedColor }) {
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(0)).current;
  const segments = useSegments();
  const currentRoute = '/' + segments.join('/');

  // Custom handler to animate in/out
  const handleColorPickerToggle = () => {
    if (showPicker) {
      // Animate out, then hide
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShowPicker(false));
    } else {
      // Show and animate in simultaneously
      slideAnim.setValue(0); // Reset to start position
      setShowPicker(true);
      // Small delay to ensure render, then animate
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }, 10);
    }
  };

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [150, 0], // Start from right (positive) and slide to final position (0)
  });

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: selectedColor }]}>
      <View style={[styles.header, { backgroundColor: selectedColor }]}>
        {/* כפתור חזור */}
        {currentRoute !== '/(tabs)/userProfile' && (
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}

        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.storyText}>Story Time</Text>
        </View>

        {/* כפתור לבחור צבע + אפשרויות בחירת צבע */}
        <View style={{ alignItems: 'flex-end', alignSelf: 'flex-end', flexDirection: 'row', position: 'relative' }}>
          {showPicker && (
            <Animated.View
              style={{
                transform: [{ translateX: slideInterpolate }],
                opacity: slideAnim,
                position: 'absolute',
                right: 50, // Position it to the left of the color button
                top: 0,
                flexDirection: 'row',
                alignItems: 'center',
                zIndex: 1000, // Ensure it's above other elements
              }}
            >
              <FlatList
                data={colorsList}
                horizontal
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={[styles.colorsList, { alignItems: 'center', justifyContent: 'center' }]}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.colorOption, { backgroundColor: item }]}
                    onPress={() => {
                      setSelectedColor(item);
                      handleColorPickerToggle(); // This will animate out and hide
                    }}
                  />
                )}
              />
            </Animated.View>
          )}
          <TouchableOpacity
            style={[styles.colorButton, { backgroundColor: selectedColor }]}
            onPress={handleColorPickerToggle}
          >
            <Text style={styles.colorButtonText}>🎨</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}