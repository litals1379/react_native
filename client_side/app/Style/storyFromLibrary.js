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
    marginVertical: 15,
    gap: 4,
  },
  emoji: {
    fontSize: 20,
    marginLeft: -5,
  },
  endButton: {
    backgroundColor: '#B3E7F2',
    borderWidth: 1,
    borderColor: '#65558F',
    borderRadius: 10,
    paddingVertical: 10,
    width: "fit-content", // This might need to be a fixed width or 'auto' for React Native
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginVertical: 40,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    margin: 10,
    direction: 'rtl',
    textAlign: 'right',
  },
  button: {
    // These values determine the size of your actual microphone/volume button
    width: 60, // Example size, adjust as needed
    height: 60, // Example size, adjust as needed
    borderRadius: 30, // Half of width/height to make it a circle
    backgroundColor: 'white', // Or your desired button background
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // marginVertical: 5, // Remove these if buttonWrapper handles spacing
    // marginHorizontal: 35, // Remove these if buttonWrapper handles spacing
  },
  buttonListening: {
    // Styles for when the button is active (listening/speaking)
    borderColor: '#65558F',
    borderWidth: 2,
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
    backgroundColor: 'rgba(212, 210, 210, 0.8)',
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
  feedbackModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  feedbackBubble: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  feedbackVideo: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  controlButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
    marginVertical: 40
  },
  buttonWrapper: {
    position: 'relative', // *** ADD THIS ***
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // *** ADD THIS NEW STYLE DEFINITION ***
  pulseCircle: {
    position: 'absolute',
    width: 60, // Match initial button size or slightly larger
    height: 60, // Match initial button size or slightly larger
    borderRadius: 30, // Half of width/height to make it a circle
  },
});