import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    flexDirection: 'column', // אפשר גם row-reverse אם יש תוכן אופקי
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    writingDirection: 'rtl',
    marginVertical: 12,
    color: '#65558F',
  },
});
