import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

// Dummy screens 
const HomeScreen = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Home Screen</Text>
    </View>
  );
  
  const ProfileScreen = () => (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Profile Screen</Text>
    </View>
  );

  const Drawer = createDrawerNavigator();
export default function drawer() {
  return (
    <View>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    </View>
  )
}

const styles = StyleSheet.create({})