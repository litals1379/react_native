import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#B3E7F2" },
  header: {
    height: 154,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowOpacity: 0.1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 0, // הסרת צל באנדרואיד
    shadowOpacity: 0, // הסרת צל ב-iOS
    borderBottomWidth: 0, // ביטול קו תחתון
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 80,
    resizeMode: 'contain',
    marginVertical: 5,
  },
  storyText: {
    position: 'absolute',
    top: '70%',
    left: '41%',
    width: 100,
    textAlign: 'center',
    transform: [{ translateX: -50 }],
    fontSize: 14,
    fontWeight: 'bold',
    color: '#65558F',
  },

  colorButton: {
    padding: 10,
    borderRadius: 20,
    marginTop: -10,
    alignSelf: 'flex-end',
  },
  colorButtonText: {
    fontSize: 24,
  },
  colorsList: {
    flexDirection: "row",
    paddingVertical: 0,
  },
  colorOption: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#000",
  },
  backButton: {
    position: 'absolute',
    left: 15,
    bottom: 10,
    padding: 5,
    zIndex: 1,
  },
  link: {
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    left: 10,
    top: 10,
  },
  backButton:{
    position: 'absolute',
    left: 15,
    bottom: 10,
    padding: 5,
    zIndex: 1,
  }
});
