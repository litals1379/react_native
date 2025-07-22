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
  const slideAnim = useRef(new Animated.Value(0)).current; // 0 = hidden, 1 = visible
  const segments = useSegments();
  const currentRoute = '/' + segments.join('/');

  // Custom handler to animate out before hiding
  const handleColorPickerToggle = () => {
    if (showPicker) {
      // Animate out, then hide
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setShowPicker(false));
    } else {
      setShowPicker(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  };

  // Remove useEffect for showPicker, as animation is now handled in the toggle

  const slideInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0], // Slide from right to left
  });

  const handleBackPress = () => {
    router.back();  // חוזר לדף הקודם
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
          <Animated.View
            style={{
              transform: [{ translateX: slideInterpolate }],
              opacity: slideAnim,
              marginRight: '10%',
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: showPicker ? 200 : 0,
              overflow: 'hidden',
            }}
          >
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
                      handleColorPickerToggle();
                    }}
                  />
                )}
              />
            )}
          </Animated.View>
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
