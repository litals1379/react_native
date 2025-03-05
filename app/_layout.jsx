
import React, { useState } from 'react';
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
//import Drawer from './drawer'

const colorsList = [
  '#FF0000', '#0000FF', '#008000', '#FFFF00',
  '#FFC0CB', '#87CEEB', '#000000', '#FFFFFF',
];

// קומפוננטת Header מותאמת אישית
const CustomHeader = ({ showPicker, setShowPicker, setSelectedColor }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        
        {/* כפתור חזור */}
        {router.canGoBack() && (
         <TouchableOpacity
           style={styles.backButton}
           onPress={() => router.back()} // כעת הכפתור חוזר לעמוד הקודם
  >
          <Text style={{ fontSize: 30, color: '#65558F' }}>{'<'}</Text>
          </TouchableOpacity>
)}

        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.headerText}>Story Time</Text>

        {/* כפתור לפתיחת פלטת הצבעים */}
        <TouchableOpacity
          style={styles.colorButton}
          onPress={() => setShowPicker(!showPicker)}
        >
          <Text style={styles.colorButtonText}>🎨</Text>
        </TouchableOpacity>


        {/* פלטת צבעים */}
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
    <View style={{ flex: 1, backgroundColor: selectedColor }}>
      <Stack screenOptions={{
        header: () => (
          <CustomHeader 
            showPicker={showPicker} 
            setShowPicker={setShowPicker} 
            setSelectedColor={setSelectedColor} 
          />
        ),
        headerStyle: { backgroundColor: "#f0f0f0" },
        headerTintColor: "#000",
        headerTitleStyle: { fontWeight: "bold", fontSize: 20 },
      }}>
        <Stack.Screen name="drawer" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} /> 
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="characters" />
        <Stack.Screen name="subjects" />
        <Stack.Screen name="options" />
        <Stack.Screen name="story" options={{ headerShown: false }} />  
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#B3E7F2" },
  header: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    color: "#65558F",
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: 'center',
  },
  logo: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
    marginVertical: 5,
    marginTop:30,
  },
  colorButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#B3E7F2",
    marginTop: 10,
    alignSelf: 'flex-end', 
    marginRight: 20, 
  },

  colorButtonText: {
    fontSize: 24,
  },
  colorsList: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  backButton: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    padding: 5,
    zIndex: 1,
  },
});
