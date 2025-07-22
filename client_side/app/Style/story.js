import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
    direction: 'rtl',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  paragraphContainer: {
    marginTop: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    direction: 'rtl',
    alignSelf: 'stretch',
    paddingHorizontal: 16,
  },
  word: {
    fontSize: 35,
    fontWeight: 'bold',
    marginHorizontal: 4,
    marginVertical: 4,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: '#333',
  },
  wordCorrect: {
    color: 'green',
  },
  wordIncorrect: {
    color: 'red',
  },
  navButtons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    color: '#65558F',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
  },
  emoji: {
    fontSize: 24,
    marginTop: 8,
  },
  micButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 24,
  },
  micIcon: {
    fontSize: 30,
    color: '#65558F',
  },
  stopIcon: {
    fontSize: 30,
    color: '#C0392B',
  },
  endButton: {
    marginTop: 32,
    backgroundColor: '#65558F',
    padding: 12,
    borderRadius: 10,
  },
  endButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
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
});
