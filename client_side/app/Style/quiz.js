import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e6f0ff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#003366',
    },
    subtitle: {
      fontSize: 20,
      color: '#004080',
      marginBottom: 5,
    },
    instruction: {
      fontSize: 18,
      marginBottom: 20,
    },
    buttonsContainer: {
      width: '100%',
      alignItems: 'center',
    },
    wordButton: {
      backgroundColor: '#4c9aff',
      paddingVertical: 15,
      paddingHorizontal: 25,
      borderRadius: 15,
      marginVertical: 8,
      width: '80%',
      alignItems: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    wordText: {
      fontSize: 20,
      color: '#fff',
      fontWeight: 'bold',
    },
    repeatButton: {
      marginTop: 30,
      padding: 12,
      paddingHorizontal: 30,
      backgroundColor: '#ffcc00',
      borderRadius: 25,
      elevation: 2,
    },
    repeatText: {
      fontSize: 18,
      color: '#333',
      fontWeight: 'bold',
    },
    score: {
      fontSize: 24,
      fontWeight: 'bold',
      marginVertical: 20,
      color: '#008000',
    },
    restartButton: {
      backgroundColor: '#66bb6a',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 25,
      elevation: 2,
    },
    restartText: {
      fontSize: 18,
      color: '#fff',
      fontWeight: 'bold',
    },
    error: {
      color: 'red',
      fontSize: 18,
    },
  });
  