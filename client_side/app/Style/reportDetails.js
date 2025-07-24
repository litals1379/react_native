import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    direction: 'rtl',
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4B3F72',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontWeight: 'bold',
    color: '#65558F',
  },
  feedbackBox: {
    backgroundColor: '#EFEAF8',
    borderLeftWidth: 5,
    borderLeftColor: '#65558F',
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#65558F',
    marginBottom: 6,
  },
  feedbackComment: {
    fontSize: 16,
    color: '#444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 12,
    color: '#4B3F72',
  },
  paragraphBox: {
    backgroundColor: '#FFF',
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#DDD',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  paragraphIndex: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 16,
    color: '#333',
  },
  paragraphText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 6,
  },
  successText: {
    color: '#27AE60',
    fontWeight: 'bold',
    fontSize: 15,
  },
  errorText: {
    color: '#E74C3C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  problematicWords: {
    marginTop: 4,
    color: '#C0392B',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
