import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';

export default function library() {
    const router = useRouter();
  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={() => router.push('../characters')}>
         <Text style={styles.buttonText}>צור סיפור חדש</Text>
      </TouchableOpacity>
    </View>  
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#B3E7F2',
        borderWidth: 1,
        borderColor: '#65558F',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginVertical: 10,
        alignItems: 'center',
      },
      buttonText: {
        color: '#65558F',
        fontSize: 18,
        fontWeight: 'bold',
      },
      
})