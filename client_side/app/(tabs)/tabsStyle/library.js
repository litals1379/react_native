import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      color: '#65558F',
    },
    booksList: {
      marginTop: 20,
      width: '100%',
    },
    bookItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 10,
      shadowColor: '#aaa',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 2,
    },
    bookImage: {
      width: 60,
      height: 90,
      resizeMode: 'cover',
      borderRadius: 5,
      marginRight: 15,
    },
    bookTitle: {
      alignContent: 'flex-start',
      flex: 1,
      textAlign: 'right',
      fontSize: 16,
      color: '#333',
      flexShrink: 1,
    },
    noBooksText: {
      marginTop: 20,
      color: '#777',
    },
    error: {
      color: 'red',
      marginTop: 10,
    },
    button: {
      backgroundColor: '#B3E7F2',
      borderWidth: 1,
      borderColor: '#65558F',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginVertical: 20,
    },
    buttonText: {
      color: '#65558F',
      fontSize: 18,
      fontWeight: 'bold',
    },
    text:{
      fontSize: 16,
      margin: 5,
    }
  });
  