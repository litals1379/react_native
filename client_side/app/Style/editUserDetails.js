import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: '#fff',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: '#fff',
    },
    header: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#65558F',
      marginBottom: 20,
      textAlign: 'center',
      writingDirection: 'rtl',
    },
    section: {
      marginTop: 16,
      fontWeight: 'bold',
      fontSize: 16,
      textAlign: 'right',
    },
    label: {
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'right',
      marginBottom: 4,
      color: '#333',
    },
    input: {
      borderBottomWidth: 1,
      borderColor: '#ccc',
      marginBottom: 12,
      paddingVertical: 6,
      paddingHorizontal: 4,
      textAlign: 'right',
    },
    inputText: {
      textAlign: 'right',
    },
    group: {
      marginBottom: 12,
    },
    saveBtn: {
      backgroundColor: '#B3E7F2',
      borderWidth: 1,
      borderColor: '#65558F',
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 30,
      marginVertical: 10,
    },
    btnText: {
      fontSize: 18,
      color: '#65558F',
      fontWeight: 'bold',
      textAlign: 'center',
      writingDirection: 'rtl',
    },
  });
  