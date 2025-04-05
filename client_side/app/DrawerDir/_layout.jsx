import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Drawer screenOptions={{
        drawerStyle: {
          backgroundColor: '#f5f5f5',
        },
        headerStyle: {
          backgroundColor: '#6200ea',
        },
        headerTitleStyle: {
          color: '#fff',
        },
      }}>
        <Drawer.Screen 
          name="options"
          options={{
            drawerLabel:"options",
            title:"options",
            headerShown:false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  screenText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});
