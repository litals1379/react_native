import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      textAlign: 'right', // RTL
      flex: 1,
      backgroundColor: '#f8f8f8',
      padding: 20,
    },
    header: {
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#65558F',
    },
    optionButton: {
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      flexDirection: 'row-reverse', // RTL
      alignItems: 'center',
      elevation: 2, // Android shadow
      shadowColor: '#000', // iOS shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    optionIcon: {
      marginLeft: 10,
      color: '#65558F',
    },
    optionText: {
      fontSize: 18,
      color: '#65558F',
      textAlign: 'right',
      flex: 1,
    },
  });
  