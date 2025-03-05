
import React, { useState } from 'react';
import { Stack, useRouter } from "expo-router";
import { View, Text, StyleSheet, SafeAreaView, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router'; 


const colorsList = [
  '#FFB6C1', // ורוד פסטל (במקום אדום)
  '#ADD8E6', // כחול פסטל (במקום כחול)
  '#90EE90', // ירוק פסטל (במקום ירוק)
  '#FFFFE0', // צהוב פסטל (במקום צהוב)
  '#E6E6FA', // לבנדר (במקום ורוד מקורי)
  '#87CEEB', // תכלת (נשאר)
  '#D3D3D3', // אפור פסטל (במקום שחור)
  '#FFFFFF', // לבן (נשאר)
];

// קומפוננטת Header מותאמת אישית
const CustomHeader = ({ showPicker, setShowPicker, setSelectedColor }) => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Link to the "options" screen */}
        <Link href="/DrawerDir/options" style={styles.link}>
          <Ionicons name="menu" size={30} color="#6200ea" />
        </Link>
        {/* כפתור חזור */}
        {router.canGoBack() && (
         <TouchableOpacity
           style={styles.backButton}
           onPress={() => router.back()} // כעת הכפתור חוזר לעמוד הקודם
  >
          <Text style={{ fontSize: 30, color: '#65558F' }}>{'<'}</Text>
          </TouchableOpacity>
)}

          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo.png')} style={styles.logo} />
            <Text style={styles.storyText}>Story Time</Text>
          </View>

        

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
    height: 120,
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
  logoContainer: {
    position: 'relative', // מוודא שהתוכן נשאר בתוך המסגרת
    alignItems: 'center', // ממקם את התמונה והטקסט במרכז
},
logo: {
    width: 300, // שומר על הגודל הנוכחי של הלוגו
    height: 80,
    resizeMode: 'contain',
    marginVertical: 5,
    marginTop: 0,
    alignSelf: 'flex-end',
},
storyText: {
  position: 'absolute', 
  top: '80%', // מוריד את הטקסט קצת למטה
  left: '41%', // מזיז טיפה שמאלה
  transform: [{ translateX: -50 }, { translateY: -10 }], // מאזנים את המיקום למרכז
  fontSize: 14, 
  fontWeight: 'bold',
  color: '#65558F', 
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  paddingHorizontal: 1, // קצת יותר ריווח
  paddingVertical: 1,  
  borderRadius: 5,
},
  colorButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#B3E7F2",
    marginTop: 0,
    alignSelf: 'flex-end', 
    marginRight: 10, 
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
  link: {
    padding: 10,
    borderRadius: 5,
    position: 'absolute', // מוודא שה- link ממוקם באופן מוחלט
    left: 10, // מיקום 10% מהקצה השמאלי של המסך
    top: 10, // אתה יכול לשנות את ה- top אם תרצה לשנות את המיקום האנכי
},

});
