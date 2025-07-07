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
  characterGrid: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  characterButton: {
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
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
    resizeMode: 'contain',  // תמונה תשתלב יפה בכפתור
  },
  characterName: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
});
