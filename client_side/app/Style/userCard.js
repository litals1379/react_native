import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    card: {
      textAlign: 'right',
      borderWidth: 1,
      borderColor: '#ddd',
      padding: 12,
      borderRadius: 10,
      marginBottom: 10,
      direction: 'rtl', // עיצוב RTL כללי
    },
    title: {
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 6,
      color: '#65558F',
    },
    section: {
      marginTop: 8,
      fontWeight: 'bold',
    },
    text: {
      fontSize: 16,
      marginBottom: 4,
      color: '#333',
      flexDirection: 'row-reverse',
    },
    actions: {
      flexDirection: 'row', // RTL: אייקונים בצד ימין
      marginTop: 10,
      justifyContent: 'flex-start',
      gap: 10,
    },
    actionBtn: {
      padding: 8,
      borderRadius: 6,
    },
  });
  