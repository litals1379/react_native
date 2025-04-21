import React, { useState } from 'react';
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { UserProvider } from './Context/userContextProvider'; // Assuming you have a context provider for user data
import CustomHeader from './Components/customHeader';
import {styles} from './Style/layout'


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
            <Stack.Screen name="editUserDetails" />
       </Stack>
     </View>
    </UserProvider>
  );
  }
    
