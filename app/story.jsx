import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useImageDimensions } from '@react-native-community/hooks'; 


export default function story() {
    const router = useRouter();
  return (
    <SafeAreaView>
        <View>
         <Text>story</Text>
        </View>
    </SafeAreaView>
    
     
  )
}

const styles = StyleSheet.create({
  
})