import React, { useState } from 'react';
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { UserProvider } from './Context/userContextProvider'; // Assuming you have a context provider for user data
import {styles} from './Style/layout'
const colorsList = [
  '#FFB6C1', '#ADD8E6', '#90EE90', '#FFFFE0', '#E6E6FA', '#87CEEB', '#FFFFFF',
];

const CustomHeader = ({ showPicker, setShowPicker, setSelectedColor, selectedColor }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: selectedColor }]}>
      <View style={[styles.header, { backgroundColor: selectedColor }]}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.png')} style={styles.logo} />
          <Text style={styles.storyText}>Story Time</Text>
        </View>

        <TouchableOpacity
          style={[styles.colorButton, { backgroundColor: selectedColor }]}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={styles.colorButtonText}>🎨</Text>
        </TouchableOpacity>

        {showPicker && (
          <FlatList
            data={colorsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.colorOption, { backgroundColor: item }]}
                onPress={() => {
                  setSelectedColor(item);
                  setShowPicker(false);
                }}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            contentContainerStyle={styles.colorsList}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default function RootLayout() {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [showPicker, setShowPicker] = useState(false);

  return (
    <UserProvider>
      <View style={{ flex: 1, backgroundColor: selectedColor }}>
      <Stack screenOptions={{
            header: () => (
              <CustomHeader 
                showPicker={showPicker} 
                setShowPicker={setShowPicker} 
                setSelectedColor={setSelectedColor} 
                selectedColor={selectedColor} 
              />
            ),
            headerStyle: { backgroundColor: selectedColor },
            headerTintColor: "#000",
            headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="story" options={{ headerShown: false }} />
            <Stack.Screen name="storyFromLibrary" options={{ headerShown: false }} />  
            <Stack.Screen name="register" />
            <Stack.Screen name="addChild" /> 
            <Stack.Screen name="login" /> 
            <Stack.Screen name="subjects" />
            <Stack.Screen name="googleAuth" /> 
            <Stack.Screen name="editUserDetails" options={{ headerShown: false }} />
       </Stack>
     </View>
    </UserProvider>
  );
  }
    
