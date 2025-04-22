import React, { useState } from 'react';
import { Stack} from "expo-router";
import { View} from 'react-native';
import { UserProvider } from './Context/userContextProvider'; 
import CustomHeader from './Components/customHeader';

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
            <Stack.Screen name="editUserDetails" />
       </Stack>
     </View>
    </UserProvider>
  );
  }
    
