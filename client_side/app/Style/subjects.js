import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#F8F8F8',
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#65558F',
      marginBottom: 20,
      textAlign: 'center',
    },
    subjectGrid: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    subjectButton: {
      width: 150,
      height: 150,
      margin: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    subjectImageContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      overflow: 'hidden',
      marginBottom: 8,
    },
    subjectImage: {
      width: '100%',
      height: '100%',
    },
    subjectName: {
      fontSize: 18,
      color: '#333',
      textAlign: 'center',
    },
  });