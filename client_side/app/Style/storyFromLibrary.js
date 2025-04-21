import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f8f8',
    },
    content: {
      textAlign: 'right',
      fontSize: 16,
      marginTop: 20,
      color: '#333',
    },
    errorText: {
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
    },
    image: {
      width: '100%',
      height: 400,
      borderRadius: 12,
      marginBottom: 16,
    },
    navigation: {
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressContainer: {
      alignItems: 'center',
    },
    progressText: {
      marginBottom: 4,
      fontSize: 14,
    },
    progressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    emoji: {
      fontSize: 20,
      marginLeft: 8,
    },
    endButton: {
      backgroundColor: '#B3E7F2',
      borderWidth: 1,
      borderColor: '#65558F',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 30,
      marginVertical: 10,
    },
    endButtonText: {
      fontSize: 18,
      color: '#65558F',
      fontWeight: 'bold',
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    
  });