import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f8f8',
    },
    content: {
      direction: 'rtl',
      fontSize: 16,
      marginTop: 20,
      color: '#333',
    },
    bookImage: {
      width: '100%',
      height: 200,
      borderRadius: 10,
      marginBottom: 10,
      resizeMode: 'cover',
    },
    bookTitle: {
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#65558F',
      marginBottom: 20,
    },
    bookItem: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    booksList: {
      marginBottom: 20,
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
    transcriptContainer: {
      textAlign: 'right',
      marginTop: 20,
      backgroundColor: '#F0F0F0',
      padding: 10,
      borderRadius: 10,
      width: '90%',
      alignSelf: 'center',
    },
    header:{
      direction: 'rtl',
      textAlign: 'center',
      marginBottom: 10,
    },
    text:{
      margin: 10,
      direction: 'rtl',
    },
    button: {
      marginVertical: 5,
      marginHorizontal: 35,
    },
    transcriptLabel: {
      textAlign: 'right',
      fontWeight: 'bold',
      marginBottom: 5,
      fontSize: 16,
    },
    transcriptText: {
      textAlign: 'right',
      fontSize: 16,
      color: '#65558F',
    },
    
  });