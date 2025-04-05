import React, { useState } from 'react';
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons, } from '@expo/vector-icons';
import { Link } from 'expo-router'; 
import { ChildProvider } from './childContext';

const colorsList = [
  '#FFB6C1', '#ADD8E6', '#90EE90', '#FFFFE0', '#E6E6FA', '#87CEEB','#FFFFFF',
];

const CustomHeader = ({ showPicker, setShowPicker, setSelectedColor, selectedColor }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: selectedColor }]}>
      <View style={[styles.header, { backgroundColor: selectedColor }]}> 
        <Link href="/DrawerDir/options" style={styles.link}>
          <Ionicons name="menu" size={30} color="#6200ea" />
        </Link>
        {router.canGoBack() && (
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="return-down-back-outline" size={25} color="#6200ea"></Ionicons>
          </TouchableOpacity>
        )}

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
    <ChildProvider>
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
          <ChildProvider>
            <Stack.Screen name="drawer" options={{ headerShown: false }} />
            <Stack.Screen name="register" />
            <Stack.Screen name="addChild" /> 
            <Stack.Screen name="login" /> 
            <Stack.Screen name="characters" />
            <Stack.Screen name="subjects" />
            <Stack.Screen name="options" />
            <Stack.Screen name="googleAuth" />
            <Stack.Screen name="story" options={{ headerShown: false }} />  
          </ChildProvider>
       </Stack>
    </View>
    </ChildProvider>
    
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#B3E7F2" },
  header: {
    height: 145,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 0, // הסרת צל באנדרואיד
    shadowOpacity: 0, // הסרת צל ב-iOS
    borderBottomWidth: 0, // ביטול קו תחתון
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 80,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  storyText: {
    position: 'absolute',
    top: '70%',
    left: '38%', 
    width: 100, 
    textAlign: 'center',
    transform: [{ translateX: -50 }], 
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#65558F',
  },
  
  colorButton: {
    padding: 10,
    borderRadius: 20,
    marginTop: -10,
    alignSelf: 'flex-end', 
  },
  colorButtonText: {
    fontSize: 24,
  },
  colorsList: {
    flexDirection: "row",
    paddingVertical: 0,
  },
  colorOption: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#000",
  },
  backButton: {
    position: 'absolute',
    left: 15,
    bottom: 10,
    padding: 5,
    zIndex: 1,
  },
  link: {
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    left: 10,
    top: 10,
  },
});
