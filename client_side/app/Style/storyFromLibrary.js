import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    direction: 'rtl',
  },
  content: {
    direction: 'rtl',
    fontSize: 35,
    marginTop: 10,
    color: '#333',
    textAlign: 'right',
  },

  wordWrapContainer: {
    flexDirection: 'row', // שונה מ-row-reverse כדי שהמילים יופיעו בסדר נכון בעברית
    flexWrap: 'wrap',
    alignSelf: 'stretch',
    paddingHorizontal: 16,
    marginTop: 16,
    direction: 'rtl',
  },

  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 2,
    writingDirection: 'rtl',
    textAlign: 'right',
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
    fontSize: 25,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 20,
  },
  bookRating: {
    textAlign: 'center',
    fontSize: 16,
    color: '#65558F',
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
    height: 250,
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
  header: {
    direction: 'rtl',
    textAlign: 'center',
    marginBottom: 10,
  },
  text: {
    margin: 10,
    direction: 'rtl',
    textAlign: 'right',
  },
  button: {
    marginVertical: 5,
    marginHorizontal: 35,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    marginVertical: 10,
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#65558F',
    fontWeight: 'bold',
  },
});
