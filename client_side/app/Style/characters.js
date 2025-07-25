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
  width: 170, 
  height: 170, 
  margin: 12,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  elevation: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
},

characterImage: {
  width: 140, 
  height: 140, 
  marginBottom: 10,
  resizeMode: 'contain',
},

characterName: {
  fontSize: 18, 
  color: '#333',
  textAlign: 'center',
},
});
